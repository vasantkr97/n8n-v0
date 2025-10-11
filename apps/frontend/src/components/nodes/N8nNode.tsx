import { memo, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

// N8nNode component represents a visual node in the flow graph
const N8nNode = memo(({ data, selected }: NodeProps) => {
  const [showWebhookUrl, setShowWebhookUrl] = useState(false);
  
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
  
  const isTrigger = Boolean((data as any)?.isTrigger);
  const isWebhook = (data as any)?.type === 'webhook';
  const workflowId = (data as any)?.workflowId;
  const webhookToken = (data as any)?.webhookToken;
  
  // Generate public webhook URL with token authentication
  const webhookUrl = isWebhook && workflowId && webhookToken
    ? `http://localhost:4000/api/executions/webhook/${workflowId}?token=${webhookToken}`
    : null;

  const copyWebhookUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (webhookUrl) {
      navigator.clipboard.writeText(webhookUrl);
      alert('✅ Webhook URL with Token copied to clipboard!\n\n📡 This URL includes your secure authentication token.\n\n🔒 Keep it private! Anyone with this URL can trigger your workflow.\n\n💡 Make sure your workflow is Active (toggle in toolbar).\n\n⚠️ Don\'t share this URL publicly!');
    }
  };

  return (
    <div className="relative group">
      {/* Node Container - Half-round for triggers, square for actions */}
      <div
        className={`relative bg-gray-800 w-32 h-28 border-2 transition-all duration-300 flex items-center justify-center ${
          isTrigger ? 'rounded-l-full rounded-r-lg' : 'rounded-lg'
        } ${
          selected
            ? 'border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-105'
            : 'border-gray-600 shadow-[0_4px_12px_rgba(0,0,0,0.4)]'
        } hover:border-gray-400 hover:shadow-[0_6px_16px_rgba(0,0,0,0.6)] hover:scale-102`}
      >
        {/* Input Handle - left edge center (not for triggers) */}
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

        {/* Webhook URL Button (only for webhook nodes) */}
        {webhookUrl && (
          <button
            onClick={copyWebhookUrl}
            onMouseEnter={() => setShowWebhookUrl(true)}
            onMouseLeave={() => setShowWebhookUrl(false)}
            className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-0.5 rounded-full shadow-lg transition-all z-10"
            title="Click to copy webhook URL"
          >
            🔗 URL
          </button>
        )}

        {/* Large Icon in Center */}
        <span className="text-3xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
          {getStatusIcon()}
        </span>
      </div>

      {/* Text Below Node */}
      <div className="mt-2 flex flex-col items-center text-center max-w-32 mx-auto">
        <div className="text-xs font-medium text-gray-200 leading-tight truncate w-full">
          {(data as any)?.label}
        </div>
        
        {(data as any)?.isExecuting && (
          <div className="text-[9px] text-blue-400 mt-0.5 font-medium animate-pulse">
            Executing...
          </div>
        )}
      </div>

      {/* Webhook URL Tooltip */}
      {showWebhookUrl && webhookUrl && (
        <div className="absolute top-full mt-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-2xl z-50 w-[500px] border border-green-700">
          <div className="font-semibold mb-2 text-green-400 flex items-center">
            <span className="mr-2">🔐</span> Secure Webhook URL
          </div>
          <div className="font-mono bg-gray-800 p-2 rounded break-all text-[10px] mb-3 border border-gray-700 max-h-24 overflow-y-auto">
            {webhookUrl}
          </div>
          <div className="text-gray-300 text-[10px] space-y-1 mb-2">
            <div>✨ <strong>Click button to copy URL with token</strong></div>
            <div>🔐 <strong>Token-based authentication</strong> - secure & simple</div>
            <div>🔒 Workflow must be <strong>Active</strong></div>
            <div>⚠️ <strong>Keep this URL private!</strong> Don't share publicly</div>
          </div>
          <div className="bg-gray-800 p-2 rounded text-[10px] border border-gray-700 mb-2">
            <div className="text-gray-400 mb-1">Example - Using query parameter:</div>
            <code className="text-green-400 break-all block">curl -X POST "{webhookUrl}"</code>
          </div>
          <div className="bg-gray-800 p-2 rounded text-[10px] border border-gray-700">
            <div className="text-gray-400 mb-1">Or using header:</div>
            <code className="text-blue-400 break-all block">curl -X POST http://localhost:4000/api/executions/webhook/{workflowId} \<br/>  -H "X-Webhook-Token: {webhookToken}"</code>
          </div>
        </div>
      )}
    </div>
  );
});

N8nNode.displayName = 'N8nNode';

export default N8nNode;
