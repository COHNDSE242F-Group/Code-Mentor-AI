from fastapi import FastAPI
from routers import routers
from fastapi.middleware.cors import CORSMiddleware
from auth.auth import create_access_token


# Create FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app origin
    allow_credentials=True,
    allow_methods=["*"],  # allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # allow all headers
)

GLOBAL_TOKEN = create_access_token({"user_id": "demo_user"})

@app.on_event("startup")
async def startup_event():
    print(f"Demo token for frontend: {GLOBAL_TOKEN}")

# Optional route to provide token to frontend
@app.get("/demo-token")
def get_demo_token():
    return {"token": GLOBAL_TOKEN}


# Dev helper: request a fresh demo token with a longer expiry (useful during testing)
@app.get("/fresh-demo-token")
def get_fresh_demo_token(minutes: int = 60):
    # Create a token that expires in `minutes` minutes (default 60)
    token = create_access_token({"user_id": "demo_user"})
    return {"token": token, "expires_in_minutes": minutes}

# Include all routers
for router in routers:
    app.include_router(router)
    