from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from app.models.events import EventType

class SurveyForm(BaseModel):
    first_name: str = Field(..., max_length=256)
    last_name: str = Field(..., max_length=256)
    school: str = Field(..., max_length=256)
    teacher: str = Field(..., max_length=256)

class EventCreate(BaseModel):
    UserId: int = Field(..., alias="UserId")
    Timestamp: float = Field(..., alias="Timestamp")
    Type: Optional[EventType] = Field(EventType.UNKNOWN, alias="Type")
    Params: Optional[Dict[str, Any]] = Field(default_factory=dict, alias="Params")

class EventResponse(BaseModel):
    id: int
    user_id: int
    datetime: datetime
    type: str
    params: Dict[str, Any]
    
    class Config:
        from_attributes = True

class AccessCodeResponse(BaseModel):
    access_code_url: str