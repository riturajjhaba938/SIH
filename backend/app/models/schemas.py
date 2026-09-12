from pydantic import BaseModel, Field
from typing import Optional, List, Union

class BeneficiaryProfile(BaseModel):
    education_level: Optional[str] = None
    traditional_trade: Optional[str] = None
    current_livelihood: Optional[str] = None
    mobility_km: Optional[int] = None
    preference: Optional[str] = None

class Recommendation(BaseModel):
    nsqf_pack_name: str
    level: int
    skill_gap_analysis: str
    local_centers: List[str]

class ChatResponse(BaseModel):
    transcribed_text: str
    bot_response_text: str
    audio_base64: str
    current_profile: BeneficiaryProfile

class ASRRequest(BaseModel):
    audio_base64: str = Field(..., description="Base64 encoded audio string")
    source_language: str = Field(..., description="Language code of the audio (e.g., 'hi')")

class ASRResponse(BaseModel):
    text: str = Field(..., description="Transcribed text from audio")
    language: str = Field(..., description="Detected or provided language code")

class ChatRequest(BaseModel):
    query: str = Field(..., description="User query in text")
    context_language: str = Field("en", description="Language for processing")

class TTSRequest(BaseModel):
    text: str = Field(..., description="Text to synthesize")
    target_language: str = Field(..., description="Target language code (e.g., 'hi')")

class TTSResponse(BaseModel):
    audio_base64: str = Field(..., description="Base64 encoded audio of the synthesized text")

class TranslateRequest(BaseModel):
    text: Union[str, List[str]] = Field(..., description="Text or list of texts to translate")
    source: Optional[str] = Field("en", description="Source language code (e.g., 'en')")
    target: str = Field("hi", description="Target language code (e.g., 'hi')")
    format: Optional[str] = Field("text", description="Format of the text: 'text' or 'html'")

class TranslateResponse(BaseModel):
    translatedText: Union[str, List[str]]
    source: str
    target: str
    status: str

