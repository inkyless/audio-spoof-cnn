from fastapi import FastAPI, UploadFile, File, HTTPException,Depends, status, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi import Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas
from pydub import AudioSegment
from tensorflow.keras.models import load_model
import os
import uuid
import io
import shutil
import numpy as np

from preprocess_file.audio_to_npy import extract_mfcc
from preprocess_file.npy_to_img import npy_to_image
from PIL import Image

# Initialize database and create tables
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI()

TEMP_AUDIO_DIR = "temp_audio"
TEMP_OUTPUT_DIR = "temp_output"

os.makedirs(TEMP_AUDIO_DIR, exist_ok=True)
os.makedirs(TEMP_OUTPUT_DIR, exist_ok=True)

# Load Trained Model
model_path_cnn = "model/cnn_model_8k.keras" # Temp
model_path_lstm = "model/cnn_model_8k.keras" # Temp
cnn_model = load_model(model_path_cnn) 
lstm_model = load_model(model_path_lstm) # Temp

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # change if deployed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/api/output_images", StaticFiles(directory=TEMP_OUTPUT_DIR), name="output_images")

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
async def upload_audio(
    file: UploadFile = File(...), 
    source_type: str = Form(...),
    db: Session = Depends(get_db)
    ):

    print("Received POST request to /upload")

    # Generate a unique session id
    generated_session_id = str(uuid.uuid4())

    filename = f"{generated_session_id}_{file.filename}"

    # Save the uploaded file temporarily
    file_location = os.path.join(TEMP_AUDIO_DIR, filename)
    file_bytes = await file.read()
    with open(file_location, "wb") as f:
        f.write(file_bytes)

    # Use AudioSegment to get audio duration
    try:
        audio = AudioSegment.from_file(io.BytesIO(file_bytes))
        duration_seconds = len(audio) / 1000.0
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid audio format")

    # Store uploaded file or recordings in AudioInteraction Table
    audio_interaction = models.AudioInteraction(
        session_id=generated_session_id, 
        audio_file= filename,
        audio_format=file.content_type,
        audio_duration=duration_seconds,  
        source_type=source_type
    )
    db.add(audio_interaction)
    db.commit()
    db.refresh(audio_interaction)

    return {
        "interaction_id": audio_interaction.interaction_id,
        "filename": filename,
        "duration":duration_seconds,
        "session_id": generated_session_id,
    }

@app.get("/predict")
def health_check():
    return {"status": "FastAPI backend on predict route is running"}
    
@app.post("/predict")
def classify_audio(
    session_id: str = Form(...),
    model: str = Form("cnn"),  # Default to CNN
    db: Session = Depends(get_db)
):
    print("Received POST request to /predict")

    interaction = db.query(models.AudioInteraction).filter_by(session_id=session_id).first()
    if not interaction:
        raise HTTPException(status_code=404, detail="AudioInteraction not found")
    
    try:
        file_path = os.path.join(TEMP_AUDIO_DIR, interaction.audio_file)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail=f"Audio file not found at {file_path}")
        generated_session_id = interaction.session_id
        # When submitting, run preprocessing: MFCC extraction and image generation
        png_filename = f"{generated_session_id}.png"
        npy_path = os.path.join(TEMP_OUTPUT_DIR, f"{generated_session_id}.npy")
        png_path = os.path.join(TEMP_OUTPUT_DIR,png_filename)

        if not os.path.exists(npy_path):
            try:
                mfcc = extract_mfcc(file_path, npy_path)
                np.save(npy_path, mfcc)
                npy_to_image(npy_path, png_path)
                if os.path.exists(png_path):
                    print(f"Image saved at {png_path}")
                else:
                    raise HTTPException(status_code=500, detail="Image file not created")
                print("Successfully NPY file convert to image file....")
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to preprocess audio: {e}")

        # Check model selection and proceed to do prediction
        try:
            if model == "cnn":
                clf = cnn_model
                image = Image.open(png_path).convert("L")  # grayscale
                image = image.resize((26, image.height))  # keep time dim variable
                image_array = np.array(image).astype(np.float32)
                image_array = image_array / 255.0  # normalize
                image_array = np.expand_dims(image_array, axis=-1)
                image_array = np.expand_dims(image_array, axis=0)  # batch dimension
                pred = clf.predict(image_array)[0][0]
                model_used = "CNN"
            elif model == "cnn-lstm":
                clf = lstm_model
                mfcc_array = np.load(npy_path, allow_pickle=True)
                # Check shape and expand if needed
                if len(mfcc_array.shape) == 2:
                    mfcc_array = np.expand_dims(mfcc_array, axis=-1)  # (time, features, 1)
                if mfcc_array.shape[0] != 26:
                    mfcc_array = mfcc_array.T  # Transpose if needed to match (26, time)
                    mfcc_array = np.expand_dims(mfcc_array, axis=0)  # (1, 26, time, 1)
                pred = clf.predict(mfcc_array)[0][0]
                model_used = "CNN-LSTM"
            else:
                raise HTTPException(status_code=400, detail="Invalid model selected")
            
            is_spoof = pred > 0.5 # Value will be boolean
            score = float(pred)

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Model inference failed: {e}")

        #Insert DetectionResult after model prediction
        detection_result = models.DetectionResult(
            session_id=interaction.session_id,
            is_spoof=is_spoof, 
            metric_score=score,
            model_use=model_used,
            image_filename=png_filename,  # Save the image filename
        )
        db.add(detection_result)
        db.commit()
        db.refresh(detection_result)

        return {
            "result_id": detection_result.result_id,
            "session_id": interaction.session_id,
            "is_spoof": bool(is_spoof),
            "score": float(score),
            "model_used": model_used,
            "image_filename": f"{png_filename}",  # Return the image filename
        }
    except Exception as e:
        print(f"Error during prediction: {e}")
        raise HTTPException(status_code=500,detail="Prediction failed")

@app.get("/result/{session_id}")
def get_detection_result(
    session_id: str, 
    db: Session = Depends(get_db)):
    result = db.query(models.DetectionResult).filter(
        models.DetectionResult.session_id == session_id
    ).first()
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    return {
        "result_id": result.result_id,
        "session_id": result.session_id,
        "is_spoof": bool(result.is_spoof),
        "score": float(result.metric_score),
        "model_used": result.model_use,
        "image_filename": result.image_filename,
        "timestamp": result.time_detect,
    }

@app.post("/feedback")
def create_feedback(
    session_id: str = Form(...),
    result_id: int = Form(...),
    feedback: bool = Form(...),
    db: Session = Depends(get_db)
):
    try:
        existing = db.query(models.UserFeedback).filter_by(
        session_id=session_id, result_id=result_id
    ).first()

        if existing:
            raise HTTPException(status_code=404, detail="Feedback already submitted for this result")
        
        # Create and save the new feedback
        new_feedback = models.UserFeedback(
            session_id=session_id,
            result_id=result_id,
            feedback=feedback
        )
        db.add(new_feedback)
        db.commit()
        db.refresh(new_feedback)
        return new_feedback

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to record feedback: {str(e)}")


@app.delete("/feedback")
def delete_feedback(
    session_id: str = Query(...),
    result_id: int = Query(...),
    db: Session = Depends(get_db)
):    
    # Check if the feedback already exists
    try:
        existing = db.query(models.UserFeedback).filter_by(
            session_id=session_id,
            result_id=result_id
        ).first()

        if not existing:
            raise HTTPException(status_code=404, detail="Feedback not found")
    
        db.delete(existing)
        db.commit()
        return {"detail": "Feedback deleted"}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to record feedback: {str(e)}")

