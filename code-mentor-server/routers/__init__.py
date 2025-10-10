# routes/__init__.py

# Import routers from your route files
from .code_runner import router as code_runner_router
from .ai_chat import router as ai_chat_router

# Optional: create a list of all routers to iterate in main.py
routers = [
    code_runner_router,
    ai_chat_router
]