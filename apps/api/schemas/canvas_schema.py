from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, Field

class FabricObject(BaseModel):
    id: str
    type: Literal["text", "textbox", "rect", "circle", "triangle", "image", "group"]
    properties: Dict[str, Any]
    objects: Optional[List["FabricObject"]] = None

class CanvasConfig(BaseModel):
    width: float = 800
    height: float = 600
    backgroundColor: str = "#ffffff"

class CanvasScene(BaseModel):
    canvas: CanvasConfig = Field(default_factory=CanvasConfig)
    objects: List[FabricObject] = Field(default_factory=list)

# Helps correctly serialize recursive models
FabricObject.model_rebuild()
