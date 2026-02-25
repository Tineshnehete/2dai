"use client";

import { useState } from 'react';
import { useCanvasStore } from '@/store/canvasStore';

export const useGenerateDesign = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const setScene = useCanvasStore((state) => state.setScene);

  const generate = async (prompt: string) => {
    setIsGenerating(true);
    setStatus("Starting...");

    try {
      const response = await fetch('http://localhost:8000/api/v1/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr === '[DONE]') break;

            try {
              const payload = JSON.parse(dataStr);
              if (payload.type === 'status') {
                setStatus(`AI working: ${payload.node}...`);
              } else if (payload.type === 'final') {
                setScene(payload.data);
                setStatus("Design ready!");
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Generation failed:", error);
      setStatus("Error generating design");
    } finally {
      setIsGenerating(false);
    }
  };

  return { generate, isGenerating, status };
};
