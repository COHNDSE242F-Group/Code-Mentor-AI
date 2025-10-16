from fastapi import APIRouter

router = APIRouter()

# Mock user profile data
MOCK_PROFILE = {
    "name": "Supun Fernando",
    "email": "supun.fernando@example.com",
    "phone": "+94 756 777 889",
    "role": "Programming Instructor",
    "address": "123 Main St, Borella,  Colombo 08",
    "bio": "Computer Science instructor with 10+ years of experience teaching programming fundamentals, data structures, and algorithms.",
    "avatarUrl": None
}

@router.get("/account/profile")
def get_profile():
    return MOCK_PROFILE

@router.post("/account/profile")
def update_profile(profile: dict):
    # For now, just echo back the posted profile
    return profile
