import React from 'react';

interface CodeEditorProps {
  code: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="flex-1 bg-slate-950 relative flex flex-col h-full overflow-hidden">
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={handleCopy}
          className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-2 border border-slate-700"
        >
          <i className="fas fa-copy"></i> Copy HTML
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap break-all">
          {code || "// Your generated code will appear here..."}
        </pre>
      </div>
    </div>
  );
};