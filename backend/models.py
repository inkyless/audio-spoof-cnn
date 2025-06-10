from sqlalchemy import Column, Integer, String, Float, Boolean, TIMESTAMP, ForeignKey
from database import Base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class AudioInteraction(Base):
    __tablename__ = "AudioInteraction"
    interaction_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(String(255), nullable=False, index=True)
    audio_file = Column(String(255), nullable=False)
    audio_format = Column(String(50))
    audio_duration = Column(Float)
    source_type = Column(String(20))
    time_created = Column(TIMESTAMP, server_default=func.current_timestamp())

    interactions = relationship("DetectionResult", back_populates="detection")

class DetectionResult(Base):
    __tablename__ = "DetectionResult"
    result_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(String(255), ForeignKey("AudioInteraction.session_id", onupdate="CASCADE", ondelete="RESTRICT"), nullable=False)
    is_spoof = Column(Boolean)
    metric_score = Column(Float)
    model_use = Column(String(50), nullable=False)
    image_filename = Column(String(255), nullable=True)
    time_detect = Column(TIMESTAMP, server_default=func.current_timestamp())

    detection = relationship("AudioInteraction", back_populates="interactions")
    feedbacks = relationship("UserFeedback", back_populates="interaction")


class UserFeedback(Base):
    __tablename__ = "UserFeedback"
    feedback_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(String(255), ForeignKey("AudioInteraction.session_id", onupdate="CASCADE", ondelete="RESTRICT"), nullable=False)
    result_id = Column(Integer, ForeignKey("DetectionResult.result_id", onupdate="CASCADE", ondelete="RESTRICT"), nullable=False)
    feedback = Column(Boolean)
    time_submit = Column(TIMESTAMP,  server_default=func.current_timestamp())

    interaction = relationship("DetectionResult", back_populates="feedbacks")
