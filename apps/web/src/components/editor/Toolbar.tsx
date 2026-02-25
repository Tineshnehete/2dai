"use client";

import React from 'react';
import { Square, Circle, Triangle, Type, Image as ImageIcon, MousePointer2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCanvasStore } from '@/store/canvasStore';
import { v4 as uuidv4 } from 'uuid';

const tools = [
  { id: 'select', icon: MousePointer2, label: 'Select' },
  { id: 'rect', icon: Square, label: 'Rectangle' },
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'text', icon: Type, label: 'Text' },
];

export const Toolbar: React.FC = () => {
  const addObject = useCanvasStore((state) => state.addObject);

  const handleToolClick = (id: string) => {
    const commonProps = {
      left: 100,
      top: 100,
      fill: "#3b82f6",
      opacity: 1,
      angle: 0,
    };

    if (id === 'rect') {
      addObject({
        id: uuidv4(),
        type: 'rect',
        properties: { ...commonProps, width: 100, height: 100 }
      });
    } else if (id === 'circle') {
      addObject({
        id: uuidv4(),
        type: 'circle',
        properties: { ...commonProps, radius: 50, width: 100, height: 100 }
      });
    } else if (id === 'text') {
      addObject({
        id: uuidv4(),
        type: 'text',
        properties: { 
          ...commonProps, 
          text: "Double click to edit", 
          fontSize: 24, 
          fontFamily: "Inter",
          fill: "#000000"
        }
      });
    }
  };
  return (
    <div className="flex flex-col gap-2 p-2 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 h-full w-16 items-center">
      <TooltipProvider>
        {tools.map((tool) => (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => handleToolClick(tool.id)}
              >
                <tool.icon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{tool.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};
