from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, AsyncGenerator
import json
import asyncio
from langchain_core.messages import HumanMessage
from graphs.design_graph import design_graph
from agents.state import DesignState

from schemas.canvas_schema import CanvasScene, CanvasConfig

router = APIRouter()

class GenerateRequest(BaseModel):
    prompt: str
    canvas_state: Optional[dict] = None

@router.post("/generate")
async def generate_design(request: GenerateRequest):
    """
    Streams the LangGraph execution events as SSE.
    """
    
    async def event_generator() -> AsyncGenerator[str, None]:
        initial_state: DesignState = {
            "messages": [HumanMessage(content=request.prompt)],
            "canvas_schema": CanvasScene(
                canvas=CanvasConfig(width=800, height=600, backgroundColor="#ffffff"),
                objects=[]
            ),
            "selected_element_ids": [],
            "intent": "generate",
            "iteration": 0,
            "user_feedback": None
        }

        # Use astream_events to get granular updates
        async for event in design_graph.astream_events(initial_state, version="v1"):
            kind = event["event"]
            
            # Send node updates to the frontend
            if kind == "on_chain_end":
                # Check if it's the final output of the graph
                # In LangGraph, the main graph name depends on how it's compiled or invoked
                # Typically we want the final state from the last state-producing event
                if "canvas_schema" in event["data"].get("output", {}):
                    final_state = event["data"]["output"]
                    schema = final_state["canvas_schema"]
                    
                    # Convert Pydantic model to dict if necessary
                    if hasattr(schema, "model_dump"):
                        schema_dict = schema.model_dump()
                    elif hasattr(schema, "dict"):
                        schema_dict = schema.dict()
                    else:
                        schema_dict = schema
                        
                    yield f"data: {json.dumps({'type': 'final', 'data': schema_dict})}\n\n"
            
            elif kind == "on_chain_start" and "node" in event["metadata"]:
                node_name = event["metadata"]["node"]
                yield f"data: {json.dumps({'type': 'status', 'node': node_name})}\n\n"

        yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
