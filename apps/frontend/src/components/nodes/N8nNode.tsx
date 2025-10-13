import { memo, useState } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';

// N8nNode component represents a visual node in the flow graph
const N8nNode = memo(({ data, selected, id }: NodeProps) => {
  const [showWebhookUrl, setShowWebhookUrl] = useState(false);
  const { deleteElements } = useReactFlow();
  

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

      {/* Node Container - Half-round for triggers, square for actions */}
      <div
        className={`relative bg-gray-600 w-28 h-24 border-2 transition-all duration-300 flex items-center justify-center ${
          isTrigger ? 'rounded-l-full rounded-r-lg' : 'rounded-lg'
        } ${
          (data as any)?.isExecuting || (data as any)?.isExecuted
            ? 'border-green-500'
            : (selected ? 'border-gray-500 shadow-lg scale-105' : 'border-white shadow-md')
        } ${(data as any)?.isExecuting || (data as any)?.isExecuted ? '' : 'hover:border-orange-500'} hover:shadow-lg hover:scale-102`}
      >
        {/* Input Handle - left edge center (not for triggers) */}
        {!isTrigger && (
          <Handle
            type="target"
            position={Position.Left}
            className="absolute top-1/2 -translate-y-1/2 -left-2
                       bg-gray-400 border-2 border-gray-300 w-3 h-3 rounded-full
                       hover:scale-125 hover:border-orange-500 transition-all duration-200"
          />
        )}

        {/* Output Handle - right edge center */}
        <Handle
          type="source"
          position={Position.Right}
          className="absolute top-1/2 -translate-y-1/2 -right-2
                     bg-gray-400 border-2 border-gray-300 w-3 h-3 rounded-full
                     hover:scale-125 hover:border-orange-500 transition-all duration-200"
        />


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

        {/* Large Icon in Center - Brand colored */}
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
          <span className="text-2xl" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}>
            {getStatusIcon()}
          </span>
        </div>
      </div>

      {/* Quick Config Popover */}
      {/* Inline popover removed - centralized overlay used */}

      {/* Text Below Node */}
      <div className="mt-2 flex flex-col items-center text-center max-w-28 mx-auto">
        <div className="text-xs font-medium text-gray-700 leading-tight truncate w-full">
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
