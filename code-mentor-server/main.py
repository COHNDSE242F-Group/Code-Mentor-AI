from fastapi import FastAPI

# Create FastAPI app
app = FastAPI()

# A simple GET endpoint
@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

# A GET endpoint with a path parameter
@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "query": q}