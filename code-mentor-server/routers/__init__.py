# routes/__init__.py

# Import routers from your route files
from .code_runner import router as code_runner_router
from .ai_chat import router as ai_chat_router
from .key_stroke import router as key_stroke_router
from .editor import router as code_editor_router
from .user import router as user_router
from .login import router as login_router
from .forgot_password import router as forgot_password_router    
from .submission_list import router as submission_list_router
from .submission_details import router as submission_details_router
from .messaging import router as messaging_router 
from .account_details import router as account_details_router
from .create_assignment import router as create_assignment_router
from .assignment_list import router as assignment_list_router
from .assignment_details import router as assignment_details_router
from .code_submit import router as code_submit_router
from .assignment import router as assignment_router
from .reset_password import router as reset_password_router
from .report import router as report_router
from .student import router as student_router
from .instructor import router as instructor_router
from .public_lists import router as public_lists_router

routers = [
    
    code_runner_router,
    ai_chat_router,
    key_stroke_router,
    code_editor_router,
    user_router,
    login_router,
    forgot_password_router,
    submission_list_router,
    submission_details_router,
    messaging_router,
    account_details_router,
    create_assignment_router,
    assignment_list_router,
    assignment_details_router,
    code_submit_router,
    assignment_router,
    student_router
    ,
    instructor_router
    ,
    reset_password_router
    report_router,
    student_router,
    public_lists_router
]