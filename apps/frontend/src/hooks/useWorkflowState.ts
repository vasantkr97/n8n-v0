import { useState, useCallback } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';

export const useWorkflowState = () => {
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [workflowTitle, setWorkflowTitle] = useState('Untitled Workflow');
  const [isWorkflowActive, setIsWorkflowActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isLoadingWorkflow, setIsLoadingWorkflow] = useState(false);
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const resetWorkflow = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setWorkflowTitle('Untitled Workflow');
    setIsWorkflowActive(false);
    setWorkflowId(null);
  }, [setNodes, setEdges]);

  return {
    workflowId,
    setWorkflowId,
    workflowTitle,
    setWorkflowTitle,
    isWorkflowActive,
    setIsWorkflowActive,
    isSaving,
    setIsSaving,
    isExecuting,
    setIsExecuting,
    isLoadingWorkflow,
    setIsLoadingWorkflow,
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    resetWorkflow
  };
};

