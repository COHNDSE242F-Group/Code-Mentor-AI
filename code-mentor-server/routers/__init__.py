# routes/__init__.py

# Import routers from your route files
from .code_runner import router as code_runner_router
from .ai_chat import router as ai_chat_router
from .key_stroke import router as key_stroke_router
from .editor import router as code_editor_router

# Optional: create a list of all routers to iterate in main.py
routers = [
    code_runner_router,
    ai_chat_router,
    key_stroke_router,
    code_editor_router
]