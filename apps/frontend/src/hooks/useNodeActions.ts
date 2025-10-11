import { useCallback } from 'react';
import { addEdge, type Connection } from '@xyflow/react';
import { getNodeConfig, createN8nNode } from '../components/nodes/nodeTypes';
import { createN8nEdge } from '../components/edges/edgeTypes';

const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

interface UseNodeActionsProps {
  workflowId: string | null;
  setNodes: any;
  setEdges: any;
}

export const useNodeActions = ({ workflowId, setNodes, setEdges }: UseNodeActionsProps) => {
  
  const onConnect = useCallback((params: Connection) => {
    const newEdge = createN8nEdge(
      `e${params.source}-${params.target}`,
      params.source!,
      params.target!,
      { itemCount: 1 }
    );
    setEdges((eds: any) => addEdge(newEdge, eds));
  }, [setEdges]);

  const handleNodeSelect = useCallback((nodeType: string) => {
    const newNodeId = generateId();
    const cfg = getNodeConfig(nodeType);
    
    const position = {
      x: (window.innerWidth / 2) - 100,
      y: (window.innerHeight / 2) - 50
    };

    const newNode = createN8nNode(newNodeId, nodeType, position, {
      ...cfg,
      label: cfg.label,
      description: cfg.description,
      workflowId: workflowId,
    });

    setNodes((nds: any) => [...nds, newNode]);
  }, [setNodes, workflowId]);

  const handleUpdateNodeData = useCallback((nodeId: string, data: any) => {
    setNodes((nodes: any) =>
      nodes.map((n: any) => {
        if (n.id === nodeId) {
          return { ...n, data: { ...n.data, ...data } };
        }
        return n;
      })
    );
  }, [setNodes]);

  return {
    onConnect,
    handleNodeSelect,
    handleUpdateNodeData
  };
};

