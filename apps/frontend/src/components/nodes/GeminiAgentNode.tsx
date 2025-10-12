import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

const GeminiAgentNode = memo(({ data, selected }: NodeProps) => {
  const isTrigger = Boolean((data as any)?.isTrigger);
  
  return (
    <div className="relative group">
      {/* Gemini Agent Node Container - Rectangle shape */}
      <div
        className={`relative bg-gradient-to-br from-orange-50 to-orange-100 w-40 h-24 border-2 transition-all duration-300 flex items-center justify-center rounded-lg ${
          selected
            ? 'border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.5)] scale-105'
            : 'border-orange-300 shadow-[0_4px_12px_rgba(249,115,22,0.2)]'
        } hover:border-orange-400 hover:shadow-[0_6px_16px_rgba(249,115,22,0.3)] hover:scale-102`}
      >
        {/* Input Handle */}
        {!isTrigger && (
          <Handle
            type="target"
            position={Position.Left}
            className="absolute top-1/2 -translate-y-1/2 -left-2
                       bg-orange-100 border-2 border-orange-400 w-3 h-3 rounded-full
                       hover:scale-125 hover:border-orange-500 transition-all duration-200 hover:bg-orange-200"
          />
        )}

        {/* Main Output Handle - Right center */}
        <Handle
          type="source"
          position={Position.Right}
          id="main-output"
          className="absolute top-1/2 -translate-y-1/2 -right-2
                     bg-orange-100 border-2 border-orange-400 w-3 h-3 rounded-full
                     hover:scale-125 hover:border-orange-500 transition-all duration-200 hover:bg-orange-200"
        />

        {/* Multiple Output Handles - Bottom edge */}
        <Handle
          type="source"
          position={Position.Bottom}
          id="output-1"
          className="absolute bottom-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-orange-100 border-2 border-orange-400 rounded-full
                     hover:scale-125 hover:border-orange-500 transition-all duration-200 hover:bg-orange-200"
          style={{ left: '25%', bottom: '-6px' }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="output-2"
          className="absolute bottom-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-orange-100 border-2 border-orange-400 rounded-full
                     hover:scale-125 hover:border-orange-500 transition-all duration-200 hover:bg-orange-200"
          style={{ left: '50%', bottom: '-6px' }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="output-3"
          className="absolute bottom-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-orange-100 border-2 border-orange-400 rounded-full
                     hover:scale-125 hover:border-orange-500 transition-all duration-200 hover:bg-orange-200"
          style={{ left: '75%', bottom: '-6px' }}
        />

        {/* Gemini AI Icon */}
        <div className="flex items-center justify-center">
          <div className="relative">
            {/* AI Agent Icon - Neural Network Brain */}
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                {/* Brain/Neural Network Icon */}
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                <circle cx="8" cy="8" r="1.5"/>
                <circle cx="16" cy="8" r="1.5"/>
                <circle cx="8" cy="16" r="1.5"/>
                <circle cx="16" cy="16" r="1.5"/>
                <circle cx="12" cy="12" r="2"/>
                <path d="M8 8l4 4m0 0l4-4m-4 4v4"/>
                <path d="M12 4l2 2m-4 0l2-2"/>
                <path d="M12 20l2-2m-4 0l2 2"/>
              </svg>
            </div>
            {/* AI Indicator */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Agent Label */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          <div className="bg-orange-600 text-white text-[10px] px-2 py-0.5 rounded-full font-medium shadow-lg">
            AI AGENT
          </div>
        </div>
      </div>

      {/* Text Below Node */}
      <div className="mt-2 flex flex-col items-center text-center max-w-40 mx-auto">
        <div className="text-xs font-medium text-gray-700 leading-tight truncate w-full">
          {(data as any)?.label || 'Gemini AI'}
        </div>
      </div>
    </div>
  );
});

GeminiAgentNode.displayName = 'GeminiAgentNode';
export default GeminiAgentNode;
