import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

// N8nNode component represents a visual node in the flow graph
const N8nNode = memo(({ data, selected }: NodeProps) => {
  // Determine node color based on its state
  const getNodeColor = () => {
    if (data?.hasError) return '#ff6b6b'; // Red for error
    if (data?.isSuccess) return '#51cf66'; // Green for success
    if (data?.isExecuting) return '#339af0'; // Blue for executing
    return (data as any)?.color || '#868e96'; // Default gray
  };

  // Determine icon to show based on state
  const getStatusIcon = () => {
    if (data?.hasError) return '❌';
    if (data?.isSuccess) return '✅';
    if (data?.isExecuting) return '⏳';
    return (data as any)?.icon || '⚙️'; // Default gear icon
  };
  console.log("Node type:", data);
  const isTrigger = Boolean((data as any)?.isTrigger);

  return (
    <div className="relative">
      {/* Square Node Container */}
      <div
        className={`relative bg-gray-800 rounded-lg w-32 h-28 border-2 transition-all duration-300 flex items-center justify-center ${
          selected 
            ? 'border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-105' 
            : 'border-gray-600 shadow-[0_4px_12px_rgba(0,0,0,0.4)]'
        } hover:border-gray-400 hover:shadow-[0_6px_16px_rgba(0,0,0,0.6)] hover:scale-102`}
      >
        {/* Input Handle - left edge center */}
        {!isTrigger && (
          <Handle
            type="target"
            position={Position.Left}
            className="absolute top-1/2 -translate-y-1/2 -left-2 
                       bg-gray-700 border-2 border-gray-500 w-3 h-3 rounded-full
                       hover:scale-125 hover:border-blue-400 transition-all duration-200 hover:bg-gray-600"
          />
        )}

        {/* Output Handle - right edge center */}
        <Handle
          type="source"
          position={Position.Right}
          className="absolute top-1/2 -translate-y-1/2 -right-2 
                     bg-gray-700 border-2 border-gray-500 w-2 h-2 
                     hover:scale-125 hover:border-blue-400 transition-all duration-200 hover:bg-gray-600"
        />

        {/* Status Indicator Circle (top-right corner) */}
        <div
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center border-2 border-gray-800 shadow-lg"
          style={{ backgroundColor: getNodeColor() }}
        >
          {(data as any)?.isExecuting && (
            <div className="w-2 h-2 border border-white border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        {/* Large Icon in Center */}
        <span className="text-3xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
          {getStatusIcon()}
        </span>
      </div>

      {/* Text Below Node */}
      <div className="mt-2 flex flex-col items-center text-center max-w-20 mx-auto">
        <div className="text-xs font-medium text-gray-200 leading-tight truncate">
          {(data as any)?.label}
        </div>
        <div className="text-[10px] text-gray-400 capitalize mt-0.5 truncate">
          {(data as any)?.type}
        </div>
        {(data as any)?.isExecuting && (
          <div className="text-[9px] text-blue-400 mt-0.5 font-medium animate-pulse">
            Executing...
          </div>
        )}
        {(data as any)?.description && !((data as any)?.isExecuting) && (
          <div className="text-[9px] text-gray-500 mt-0.5 leading-tight truncate max-w-full">
            {(data as any)?.description}
          </div>
        )}
      </div>
    </div>
  );
});

N8nNode.displayName = 'N8nNode';

export default N8nNode;
