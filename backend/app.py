from fastapi import FastAPI, HTTPException, Request, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
import mysql.connector
from mysql.connector import Error
import json
import os
from datetime import datetime
from dotenv import load_dotenv
from django.conf import settings
from django.contrib.auth.hashers import check_password
from pydantic import BaseModel


class UserCredentials(BaseModel):
    username: str
    password: str

if not settings.configured:
    settings.configure(
        # We must provide a SECRET_KEY, even if it's a dummy one for this purpose.
        SECRET_KEY='a-dummy-secret-key-for-standalone-use',
        
        # This tells Django which hashing algorithms to recognize.
        # This is the default list from a standard Django project.
        PASSWORD_HASHERS=[
            'django.contrib.auth.hashers.PBKDF2PasswordHasher',
            'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
            'django.contrib.auth.hashers.Argon2PasswordHasher',
            'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
        ]
    )
# --- End of Django configuration ---

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
    'host': os.getenv('DB_HOST', '127.0.0.1'),
    'port': int(os.getenv('DB_PORT', '3306')),
    'user': os.getenv('DB_USER', 'fsd'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'fsd'),
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
    
def verify_django_password(plain_password: str, hashed: str) -> bool:
    return django_pbkdf2_sha256.verify(plain_password, hashed)

@app.get("/")
def home():
    return {"message": "Hello, FastAPI!"}

@app.get("/api/players")
def get_players(
    start_date: Optional[date] = Query(None, description=""),
    end_date: Optional[date] = Query(None, description=""),
    event_type: Optional[str] = Query(None, description=""),
    limit: int = Query(50, ge=1, le=100, description=""),
    offset: int = Query(0, ge=0, description="")
):
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
        return {
            "data": players,
            "pagination": {
                "limit": limit,
                "offset": offset,
                "count": len(players)
            }
        }
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

@app.get("/api/avgCompletionTime")
def avg_completion_time():
    try:
        connection = get_db_connection()
        if not connection:
            raise HTTPException(status_code=500, detail="Database connection failed")
        cursor = connection.cursor(dictionary=True)
        query = """
        WITH CompletedSessions AS (
            SELECT 
                starts.user_id, 
                starts.datetime AS start_time,
                (
                    SELECT MIN(ends.datetime)
                    FROM metrics_event AS ends
                    WHERE ends.user_id = starts.user_id
                        AND ends.type = 'ASSESSMENT_END'
                        AND ends.datetime > starts.datetime
                ) AS end_time
            FROM metrics_event AS starts
            WHERE starts.type = 'ASSESSMENT_START'
        )
        SELECT 
            SEC_TO_TIME(AVG(TIMESTAMPDIFF(SECOND, start_time, end_time))) AS avg_completion_time,
            AVG(TIMESTAMPDIFF(SECOND, start_time, end_time)) AS avg_completion_seconds
        FROM CompletedSessions
        WHERE end_time IS NOT NULL;
        """
        cursor.execute(query)
        result = cursor.fetchone()
        cursor.close()
        connection.close()
        return {
            "avg_completion_time": result["avg_completion_time"],
            "avg_completion_seconds": result["avg_completion_seconds"]
        }
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
    
    from fastapi import FastAPI, HTTPException
# Assuming get_db_connection is in a file named 'database'
# from database import get_db_connection

# This is a placeholder for your actual DB connection function and app instance
# app = FastAPI()
# def get_db_connection(): ...

@app.get("/api/mostVisitedArea")
async def most_visited_area():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = """
            SELECT
                JSON_UNQUOTE(JSON_EXTRACT(params, '$.Name')) AS zone_name,
                COUNT(*) AS visit_count
            FROM
                metrics_event
            WHERE
                type = 'ZONE_ENTER'
            GROUP BY
                zone_name
            ORDER BY
                visit_count DESC
            LIMIT 1;
        """
        
        cursor.execute(query)
        result = cursor.fetchone()
        
        if not result:
            return {"message": "No ZONE_ENTER events found."}
            
        return result

    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
        
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

@app.get("/api/mostPopularFinalClaim")
async def most_popular_final_claim():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT
                JSON_UNQUOTE(JSON_EXTRACT(params, '$.FinalClaim')) AS final_claim,
                COUNT(*) AS claim_count
            FROM
                metrics_event
            WHERE
                type = 'ASSESSMENT_UPDATE'
                AND JSON_EXTRACT(params, '$.FinalClaim') IS NOT NULL
            GROUP BY
                final_claim
            ORDER BY
                claim_count DESC
            LIMIT 1;
        """
        cursor.execute(query)
        result = cursor.fetchone()
        if not result:
            return {"message": "No final claims found."}
        return result
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()
    
@app.get("/api/finalHypothesisCount")
async def final_hypothesis_count():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT
                JSON_UNQUOTE(JSON_EXTRACT(params, '$.FinalClaim')) AS final_claim,
                COUNT(*) AS claim_count
            FROM
                metrics_event
            WHERE
                type = 'ASSESSMENT_UPDATE'
                AND JSON_EXTRACT(params, '$.FinalClaim') IS NOT NULL
            GROUP BY
                final_claim
            ORDER BY
                claim_count DESC;
        """
        cursor.execute(query)
        results = cursor.fetchall()
        return results
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

@app.get("/api/mostCommonlyFoundEvidence")
async def most_commonly_found_evidence():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT
                JSON_UNQUOTE(JSON_EXTRACT(params, '$.ItemName')) AS item_name,
                COUNT(*) AS item_count
            FROM
                metrics_event
            WHERE
                type = 'BACKPACK_ADD'
                AND JSON_EXTRACT(params, '$.ItemName') IS NOT NULL
            GROUP BY
                item_name
            ORDER BY
                item_count DESC;
        """
        cursor.execute(query)
        results = cursor.fetchall()
        return results
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        if conn and conn.is_connected():
            cursor.close()

@app.get("/api/totalVisitedZones")
async def total_visited_zones():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT
                JSON_UNQUOTE(JSON_EXTRACT(params, '$.Name')) AS zone_name,
                COUNT(*) AS visit_count
            FROM
                metrics_event
            WHERE
                type = 'ZONE_ENTER'
            GROUP BY
                zone_name
            ORDER BY
                visit_count DESC;
        """
        cursor.execute(query)
        results = cursor.fetchall()
        return results
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()


@app.get("/api/firstFinalClaim")
async def first_final_claim():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            WITH claims_data AS (
                SELECT
                    JSON_UNQUOTE(JSON_EXTRACT(params, '$.InitialClaim')) as initial_claim,
                    JSON_UNQUOTE(JSON_EXTRACT(params, '$.FinalClaim')) as final_claim
                FROM
                    metrics_event
                WHERE
                    type = 'ASSESSMENT_UPDATE'
                    AND JSON_CONTAINS_PATH(params, 'one', '$.InitialClaim', '$.FinalClaim')
            )
            SELECT
                SUBSTRING_INDEX(COALESCE(initial_claim, final_claim), ' ', 1) AS hypothesis,
                COUNT(initial_claim) AS initial_claims_count,
                COUNT(final_claim) AS final_claims_count
            FROM
                claims_data
            GROUP BY
                hypothesis
            ORDER BY
                (COUNT(initial_claim) + COUNT(final_claim)) DESC;
        """
        cursor.execute(query)
        results = cursor.fetchall()
        return results
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()
    
@app.post("/api/login")
async def login(credentials: UserCredentials):
    print(f"--- LOGIN ENDPOINT HIT for user: {credentials.username} ---")
    conn = None
    cursor = None # Define cursor here to access it in finally
    try:
        conn = get_db_connection()
        if not conn:
            raise HTTPException(status_code=503, detail="Database connection is unavailable")

        cursor = conn.cursor(dictionary=True)
        
        # This part no longer needs its own try block
        cursor.execute("SELECT id, password FROM auth_user WHERE username = %s AND is_active = 1", (credentials.username,))
        user = cursor.fetchone()

        # The check_password function now correctly takes the plain-text password first
        if not user or not check_password(credentials.password, user["password"]):
            print(f"Login failed: Invalid credentials for user '{credentials.username}'.")
            # This will now correctly return a 401 error to the frontend
            raise HTTPException(status_code=401, detail="Invalid username or password")

        print(f"Login successful for user ID: {user['id']}")
        return {"user_id": user["id"], "message": "Login successful"}

    except mysql.connector.Error as db_err:
        # Catch specific database errors
        print(f"A database error occurred: {db_err}")
        raise HTTPException(status_code=500, detail="A database error occurred.")
    except Exception as e:
        # Catch any other unexpected server-side errors
        print(f"An unexpected error occurred during login: {e}")
        raise HTTPException(status_code=500, detail="Login Unsuccessful. Please try again.")
    finally:
        # Ensure resources are always closed
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()