# routes/__init__.py

# Import routers from your route files
from .code_runner import router as code_runner_router
from .ai_chat import router as ai_chat_router
from .forgot_password import router as forgot_password_router    
from .submission_list import router as submission_list_router
from .submission_details import router as submission_details_router

# Optional: create a list of all routers to iterate in main.py
routers = [
    code_runner_router,
    ai_chat_router,
    forgot_password_router,
    submission_list_router,
    submission_details_router
]