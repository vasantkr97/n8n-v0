import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

const TelegramNode = memo(({ data, selected }: NodeProps) => {
  const isTrigger = Boolean((data as any)?.isTrigger);
  
  return (
    <div className="relative group">
      {/* Telegram Node Container */}
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

        {/* Telegram Icon */}
        <div className="flex items-center justify-center">
          <svg className="w-12 h-12 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        </div>
      </div>

      {/* Text Below Node */}
      <div className="mt-2 flex flex-col items-center text-center max-w-28 mx-auto">
        <div className="text-xs font-medium text-gray-200 leading-tight truncate w-full">
          {(data as any)?.label || 'Telegram'}
        </div>
      </div>
    </div>
  );
});

TelegramNode.displayName = 'TelegramNode';
export default TelegramNode;
