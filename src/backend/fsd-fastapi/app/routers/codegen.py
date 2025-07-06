import json
from base64 import b64encode, b64decode
from typing import Dict, Any
from fastapi import APIRouter, Request, Form, HTTPException, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from jose import jwt
from urllib.parse import urlencode, quote

from app.config import settings
from app.models.schemas import SurveyForm, AccessCodeResponse

router = APIRouter(prefix="/codegen", tags=["codegen"])
templates = Jinja2Templates(directory="app/templates")

@router.get("/survey", response_class=HTMLResponse)
async def survey_form(request: Request):
    return templates.TemplateResponse("survey.html", {"request": request})

@router.post("/survey", response_class=HTMLResponse)
async def submit_survey(
    request: Request,
    first_name: str = Form(...),
    last_name: str = Form(...),
    school: str = Form(...),
    teacher: str = Form(...)
):
    form_data = {
        "first_name": first_name,
        "last_name": last_name,
        "school": school,
        "teacher": teacher
    }
    
    payload = b64encode(json.dumps(form_data).encode()).decode()
    redirect_url = f"/codegen/generate?payload={quote(payload)}"
    
    return RedirectResponse(url=redirect_url, status_code=302)

@router.get("/generate", response_class=HTMLResponse)
async def generate_access_code(request: Request, payload: str):
    try:
        payload_str = b64decode(payload).decode()
        payload_data = json.loads(payload_str)
        
        code = jwt.encode(payload_data, settings.codegen_jwt_secret, algorithm="HS256")
        
        return templates.TemplateResponse("generate.html", {
            "request": request,
            "code": code
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid payload")

@router.get("/qualtrics", response_model=AccessCodeResponse)
async def qualtrics_integration(request: Request):
    query_params = dict(request.query_params)
    payload = b64encode(json.dumps(query_params).encode()).decode()
    
    base_url = str(request.base_url)
    if base_url.endswith('/'):
        base_url = base_url[:-1]
    
    access_code_url = f"{base_url}/codegen/generate?payload={quote(payload)}"
    
    return AccessCodeResponse(access_code_url=access_code_url)