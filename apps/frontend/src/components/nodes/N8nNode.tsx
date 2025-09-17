import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

// Interface moved to nodeTypes.ts for better organization

const N8nNode = memo(({ data, selected }: NodeProps) => {
  const getNodeColor = () => {
    if (data?.hasError) return '#ff6b6b';
    if (data?.isSuccess) return '#51cf66';
    if (data?.isExecuting) return '#339af0';
    return (data as any)?.color || '#868e96';
  };

  const getStatusIcon = () => {
    if (data?.hasError) return '❌';
    if (data?.isSuccess) return '✅';
    if (data?.isExecuting) return '⏳';
    return (data as any)?.icon || '⚙️';
  };

  return (
    <div className={`n8n-node ${selected ? 'selected' : ''}`}>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="n8n-handle n8n-handle-input"
        style={{
          background: '#fff',
          border: '2px solid #d1d5db',
          width: '12px',
          height: '12px',
          left: '-6px'
        }}
      />
      
      {/* Node Content */}
      <div 
        className="n8n-node-content"
        style={{
          backgroundColor: '#fff',
          border: `2px solid ${selected ? '#007acc' : '#e5e7eb'}`,
          borderRadius: '8px',
          padding: '12px 16px',
          minWidth: '200px',
          boxShadow: selected 
            ? '0 4px 12px rgba(0, 122, 204, 0.15)' 
            : '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease',
          position: 'relative'
        }}
      >
        {/* Status Indicator */}
        <div 
          className="n8n-node-status"
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '20px',
            height: '20px',
            backgroundColor: getNodeColor(),
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            border: '2px solid #fff',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          {(data as any)?.isExecuting && (
            <div className="n8n-spinner" style={{
              width: '12px',
              height: '12px',
              border: '2px solid #fff',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          )}
        </div>

        {/* Node Header */}
        <div className="n8n-node-header" style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '4px'
        }}>
          <span 
            className="n8n-node-icon"
            style={{
              fontSize: '16px',
              marginRight: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              backgroundColor: `${getNodeColor()}20`
            }}
          >
            {getStatusIcon()}
          </span>
          <div>
            <div 
              className="n8n-node-label"
              style={{
                fontWeight: '600',
                fontSize: '14px',
                color: '#374151',
                lineHeight: '1.2'
              }}
            >
              {(data as any)?.label}
            </div>
            <div 
              className="n8n-node-type"
              style={{
                fontSize: '12px',
                color: '#6b7280',
                textTransform: 'capitalize'
              }}
            >
              {(data as any)?.type}
            </div>
          </div>
        </div>

        {/* Node Description */}
        {(data as any)?.description && (
          <div 
            className="n8n-node-description"
            style={{
              fontSize: '12px',
              color: '#9ca3af',
              marginTop: '4px',
              lineHeight: '1.3'
            }}
          >
            {(data as any)?.description}
          </div>
        )}

        {/* Execution Status Text */}
        {(data as any)?.isExecuting && (
          <div style={{
            fontSize: '11px',
            color: '#339af0',
            marginTop: '4px',
            fontWeight: '500'
          }}>
            Executing...
          </div>
        )}
      </div>
      
      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="n8n-handle n8n-handle-output"
        style={{
          background: '#fff',
          border: '2px solid #d1d5db',
          width: '12px',
          height: '12px',
          right: '-6px'
        }}
      />

      {/* CSS for animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .n8n-node:hover .n8n-node-content {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }
        
        .n8n-handle:hover {
          transform: scale(1.2);
          border-color: #007acc !important;
        }
        
        .n8n-node.selected .n8n-handle {
          border-color: #007acc;
        }
      `}</style>
    </div>
  );
});

N8nNode.displayName = 'N8nNode';

export default N8nNode;
