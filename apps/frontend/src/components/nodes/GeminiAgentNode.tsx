import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

const GeminiAgentNode = memo(({ data, selected }: NodeProps) => {
  const isTrigger = Boolean((data as any)?.isTrigger);
  
  return (
    <div className="relative group">
      {/* Gemini Agent Node Container - Rectangle shape */}
      <div
        className={`relative bg-gradient-to-br from-gray-700 to-gray-800 w-40 h-24 border-2 transition-all duration-300 flex items-center justify-center rounded-lg ${
          selected
            ? 'border-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.6)] scale-105'
            : 'border-gray-600 shadow-[0_4px_12px_rgba(0,0,0,0.4)]'
        } hover:border-gray-500 hover:shadow-[0_6px_16px_rgba(0,0,0,0.5)] hover:scale-102`}
      >
        {/* Input Handle */}
        {!isTrigger && (
          <Handle
            type="target"
            position={Position.Left}
            className="absolute top-1/2 -translate-y-1/2 -left-2
                       bg-gray-600 border-2 border-gray-500 w-3 h-3 rounded-full
                       hover:scale-125 hover:border-orange-400 transition-all duration-200 hover:bg-gray-500"
          />
        )}

        {/* Main Output Handle - Right center */}
        <Handle
          type="source"
          position={Position.Right}
          id="main-output"
          className="absolute top-1/2 -translate-y-1/2 -right-2
                     bg-gray-600 border-2 border-gray-500 w-3 h-3 rounded-full
                     hover:scale-125 hover:border-orange-400 transition-all duration-200 hover:bg-gray-500"
        />

        {/* Multiple Output Handles - Bottom edge */}
        <Handle
          type="source"
          position={Position.Bottom}
          id="output-1"
          className="absolute bottom-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-600 border-2 border-gray-500 rounded-full
                     hover:scale-125 hover:border-orange-400 transition-all duration-200 hover:bg-gray-500"
          style={{ left: '25%', bottom: '-6px' }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="output-2"
          className="absolute bottom-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-600 border-2 border-gray-500 rounded-full
                     hover:scale-125 hover:border-orange-400 transition-all duration-200 hover:bg-gray-500"
          style={{ left: '50%', bottom: '-6px' }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="output-3"
          className="absolute bottom-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-600 border-2 border-gray-500 rounded-full
                     hover:scale-125 hover:border-orange-400 transition-all duration-200 hover:bg-gray-500"
          style={{ left: '75%', bottom: '-6px' }}
        />

        {/* Gemini AI Icon - Simple and Clean */}
        <div className="flex items-center justify-center">
          <span className="text-4xl">✨</span>
        </div>

        {/* Agent Label */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          <div className="bg-gray-600 text-gray-200 text-[10px] px-2 py-0.5 rounded-full font-medium shadow-lg">
            AI AGENT
          </div>
        </div>
      </div>

      {/* Text Below Node */}
      <div className="mt-2 flex flex-col items-center text-center max-w-40 mx-auto">
        <div className="text-xs font-medium text-gray-200 leading-tight truncate w-full">
          {(data as any)?.label || 'Gemini AI'}
        </div>
      </div>
    </div>
  );
});

GeminiAgentNode.displayName = 'GeminiAgentNode';
export default GeminiAgentNode;
