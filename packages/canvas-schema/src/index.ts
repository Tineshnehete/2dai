export interface FabricObject {
  id: string;
  type: "text" | "textbox" | "rect" | "circle" | "triangle" | "image" | "group";
  properties: Record<string, any>;
  objects?: FabricObject[];
}

export interface CanvasConfig {
  width: number;
  height: number;
  backgroundColor: string;
}

export interface CanvasScene {
  canvas: CanvasConfig;
  objects: FabricObject[];
}
