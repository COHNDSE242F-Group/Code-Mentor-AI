from fastapi import APIRouter, HTTPException, Depends, Request, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session
import traceback

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

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

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
            completion = client.chat.completions.create(
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
            completion = client.chat.completions.create(
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

# Create or update progress report
@router.post("/progress_report", summary="Create or update conceptual map")
async def create_or_update_progress_report(
    student_id: int = Query(..., description="ID of the assignment"),
    token_data: dict = Depends(role_required(["student"]))
):
    async with async_session() as session:
        # Get the student by ID
        result = await session.execute(
            select(Student).where(Student.student_id == student_id)
        )
        student = result.scalar_one_or_none()

        if not student:
            raise HTTPException(status_code=404, detail="Student not found")