import React, { useEffect, useRef } from 'react';
import { DeviceFrame } from '../types';

interface PreviewWindowProps {
  code: string;
  deviceFrame: DeviceFrame;
  isLoading: boolean;
}

export const PreviewWindow: React.FC<PreviewWindowProps> = ({ code, deviceFrame, isLoading }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      // Direct document write to support scripts and styles immediately
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(code);
        doc.close();
      }
    }
  }, [code]);

  return (
    <div className="flex-1 bg-slate-900/50 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-white">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-light animate-pulse">Designing your website...</p>
        </div>
      )}

      {!code && !isLoading ? (
        <div className="text-slate-500 flex flex-col items-center text-center max-w-md p-8 border-2 border-dashed border-slate-700 rounded-xl">
          <i className="fas fa-magic text-4xl mb-4 text-slate-600"></i>
          <h3 className="text-xl font-semibold mb-2">Ready to Create</h3>
          <p>Describe what you want to build in the chat below to get started.</p>
        </div>
      ) : (
        <div 
          className={`transition-all duration-500 ease-in-out bg-white shadow-2xl overflow-hidden ${
            deviceFrame === DeviceFrame.DESKTOP ? 'w-full h-full rounded-lg' : 
            deviceFrame === DeviceFrame.TABLET ? 'w-[768px] h-[90%] rounded-xl border-[12px] border-slate-800' : 
            'w-[375px] h-[80%] rounded-3xl border-[12px] border-slate-800'
          }`}
        >
          <iframe
            ref={iframeRef}
            title="Website Preview"
            className="w-full h-full bg-white"
            sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin" 
          />
        </div>
      )}
    </div>
  );
};