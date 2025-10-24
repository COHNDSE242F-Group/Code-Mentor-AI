from fastapi import APIRouter, HTTPException, Depends, Request, Query, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session
import traceback
import asyncio

from typing import Any, Dict, List
import json
import os
import re
import logging
from auth.dependencies import role_required
from groq import Groq
from models.assignment import Assignment
from models.conceptual_map import ConceptualMap
from models.topic_map import TopicMap
from models.student import Student
from models.progress_report import ProgressReport
from models.submission import Submission
from sqlalchemy.orm.attributes import flag_modified

# Import Gemini client
from google import genai

router = APIRouter(
    prefix="/report",
    tags=["Conceptual Map Reports"]
)

# Logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("routers.report")

# ==============================
# Pydantic Schemas
# ==============================
class ConceptualMapCreate(BaseModel):
    batch_id: int
    content: Dict[str, Any]

class ConceptualMapOut(BaseModel):
    batch_id: int
    content: Dict[str, Any]

    class Config:
        orm_mode = True

class ConceptCreate(BaseModel):
    batch_id: int
    concept: str
    description: str

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
gemini_client = genai.Client(api_key="AIzaSyAuryUoesohR0or9ZzKVxjNQ04w7unWTR4")

async def update_all_student_reports(batch_id: int, concept: dict):
    async with async_session() as session:
        # Get all progress reports of students in this batch
        subq = select(Student.student_id).where(Student.batch_id == batch_id).subquery()
        progress_result = await session.execute(
            select(ProgressReport).where(ProgressReport.student_id.in_(subq))
        )
        progress_reports = progress_result.scalars().all()

        if "topics" in concept and isinstance(concept["topics"], list):
            for topic in concept["topics"]:
                topic["completed"] = False

        for progress_report in progress_reports:
            report = progress_report.content or {}  # Get existing JSON
            concepts = report.get("concepts", [])
            concepts.append(concept)  # Add new concept
            report["concepts"] = concepts  # Save updated list
            progress_report.content = report  # Assign back to ORM object

        await session.commit()

async def update_student_report_with_submission(submission_id: int):
    async with async_session() as session:
        # Get the submission by ID
        result = await session.execute(
            select(Submission).where(Submission.submission_id == submission_id)
        )
        submission = result.scalar_one_or_none()

        if not submission:
            raise HTTPException(status_code=404, detail="Submission not found")
        
        # Get the progress report by student ID
        progress_result = await session.execute(
            select(ProgressReport).where(ProgressReport.student_id == submission.student_id)
        )
        progress_report = progress_result.scalar_one_or_none()

        if not progress_report:
            raise HTTPException(status_code=404, detail="Progress report not found")
        
        # Get the topic map by assignment ID
        topic_result = await session.execute(
            select(TopicMap).where(TopicMap.assignment_id == submission.assignment_id)
        )
        topic_map = topic_result.scalar_one_or_none()

        if not topic_map:
            raise HTTPException(status_code=404, detail="Topic map not found")
        
        report_data = progress_report.content or {}
        concepts = report_data.get("concepts", [])
        topic_data = topic_map.content or {}

        topic_data = {int(k): [int(v) for v in vals] for k, vals in topic_data.items()}

        for concept in concepts:
            new_topics = 0
            if concept["id"] in topic_data:
                for topic in concept.get("topics"):
                    if topic["id"] in topic_data[concept["id"]]:
                        if topic["completed"] == False:
                            topic["completed"] = True
                            new_topics += 1
            
            if "topic_count" not in concept:
                concept["topic_count"] = len(concept.get("topics", []))
            
            if "completed_count" not in concept:
                concept["completed_count"] = 0
            
            concept["completed_count"] += new_topics
        
        report_data["concepts"] = concepts
        progress_report.content = report_data

        await session.commit()

# ==============================
# Endpoints for managing Conceptual Map
# ==============================

# Create or update conceptual map
@router.post("/conceptual_map", summary="Create or update conceptual map")
async def create_or_update_conceptual_map(
    assignment_id: int = Query(..., description="ID of the assignment"),
    token_data: dict = Depends(role_required(["instructor"]))
):
    """
    Create or update a conceptual map for a given batch_id.
    Only accessible by instructors.
    """
    async with async_session() as session:
        # Get the assignment by ID
        result = await session.execute(
            select(Assignment).where(Assignment.assignment_id == assignment_id)
        )
        assignment = result.scalar_one_or_none()

        if not assignment:
            raise HTTPException(status_code=404, detail="Assignment not found")

        # Get the batch_id from the assignment
        batch_id = assignment.batch_id
        if not batch_id:
            raise HTTPException(status_code=400, detail="Assignment has no batch_id")

        # Use batch_id to get the conceptual map
        map_result = await session.execute(
            select(ConceptualMap).where(ConceptualMap.batch_id == batch_id)
        )
        conceptual_map = map_result.scalar_one_or_none()

        if not conceptual_map:
            raise HTTPException(status_code=404, detail="Conceptual map not found for this batch")
        
        concepts_json = {"concepts": []}

        for concept in conceptual_map.content["concepts"]:
            concept_entry = {
                "id": concept["id"],
                "name": concept["name"],
                "description": concept["description"]
            }
            concepts_json["concepts"].append(concept_entry)
        
        concepts_json = json.dumps(concepts_json, indent=2)
        
        prompt = f"""
        You are given an assignment JSON and a list of concepts. 
        Return a JSON with only the IDs of concepts that are relevant for this assignment. 
        Do NOT include any text outside the JSON.

        Assignment JSON:
        {assignment}

        concept JSON:
        {concepts_json}

        Return only this format:
        {{"concept_ids": [1, 2, 5]}}
        """

        try:
            # --- 2. Call Groq API directly inside the router ---
            completion = groq_client.chat.completions.create(
                model="openai/gpt-oss-20b",
                messages=[
                    {"role": "system", "content": "You are a helpful AI tutor who extracts relevant concepts IDs from assignments."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0,
                max_completion_tokens=1500,
                reasoning_effort="medium"
            )

            response_text = completion.choices[0].message.content

            # --- Call Gemini ---
            # response = gemini_client.models.generate_content(
            #     model="gemini-2.5-flash",
            #     contents=prompt
            # )

            # response_text = response.text.strip()

            # --- 3. Parse JSON safely ---
            try:
                result_json = json.loads(response_text)
                concept_ids = result_json.get("concept_ids", [])
            except json.JSONDecodeError:
                raise HTTPException(status_code=500, detail=f"AI returned invalid JSON: {response_text}")
            
        except Exception as e:
            print("❌ Error generating concept IDs:", e)
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=str(e))

        topics_json = {"topics": []}

        for concept in conceptual_map.content["concepts"]:
            concept_id = concept["id"]
            if concept_id in concept_ids:
                for topic in concept.get("topics", []):
                    # Create unique topic entry
                    topic_entry = {
                        "id": f"{concept_id}-{topic['id']}",  # Unique ID across all
                        "name": topic["name"],
                        "concept_id": concept_id
                    }
                    topics_json["topics"].append(topic_entry)

        topics_json = json.dumps(topics_json, indent=2)

        # --- 1. Construct prompt for Groq ---
        prompt = f"""
            You are given an assignment JSON and a list of topics. 
            Return a JSON with only the IDs of topics that are relevant for this assignment. 
            Do NOT include any text outside the JSON.

            Assignment JSON:
            {assignment}

            Topics JSON:
            {topics_json}

            Return only this format:
            {{"topic_ids": ["1-1", "1-2", "2-1"]}}
            """

        try:
            # --- 2. Call Groq API directly inside the router ---
            completion = groq_client.chat.completions.create(
                model="openai/gpt-oss-20b",
                messages=[
                    {"role": "system", "content": "You are a helpful AI tutor who extracts relevant topic IDs from assignments."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0,
                max_completion_tokens=1500,
                reasoning_effort="medium"
            )

            response_text = completion.choices[0].message.content

            # --- Call Gemini ---
            # response = gemini_client.models.generate_content(
            #     model="gemini-2.5-flash",
            #     contents=prompt
            # )

            # response_text = response.text.strip()

            # --- 3. Parse JSON safely ---
            try:
                result_json = json.loads(response_text)
                topic_ids = result_json.get("topic_ids", [])
            except json.JSONDecodeError:
                raise HTTPException(status_code=500, detail=f"AI returned invalid JSON: {response_text}")
            
            topic_map_json = {}

            for topic_id in topic_ids:
                concept_id = topic_id.split("-")[0]
                topic_id = topic_id.split("-")[1]

                if concept_id not in topic_map_json:
                    topic_map_json[concept_id] = []
                
                topic_map_json[concept_id].append(topic_id)
            
            new_map = TopicMap(
                assignment_id=assignment_id,
                content=topic_map_json
            )

            session.add(new_map)
            await session.commit()
        
        except Exception as e:
            logger.error(f"Error creating/updating conceptual map: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal Server Error")

# Update progress report
@router.post("/progress_report", summary="Update progress report")
async def update_progress_report(
    submission_id: int = Query(..., description="ID of the submission"),
    token_data: dict = Depends(role_required(["student"]))
):
    asyncio.create_task(update_student_report_with_submission(submission_id))

# Creating new concept
@router.post("/concept", summary="Create new concept")
async def create_or_update_progress_report(
    data: ConceptCreate,
    background_tasks: BackgroundTasks,
    token_data: dict = Depends(role_required(["student"]))
):
    async with async_session() as session:
        # Get the student by ID
        result = await session.execute(
            select(ConceptualMap).where(ConceptualMap.batch_id == data.batch_id)
        )
        concept_map = result.scalar_one_or_none()

        if not concept_map:
            raise HTTPException(status_code=404, detail="Concept map not found")
        
        # Get the progress report with the student_id

        # --- 1. Create prompt ---
        prompt = f"""
        You are an AI tutor who generates all possible subtopics for a concept.
        The user will provide a concept name and a short description.

        Concept: {data.concept}
        Description: {data.description}

        Return ONLY a valid JSON in this exact format (no explanations, no text outside JSON):
        - The JSON must include all possible subtopics, do not skip any.
        - Assign each topic a unique id starting from 1.

        {{
            "topics": [
                {{ "id": 1, "name": "First topic name" }},
                {{ "id": 2, "name": "Second topic name" }}
            ]
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

            concept_json = {}

            # --- 3. Parse JSON ---
            try:
                topics_json = json.loads(response_text)
                topics = topics_json.get("topics", [])
                concept_json["id"] = max((concept["id"] for concept in concept_map.content.get("concepts", [])), default=0) + 1
                concept_json["name"] = data.concept
                concept_json["description"] = data.description
                concept_json["topics"] = topics
            except json.JSONDecodeError:
                raise HTTPException(status_code=500, detail=f"Invalid JSON from Gemini: {response_text}")
            
            concepts = concept_map.content.get("concepts", [])
            concepts.append(concept_json)
            concept_map.content["concepts"] = concepts
            await session.commit()

            asyncio.create_task(update_all_student_reports(data.batch_id, concept_json))
        except Exception as e:
            print("❌ Error generating topics:", e)
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=str(e))

# AI evaluation
@router.post("/ai-evaluation", summary="Evaluate submissions")
async def create_or_update_progress_report(
    submission_id: int = Query(..., description="ID of the submission"),
    token_data: dict = Depends(role_required(["student"]))
):
    async with async_session() as session:
        # Get the submission by ID
        result = await session.execute(
            select(Submission).where(Submission.submission_id == submission_id)
        )
        submission = result.scalar_one_or_none()

        if not submission:
            raise HTTPException(status_code=404, detail="Submission not found")
        
        report = submission.report or {} 
        if "ai-evaluation" in report:
            raise HTTPException(status_code=400, detail="AI evaluation allready exist for this submission.")

        # Get the assignment by ID
        assignment_result = await session.execute(
            select(Assignment).where(Assignment.assignment_id == submission.assignment_id)
        )
        assignment = assignment_result.scalar_one_or_none()

        if not assignment:
            raise HTTPException(status_code=404, detail="Assignment not found")
        
                # --- 1. Create prompt ---
        prompt = f"""
        You are an expert AI programming evaluator and teacher. 
        Your task is to evaluate a student's code submission based on the provided assignment details.

        ---

        ### Assignment Information
        The assignment is given as a JSON object with name and description:
        {{
            "name": "{assignment.assignment_name}",
            "description": {json.dumps(assignment.description, ensure_ascii=False)}
        }}

        ---

        ### Student Code Submission
        Here is the student's submitted code (written by the student, not the AI):

        {report["code"]}

        ---

        ### Evaluation Criteria

        You must carefully analyze the student's code **only** based on the following aspects:

        1. **Correctness** — Does the code correctly solve the problem described in the assignment?
        2. **Code Quality** — Is the logic efficient, modular, and cleanly implemented?
        3. **Readability & Structure** — Are variable names clear, comments useful, and code easy to follow?
        4. **Error Handling** — Does the code handle edge cases, exceptions, and invalid inputs properly?
        5. **Adherence to Requirements** — Does the code meet all assignment goals and constraints?

        ---

        ### Expected Output Format

        You must return **ONLY** a valid JSON object in this exact structure.  
        There should be **no text before or after** the JSON.  
        Do **not** include explanations, markdown, or code blocks.

        The JSON should look like this:

        {{
        "evaluation": {{
            "good_practices": [
            "Use bullet points to highlight specific strengths. For example: 'Used descriptive variable names' or 'Implemented efficient sorting algorithm'."
            ],
            "errors": [
            "List specific mistakes such as syntax errors, incorrect logic, or missing features."
            ],
            "improvements": [
            "Provide clear and actionable suggestions for improvement, such as 'Refactor into smaller functions' or 'Add input validation'."
            ],
            "overall_score": integer_between_0_and_100
        }}
        }}

        ---

        ### ⚖️ Scoring Guidelines
        - 90–100 → Excellent code (minor or no issues)
        - 75–89 → Good code (mostly correct, few improvements needed)
        - 50–74 → Fair (some mistakes but understandable)
        - 30–49 → Poor (many logical or structural issues)
        - 0–29  → Very poor or incorrect implementation

        ---

        ### Important Rules
        - Do NOT include explanations or reasoning outside the JSON.
        - Do NOT include markdown (no ```json, no ```).
        - Ensure the JSON is syntactically correct.
        - Be objective and consistent in scoring.

        Now, evaluate the submission accordingly and return **only the JSON output**.
        """

        try:
            # --- 2. Call Gemini API ---
            response = gemini_client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )

            response_text = response.text.strip()
            response_text = re.sub(r"^```(?:json)?|```$", "", response_text, flags=re.MULTILINE).strip()
            print("Gemini Response:", response_text)

            # --- 3. Parse JSON ---
            try:
                evaluation_json = json.loads(response_text)
            except json.JSONDecodeError:
                raise HTTPException(status_code=500, detail=f"Invalid JSON from Gemini: {response_text}")
            
            report["ai-evaluation"] = evaluation_json.get("evaluation")
            flag_modified(submission, "report")
            submission.report = report
            await session.commit()
        except Exception as e:
            print("❌ Error evaluating submission:", e)
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=str(e))