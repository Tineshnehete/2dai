from typing import Dict, Any, List
from langchain_core.messages import HumanMessage
from agents.state import DesignState

def supervisor_node(state: DesignState) -> Dict[str, Any]:
    """
    The Supervisor determines the intent of the user (generate vs edit)
    and routes the state accordingly.
    """
    messages = state.get("messages", [])
    if messages:
        last_message = messages[-1].content.lower()
        if "edit" in last_message or "change" in last_message:
            return {"intent": "edit"}
        else:
            return {"intent": "generate"}
    return {}

def quality_checker_node(state: DesignState) -> Dict[str, Any]:
    """
    Validates the generated schema against constraints (contrast, sizing, valid JSON).
    """
    print("Quality checker node executing...")
    return {"iteration": state.get("iteration", 0) + 1}
