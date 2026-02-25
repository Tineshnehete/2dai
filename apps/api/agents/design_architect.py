import os
from typing import Any, Dict, List, Optional
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from schemas.canvas_schema import CanvasScene, FabricObject, CanvasConfig
from agents.state import DesignState
from pydantic import ValidationError
import json

# Initialize the OpenAI model
# Ensure OPENAI_API_KEY is in your environment (.env is loaded in main.py)
model = ChatOpenAI(model="gpt-4o", temperature=0)

SYSTEM_PROMPT = """
You are a professional Graphic Design Architect. Your job is to translate a user's design request into a structured Fabric.js JSON schema.
The schema consists of a 'canvas' configuration and a list of 'objects'.

Each object MUST have:
- id: a unique string ID
- type: "text", "textbox", "rect", "circle", "triangle", "image", or "group"
- properties: an object containing positions (left, top), sizing (width, height), colors (fill, stroke), and other Fabric.js properties.

Available properties for all objects:
- left: number
- top: number
- fill: string (hex or color name)
- opacity: number (0 to 1)
- angle: number (rotation in degrees)

Specific for 'text' and 'textbox':
- text: string
- fontSize: number
- fontFamily: string
- fontWeight: "normal" | "bold"

Keep designs clean, modern, and professional. Use a harmonious color palette.
The canvas defaults to 800x600 unless specified.

Output MUST be a valid JSON that conforms to the CanvasScene schema.
"""

def design_architect_node(state: DesignState) -> Dict[str, Any]:
    """
    Design Architect Agent: Generates a full canvas scene based on the user's prompt.
    """
    messages = state.get("messages", [])
    if not messages:
        return {}

    user_prompt = messages[-1].content

    # Prepare messages for LLM
    llm_messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=f"Create a design for: {user_prompt}")
    ]

    # Use structured output with function_calling method to avoid strict schema issues
    structured_llm = model.with_structured_output(CanvasScene, method="function_calling")
    
    try:
        response = structured_llm.invoke(llm_messages)
        print(f"Generated design with {len(response.objects)} objects.")
        return {"canvas_schema": response}
    except Exception as e:
        print(f"Error in Design Architect: {e}")
        # Fallback to empty scene
        return {
            "canvas_schema": CanvasScene(
                canvas=CanvasConfig(width=800, height=600, backgroundColor="#ffffff"),
                objects=[]
            )
        }
