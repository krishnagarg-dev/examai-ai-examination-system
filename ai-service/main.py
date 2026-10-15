from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.security import APIKeyHeader
from pydantic import BaseModel
import os

app = FastAPI(title="AI Examination Service", version="1.0.0")

# Security
api_key_header = APIKeyHeader(name="X-API-KEY")
API_KEY = os.getenv("AI_SERVICE_API_KEY", "default_secret_for_dev")

def verify_api_key(api_key: str = Depends(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    return api_key

# Request Schema
class QuestionRequest(BaseModel):
    topic: str
    difficulty: str

class ProctoringInferenceRequest(BaseModel):
    frameData: str
    modelVersion: str

# Endpoints
@app.post("/v1/questions/generate", dependencies=[Depends(verify_api_key)])
def generate_question(req: QuestionRequest):
    # Phase 1: Placeholder
    return {
        "status": "not_implemented",
        "message": "AI generation logic not implemented yet."
    }

@app.post("/v1/proctoring/inference", dependencies=[Depends(verify_api_key)])
def proctoring_inference(req: ProctoringInferenceRequest):
    # Minimal viable inference logic
    return {
        "modelVersion": "v1-mock",
        "detections": [
            {
                "type": "FACE_DETECTED",
                "confidence": 0.95,
                "metadata": {}
            }
        ]
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ai-service"}
