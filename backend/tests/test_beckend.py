import os
import io
import pytest
import wave
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# Global variables to be used across tests
test_session_id = None
test_result_id = None

def generate_silent_wav(duration_sec=1, sample_rate=8000):
    byte_io = io.BytesIO()
    with wave.open(byte_io, 'wb') as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(sample_rate)
        wav.writeframes(b'\x00\x00' * sample_rate * duration_sec)
    byte_io.seek(0)
    return byte_io

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "FastAPI backend is running"

def test_predict_health_check():
    response = client.get("/predict")
    assert response.status_code == 200
    assert response.json()["status"] == "FastAPI backend on predict route is running"

def test_upload_audio():
    global test_session_id, test_filename
    response = client.post(
        "/",
        data={"source_type": "upload"},
        files={"file": ("test.wav", generate_silent_wav(), "audio/wav")}
    )
    assert response.status_code == 200
    data = response.json()
    test_session_id = data["session_id"]
    test_filename = data["filename"]
    assert test_session_id is not None
    assert "interaction_id" in data

def test_predict():
    global test_session_id, test_result_id
    response = client.post(
        "/predict",
        data={"session_id": test_session_id, "model": "cnn"}
    )
    assert response.status_code == 200
    data = response.json()
    test_result_id = data["result_id"]
    assert isinstance(data["is_spoof"], bool)

def test_get_result():
    global test_session_id
    response = client.get(f"/result/{test_session_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["session_id"] == test_session_id

def test_create_feedback():
    global test_session_id, test_result_id
    response = client.post(
        "/feedback",
        data={"session_id": test_session_id, "result_id": test_result_id, "feedback": True}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["session_id"] == test_session_id
    assert data["result_id"] == test_result_id

def test_create_feedback_duplicate():
    global test_session_id, test_result_id
    response = client.post(
        "/feedback",
        data={"session_id": test_session_id, "result_id": test_result_id, "feedback": True}
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Feedback already submitted for this result"

def test_delete_feedback():
    global test_session_id, test_result_id
    response = client.delete(
        "/feedback",
        params={"session_id": test_session_id, "result_id": test_result_id}
    )
    assert response.status_code == 200
    assert response.json()["detail"] == "Feedback deleted"

def test_delete_feedback_not_found():
    response = client.delete(
        "/feedback",
        params={"session_id": "nonexistent", "result_id": 9999}
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Feedback not found"
