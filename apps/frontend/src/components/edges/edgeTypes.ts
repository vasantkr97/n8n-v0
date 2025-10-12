import N8nEdge from './N8nEdge';

// Define all custom edge types for n8n-style workflow
export const edgeTypes = {
  'n8n-edge': N8nEdge,
  'default': N8nEdge,
  'smoothstep': N8nEdge,
  'straight': N8nEdge,
  'smooth': N8nEdge,
  'step': N8nEdge,
};

// Helper function to create n8n-style edge data
export const createN8nEdge = (
  id: string,
  source: string,
  target: string,
  data?: {
    label?: string;
    isExecuting?: boolean;
    hasExecuted?: boolean;
    hasError?: boolean;
    itemCount?: number;
  }
) => ({
  id,
  source,
  target,
  type: 'n8n-edge',
  animated: data?.isExecuting || false,
  data: data || {},
  style: {
    strokeWidth: 2.5,
    strokeOpacity: 0.8,
  },
  markerEnd: {
    type: 'arrowclosed' as const,
    width: 16,
    height: 16,
    color: data?.hasError ? '#ef4444' : 
          data?.hasExecuted ? '#10b981' : 
          data?.isExecuting ? '#3b82f6' : '#64748b',
  },
});
