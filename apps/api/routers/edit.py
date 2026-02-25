from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter()

class EditRequest(BaseModel):
    prompt: str
    selected_element_ids: List[str]
    canvas_state: dict

@router.patch("/edit")
async def edit_design(request: EditRequest):
    # TODO: Implement Edit Agent via LangGraph delta patching
    return {"message": "Edit requested", "status": "pending_implementation"}
