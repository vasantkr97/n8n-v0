import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

// AgentNode component represents a visual agent node in the flow graph with multiple connection points
const AgentNode = memo(({ data, selected }: NodeProps) => {
  // Determine node color based on its state
  // const getNodeColor = () => {
  //   if (data?.hasError) return '#ff6b6b'; // Red for error
  //   if (data?.isSuccess) return '#51cf66'; // Green for success
  //   if (data?.isExecuting) return '#339af0'; // Blue for executing
  //   return (data as any)?.color || '#6f42c1'; // Purple for agent nodes
  // };


  const isTrigger = Boolean((data as any)?.isTrigger);
  const nodeType = (data as any)?.type || 'unknown';

  // Debug logging
  console.log('AgentNode rendered for:', nodeType, data);

  return (
    <div className="relative">
      {/* Agent Node Container - Larger for multiple handles */}
      <div
        className={`relative rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${
          selected 
            ? 'border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-105' 
            : 'border-gray-600 shadow-[0_4px_12px_rgba(0,0,0,0.4)]'
        } hover:border-gray-400 hover:shadow-[0_6px_16px_rgba(0,0,0,0.6)] hover:scale-102`}
        style={{
          background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
          width: '144px',
          height: '160px' // Increased height to accommodate bottom handles
        }}
      >
        {/* Single Input Handle - left edge center */}
        {!isTrigger && (
          <Handle
            type="target"
            position={Position.Left}
            id="input"
            className="absolute top-1/2 -translate-y-1/2 -left-3 w-4 h-4 bg-purple-600 border-2 border-purple-400 rounded-full
                       hover:scale-125 hover:border-blue-400 transition-all duration-200 hover:bg-purple-500
                       shadow-lg"
          />
        )}

        {/* Single Output Handle - right edge center */}
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          className="absolute top-1/2 -translate-y-1/2 -right-3 w-4 h-4 bg-blue-600 border-2 border-blue-400 rounded-full
                     hover:scale-125 hover:border-blue-300 transition-all duration-200 hover:bg-blue-500
                     shadow-lg"
        />

        {/* Three Output Handles - bottom edge (left, center, right) */}
        <Handle
          type="source"
          position={Position.Bottom}
          id="output-1"
          className="absolute bottom-0 -translate-x-1/2 -translate-y-1/2 left-1/4 w-4 h-4 bg-blue-600 border-2 border-blue-400 rounded-full
                     hover:scale-125 hover:border-blue-300 transition-all duration-200 hover:bg-blue-500
                     shadow-lg"
          style={{ left: '25%', bottom: '-12px' }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="output-2"
          className="absolute bottom-0 -translate-x-1/2 -translate-y-1/2 left-1/2 w-4 h-4 bg-blue-600 border-2 border-blue-400 rounded-full
                     hover:scale-125 hover:border-blue-300 transition-all duration-200 hover:bg-blue-500
                     shadow-lg"
          style={{ left: '50%', bottom: '-12px' }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="output-3"
          className="absolute bottom-0 -translate-x-1/2 -translate-y-1/2 left-3/4 w-4 h-4 bg-blue-600 border-2 border-blue-400 rounded-full
                     hover:scale-125 hover:border-blue-300 transition-all duration-200 hover:bg-blue-500
                     shadow-lg"
          style={{ left: '75%', bottom: '-12px' }}
        />

        {/* Agent Node Label */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          <div className="bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full font-medium shadow-lg">
            AGENT
          </div>
        </div>

        {/* Status Indicator Circle (top-right corner) */}
        <div
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center border-2 border-gray-800 shadow-lg"
          // style={{ backgroundColor: getNodeColor() }}
        >
          {(data as any)?.isExecuting && (
            <div className="w-2 h-2 border border-white border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        {/* AI Agent Icon in Center */}
        <div className="flex flex-col items-center justify-center">
          {/* Robot/AI Head */}
          <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            {/* Robot Face */}
            <div className="relative">
              {/* Eyes */}
              <div className="flex space-x-2 mb-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
              {/* Mouth */}
              <div className="w-4 h-1 bg-white rounded-full mx-auto"></div>
              {/* Antenna */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                <div className="w-0.5 h-3 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-green-400 rounded-full -mt-1 -ml-0.5 animate-ping"></div>
              </div>
            </div>
          </div>
          {/* AI Brain/Neural Network pattern */}
          <div className="absolute inset-2 rounded-full border border-purple-300 opacity-30">
            <div className="absolute top-2 left-2 w-1 h-1 bg-purple-300 rounded-full"></div>
            <div className="absolute top-3 right-3 w-1 h-1 bg-purple-300 rounded-full"></div>
            <div className="absolute bottom-3 left-3 w-1 h-1 bg-purple-300 rounded-full"></div>
            <div className="absolute bottom-2 right-2 w-1 h-1 bg-purple-300 rounded-full"></div>
            <div className="absolute top-1/2 left-1 w-1 h-1 bg-purple-300 rounded-full"></div>
            <div className="absolute top-1/2 right-1 w-1 h-1 bg-purple-300 rounded-full"></div>
          </div>
          {/* Status overlay for executing/error states */}
          {(data as any)?.isExecuting && (
            <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {(data as any)?.hasError && (
            <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-red-300 text-lg">❌</span>
            </div>
          )}
        </div>
      </div>

      {/* Text Below Node */}
      <div className="mt-2 flex flex-col items-center text-center max-w-24 mx-auto">
        <div className="text-xs font-medium text-gray-200 leading-tight truncate">
          {(data as any)?.label}
        </div>
        
        {(data as any)?.isExecuting && (
          <div className="text-[9px] text-blue-400 mt-0.5 font-medium animate-pulse">
            Executing...
          </div>
        )}
      </div>
    </div>
  );
});

AgentNode.displayName = 'AgentNode';

export default AgentNode;
