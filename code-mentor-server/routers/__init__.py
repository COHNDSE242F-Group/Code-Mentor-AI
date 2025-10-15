# routes/__init__.py

# Import routers from your route files
from .code_runner import router as code_runner_router
from .ai_chat import router as ai_chat_router
from .key_stroke import router as key_stroke_router
from .editor import router as code_editor_router
from .forgot_password import router as forgot_password_router    
from .submission_list import router as submission_list_router
from .submission_details import router as submission_details_router
from .messaging import router as messaging_router 
from .account_details import router as account_details_router
from .create_assignment import router as create_assignment_router

# Optional: create a list of all routers to iterate in main.py
routers = [
    code_runner_router,
    ai_chat_router,
    key_stroke_router,
    code_editor_router,
    forgot_password_router,
    submission_list_router,
    submission_details_router,
    messaging_router,
    account_details_router,
    create_assignment_router
]