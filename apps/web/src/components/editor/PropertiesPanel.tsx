"use client";

import React from 'react';
import { useCanvasStore } from '@/store/canvasStore';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const PropertiesPanel: React.FC = () => {
  const { selectedElementIds, objects, updateObject } = useCanvasStore();
  const selectedObject = objects.find(obj => obj.id === selectedElementIds[0]);

  const handleChange = (key: string, value: string | number) => {
    if (selectedObject) {
      updateObject(selectedObject.id, { [key]: value });
    }
  };

  if (!selectedObject) {
    return (
      <div className="w-64 p-4 border-l border-zinc-200 dark:border-zinc-800 h-full flex items-center justify-center text-zinc-500 text-sm italic">
        Select an element to edit properties
      </div>
    );
  }

  return (
    <div className="w-64 p-4 border-l border-zinc-200 dark:border-zinc-800 h-full flex flex-col gap-4 overflow-y-auto">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Layout</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="x">X</Label>
          <Input 
            id="x" 
            type="number"
            value={Math.round(selectedObject.properties.left || 0)} 
            onChange={(e) => handleChange('left', parseFloat(e.target.value))}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="y">Y</Label>
          <Input 
            id="y" 
            type="number"
            value={Math.round(selectedObject.properties.top || 0)} 
            onChange={(e) => handleChange('top', parseFloat(e.target.value))}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="w">Width</Label>
          <Input 
            id="w" 
            type="number"
            value={Math.round(selectedObject.properties.width || 0)} 
            onChange={(e) => handleChange('width', parseFloat(e.target.value))}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="h">Height</Label>
          <Input 
            id="h" 
            type="number"
            value={Math.round(selectedObject.properties.height || 0)} 
            onChange={(e) => handleChange('height', parseFloat(e.target.value))}
          />
        </div>
      </div>
      
      <Separator />
      
      <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Fill</h3>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <Input 
            type="color"
            className="w-12 h-8 p-1 bg-transparent border-none"
            value={selectedObject.properties.fill || '#000000'}
            onChange={(e) => handleChange('fill', e.target.value)}
          />
          <Input 
            value={selectedObject.properties.fill || '#000000'} 
            onChange={(e) => handleChange('fill', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
