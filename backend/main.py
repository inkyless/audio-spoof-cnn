from fastapi import FastAPI, UploadFile, File, HTTPException,Depends, status, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas
from pydub import AudioSegment
from tensorflow.keras.models import load_model
import os
import uuid
import io

# Initialize database and create tables
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI()

# Load Trained Model
model_path_cnn = "model/cnn_model_8k.keras" # Temp
model_path_lstm = "model/cnn_model_8k.keras" # Temp
cnn_model = load_model(model_path_cnn) 
lstm_model = load_model(model_path_lstm) # Temp

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # change if deployed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def health_check():
    return {"status": "FastAPI backend is running"}

@app.post("/")
async def classify_audio(
    file: UploadFile = File(...), 
    source_type: str = Form(...),
    model: str = Form("cnn"), # Default to CNN
    db: Session = Depends(get_db)
    ):

    # Generate a unique session id
    generated_session_id = str(uuid.uuid4())

    os.makedirs("./temp_audio", exist_ok=True)
    filename = f"{generated_session_id}_{file.filename}"
    # Save the uploaded file temporarily
    file_location = f"./temp_audio/{filename}"
    file_bytes = await file.read()
    with open(file_location, "wb") as f:
        f.write(file_bytes)

    # After processing:
    try:
        os.remove(file_location)
    except Exception as e:
        print(f"Warning: failed to delete temp file: {e}")

     # Load audio with pydub from bytes to get duration
    try:
        audio = AudioSegment.from_file(io.BytesIO(file_bytes))
        duration_seconds = len(audio) / 1000.0
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid audio format")
    
    # Check model selection
    if model == "cnn":
        clf = cnn_model
        model_used = "CNN"
    elif model == "cnn-lstm":
        clf = lstm_model
        model_used = "CNN-LSTM"
    else:
        raise HTTPException(status_code=400, detail="Invalid model selected")

    # Store in AudioInteraction Table
    audio_interaction = models.AudioInteraction(
        session_id=generated_session_id, 
        audio_file=file.filename,
        audio_format=file.content_type,
        audio_duration=duration_seconds,  
        source_type=source_type
    )
    db.add(audio_interaction)
    db.commit()
    db.refresh(audio_interaction)

    # (Placeholder) Run your classification logic here, e.g.:
    is_spoof = False  # dummy
    score = 0.9      # dummy
    model_used = "CNN" if model == "cnn" else "CNN-LSTM" # dummy, replace with actual model name

    # 4. Insert DetectionResult linked to AudioInteraction
    detection_result = models.DetectionResult(
        interaction_id=audio_interaction.interaction_id,
        is_spoof=is_spoof,
        metric_score=score,
        model_use=model_used
    )
    db.add(detection_result)
    db.commit()
    db.refresh(detection_result)

    # 5. Return detection result + IDs for feedback later
    return {
        "interaction_id": audio_interaction.interaction_id,
        "result_id": detection_result.result_id,
        "is_spoof": is_spoof,
        "score": score,
        "model_used": model_used,
    }


@app.post("/upload", status_code=status.HTTP_201_CREATED)
def create_interaction(data: schemas.AudioInteractionCreate, db: Session = Depends(get_db)):
    record = models.AudioInteraction(**data.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@app.post("/result",response_model=schemas.DetectionResultCreate)
def create_detection(data: schemas.DetectionResultCreate, db: Session = Depends(get_db)):
    # Optional: Check if interaction_id exists
    if not db.query(models.AudioInteraction).filter(models.AudioInteraction.interaction_id == data.interaction_id).first():
        raise HTTPException(status_code=400, detail="AudioInteraction not found")
    record = models.DetectionResult(**data.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@app.post("/feedback")
def create_feedback(data: schemas.UserFeedbackCreate, db: Session = Depends(get_db)):
    record = models.UserFeedback(**data.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record
