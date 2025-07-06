from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.events import Event
from app.models.schemas import EventCreate, EventResponse

router = APIRouter(prefix="/metrics", tags=["metrics"])

@router.put("/events", status_code=201)
async def create_event(
    event_data: EventCreate,
    db: AsyncSession = Depends(get_db)
):
    try:
        event_datetime = datetime.fromtimestamp(event_data.Timestamp, tz=timezone.utc)
        
        event = Event(
            user_id=event_data.UserId,
            datetime=event_datetime,
            type=event_data.Type.value,
            params=event_data.Params
        )
        
        db.add(event)
        await db.commit()
        await db.refresh(event)
        
        return {"status": "created", "event_id": event.id}
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/events", response_model=list[EventResponse])
async def get_events(
    user_id: int = None,
    limit: int = 100,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    query = select(Event)
    
    if user_id:
        query = query.where(Event.user_id == user_id)
    
    query = query.offset(offset).limit(limit).order_by(Event.datetime.desc())
    
    result = await db.execute(query)
    events = result.scalars().all()
    
    return events