from fastapi import FastAPI, UploadFile, File, Form, Depends
from typing import Optional, List
import json
from .models import schemas
from .services.asr_tts import BhashiniConnector
from .services.agent import process_conversation
from .services.libretranslate import translate_text
from .core.vectordb import query_recommendations
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="PM-AJAY Voice Assistant API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

bhashini = BhashiniConnector()

# --- Auth & Registration Mock Endpoints ---
class OTPRequest(BaseModel):
    phone: str

class OTPVerify(BaseModel):
    phone: str
    otp: str

class RegistrationForm(BaseModel):
    phone: str
    name: Optional[str] = None
    age: Optional[str] = None
    gender: Optional[str] = None
    disability: Optional[str] = None
    primary_skill: Optional[str] = None
    field_of_interest: Optional[str] = None
    description: Optional[str] = None

@app.post("/api/v1/auth/request-otp")
async def request_otp(req: OTPRequest):
    return {"status": "success", "message": f"OTP sent to {req.phone}"}

@app.post("/api/v1/auth/verify-otp")
async def verify_otp(req: OTPVerify):
    if req.otp == "1234":
        return {"status": "success", "message": "OTP verified successfully"}
    return {"status": "error", "message": "Invalid OTP"}

@app.post("/api/v1/register")
async def register_user(form: RegistrationForm):
    # Mock saving to DB
    return {"status": "success", "message": "Registration complete!", "data": form.dict()}

@app.post("/api/v1/voice/transcribe-field")
async def transcribe_field(
    field_name: str = Form(...),
    audio_file: UploadFile = File(...)
):
    # Mock STT based on the field being requested to show the voice registration capability
    mock_responses = {
        "name": "Rituraj Jha",
        "age": "24",
        "gender": "Male",
        "disability": "None",
        "primary_skill": "Tailoring",
        "field_of_interest": "Fashion Design",
        "description": "I want to learn how to design modern clothes and start my own boutique."
    }
    
    # Read file just to mock processing
    await audio_file.read()
    
    transcribed_text = mock_responses.get(field_name.lower(), "Sample voice input")
    return {"text": transcribed_text}

# --- Existing Endpoints ---

@app.post("/api/v1/voice/chat", response_model=schemas.ChatResponse)
async def voice_chat(
    audio_file: Optional[UploadFile] = File(None),
    text_transcript: Optional[str] = Form(None),
    language: str = Form("hi"),
    current_profile_json: str = Form("{}")
):
    profile_data = json.loads(current_profile_json)
    profile = schemas.BeneficiaryProfile(**profile_data)

    transcribed_text = text_transcript
    if audio_file and not text_transcript:
        audio_bytes = await audio_file.read()
        transcribed_text = bhashini.transcribe_audio(audio_bytes, language)

    bot_response_text, updated_profile = process_conversation(transcribed_text, profile)
    audio_base64 = bhashini.synthesize_text(bot_response_text, language)

    return schemas.ChatResponse(
        transcribed_text=transcribed_text,
        bot_response_text=bot_response_text,
        audio_base64=audio_base64,
        current_profile=updated_profile
    )

@app.get("/api/v1/recommendations", response_model=List[schemas.Recommendation])
async def get_recommendations(profile_json: str):
    profile_data = json.loads(profile_json)
    query_str = " ".join([str(v) for v in profile_data.values() if v])
    if not query_str:
        return []

    results = query_recommendations(query_str, n_results=2)
    
    recs = []
    if results and results['metadatas'] and len(results['metadatas'][0]) > 0:
        for meta in results['metadatas'][0]:
            recs.append(schemas.Recommendation(
                nsqf_pack_name=meta["name"],
                level=meta["level"],
                skill_gap_analysis="Training required based on current profile.",
                local_centers=["PM-AJAY Center A", "Local MSME Hub"]
            ))
    return recs

@app.post("/api/translate", response_model=schemas.TranslateResponse)
@app.post("/api/v1/translate", response_model=schemas.TranslateResponse)
async def translate_endpoint(req: schemas.TranslateRequest):
    result = await translate_text(
        text=req.text,
        source=req.source or "en",
        target=req.target or "hi",
        format=req.format or "text"
    )
    return schemas.TranslateResponse(**result)
