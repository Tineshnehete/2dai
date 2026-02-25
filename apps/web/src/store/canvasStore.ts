import { create } from 'zustand';
import { FabricObject, CanvasConfig, CanvasScene } from '@repo/canvas-schema';

interface CanvasState {
  objects: FabricObject[];
  config: CanvasConfig;
  selectedElementIds: string[];
  history: {
    past: FabricObject[][];
    future: FabricObject[][];
  };

  // Actions
  setObjects: (objects: FabricObject[]) => void;
  setScene: (scene: CanvasScene) => void;
  addObject: (object: FabricObject) => void;
  updateObject: (id: string, properties: Partial<FabricObject['properties']>) => void;
  removeObject: (id: string) => void;
  setSelectedElementIds: (ids: string[]) => void;
  setConfig: (config: Partial<CanvasConfig>) => void;
  
  // History
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  objects: [],
  config: {
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
  },
  selectedElementIds: [],
  history: {
    past: [],
    future: [],
  },

  setObjects: (objects) => set({ objects }),

  setScene: (scene) => set({
    objects: scene.objects,
    config: scene.canvas
  }),

  addObject: (object) => set((state) => ({ 
    objects: [...state.objects, object] 
  })),

  updateObject: (id, properties) => set((state) => ({
    objects: state.objects.map((obj) => 
      obj.id === id ? { ...obj, properties: { ...obj.properties, ...properties } } : obj
    )
  })),

  removeObject: (id) => set((state) => ({
    objects: state.objects.filter((obj) => obj.id !== id)
  })),

  setSelectedElementIds: (ids) => set({ selectedElementIds: ids }),

  setConfig: (config) => set((state) => ({
    config: { ...state.config, ...config }
  })),

  saveHistory: () => {
    const { objects, history } = get();
    set({
      history: {
        past: [...history.past, objects.map(obj => ({ ...obj }))],
        future: [],
      }
    });
  },

  undo: () => {
    const { history, objects } = get();
    if (history.past.length === 0) return;

    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, history.past.length - 1);

    set({
      objects: previous,
      history: {
        past: newPast,
        future: [objects, ...history.future],
      }
    });
  },

  redo: () => {
    const { history, objects } = get();
    if (history.future.length === 0) return;

    const next = history.future[0];
    const newFuture = history.future.slice(1);

    set({
      objects: next,
      history: {
        past: [...history.past, objects],
        future: newFuture,
      }
    });
  }
}));
