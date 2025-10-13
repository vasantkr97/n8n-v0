import { memo } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';

const GeminiAgentNode = memo(({ data, selected, id }: NodeProps) => {
  const isTrigger = Boolean((data as any)?.isTrigger);
  const { deleteElements } = useReactFlow();
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };
  
  return (
    <div className="relative group">
      {/* Delete Button - Shows on hover, positioned above node */}
      <button
        onClick={handleDelete}
        className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
        title="Delete node"
      >
        <svg className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      {/* Gemini Agent Node Container - Rectangle shape */}
      <div
        className={`relative bg-gray-600 w-40 h-24 border-2 transition-all duration-300 flex items-center justify-center rounded-lg ${
          selected
            ? 'border-gray-500 shadow-lg scale-105'
            : 'border-white shadow-md'
        } hover:border-orange-500 hover:shadow-lg hover:scale-102`}
      >
        {/* Input Handle */}
        {!isTrigger && (
          <Handle
            type="target"
            position={Position.Left}
            className="absolute top-1/2 -translate-y-1/2 -left-2
                       bg-gray-400 border-2 border-gray-300 w-3 h-3 rounded-full
                       hover:scale-125 hover:border-orange-500 transition-all duration-200"
          />
        )}

        {/* Main Output Handle - Right center */}
        <Handle
          type="source"
          position={Position.Right}
          id="main-output"
          className="absolute top-1/2 -translate-y-1/2 -right-2
                     bg-gray-400 border-2 border-gray-300 w-3 h-3 rounded-full
                     hover:scale-125 hover:border-orange-500 transition-all duration-200"
        />

        {/* Multiple Output Handles - Bottom edge */}
        <Handle
          type="source"
          position={Position.Bottom}
          id="output-1"
          className="absolute bottom-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-400 border-2 border-gray-300 rounded-full
                     hover:scale-125 hover:border-orange-500 transition-all duration-200"
          style={{ left: '25%', bottom: '-6px' }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="output-2"
          className="absolute bottom-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-400 border-2 border-gray-300 rounded-full
                     hover:scale-125 hover:border-orange-500 transition-all duration-200"
          style={{ left: '50%', bottom: '-6px' }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="output-3"
          className="absolute bottom-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-400 border-2 border-gray-300 rounded-full
                     hover:scale-125 hover:border-orange-500 transition-all duration-200"
          style={{ left: '75%', bottom: '-6px' }}
        />

        {/* AI Agent Icon - Professional single color */}
        <div className="flex items-center justify-center">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
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
