from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Dict, Any

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

@router.get("/player-data")
async def get_player_data(
    limit: int = 100,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    try:
        query = select(
            Event.user_id,
            func.min(Event.datetime).label('start_time'),
            func.max(Event.datetime).label('end_time'),
            func.count(Event.id).label('event_count')
        ).group_by(Event.user_id)
        
        query = query.offset(offset).limit(limit).order_by(func.max(Event.datetime).desc())
        
        result = await db.execute(query)
        player_sessions = result.all()
        
        player_data = []
        for session in player_sessions:
            start_time = session.start_time
            end_time = session.end_time
            duration_minutes = int((end_time - start_time).total_seconds() / 60)
            
            game_mode_query = select(Event.params).where(
                Event.user_id == session.user_id,
                Event.type == "GAME_START"
            ).limit(1)
            
            mode_result = await db.execute(game_mode_query)
            mode_event = mode_result.scalar_one_or_none()
            
            mode = "Unknown"
            if mode_event and isinstance(mode_event, dict):
                mode = mode_event.get("difficulty", "Unknown")
            
            status = True
            end_event_query = select(Event).where(
                Event.user_id == session.user_id,
                Event.type == "GAME_END"
            ).limit(1)
            
            end_result = await db.execute(end_event_query)
            end_event = end_result.scalar_one_or_none()
            
            if not end_event:
                status = False
            
            player_data.append({
                "name": f"Player{session.user_id}",
                "startTime": start_time.strftime("%H:%M"),
                "endTime": end_time.strftime("%H:%M"),
                "mode": mode,
                "duration": f"{duration_minutes}min",
                "status": status
            })
        
        return player_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))