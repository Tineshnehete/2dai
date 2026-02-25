from typing import TypedDict, List, Optional
from langchain_core.messages import BaseMessage
from schemas.canvas_schema import CanvasScene

class DesignState(TypedDict):
    messages: List[BaseMessage]
    canvas_schema: CanvasScene
    selected_element_ids: List[str]
    intent: str
    iteration: int
    user_feedback: Optional[str]
