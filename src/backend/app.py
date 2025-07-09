from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
import mysql.connector
from mysql.connector import Error
import json
import os
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()

print('DEBUG: os.environ:', dict(os.environ))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', '3306')),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'test'),
    'charset': 'utf8mb4'
}

print('DEBUG: DB_CONFIG:', DB_CONFIG)

class MetricEvent(BaseModel):
    UserId: int
    Type: str
    Params: dict
    Timestamp: int = None

def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

@app.get("/")
def home():
    return {"message": "Hello, FastAPI!"}

@app.get("/api/players")
def get_players():
    try:
        connection = get_db_connection()
        if not connection:
            raise HTTPException(status_code=500, detail="Database connection failed")
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM metrics_event ORDER BY datetime DESC"
        cursor.execute(query)
        results = cursor.fetchall()
        print('DEBUG: results from DB:', results)
        cursor.execute("SHOW TABLES;")
        print('DEBUG: tables:', cursor.fetchall())
        players = []
        for row in results:
            players.append({
                'user_id': row['user_id'],
                'datetime': row['datetime'].isoformat() if isinstance(row['datetime'], datetime) else str(row['datetime']),
                'type': row['type'],
                'params': json.loads(row['params']) if row['params'] else {}
            })
        cursor.close()
        connection.close()
        return players
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@app.get("/api/players/{user_id}")
def get_player_by_id(user_id: int):
    try:
        connection = get_db_connection()
        if not connection:
            raise HTTPException(status_code=500, detail="Database connection failed")
        cursor = connection.cursor(dictionary=True)
        query = """
        SELECT 
            user_id,
            datetime,
            type,
            params
        FROM metrics_event 
        WHERE user_id = %s
        ORDER BY datetime DESC
        """
        cursor.execute(query, (user_id,))
        results = cursor.fetchall()
        if not results:
            raise HTTPException(status_code=404, detail="Player not found")
        players = []
        for row in results:
            players.append({
                'user_id': row['user_id'],
                'datetime': row['datetime'].isoformat() if isinstance(row['datetime'], datetime) else str(row['datetime']),
                'type': row['type'],
                'params': json.loads(row['params']) if row['params'] else {}
            })
        cursor.close()
        connection.close()
        return players
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@app.post("/api/metrics")
async def add_metric_event(request: Request):
    try:
        # Get raw body as string
        body = await request.body()
        body_str = body.decode('utf-8')
        
        # Parse the JSON string
        event_data = json.loads(body_str)
        
        # Extract fields with proper case handling
        user_id = event_data.get('UserId', 0)
        event_type = event_data.get('Type', '')
        params = event_data.get('Params', {})
        
        connection = get_db_connection()
        if not connection:
            raise HTTPException(status_code=500, detail="Database connection failed")
        cursor = connection.cursor()
        
        query = """
        INSERT INTO metrics_event (user_id, datetime, type, params)
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (
            user_id,
            datetime.now(),
            event_type,
            json.dumps(params)
        ))
        
        connection.commit()
        event_id = cursor.lastrowid
        cursor.close()
        connection.close()
        
        return {"success": True, "id": event_id, "message": "Metric event recorded"}
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")