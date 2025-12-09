import React, { useState, useEffect } from 'react';
import { generateWebsiteCode } from './services/gemini';
import { PromptInput } from './components/PromptInput';
import { PreviewWindow } from './components/PreviewWindow';
import { CodeEditor } from './components/CodeEditor';
import { ViewMode, DeviceFrame } from './types';

const App: React.FC = () => {
  // State
  const [prompt, setPrompt] = useState<string>('');
  const [currentCode, setCurrentCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SPLIT);
  const [deviceFrame, setDeviceFrame] = useState<DeviceFrame>(DeviceFrame.DESKTOP);
  const [error, setError] = useState<string | null>(null);

  // Handlers
  const handleGenerate = async (userPrompt: string) => {
    setIsLoading(true);
    setError(null);
    setPrompt(userPrompt);

    try {
      // If we have existing code, we pass it for refinement
      const generatedCode = await generateWebsiteCode(userPrompt, currentCode || undefined);
      setCurrentCode(generatedCode);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while generating the website. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!currentCode) return;
    const blob = new Blob([currentCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'webgenie-website.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100 font-sans overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <i className="fas fa-magic text-white text-sm"></i>
          </div>
          <h1 className="font-bold text-lg tracking-tight">WebGenie <span className="text-slate-500 font-normal text-sm ml-1">AI Builder</span></h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Device Toggles (Only visible in Preview/Split modes) */}
          {(viewMode === ViewMode.PREVIEW || viewMode === ViewMode.SPLIT) && (
            <div className="bg-slate-800 p-1 rounded-lg flex gap-1 hidden md:flex">
              <button
                onClick={() => setDeviceFrame(DeviceFrame.DESKTOP)}
                className={`p-1.5 px-3 rounded text-xs transition-all ${deviceFrame === DeviceFrame.DESKTOP ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                title="Desktop"
              >
                <i className="fas fa-desktop"></i>
              </button>
              <button
                onClick={() => setDeviceFrame(DeviceFrame.TABLET)}
                className={`p-1.5 px-3 rounded text-xs transition-all ${deviceFrame === DeviceFrame.TABLET ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                title="Tablet"
              >
                <i className="fas fa-tablet-alt"></i>
              </button>
              <button
                onClick={() => setDeviceFrame(DeviceFrame.MOBILE)}
                className={`p-1.5 px-3 rounded text-xs transition-all ${deviceFrame === DeviceFrame.MOBILE ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                title="Mobile"
              >
                <i className="fas fa-mobile-alt"></i>
              </button>
            </div>
          )}

          <div className="h-6 w-px bg-slate-800 mx-2 hidden md:block"></div>

          {/* View Mode Toggles */}
          <div className="bg-slate-800 p-1 rounded-lg flex gap-1">
            <button
              onClick={() => setViewMode(ViewMode.PREVIEW)}
              className={`p-1.5 px-3 rounded text-xs font-medium transition-all ${viewMode === ViewMode.PREVIEW ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Preview
            </button>
            <button
              onClick={() => setViewMode(ViewMode.SPLIT)}
              className={`p-1.5 px-3 rounded text-xs font-medium transition-all hidden md:block ${viewMode === ViewMode.SPLIT ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Split
            </button>
            <button
              onClick={() => setViewMode(ViewMode.CODE)}
              className={`p-1.5 px-3 rounded text-xs font-medium transition-all ${viewMode === ViewMode.CODE ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Code
            </button>
          </div>

          <button 
             onClick={handleDownload}
             disabled={!currentCode}
             className="hidden md:flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700"
          >
            <i className="fas fa-download"></i> Export
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Error Toast */}
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-xl backdrop-blur-md animate-fade-in flex items-center gap-3">
            <i className="fas fa-exclamation-circle"></i>
            {error}
            <button onClick={() => setError(null)} className="ml-2 hover:text-white/80"><i className="fas fa-times"></i></button>
          </div>
        )}

        {/* Content Area */}
        <div className="w-full h-full flex">
          
          {/* Preview Pane */}
          {(viewMode === ViewMode.PREVIEW || viewMode === ViewMode.SPLIT) && (
            <div className={`h-full flex flex-col ${viewMode === ViewMode.SPLIT ? 'w-1/2 border-r border-slate-800' : 'w-full'}`}>
              <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between items-center">
                <span>Live Preview</span>
                {isLoading && <span className="text-blue-400 animate-pulse">Updating...</span>}
              </div>
              <PreviewWindow 
                code={currentCode} 
                deviceFrame={deviceFrame} 
                isLoading={isLoading} 
              />
            </div>
          )}

          {/* Code Pane */}
          {(viewMode === ViewMode.CODE || viewMode === ViewMode.SPLIT) && (
             <div className={`h-full flex flex-col ${viewMode === ViewMode.SPLIT ? 'w-1/2' : 'w-full'}`}>
               <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between items-center">
                 <span>Generated HTML</span>
                 <span className="text-slate-600">index.html</span>
               </div>
               <CodeEditor code={currentCode} />
             </div>
          )}
        </div>
      </main>

      {/* Prompt Input Area */}
      <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />
    </div>
  );
};

export default App;