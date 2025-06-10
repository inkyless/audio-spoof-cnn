from pydantic import BaseModel
from typing import Optional

class AudioInteractionCreate(BaseModel):
    session_id: str
    audio_file: str
    audio_format: Optional[str]
    audio_duration: Optional[float]
    source_type: Optional[str]

class DetectionResultCreate(BaseModel):
    interaction_id: int
    is_spoof: Optional[bool]
    metric_score: Optional[float]
    model_use: str
    image_filename: Optional[str] = None

class UserFeedbackCreate(BaseModel):
    session_id: str
    result_id: int
    feedback: bool
    time_submit: Optional[str] 