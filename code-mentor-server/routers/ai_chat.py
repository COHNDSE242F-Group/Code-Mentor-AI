# ai_chat.py
from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel
from groq import Groq
import traceback
import os
from typing import Optional, Dict, Any

# === Import your JWT verification function ===
from auth.dependencies import login_required

# === Initialize Groq client ===
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

router = APIRouter()

# === Request / Response Models ===
class ChatRequest(BaseModel):
    message: str
    history: list = []
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    reply: str

# === System Prompt for SMART Guidance Responses ===
GUIDANCE_SYSTEM_PROMPT = """
You are a helpful AI coding tutor who provides different types of help based on the student's question.

CRITICAL RULES:

FOR PROBLEM-SPECIFIC QUESTIONS (about the current assignment/problem):
1. NEVER provide complete code solutions to the programming problem
2. NEVER write code blocks that solve the core problem
3. ALWAYS provide guidance, hints, and thinking strategies instead of direct answers
4. Focus on teaching concepts, debugging approaches, and problem-solving techniques
5. Ask guiding questions to help students discover answers themselves

FOR GENERAL PROGRAMMING QUESTIONS (syntax, concepts, general knowledge):
1. YOU CAN provide syntax examples and explanations
2. YOU CAN answer questions about programming concepts
3. YOU CAN show small code snippets for educational purposes
4. Keep examples simple and focused on the specific question

HOW TO DISTINGUISH:
- If the question is about HOW TO SOLVE the current problem → Use strict guidance
- If the question is about GENERAL PROGRAMMING knowledge → Provide direct help with examples
- If the question is about SYNTAX or HOW TO USE a programming feature → Provide syntax examples

RESPONSE GUIDELINES:
For problem-solving: "What approaches have you considered? What specific part is challenging?"
For general questions: "In Python, you can create a list like this: my_list = []"

Remember: Your goal is to be helpful while encouraging learning and independent problem-solving.
"""

def build_guidance_messages(user_message: str, history: list, context: Optional[Dict] = None) -> list:
    """Build messages with context-aware guidance"""
    messages = [
        {"role": "system", "content": GUIDANCE_SYSTEM_PROMPT}
    ]
    
    # Add context information if provided
    if context:
        context_message = "Additional context for this tutoring session:\n"
        
        if context.get('programming_language'):
            context_message += f"- Programming Language: {context['programming_language']}\n"
        
        if context.get('problem_details'):
            problem = context['problem_details']
            context_message += "- Current Problem Information:\n"
            if problem.get('title'):
                context_message += f"  Title: {problem['title']}\n"
            if problem.get('description'):
                # Truncate long descriptions
                desc = problem['description']
                if len(str(desc)) > 500:
                    desc = str(desc)[:500] + "..."
                context_message += f"  Description: {desc}\n"
        
        if context.get('current_code'):
            # Include limited code context for debugging help
            code = context['current_code']
            if len(code) > 300:
                code = code[:300] + "\n// ... (code truncated for context)"
            context_message += f"- Student's current code snippet (for context only):\n```{context.get('programming_language', 'text')}\n{code}\n```\n"
        
        messages.append({"role": "system", "content": context_message})
    
    # Include chat history if provided (limited to last 4 messages)
    recent_history = history[-4:] if len(history) > 4 else history
    for h in recent_history:
        role_h = h.get("role", "user")
        content = h.get("content", "")
        messages.append({"role": role_h, "content": content})
    
    # Add the current user message
    messages.append({"role": "user", "content": user_message})
    
    return messages

def is_general_programming_question(message: str, context: Optional[Dict] = None) -> bool:
    """Check if this is a general programming question vs problem-specific"""
    general_keywords = [
        "how to create", "syntax for", "what is", "how does", "can i use",
        "difference between", "explain", "what are", "how do i use",
        "example of", "how to use", "what does", "meaning of",
        "can you explain", "tell me about", "how to declare",
        "how to define", "how to initialize", "how to write",
        "how to make", "how to do", "how to get", "how to check"
    ]
    
    problem_specific_keywords = [
        "solve", "solution", "answer", "how to implement", 
        "write the code for", "complete the", "finish the",
        "make the", "build the", "create the", "do the",
        "help me with this problem", "help with this assignment"
    ]
    
    message_lower = message.lower()
    
    # Check for general programming questions
    has_general_keyword = any(keyword in message_lower for keyword in general_keywords)
    
    # Check for problem-specific questions
    has_problem_keyword = any(keyword in message_lower for keyword in problem_specific_keywords)
    
    # If it has general keywords but NOT problem-specific keywords, it's general
    if has_general_keyword and not has_problem_keyword:
        return True
    
    # If it's clearly asking about general concepts
    if any(concept in message_lower for concept in [
        "syntax", "what is a", "what are", "explain", "define",
        "data types", "list in", "dictionary in", "array in",
        "string in", "integer in", "boolean in", "float in"
    ]):
        return True
    
    return False

def contains_solution_request(message: str) -> bool:
    """Check if user is asking for direct solutions to the current problem"""
    solution_keywords = [
        "give me the code", "write the code for me", "complete solution", 
        "solve this for me", "do it for me", "answer the problem",
        "show me the answer", "tell me the solution", "full code",
        "entire solution", "complete code", "how to implement this",
        "write the function for me", "do my assignment", "solve my homework"
    ]
    message_lower = message.lower()
    return any(keyword in message_lower for keyword in solution_keywords)

def contains_problem_solution(reply: str, context: Optional[Dict] = None) -> bool:
    """Check if response contains solution code for the current problem"""
    # Only flag responses that contain actual problem solution code
    forbidden_patterns = [
        "def process_tags", "function process_tags", "process_tags(",
        "def filter_tags", "function filter_tags", 
        "return processed_tags", "return result",
        "# solution", "// solution", "/* solution"
    ]
    
    reply_lower = reply.lower()
    
    # Check if it contains problem-specific solution code
    for pattern in forbidden_patterns:
        if pattern in reply_lower:
            return True
    
    return False

def enforce_guidance_policy(reply: str, user_message: str, context: Optional[Dict] = None) -> str:
    """Ensure the response follows appropriate guidance policy"""
    
    # Check if this is a general programming question
    if is_general_programming_question(user_message, context):
        print("✅ General programming question - allowing syntax help")
        return reply
    
    # For problem-specific questions, check for solution code
    if contains_problem_solution(reply, context):
        print("🚫 Problem solution detected, using fallback")
        return (
            "I notice my response was getting too specific to the current problem. "
            "Let me provide better guidance instead:\n\n"
            "For this specific problem, I'd encourage you to:\n\n"
            "1. Review the problem requirements carefully\n"
            "2. Break it down into smaller steps\n"
            "3. Think about what data structures might be helpful\n"
            "4. Consider edge cases and test scenarios\n\n"
            "What specific aspect are you finding most challenging?"
        )
    
    print("✅ Response passed guidance check")
    return reply

# === Available Groq Models ===
AVAILABLE_MODELS = [
    "llama-3.1-8b-instant",  # Fast, good for guidance
    "mixtral-8x7b-32768",    # Good balance
    "llama-3.3-70b-versatile", # More capable but slower
]

# === Main Chat Endpoint ===
@router.post("/ai-chat", response_model=ChatResponse)
async def ai_chat(req: ChatRequest, user: dict = Depends(login_required)):
    """
    Handles AI chat requests with smart guidance responses.
    Requires the user to be logged in (any role).
    """
    try:
        # user dict contains {"user_id": ..., "role": ...}
        user_id = user.get("user_id")
        role = user.get("role")
        print(f"AI chat request by user_id={user_id}, role={role}")
        print(f"Context provided: {req.context}")

        # Check if user is asking for direct solutions to the problem
        if contains_solution_request(req.message):
            print("🚫 Solution request detected, using guidance response")
            guidance_response = (
                "I understand you're looking for help with this problem! "
                "As a learning-focused tutor, I'm here to guide you through the thinking process "
                "rather than providing direct solutions. This helps you develop stronger "
                "problem-solving skills.\n\n"
                "Could you tell me:\n"
                "1. What specific part are you struggling with?\n"
                "2. What have you tried so far?\n"
                "3. What concepts are you finding challenging?\n\n"
                "I'll help you break it down and find the right approach!"
            )
            return {"reply": guidance_response}

        # Build guided messages with context
        messages = build_guidance_messages(req.message, req.history, req.context)

        print("📤 Messages sent to Groq:", len(messages), "messages")

        # Try available models in order of preference
        models_to_try = [
            "llama-3.1-8b-instant",  # Fast and good for following instructions
            "mixtral-8x7b-32768",    # Good balance of speed and capability
            "llama-3.3-70b-versatile", # Most capable but slower
        ]

        last_error = None
        for model in models_to_try:
            try:
                print(f"🔄 Trying model: {model}")
                
                # === Call Groq's API ===
                completion = client.chat.completions.create(
                    model=model,
                    messages=messages,
                    temperature=0.5,
                    max_completion_tokens=600,
                    top_p=0.9,
                    stream=False,
                    stop=None
                )

                reply_text = completion.choices[0].message.content
                print(f"🤖 Raw AI response: {reply_text[:200]}...")
                
                # Ensure the response follows appropriate guidance policy
                guided_reply = enforce_guidance_policy(reply_text, req.message, req.context)

                print(f"✅ Response generated using {model}")
                return {"reply": guided_reply}

            except Exception as e:
                last_error = e
                print(f"❌ Model {model} failed: {str(e)}")
                continue  # Try next model

        # If all models fail, raise the last error
        raise last_error

    except Exception as e:
        print("❌ All models failed:", e)
        traceback.print_exc()
        
        # Provide a fallback response if all API calls fail
        fallback_response = (
            "I'm currently having trouble connecting to the AI service. "
            "In the meantime, here's some general guidance:\n\n"
            "1. Read the problem requirements carefully and make sure you understand each one\n"
            "2. Break the problem down into smaller steps\n"
            "3. Try solving a simpler version of the problem first\n"
            "4. Test your solution with different inputs\n\n"
            "Please try again in a few moments, or contact your instructor for assistance."
        )
        
        return {"reply": fallback_response}