from fastapi import FastAPI, UploadFile, File, Form, Depends
from typing import Optional, List, Dict
import json
import os
import requests
from .models import schemas
from .services.asr_tts import BhashiniConnector
from .services.agent import process_conversation, translate_dict
from .core.vectordb import query_recommendations
from .core.db import get_database
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from gtts import gTTS
from io import BytesIO
import base64

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
    pincode: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None

# ----- Transcription quality validator -----
NOISE_PATTERNS = {
    # Whisper hallucinations on silence
    "thank you", "thanks", "thanks for watching", "thank you for watching",
    ".", ",", "...", " ", "", "uh", "um", "hmm", "hm", "ah", "oh",
    "[music]", "[applause]", "[blank_audio]", "[noise]",
    "आप", "धन्यवाद", # common Hindi hallucinations
}

def is_valid_transcription(text: str) -> bool:
    """Returns True only when the transcription contains useful content."""
    if not text:
        return False
    cleaned = text.strip().lower()
    # Reject pure noise patterns
    if cleaned in NOISE_PATTERNS:
        return False
    # Reject if fewer than 2 real alphanumeric characters
    alphanum = [c for c in cleaned if c.isalnum()]
    if len(alphanum) < 2:
        return False
    # Reject very long hallucinations (> 300 chars) for single-field inputs
    if len(cleaned) > 300:
        return False
    return True

@app.post("/api/v1/auth/request-otp")
async def request_otp(req: OTPRequest):
    return {"status": "success", "message": f"OTP sent to {req.phone}"}

@app.post("/api/v1/auth/verify-otp")
async def verify_otp(req: OTPVerify):
    if req.otp == "1234":
        db = get_database()
        user = await db.users.find_one({"phone": req.phone})
        
        if user:
            # User exists
            profile_data = user.get("profile", {})
            return {
                "status": "success",
                "message": "OTP verified successfully",
                "is_new_user": False,
                "profile": profile_data
            }
        else:
            # New user
            return {
                "status": "success", 
                "message": "OTP verified successfully",
                "is_new_user": True,
                "profile": None
            }
    return {"status": "error", "message": "Invalid OTP"}

# Fields that should only contain digits
NUMERIC_FIELDS = {"age", "pincode"}
# Minimum meaningful lengths per field
MIN_LENGTHS = {"name": 2, "age": 1, "gender": 1, "pincode": 6, "district": 2}

def sanitize_profile(raw: dict) -> dict:
    """Strip empty, whitespace-only, or nonsensical values. Return only valid fields."""
    cleaned = {}
    for key, value in raw.items():
        if value is None:
            continue
        text = str(value).strip()
        if not text:
            continue
        # Numeric-only fields must actually be digits
        if key in NUMERIC_FIELDS and not text.isdigit():
            continue
        # Honour minimum meaningful length
        min_len = MIN_LENGTHS.get(key, 1)
        if len(text) < min_len:
            continue
        cleaned[key] = text
    return cleaned

@app.post("/api/v1/register")
async def register_user(form: RegistrationForm):
    db = get_database()
    raw = form.dict(exclude_unset=True)
    phone = raw.pop("phone", None)
    
    if not phone:
        return {"status": "error", "message": "Phone number is required"}
    
    # Only persist validated, meaningful fields
    profile_data = sanitize_profile(raw)
    
    if not profile_data:
        return {"status": "error", "message": "No valid fields to save"}
        
    await db.users.update_one(
        {"phone": phone},
        {"$set": {"profile": profile_data, "phone": phone}},
        upsert=True
    )
    
    return {"status": "success", "message": "Registration complete!", "data": profile_data}

@app.post("/api/v1/voice/transcribe-field")
async def transcribe_field(
    field_name: str = Form(...),
    audio_file: UploadFile = File(...),
    language: str = Form("hi")
):
    audio_bytes = await audio_file.read()
    
    prompt = None
    if "phone" in field_name.lower() or "otp" in field_name.lower():
        prompt = "9 8 7 6 5 4 3 2 1 0. Phone number."
        
    try:
        transcribed_text = bhashini.transcribe_audio(audio_bytes, language, prompt=prompt)
    except Exception as e:
        print(f"Error during transcription: {e}")
        return {"text": "", "valid": False, "reason": "transcription_failed"}
    
    valid = is_valid_transcription(transcribed_text)
    return {
        "text": transcribed_text if valid else "",
        "valid": valid,
        "raw": transcribed_text  # let frontend log raw for debugging
    }

class TranslateRequest(BaseModel):
    texts: Dict[str, str]
    target_language: str

@app.post("/api/v1/translate")
async def translate_texts(req: TranslateRequest):
    translated = translate_dict(req.texts, req.target_language)
    return {"status": "success", "data": translated}

@app.get("/api/v1/voice/generate-prompt")
async def generate_prompt(field_name: str, language: str = "hi"):
    from .services.agent import generate_voice_prompt
    prompt_text = generate_voice_prompt(field_name, language)
    return {"status": "success", "prompt": prompt_text}

class SynthesizeRequest(BaseModel):
    text: str
    language: str

@app.post("/api/v1/voice/synthesize")
async def synthesize_voice(req: SynthesizeRequest):
    try:
        lang = req.language.split("-")[0]
        # gTTS supports hi, mr, gu, ta, te, bn, ur, ml, kn
        tts = gTTS(text=req.text, lang=lang)
        fp = BytesIO()
        tts.write_to_fp(fp)
        audio_base64 = base64.b64encode(fp.getvalue()).decode('utf-8')
        return {"status": "success", "audio_base64": audio_base64}
    except Exception as e:
        print(f"TTS Error: {e}")
        return {"status": "error", "message": str(e)}

@app.get("/api/v1/location/resolve-pincode")
async def resolve_pincode(pincode: str):
    try:
        res = requests.get(f"https://api.postalpincode.in/pincode/{pincode}").json()
        if res and res[0]["Status"] == "Success":
            info = res[0]["PostOffice"][0]
            return {
                "status": "success",
                "district": info["District"],
                "state": info["State"],
                "taluka": info.get("Taluk", info.get("Name", ""))
            }
        return {"status": "error", "message": "Invalid PIN Code"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/v1/location/reverse-geocode")
async def reverse_geocode(lat: str, lon: str):
    try:
        url = f"https://api.bigdatacloud.net/data/reverse-geocode-client?latitude={lat}&longitude={lon}&localityLanguage=en"
        res = requests.get(url, timeout=3).json()
        return {"status": "success", "pincode": res.get("postcode", "")}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/v1/training-centers/stats")
async def training_centers_stats(district: str):
    try:
        json_path = os.path.join(os.path.dirname(__file__), "..", "training_centers_gujarat.json")
        if not os.path.exists(json_path):
            return {"status": "error", "count": 0, "message": "Data file not found"}
            
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        districts = data.get("Data", {}).get("District", [])
        for d in districts:
            if d.get("District", "").lower() == district.lower():
                return {"status": "success", "count": int(d.get("Count", 0)), "district": d.get("District")}
                
        return {"status": "success", "count": 0, "district": district, "message": "No centers found for this district"}
    except Exception as e:
        print(f"Error fetching stats: {e}")
        return {"status": "error", "count": 0, "message": str(e)}

# --- Existing Endpoints ---

@app.post("/api/v1/voice/chat", response_model=schemas.ChatResponse)
async def voice_chat(
    audio_file: Optional[UploadFile] = File(None),
    text_transcript: Optional[str] = Form(None),
    language: str = Form("hi"),
    current_profile_json: str = Form("{}"),
    phone: Optional[str] = Form(None)
):
    profile_data = json.loads(current_profile_json)
    profile = schemas.BeneficiaryProfile(**profile_data)

    transcribed_text = text_transcript
    if audio_file and not text_transcript:
        audio_bytes = await audio_file.read()
        try:
            raw_text = bhashini.transcribe_audio(audio_bytes, language)
            # Only use transcription if it contains valid content
            transcribed_text = raw_text if is_valid_transcription(raw_text) else None
        except Exception as e:
            print(f"ASR error in chat: {e}")
            transcribed_text = None

    if not transcribed_text:
        return schemas.ChatResponse(
            transcribed_text="",
            bot_response_text="",
            audio_base64="",
            current_profile=profile
        )

    bot_response_text, updated_profile = process_conversation(transcribed_text, profile)
    audio_base64 = bhashini.synthesize_text(bot_response_text, language)

    # Persist any newly extracted valid profile fields to MongoDB
    if phone:
        try:
            db = get_database()
            updated_dict = updated_profile.dict(exclude_unset=True) if hasattr(updated_profile, 'dict') else {}
            valid_fields = sanitize_profile(updated_dict)
            if valid_fields:
                await db.users.update_one(
                    {"phone": phone},
                    {"$set": {f"profile.{k}": v for k, v in valid_fields.items()}},
                    upsert=True
                )
        except Exception as e:
            print(f"MongoDB profile update error: {e}")

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
