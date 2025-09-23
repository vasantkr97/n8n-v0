import AgentNode from './AgentNode';
import N8nNode from './N8nNode';

// Define all custom node types for n8n-style workflow
export const nodeTypes = {
  'n8n-node': N8nNode,
  manual: N8nNode,
  webhook: N8nNode,
  email: N8nNode,
  telegram: N8nNode,
  gemini: N8nNode, // Use AgentNode for gemini nodes
  // Add trigger flags to node configs for proper rendering
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
  type: type, // Use the actual node type for proper component mapping
  position,
  data: {
    ...data,
    type, // store actual node type here as well
  },
});

// Predefined node configurations for our nodes
export const nodeConfigs = {
  // === Triggers ===
  manual: {
    icon: '▶️',
    color: '#007acc',
    label: 'Manual Trigger',
    description: 'Manually start the workflow',
    isTrigger: true,
  },
  webhook: {
    icon: '🔗',
    color: '#28a745',
    label: 'Webhook',
    description: 'Trigger on incoming HTTP requests',
    isTrigger: true,
  },

  // === Actions ===
  email: {
    icon: '📧',
    color: '#dc3545',
    label: 'Email',
    description: 'Send email messages',
    isTrigger: false,
  },
  telegram: {
    icon: '💬',
    color: '#0088cc',
    label: 'Telegram',
    description: 'Send messages via Telegram bot',
    isTrigger: false,
  },
  gemini: {
    icon: '✨',
    color: '#6f42c1',
    label: 'Gemini Agent',
    description: 'Use Gemini LLM to generate responses',
    isTrigger: false,
  },
};

// Helper to get node config by type
export const getNodeConfig = (type: string) => {
  return nodeConfigs[type as keyof typeof nodeConfigs] || {
    icon: '⚙️',
    color: '#6c757d',
    label: type,
    description: `${type} node`,
    isTrigger: false,
  };
};
