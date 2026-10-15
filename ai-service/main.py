
import base64
import binascii
import os

import cv2
import numpy as np
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import APIKeyHeader
from pydantic import BaseModel, Field


app = FastAPI(title="AI Examination Service", version="1.1.0")

# Authentication: keep the existing X-API-KEY contract.
api_key_header = APIKeyHeader(name="X-API-KEY")
API_KEY = os.getenv("AI_SERVICE_API_KEY", "default_secret_for_dev")

MAX_FRAME_BYTES = 5 * 1024 * 1024
MAX_FRAME_CHARS = 7 * 1024 * 1024
MAX_IMAGE_WIDTH = 640

# OpenCV's bundled Haar cascade; no separate model download required.
CASCADE_PATH = (
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)
face_cascade = cv2.CascadeClassifier(CASCADE_PATH)

if face_cascade.empty():
    raise RuntimeError(f"Unable to load face detection model: {CASCADE_PATH}")


def verify_api_key(api_key: str = Depends(api_key_header)):
    if not api_key or api_key != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    return api_key


class QuestionRequest(BaseModel):
    topic: str
    difficulty: str


class ProctoringInferenceRequest(BaseModel):
    frameData: str = Field(min_length=1, max_length=MAX_FRAME_CHARS)
    modelVersion: str = Field(min_length=1, max_length=100)


def decode_frame(frame_data: str) -> np.ndarray:
    """Decode a base64 image or data URL into an OpenCV BGR image."""
    encoded = frame_data.strip()

    if encoded.startswith("data:"):
        header, separator, encoded = encoded.partition(",")
        if not separator or ";base64" not in header:
            raise HTTPException(
                status_code=400,
                detail="Frame must be a base64-encoded image",
            )

    # Reject oversized payloads before allocating decoded image memory.
    if not encoded or len(encoded) > MAX_FRAME_CHARS:
        raise HTTPException(status_code=413, detail="Frame is too large")

    try:
        image_bytes = base64.b64decode(encoded, validate=True)
    except (binascii.Error, ValueError):
        raise HTTPException(
            status_code=400,
            detail="Invalid base64 frame data",
        ) from None

    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty image frame")

    if len(image_bytes) > MAX_FRAME_BYTES:
        raise HTTPException(status_code=413, detail="Frame is too large")

    image_array = np.frombuffer(image_bytes, dtype=np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    if image is None or image.size == 0:
        raise HTTPException(
            status_code=400,
            detail="Frame is not a supported image",
        )

    height, width = image.shape[:2]
    if width < 2 or height < 2:
        raise HTTPException(status_code=400, detail="Frame dimensions are invalid")

    # Bound CPU cost by resizing wide frames while preserving aspect ratio.
    if width > MAX_IMAGE_WIDTH:
        new_height = max(1, round(height * MAX_IMAGE_WIDTH / width))
        image = cv2.resize(
            image,
            (MAX_IMAGE_WIDTH, new_height),
            interpolation=cv2.INTER_AREA,
        )

    return image


@app.post(
    "/v1/questions/generate",
    dependencies=[Depends(verify_api_key)],
)
def generate_question(req: QuestionRequest):
    # Question generation remains unimplemented.
    return {
        "status": "not_implemented",
        "message": "AI generation logic not implemented yet.",
    }


@app.post(
    "/v1/proctoring/inference",
    dependencies=[Depends(verify_api_key)],
)
def proctoring_inference(req: ProctoringInferenceRequest):
    image = decode_frame(req.frameData)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Haar-cascade detection is a CPU-friendly baseline, not a calibrated
    # probability model. Its output can be affected by lighting and pose.
    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30),
    )

    face_count = len(faces)

    if face_count == 0:
        detections = [
            {"type": "NO_FACE", "confidence": 0.8, "metadata": {}}
        ]
    elif face_count == 1:
        detections = [
            {"type": "FACE_DETECTED", "confidence": 0.8, "metadata": {}}
        ]
    else:
        detections = [
            {
                "type": "MULTIPLE_FACES",
                "confidence": 0.8,
                "metadata": {"faceCount": face_count},
            }
        ]

    return {
        "modelVersion": "opencv-haar-v1",
        "detections": detections,
    }


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ai-service"}
