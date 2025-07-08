from sqlalchemy import Column, BigInteger, Integer, String, DateTime, JSON
from sqlalchemy.sql import func
from app.database import Base
from enum import Enum

class EventType(str, Enum):
    UNKNOWN = "UNKNOWN"
    
    GAME_START = "GAME_START"
    GAME_END = "GAME_END"
    
    INSPECT = "INSPECT"
    TALK = "TALK"
    
    BACKPACK_ADD = "BACKPACK_ADD"
    BACKPACK_DISCARD = "BACKPACK_DISCARD"
    
    ZONE_ENTER = "ZONE_ENTER"
    ZONE_EXIT = "ZONE_EXIT"
    
    LAB_ENTER = "LAB_ENTER"
    LAB_TEST = "LAB_TEST"
    LAB_EXIT = "LAB_EXIT"
    
    SCRATCHPAD_OPEN = "SCRATCHPAD_OPEN"
    SCRATCHPAD_UPDATE = "SCRATCHPAD_UPDATE"
    SCRATCHPAD_CLOSE = "SCRATCHPAD_CLOSE"
    
    KIOSK_OPEN = "KIOSK_OPEN"
    KIOSK_VIEW = "KIOSK_VIEW"
    KIOSK_CLOSE = "KIOSK_CLOSE"
    
    ASSESSMENT_START = "ASSESSMENT_START"
    ASSESSMENT_UPDATE = "ASSESSMENT_UPDATE"
    ASSESSMENT_END = "ASSESSMENT_END"

class Event(Base):
    __tablename__ = "metrics_event"
    
    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    datetime = Column(DateTime(6), nullable=False)
    type = Column(String(32), nullable=False)
    params = Column(JSON, nullable=False)