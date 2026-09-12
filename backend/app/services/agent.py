import os
import json
from typing import Dict, Any, TypedDict
from langgraph.graph import StateGraph, END
from app.models.schemas import BeneficiaryProfile
from dotenv import load_dotenv

load_dotenv()


try:
    from groq import Groq
except ImportError:
    Groq = None

# Initialize Groq client
client = None
if Groq and os.getenv("GROQ_API_KEY"):
    try:
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        print("Groq client initialized successfully!")
    except Exception as e:
        print(f"Failed to initialize Groq client: {e}")
else:
    print("\n" + "="*60)
    print("WARNING: Groq library not installed or GROQ_API_KEY not set!")
    print("Translations and Voice Prompts will FALL BACK TO ENGLISH.")
    print("Ensure you have set GROQ_API_KEY in your .env file.")
    print("="*60 + "\n")

class AgentState(TypedDict):
    text: str
    profile: dict
    messages: list
    bot_response: str
    language: str

def extract_slots(state: AgentState) -> AgentState:
    text = state["text"]
    profile = state.get("profile", {})
    language = state.get("language", "hi")
    
    if not client:
        return state

    prompt = f"""You are an AI assistant helping to fill out a beneficiary profile.
Current profile data: {json.dumps(profile)}
Extract any relevant information and output a JSON object containing the updated profile fields. 
Keys must match: education_level, traditional_trade, current_livelihood, preference.
Only include keys that have updated or newly extracted information."""
    
    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": f"[Language Code: {language}] {text}"}
            ],
            temperature=0.1,
            max_tokens=200,
        )
        
        output_text = response.choices[0].message.content.strip()
        # Clean up in case it wraps in markdown blocks
        if output_text.startswith("```json"):
            output_text = output_text[7:]
        if output_text.startswith("```"):
            output_text = output_text[3:]
        if output_text.endswith("```"):
            output_text = output_text[:-3]
            
        updates = json.loads(output_text.strip())
        profile.update(updates)
    except Exception as e:
        print("Error during slot extraction:", e)
        
    state["profile"] = profile
    return state

def generate_response(state: AgentState) -> AgentState:
    profile = state["profile"]
    language = state.get("language", "hi")
    
    if not client:
        state["bot_response"] = "Error: API client not initialized."
        return state

    prompt = f"""You are an AI assistant interviewing a user for a government skills program.
You need the following information: education level, current trade or livelihood, and preference for wage or self-employment.
Current profile data: {json.dumps(profile)}
If any of these fields are missing, generate a short, friendly conversational response asking for ONE of the missing pieces of information.
If all fields are present, thank the user and tell them they can check the dashboard for recommendations.
CRITICAL: You MUST write your response in the language corresponding to this language code: '{language}' (e.g. 'hi' for Hindi, 'te' for Telugu, etc.).
Output ONLY the response text without any formatting."""
    
    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": "Generate response now."}
            ],
            temperature=0.7,
            max_tokens=200,
        )
        state["bot_response"] = response.choices[0].message.content.strip()
    except Exception as e:
        print("Error during response generation:", e)
        state["bot_response"] = "Sorry, I am having trouble processing that right now."
        
    return state

# Build the Graph
workflow = StateGraph(AgentState)
workflow.add_node("extract", extract_slots)
workflow.add_node("respond", generate_response)

workflow.set_entry_point("extract")
workflow.add_edge("extract", "respond")
workflow.add_edge("respond", END)

app_graph = workflow.compile()

def process_conversation(text: str, current_profile: BeneficiaryProfile, language: str = "hi") -> tuple[str, BeneficiaryProfile]:
    inputs = {
        "text": text,
        "profile": current_profile.dict(exclude_none=True),
        "messages": [],
        "bot_response": "",
        "language": language
    }
    
    result = app_graph.invoke(inputs)
    
    updated_profile = BeneficiaryProfile(**result["profile"])
    return result["bot_response"], updated_profile

def translate_dict(data: dict, target_language: str) -> dict:
    if target_language == "en":
        return data
        
    if not client:
        print("No API client loaded for translation. Returning original data.")
        return data

    prompt = f"""You are an AI assistant specialized in translating JSON objects.
Translate all the string values in the provided JSON object from English to the language corresponding to language code '{target_language}' (e.g. 'hi' for Hindi, 'bn' for Bengali, 'te' for Telugu).
Keep the JSON keys exactly the same. Only translate the values.
Output ONLY valid JSON without any markdown formatting or explanations."""
    
    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": json.dumps(data)}
            ],
            temperature=0.1,
            max_tokens=4000,
            response_format={"type": "json_object"}
        )
        
        output_text = response.choices[0].message.content.strip()
        translated_data = json.loads(output_text)
        
        # Ensure all keys from original data are present in translated data (fallback)
        for k, v in data.items():
            if k not in translated_data:
                translated_data[k] = v
                
        return translated_data
    except Exception as e:
        print("Error during batch translation:", e)
        return data

def generate_voice_prompt(field_name: str, language: str) -> str:
    if language == "en":
        return f"Please enter your {field_name}."
        
    if not client:
        return f"Please enter your {field_name}."

    prompt = f"""You are a helpful AI assistant.
Translate the phrase "Please enter your {field_name}" into the language corresponding to language code '{language}'.
Output ONLY the translated sentence, without any english text or markdown formatting."""
    
    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": "Translate now."}
            ],
            temperature=0.1,
            max_tokens=100,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print("Error generating voice prompt:", e)
        return f"Please enter your {field_name}."
