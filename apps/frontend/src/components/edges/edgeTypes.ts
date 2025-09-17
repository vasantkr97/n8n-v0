import N8nEdge from './N8nEdge';

// Define all custom edge types for n8n-style workflow
export const edgeTypes = {
  'n8n-edge': N8nEdge,
  'default': N8nEdge,
  'smoothstep': N8nEdge,
  'straight': N8nEdge,
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
    strokeWidth: 2,
  },
  markerEnd: {
    type: 'arrowclosed' as const,
    width: 20,
    height: 20,
    color: data?.hasError ? '#ff6b6b' : 
          data?.hasExecuted ? '#51cf66' : 
          data?.isExecuting ? '#339af0' : '#9ca3af',
  },
});
