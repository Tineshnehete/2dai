"use client";

import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useGenerateDesign } from '@/hooks/useGenerateDesign';

export const AIChat: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const { generate, isGenerating, status } = useGenerateDesign();

  const handleSend = () => {
    if (!prompt || isGenerating) return;
    generate(prompt);
    setPrompt("");
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 w-80">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-purple-500" />
        <h2 className="font-semibold text-sm">AI Design Assistant</h2>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="flex-col flex gap-4">
          <div className="bg-zinc-100 dark:bg-zinc-900 p-3 rounded-lg text-sm">
            Hello! I can help you generate or edit your design. Try saying "Create a modern social media post for a tech brand".
          </div>
          {status && (
            <div className="bg-purple-50 dark:bg-purple-950/30 p-3 border border-purple-100 dark:border-purple-900/50 rounded-lg text-sm text-purple-700 dark:text-purple-300">
              <Sparkles className="h-3 w-3 inline mr-2 animate-pulse" />
              {status}
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-top border-zinc-200 dark:border-zinc-800 flex flex-col gap-2">
        <Textarea 
          placeholder="Describe your design..." 
          className="resize-none min-h-[100px]"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isGenerating}
        />
        <Button onClick={handleSend} disabled={isGenerating || !prompt} className="w-full gap-2">
          {isGenerating ? "Generating..." : "Generate"}
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
