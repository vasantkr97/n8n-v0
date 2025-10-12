import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

const EmailNode = memo(({ data, selected }: NodeProps) => {
  const isTrigger = Boolean((data as any)?.isTrigger);
  
  return (
    <div className="relative group">
      {/* Email Node Container */}
      <div
        className={`relative bg-gradient-to-br from-green-50 to-green-100 w-28 h-24 border-2 transition-all duration-300 flex items-center justify-center ${
          isTrigger ? 'rounded-l-full rounded-r-lg' : 'rounded-lg'
        } ${
          selected
            ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)] scale-105'
            : 'border-green-300 shadow-[0_4px_12px_rgba(34,197,94,0.2)]'
        } hover:border-green-400 hover:shadow-[0_6px_16px_rgba(34,197,94,0.3)] hover:scale-102`}
      >
        {/* Input Handle */}
        {!isTrigger && (
          <Handle
            type="target"
            position={Position.Left}
            className="absolute top-1/2 -translate-y-1/2 -left-2
                       bg-green-100 border-2 border-green-400 w-3 h-3 rounded-full
                       hover:scale-125 hover:border-green-500 transition-all duration-200 hover:bg-green-200"
          />
        )}

        {/* Output Handle */}
        <Handle
          type="source"
          position={Position.Right}
          className="absolute top-1/2 -translate-y-1/2 -right-2
                     bg-green-100 border-2 border-green-400 w-3 h-3 rounded-full
                     hover:scale-125 hover:border-green-500 transition-all duration-200 hover:bg-green-200"
        />

        {/* Email Icon */}
        <div className="flex items-center justify-center">
          <svg className="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
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
