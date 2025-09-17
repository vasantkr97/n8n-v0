import {
  type EdgeProps,
  getSmoothStepPath,
  EdgeLabelRenderer,
  BaseEdge,
} from '@xyflow/react';

// Interface moved to edgeTypes.ts for better organization

const N8nEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data = {},
  markerEnd,
  selected,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8,
  });

  const getEdgeColor = () => {
    if ((data as any)?.hasError) return '#ff6b6b';
    if ((data as any)?.hasExecuted) return '#51cf66';
    if ((data as any)?.isExecuting) return '#339af0';
    return selected ? '#007acc' : '#9ca3af';
  };

  const getEdgeWidth = () => {
    if ((data as any)?.isExecuting) return 3;
    if (selected) return 2.5;
    return 2;
  };

  const edgeStyle = {
    ...style,
    stroke: getEdgeColor(),
    strokeWidth: getEdgeWidth(),
    strokeDasharray: (data as any)?.isExecuting ? '5,5' : 'none',
    animation: (data as any)?.isExecuting ? 'n8n-edge-flow 1s linear infinite' : 'none',
  };

  return (
    <>
      {/* Main Edge Path */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={edgeStyle}
        interactionWidth={20}
      />
      
      {/* Edge Label */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: '11px',
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {/* Item Count Badge */}
          {(data as any)?.itemCount !== undefined && (data as any).itemCount > 0 && (
            <div
              style={{
                backgroundColor: getEdgeColor(),
                color: '#fff',
                padding: '2px 6px',
                borderRadius: '10px',
                fontSize: '10px',
                fontWeight: '600',
                minWidth: '18px',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                marginBottom: '4px'
              }}
            >
              {(data as any).itemCount}
            </div>
          )}
          
          {/* Edge Label */}
          {(data as any)?.label && (
            <div
              style={{
                backgroundColor: '#fff',
                padding: '4px 8px',
                borderRadius: '4px',
                border: `1px solid ${getEdgeColor()}`,
                fontSize: '11px',
                color: '#374151',
                fontWeight: '500',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                maxWidth: '120px',
                textAlign: 'center',
                wordBreak: 'break-word'
              }}
            >
              {(data as any).label}
            </div>
          )}
          
          {/* Execution Status */}
          {(data as any)?.isExecuting && (
            <div
              style={{
                backgroundColor: '#339af0',
                color: '#fff',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: '600',
                marginTop: '4px',
                animation: 'pulse 1.5s ease-in-out infinite alternate'
              }}
            >
              Processing...
            </div>
          )}
        </div>
      </EdgeLabelRenderer>

      {/* CSS for animations */}
      <style>{`
        @keyframes n8n-edge-flow {
          to {
            stroke-dashoffset: -10;
          }
        }
        
        @keyframes pulse {
          from {
            opacity: 1;
          }
          to {
            opacity: 0.6;
          }
        }
      `}</style>
    </>
  );
};

export default N8nEdge;
