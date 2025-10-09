// import { useState, useCallback } from 'react';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import {
//   createWorkflow,
//   updateWorkflow
// } from '../../apiServices/workflow.api';

// // Generate UUID for nodes and workflows
// const generateId = () => {
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//     const r = Math.random() * 16 | 0;
//     const v = c === 'x' ? r : (r & 0x3 | 0x8);
//     return v.toString(16);
//   });
// };

// // Get n8n-style node type based on our node type
// const getN8nNodeType = (nodeType: string) => {
//   switch (nodeType) {
//     case 'manual':
//       return '@n8n/n8n-manualTrigger';
//     case 'webhook':
//       return '@n8n/n8n-WebhookTrigger';
//     case 'email':
//       return 'n8n-nodes-base.email';
//     case 'telegram':
//       return 'n8n-nodes-base.telegram';
//     case 'gemini':
//       return '@n8n/n8n-nodes-langchain.googleGemini';
//     default:
//       return `n8n-nodes-base.${nodeType}`;
//   }
// };

// export interface WorkflowData {
//   title: string;
//   isActive: boolean;
//   triggerType: 'MANUAL' | 'WEBHOOK';

//   nodes?: any;
//   connections?: any;

// }

// export const useWorkflowManagement = () => {
//   const queryClient = useQueryClient();
//   const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowData>({
//     title: 'My New Workflow',
//     isActive: false,
//     triggerType: 'MANUAL',
//     description: '',
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     nodes: [],
//     connections: {}
//   });

//   // Get all workflows
//   const { data: workflows, isLoading: loadingWorkflows } = useQuery({
//     queryKey: ['workflows'],
//     queryFn: getWorkflows
//   });

//   // Create workflow mutation
//   const createWorkflowMutation = useMutation({
//     mutationFn: createWorkflow,
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ['workflows'] });
//       setCurrentWorkflow(prev => ({ ...prev, id: data.id }));
//       console.log('Workflow created successfully');
//     },
//     onError: (error) => {
//       console.error('Failed to create workflow:', error);
//     }
//   });

//   // Update workflow mutation
//   const updateWorkflowMutation = useMutation({
//     mutationFn: ({ id, data }: { id: string; data: Partial<WorkflowData> }) =>
//       updateWorkflow({ workflowId: id, updatedWorkflow: data }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['workflows'] });
//       console.log('Workflow updated successfully');
//     },
//     onError: (error) => {
//       console.error('Failed to update workflow:', error);
//     }
//   });

//   // Execute workflow mutation
//   const executeWorkflowMutation = useMutation({
//     mutationFn: ({ workflowId, inputData }: { workflowId: string; inputData?: any }) =>
//       executeWorkflow(workflowId, inputData),
//     onSuccess: (data) => {
//       console.log('Workflow execution started:', data);
//     },
//     onError: (error) => {
//       console.error('Failed to execute workflow:', error);
//     }
//   });

//   // Create new workflow
//   const createNewWorkflow = useCallback(() => {
//     const now = new Date().toISOString();
//     setCurrentWorkflow({
//       title: 'My New Workflow',
//       isActive: true, // Start as active so it can be executed
//       triggerType: 'MANUAL',
//       description: '',
//       createdAt: now,
//       updatedAt: now,
//       nodes: [],
//       connections: {},
   
//     });
//   }, []);

//   // Save current workflow in n8n format
//   const saveWorkflow = useCallback(async () => {
//     try {
//       const now = new Date().toISOString();

//       // Convert our nodes to n8n format
//       const n8nNodes = currentWorkflow.nodes.map((node: any) => {
//         const nodeType = node.data?.type || 'unknown';
//         const n8nType = getN8nNodeType(nodeType);
//         const nodeData = node.data || {};

//         return {
//           parameters: {
//             ...nodeData,
//             options: {}
//           },
//           type: n8nType,
//           typeVersion: 1.0,
//           position: [Math.round(node.position.x), Math.round(node.position.y)],
//           id: node.id,
//           name: nodeData.label || nodeType,
//           webhookId: nodeData.webhookId || generateId()
//         };
//       });

//         // Use existing connections or convert from edges if needed
//         const connections = currentWorkflow.connections || {};

//       // Create n8n-style workflow data
//       const workflowData = {
//         name: currentWorkflow.title,
//         active: currentWorkflow.isActive,
//         isArchived: false,
//         nodes: n8nNodes,
//         connections,
//         settings: {
//           executionOrder: 'v1'
//         },
//         staticData: null,
//         meta: {
//           templateCredsSetupCompleted: true
//         },
//         pinData: {},
//         versionId: currentWorkflow.id || generateId(),
//         triggerCount: currentWorkflow.nodes?.filter((n: any) => n.data?.isTrigger).length || 0,
//         tags: [],
//         scopes: [
//           'workflow:create',
//           'workflow:delete',
//           'workflow:execute',
//           'workflow:list',
//           'workflow:move',
//           'workflow:read',
//           'workflow:share',
//           'workflow:update'
//         ]
//       };

//       const saveData = {
//         title: currentWorkflow.title,
//         isActive: currentWorkflow.isActive,
//         triggerType: currentWorkflow.triggerType,
//         description: currentWorkflow.description,
//         createdAt: now,
//         updatedAt: now,
//         ...workflowData
//       };

//       if (currentWorkflow.id) {
//         // Update existing workflow
//         await updateWorkflowMutation.mutateAsync({
//           id: currentWorkflow.id,
//           data: saveData
//         });
//       } else {
//         // Create new workflow
//         const result = await createWorkflowMutation.mutateAsync(saveData);
//         setCurrentWorkflow(prev => ({ ...prev, id: result.id, createdAt: now, updatedAt: now }));
//       }
//     } catch (error) {
//       console.error('Save workflow failed:', error);
//     }
//   }, [currentWorkflow, createWorkflowMutation, updateWorkflowMutation]);

//   // Execute current workflow
//   const executeCurrentWorkflow = useCallback(async () => {
//     // If workflow hasn't been saved yet, save it first
//     if (!currentWorkflow.id) {
//       console.log('Workflow not saved yet, saving before execution...');
//       try {
//         const now = new Date().toISOString();

//         // Convert nodes to n8n format for saving
//         const n8nNodes = currentWorkflow.nodes.map((node: any) => {
//           const nodeType = node.data?.type || 'unknown';
//           const n8nType = getN8nNodeType(nodeType);
//           const nodeData = node.data || {};

//           return {
//             parameters: {
//               ...nodeData,
//               options: {}
//             },
//             type: n8nType,
//             typeVersion: 1.0,
//             position: [Math.round(node.position.x), Math.round(node.position.y)],
//             id: node.id,
//             name: nodeData.label || nodeType,
//             webhookId: nodeData.webhookId || generateId()
//           };
//         });

//         // Convert edges to n8n connections format
//         const connections: any = {};
//         currentWorkflow.edges?.forEach((edge: any) => {
//           const sourceNode = currentWorkflow.nodes?.find((n: any) => n.id === edge.source);
//           const targetNode = currentWorkflow.nodes?.find((n: any) => n.id === edge.target);

//           if (sourceNode && targetNode) {
//             const sourceName = sourceNode.data?.label || sourceNode.data?.type || 'Node';
//             const targetName = targetNode.data?.label || targetNode.data?.type || 'Node';

//             if (!connections[sourceName]) {
//               connections[sourceName] = { main: [[]] };
//             }

//             connections[sourceName].main[0].push({
//               node: targetName,
//               type: 'main',
//               index: 0
//             });
//           }
//         });

//         // Create n8n-style workflow data for saving
//         const workflowData = {
//           name: currentWorkflow.title,
//           active: currentWorkflow.isActive,
//           isArchived: false,
//           nodes: n8nNodes,
//           connections,
//           settings: {
//             executionOrder: 'v1'
//           },
//           staticData: null,
//           meta: {
//             templateCredsSetupCompleted: true
//           },
//           pinData: {},
//           versionId: generateId(),
//           triggerCount: currentWorkflow.nodes?.filter((n: any) => (n as any).data?.isTrigger).length || 0,
//           tags: [],
//           scopes: [
//             'workflow:create',
//             'workflow:delete',
//             'workflow:execute',
//             'workflow:list',
//             'workflow:move',
//             'workflow:read',
//             'workflow:share',
//             'workflow:update'
//           ]
//         };

//         const saveData = {
//           title: currentWorkflow.title,
//           isActive: currentWorkflow.isActive,
//           triggerType: currentWorkflow.triggerType,
//           description: currentWorkflow.description,
//           createdAt: now,
//           updatedAt: now,
//           ...workflowData
//         };

//         const result = await createWorkflowMutation.mutateAsync(saveData);

//         // Execute with the new workflow ID
//         await executeWorkflowMutation.mutateAsync({
//           workflowId: result.id,
//           inputData: {}
//         });
//       } catch (error) {
//         console.error('Failed to save and execute workflow:', error);
//         return;
//       }
//     } else {
//       // Execute existing workflow
//       try {
//         await executeWorkflowMutation.mutateAsync({
//           workflowId: currentWorkflow.id,
//           inputData: {}
//         });
//       } catch (error) {
//         console.error('Execute workflow failed:', error);
//       }
//     }
//   }, [currentWorkflow, executeWorkflowMutation, createWorkflowMutation]);

//   // Update workflow data
//   const updateWorkflowData = useCallback((updates: Partial<WorkflowData>) => {
//     setCurrentWorkflow(prev => ({ ...prev, ...updates }));
//   }, []);

//   return {
//     // Data
//     currentWorkflow,
//     workflows,
//     loadingWorkflows,

//     // Actions
//     createNewWorkflow,
//     saveWorkflow,
//     executeCurrentWorkflow,
//     updateWorkflowData,

//     // Loading states
//     isSaving: createWorkflowMutation.isPending || updateWorkflowMutation.isPending,
//     isExecuting: executeWorkflowMutation.isPending,

//     // Mutations for external use
//     createWorkflowMutation,
//     updateWorkflowMutation,
//     executeWorkflowMutation
//   };
// };
