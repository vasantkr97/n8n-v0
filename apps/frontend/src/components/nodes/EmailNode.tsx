import { memo } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';

const EmailNode = memo(({ data, selected, id }: NodeProps) => {
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

      {/* Email Node Container */}
      <div
        className={`relative bg-gray-600 w-28 h-24 border-2 transition-all duration-300 flex items-center justify-center ${
          isTrigger ? 'rounded-l-full rounded-r-lg' : 'rounded-lg'
        } ${
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

        {/* Output Handle */}
        <Handle
          type="source"
          position={Position.Right}
          className="absolute top-1/2 -translate-y-1/2 -right-2
                     bg-gray-400 border-2 border-gray-300 w-3 h-3 rounded-full
                     hover:scale-125 hover:border-orange-500 transition-all duration-200"
        />

        {/* Email Icon - Brand colored */}
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Text Below Node */}
      <div className="mt-2 flex flex-col items-center text-center max-w-28 mx-auto">
        <div className="text-xs font-medium text-gray-700 leading-tight truncate w-full">
          {(data as any)?.label || 'Email'}
        </div>
      </div>
    </div>
  );
});

EmailNode.displayName = 'EmailNode';
export default EmailNode;
