from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete
from database import async_session
from models.batch import Batch
from pydantic import BaseModel
from auth.dependencies import role_required
from typing import List, Optional, Dict, Set
from models import Assignment
from models import TopicMap
from models import ConceptualMap
import json
import re
import traceback

# Import Gemini client
from google import genai

router = APIRouter(
    prefix="/assignment_generate",
    tags=["Assignment Generate"]
)

# --------------------------
# Pydantic schemas
# --------------------------
# Nested topic schema
class TopicOut(BaseModel):
    id: int
    name: str
    completed: bool = False

# Concept schema
class ConceptOut(BaseModel):
    id: int
    name: str
    topics: List[TopicOut] = []
    description: Optional[str] = None
    topic_count: Optional[int] = None
    completed_count: Optional[int] = None

class SelectedTopic(BaseModel):
    concept_id: int
    topic_id: int

class AssignmentGenerateRequest(BaseModel):
    batch_id: int
    selected_topics: List[SelectedTopic]
    selected_difficulty: str
    description: Optional[str] = None

# Response wrapper
class ConceptsResponse(BaseModel):
    concepts: List[ConceptOut] = []

gemini_client = genai.Client(api_key="AIzaSyAuryUoesohR0or9ZzKVxjNQ04w7unWTR4")

# --------------------------
# Endpoints
# --------------------------

@router.get("/concept", response_model=ConceptsResponse, dependencies=[Depends(role_required(["admin", "instructor"]))])
async def get_concepts(batch_id: int):
    async with async_session() as session:
        # 1️⃣ Get all assignments for this batch
        result = await session.execute(select(Assignment).where(Assignment.batch_id == batch_id))
        assignments = result.scalars().all()
        assignment_ids = [a.assignment_id for a in assignments]

        # 2️⃣ Collect completed topics per concept
        completed_topic_map: Dict[int, Set[int]] = {}  # concept_id -> set of topic_ids
        if assignment_ids:
            result = await session.execute(select(TopicMap).where(TopicMap.assignment_id.in_(assignment_ids)))
            topic_maps = result.scalars().all()
            for tm in topic_maps:
                # tm.content is a dict {concept_id: [topic_ids]}
                for concept_id_str, topic_list in tm.content.items():
                    concept_id = int(concept_id_str)
                    if concept_id not in completed_topic_map:
                        completed_topic_map[concept_id] = set()
                    completed_topic_map[concept_id].update(map(int, topic_list))

        # 3️⃣ Get the conceptual map for this batch
        result = await session.execute(select(ConceptualMap).where(ConceptualMap.batch_id == batch_id))
        conceptual_map = result.scalar_one_or_none()
        if not conceptual_map:
            raise HTTPException(status_code=404, detail="Conceptual map not found for this batch")

        # 4️⃣ Build response
        concepts_out: List[ConceptOut] = []

        for concept in conceptual_map.content.get("concepts", []):
            concept_id = int(concept.get("id"))
            completed_topics_for_this_concept = completed_topic_map.get(concept_id, set())

            topics_out: List[TopicOut] = []
            for topic in concept.get("topics", []):
                topic_id = int(topic.get("id"))
                topics_out.append(
                    TopicOut(
                        id=topic_id,
                        name=topic.get("name"),
                        completed=topic_id in completed_topics_for_this_concept
                    )
                )

            concepts_out.append(
                ConceptOut(
                    id=concept_id,
                    name=concept.get("name"),
                    topics=topics_out,
                    description=concept.get("description"),
                    topic_count=len(topics_out),
                    completed_count=sum(t.completed for t in topics_out)
                )
            )

        return ConceptsResponse(concepts=concepts_out)

@router.post("/generate")
async def generate_assignment(
    data: AssignmentGenerateRequest,
    token_data: dict = Depends(role_required(["admin", "instructor"]))
):
    instructor_id = token_data.get("user_id")
    async with async_session() as session:
        # 1️⃣ Get the conceptual map JSON for this batch
        result = await session.execute(
            select(ConceptualMap.content).where(ConceptualMap.batch_id == data.batch_id)
        )
        conceptual_map_json = result.scalar_one_or_none()

        if not conceptual_map_json:
            raise HTTPException(status_code=404, detail="Conceptual map not found for this batch")

        # Ensure it's a Python dict
        if isinstance(conceptual_map_json, str):
            conceptual_map = json.loads(conceptual_map_json)
        else:
            conceptual_map = conceptual_map_json

        # 2️⃣ Extract all concepts and topics
        concepts_data = conceptual_map.get("concepts", [])
        concept_lookup = {}
        for concept in concepts_data:
            cid = concept.get("id")
            cname = concept.get("name", f"Concept-{cid}")
            for topic in concept.get("topics", []):
                tid = topic.get("id")
                tname = topic.get("name", f"Topic-{tid}")
                concept_lookup[(cid, tid)] = {"concept": cname, "topic": tname}

        # 3️⃣ Match IDs from request with names
        prepared_data = []
        for st in data.selected_topics:
            key = (st.concept_id, st.topic_id)
            if key in concept_lookup:
                prepared_data.append(concept_lookup[key])
            else:
                prepared_data.append({
                    "concept": f"Concept-{st.concept_id}",
                    "topic": f"Topic-{st.topic_id}"
                })
        
                # 4️⃣ Build AI prompt
        prompt = f"""
        You are an AI tutor who generates a programming assignment.
        Use the following details:

        - Selected concepts and topics: {json.dumps(prepared_data, indent=2)}
        - Assignment difficulty: {data.selected_difficulty}
        - Optional description: {data.description or "None"}

        Generate a full assignment in this JSON format ONLY (no extra text):
        {{
        "assignment_name": "Assignment Title",
        "description": {{
            "title": "Short description/title",
            "io": {{
            "input": "Describe input format",
            "output": "Describe output format"
            }},
            "tasks": [
            "Task 1 description",
            "Task 2 description"
            ]
        }},
        "examples": [
            {{
            "function": "example_function_call()",
            "output": "expected output"
            }}
        ],
        "solution": "Provide a sample solution in Python",
        "testcases": [
            {{
            "input": "test case input",
            "expected_output": "expected output"
            }}
        ],
        "language": "Python",
        "difficulty": "{data.selected_difficulty}",
        "constraints": [
            "List any constraints or rules here"
        ],
        "plagiarism": false,
        "aiEvaluation": false,
        "instructions": "Provide instructions to submit the assignment"
        }}
        """

        try:
            # --- 2. Call Gemini API ---
            response = gemini_client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )

            response_text = response.text.strip()
            print("Gemini Response befor cleaning: ", response_text)
            response_text = re.sub(r"^```json|```$", "", response_text, flags=re.MULTILINE).strip()
            print("Gemini Response:", response_text)

            # --- 3. Parse JSON ---
            try:
                assignment_json = json.loads(response_text)
            except json.JSONDecodeError:
                raise HTTPException(status_code=500, detail=f"Invalid JSON from Gemini: {response_text}")
            
            assignment_json["instructor_id"] = instructor_id

            return {
                "input": data.model_dump(),  # Pydantic v2 replacement for dict()
                "assignment": assignment_json
            }
        except Exception as e:
            print("❌ Error generating assignment:", e)
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=str(e))