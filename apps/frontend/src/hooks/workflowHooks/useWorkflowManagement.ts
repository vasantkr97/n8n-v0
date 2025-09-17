import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getWorkflows, 
  createWorkflow, 
  updateWorkflow
} from '../../api/workflow.api';
import { executeWorkflow } from '../../api/execution';

export interface WorkflowData {
  id?: string;
  title: string;
  isActive: boolean;
  nodes: any[];
  edges: any[];
  triggerType: 'MANUAL' | 'WEBHOOK' | 'CRON';
  description?: string;
}

export const useWorkflowManagement = () => {
  const queryClient = useQueryClient();
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowData>({
    title: 'My New Workflow',
    isActive: false,
    nodes: [],
    edges: [],
    triggerType: 'MANUAL',
    description: ''
  });

  // Get all workflows
  const { data: workflows, isLoading: loadingWorkflows } = useQuery({
    queryKey: ['workflows'],
    queryFn: getWorkflows
  });

  // Create workflow mutation
  const createWorkflowMutation = useMutation({
    mutationFn: createWorkflow,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      setCurrentWorkflow(prev => ({ ...prev, id: data.id }));
      console.log('Workflow created successfully');
    },
    onError: (error) => {
      console.error('Failed to create workflow:', error);
    }
  });

  // Update workflow mutation
  const updateWorkflowMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WorkflowData> }) => 
      updateWorkflow({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      console.log('Workflow updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update workflow:', error);
    }
  });

  // Execute workflow mutation
  const executeWorkflowMutation = useMutation({
    mutationFn: ({ workflowId, inputData }: { workflowId: string; inputData?: any }) =>
      executeWorkflow(workflowId, inputData),
    onSuccess: (data) => {
      console.log('Workflow execution started:', data);
    },
    onError: (error) => {
      console.error('Failed to execute workflow:', error);
    }
  });

  // Create new workflow
  const createNewWorkflow = useCallback(() => {
    setCurrentWorkflow({
      title: 'My New Workflow',
      isActive: true, // Start as active so it can be executed
      nodes: [],
      edges: [],
      triggerType: 'MANUAL',
      description: ''
    });
  }, []);

  // Save current workflow
  const saveWorkflow = useCallback(async () => {
    try {
      const workflowData = {
        title: currentWorkflow.title,
        isActive: currentWorkflow.isActive,
        triggerType: currentWorkflow.triggerType,
        nodes: currentWorkflow.nodes.map(node => ({
          nodeId: node.id,
          type: node.data?.type || 'default',
          position: node.position,
          parameters: node.data || {},
          outputs: [], // Will be populated from edges
        }))
      };

      if (currentWorkflow.id) {
        // Update existing workflow
        await updateWorkflowMutation.mutateAsync({
          id: currentWorkflow.id,
          data: workflowData
        });
      } else {
        // Create new workflow
        await createWorkflowMutation.mutateAsync(workflowData);
      }
    } catch (error) {
      console.error('Save workflow failed:', error);
    }
  }, [currentWorkflow, createWorkflowMutation, updateWorkflowMutation]);

  // Execute current workflow
  const executeCurrentWorkflow = useCallback(async () => {
    // If workflow hasn't been saved yet, save it first
    if (!currentWorkflow.id) {
      console.log('Workflow not saved yet, saving before execution...');
      try {
        // Save the workflow first
        const workflowData = {
          title: currentWorkflow.title,
          isActive: currentWorkflow.isActive,
          triggerType: currentWorkflow.triggerType,
          nodes: currentWorkflow.nodes.map(node => ({
            nodeId: node.id,
            type: node.data?.type || 'default',
            position: node.position,
            parameters: node.data || {},
            outputs: [], // Will be populated from edges
          }))
        };
        
        const result = await createWorkflowMutation.mutateAsync(workflowData);
        
        // Execute with the new workflow ID
        await executeWorkflowMutation.mutateAsync({
          workflowId: result.id,
          inputData: {}
        });
      } catch (error) {
        console.error('Failed to save and execute workflow:', error);
        return;
      }
    } else {
      // Execute existing workflow
      try {
        await executeWorkflowMutation.mutateAsync({
          workflowId: currentWorkflow.id,
          inputData: {}
        });
      } catch (error) {
        console.error('Execute workflow failed:', error);
      }
    }
  }, [currentWorkflow, executeWorkflowMutation, createWorkflowMutation]);

  // Update workflow data
  const updateWorkflowData = useCallback((updates: Partial<WorkflowData>) => {
    setCurrentWorkflow(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    // Data
    currentWorkflow,
    workflows,
    loadingWorkflows,

    // Actions
    createNewWorkflow,
    saveWorkflow,
    executeCurrentWorkflow,
    updateWorkflowData,

    // Loading states
    isSaving: createWorkflowMutation.isPending || updateWorkflowMutation.isPending,
    isExecuting: executeWorkflowMutation.isPending,

    // Mutations for external use
    createWorkflowMutation,
    updateWorkflowMutation,
    executeWorkflowMutation
  };
};
