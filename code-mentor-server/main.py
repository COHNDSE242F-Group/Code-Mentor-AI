from fastapi import FastAPI
from routers import routers
from fastapi.middleware.cors import CORSMiddleware

# Create FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app origin
    allow_credentials=True,
    allow_methods=["*"],  # allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # allow all headers
)

# Include all routers
for router in routers:
    app.include_router(router)
