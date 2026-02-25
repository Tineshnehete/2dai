"use client";

import { DesignCanvas } from "@/components/editor/DesignCanvas";
import { Toolbar } from "@/components/editor/Toolbar";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { AIChat } from "@/components/editor/AIChat";

export default function Home() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-black text-zinc-900 dark:text-zinc-50">
      {/* Left Toolbar */}
      <Toolbar />
      
      {/* Main Canvas Area */}
      <main className="flex-1 flex flex-col relative bg-zinc-100 dark:bg-zinc-900">
        <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-6 justify-between bg-white dark:bg-black">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tighter text-xl">2DAI</span>
            <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-500">Beta</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
              Save Draft
            </button>
            <button className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black px-4 py-1.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
              Export
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-hidden">
          <DesignCanvas />
        </div>
      </main>
      
      {/* Right Panels */}
      <div className="flex flex-row">
        <PropertiesPanel />
        <AIChat />
      </div>
    </div>
  );
}
