import re
from typing import Dict, Any, TypedDict
from app.models.schemas import BeneficiaryProfile

class AgentState(TypedDict):
    text: str
    profile: dict
    messages: list
    bot_response: str

def extract_slots(state: AgentState) -> AgentState:
    text = state["text"].lower()
    profile = state.get("profile", {})
    
    # Mock Entity Extraction (Regex-based for prototype)
    if "10th grade" in text or "10th" in text:
        profile["education_level"] = "10th Grade"
    if "tailor" in text or "sewing" in text:
        profile["traditional_trade"] = "Tailoring"
    if "farm" in text or "agriculture" in text:
        profile["traditional_trade"] = "Farming"
    if "wage" in text or "job" in text:
        profile["preference"] = "Wage Employment"
    if "business" in text or "self" in text:
        profile["preference"] = "Self-Employment"

    state["profile"] = profile
    return state

def generate_response(state: AgentState) -> AgentState:
    profile = state["profile"]
    missing_slots = []
    
    if not profile.get("education_level"):
        missing_slots.append("education level")
    if not profile.get("traditional_trade") and not profile.get("current_livelihood"):
        missing_slots.append("current trade or livelihood")
    if not profile.get("preference"):
        missing_slots.append("preference for wage or self-employment")

    if missing_slots:
        state["bot_response"] = f"Thank you. Could you also tell me about your {missing_slots[0]}?"
    else:
        state["bot_response"] = "I have all the information needed. You can now check the dashboard for recommendations."
    
    return state

try:
    from langgraph.graph import StateGraph, END
    workflow = StateGraph(AgentState)
    workflow.add_node("extract", extract_slots)
    workflow.add_node("respond", generate_response)
    workflow.set_entry_point("extract")
    workflow.add_edge("extract", "respond")
    workflow.add_edge("respond", END)
    app_graph = workflow.compile()
except ImportError:
    app_graph = None

def process_conversation(text: str, current_profile: BeneficiaryProfile) -> tuple[str, BeneficiaryProfile]:
    inputs = {
        "text": text,
        "profile": current_profile.dict(exclude_none=True),
        "messages": [],
        "bot_response": ""
    }
    
    if app_graph:
        result = app_graph.invoke(inputs)
    else:
        state = extract_slots(inputs)
        result = generate_response(state)
    
    updated_profile = BeneficiaryProfile(**result["profile"])
    return result["bot_response"], updated_profile

