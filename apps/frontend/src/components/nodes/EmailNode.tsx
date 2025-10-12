import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

const EmailNode = memo(({ data, selected }: NodeProps) => {
  const isTrigger = Boolean((data as any)?.isTrigger);
  
  return (
    <div className="relative group">
      {/* Email Node Container */}
      <div
        className={`relative bg-gradient-to-br from-gray-700 to-gray-800 w-28 h-24 border-2 transition-all duration-300 flex items-center justify-center ${
          isTrigger ? 'rounded-l-full rounded-r-lg' : 'rounded-lg'
        } ${
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

        {/* Output Handle */}
        <Handle
          type="source"
          position={Position.Right}
          className="absolute top-1/2 -translate-y-1/2 -right-2
                     bg-gray-600 border-2 border-gray-500 w-3 h-3 rounded-full
                     hover:scale-125 hover:border-orange-400 transition-all duration-200 hover:bg-gray-500"
        />

        {/* Email Icon - Simple and Clean */}
        <div className="flex items-center justify-center">
          <span className="text-4xl">📧</span>
        </div>
      </div>

      {/* Text Below Node */}
      <div className="mt-2 flex flex-col items-center text-center max-w-28 mx-auto">
        <div className="text-xs font-medium text-gray-200 leading-tight truncate w-full">
          {(data as any)?.label || 'Email'}
        </div>
      </div>
    </div>
  );
});

EmailNode.displayName = 'EmailNode';
export default EmailNode;
