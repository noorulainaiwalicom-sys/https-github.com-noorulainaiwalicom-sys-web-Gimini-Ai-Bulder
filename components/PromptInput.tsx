import React, { useState, KeyboardEvent } from 'react';

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onGenerate(input);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full bg-slate-900 border-t border-slate-800 p-4 sticky bottom-0 z-20">
      <div className="max-w-4xl mx-auto relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your website... (e.g., 'A modern landing page for a coffee shop with a hero section and menu grid')"
          className="w-full bg-slate-800 text-white rounded-xl pl-4 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none shadow-lg h-16 max-h-48 overflow-y-auto"
          disabled={isLoading}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          className={`absolute right-3 top-3 p-2 rounded-lg transition-colors ${
            isLoading || !input.trim()
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md'
          }`}
        >
          {isLoading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <i className="fas fa-paper-plane"></i>
          )}
        </button>
      </div>
      <div className="text-center mt-2 text-xs text-slate-500">
        Powered by Gemini 3 Pro • Press Enter to send • Shift+Enter for new line
      </div>
    </div>
  );
};