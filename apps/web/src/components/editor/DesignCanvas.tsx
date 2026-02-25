"use client";

import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { useCanvasStore } from '@/store/canvasStore';
import { FabricObject } from '@repo/canvas-schema';

export const DesignCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const { 
    objects, 
    config, 
    addObject, 
    updateObject, 
    removeObject,
    setSelectedElementIds,
    saveHistory 
  } = useCanvasStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize fabric canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: config.width,
      height: config.height,
      backgroundColor: config.backgroundColor,
    });

    fabricCanvasRef.current = canvas;

    // Event listeners
    canvas.on('object:modified', (e) => {
      const target = e.target;
      if (target && (target as any).id) {
        updateObject((target as any).id, {
          left: target.left,
          top: target.top,
          width: target.width * target.scaleX!,
          height: target.height * target.scaleY!,
          angle: target.angle,
          fill: target.fill as string,
        });
        saveHistory();
      }
    });

    canvas.on('selection:created', (e) => {
      const selected = e.selected || [];
      setSelectedElementIds(selected.map((obj: any) => obj.id));
    });

    canvas.on('selection:updated', (e) => {
      const selected = e.selected || [];
      setSelectedElementIds(selected.map((obj: any) => obj.id));
    });

    canvas.on('selection:cleared', () => {
      setSelectedElementIds([]);
    });

    return () => {
      canvas.dispose();
    };
  }, []);

  // Sync objects from store to fabric
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;

    // Remove objects that are no longer in the store
    const currentFabricObjects = canvas.getObjects();
    currentFabricObjects.forEach((obj: any) => {
      if (obj.id && !objects.find(o => o.id === obj.id)) {
        canvas.remove(obj);
      }
    });

    // Add or update objects
    objects.forEach((obj) => {
      const existing = currentFabricObjects.find((fo: any) => fo.id === obj.id);

      if (existing) {
        // Update existing object
        existing.set({
          left: obj.properties.left,
          top: obj.properties.top,
          fill: obj.properties.fill,
          angle: obj.properties.angle,
          opacity: obj.properties.opacity,
        });
        
        if (obj.type === 'text' || obj.type === 'textbox') {
          (existing as fabric.IText).set({ text: obj.properties.text });
        }
        
        existing.setCoords();
      } else {
        // Create new object
        let newObj: fabric.Object | null = null;

        if (obj.type === 'rect') {
          newObj = new fabric.Rect({
            ...obj.properties,
            width: obj.properties.width || 100,
            height: obj.properties.height || 100,
          });
        } else if (obj.type === 'circle') {
          newObj = new fabric.Circle({
            ...obj.properties,
            radius: obj.properties.radius || 50,
          });
        } else if (obj.type === 'text' || obj.type === 'textbox') {
          newObj = new fabric.Textbox(obj.properties.text || "Text", {
            ...obj.properties,
          });
        }

        if (newObj) {
          (newObj as any).id = obj.id;
          canvas.add(newObj);
        }
      }
    });

    canvas.renderAll();
  }, [objects]);

  return (
    <div className="relative flex items-center justify-center bg-zinc-200 dark:bg-zinc-900 overflow-auto p-8 h-full w-full">
      <div className="shadow-2xl border border-zinc-300 dark:border-zinc-800 bg-white">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};
