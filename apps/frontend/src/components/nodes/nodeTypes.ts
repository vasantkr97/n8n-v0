import N8nNode from './N8nNode';

// Define all custom node types for n8n-style workflow
export const nodeTypes = {
  'n8n-node': N8nNode,
  // You can add more specific node types here
  'trigger': N8nNode,
  'action': N8nNode,
  'webhook': N8nNode,
  'http': N8nNode,
  'email': N8nNode,
  'manual': N8nNode,
  'cron': N8nNode,
  'gmail': N8nNode,
  'slack': N8nNode,
  'function': N8nNode,
  'condition': N8nNode,
  'merge': N8nNode,
  'switch': N8nNode,
};

// Helper function to create n8n-style node data
export const createN8nNode = (
  id: string,
  type: string,
  position: { x: number; y: number },
  data: {
    label: string;
    description?: string;
    icon?: string;
    color?: string;
    isExecuting?: boolean;
    hasError?: boolean;
    isSuccess?: boolean;
  }
) => ({
  id,
  type: 'n8n-node',
  position,
  data: {
    ...data,
    type, // Store the actual node type in data
  },
});

// Predefined node configurations for common n8n node types
export const nodeConfigs = {
  manual: {
    icon: '▶️',
    color: '#007acc',
    label: 'Manual Trigger',
    description: 'Manually trigger workflow'
  },
  webhook: {
    icon: '🔗',
    color: '#28a745',
    label: 'Webhook',
    description: 'Listen for HTTP requests'
  },
  http: {
    icon: '🌐',
    color: '#6f42c1',
    label: 'HTTP Request',
    description: 'Make HTTP requests'
  },
  email: {
    icon: '📧',
    color: '#dc3545',
    label: 'Email',
    description: 'Send email messages'
  },
  cron: {
    icon: '⏰',
    color: '#fd7e14',
    label: 'Cron',
    description: 'Schedule based trigger'
  },
  gmail: {
    icon: '📮',
    color: '#ea4335',
    label: 'Gmail',
    description: 'Gmail integration'
  },
  slack: {
    icon: '💬',
    color: '#4a154b',
    label: 'Slack',
    description: 'Slack integration'
  },
  function: {
    icon: '⚙️',
    color: '#6c757d',
    label: 'Function',
    description: 'JavaScript function'
  },
  condition: {
    icon: '❓',
    color: '#17a2b8',
    label: 'IF',
    description: 'Conditional logic'
  },
  merge: {
    icon: '🔀',
    color: '#20c997',
    label: 'Merge',
    description: 'Merge data streams'
  },
  switch: {
    icon: '🔁',
    color: '#ffc107',
    label: 'Switch',
    description: 'Route data conditionally'
  }
};

// Helper to get node config by type
export const getNodeConfig = (type: string) => {
  return nodeConfigs[type as keyof typeof nodeConfigs] || {
    icon: '⚙️',
    color: '#6c757d',
    label: type,
    description: `${type} node`
  };
};
