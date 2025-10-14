import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getWorkflowById } from '../apiServices/workflow.api';
import { getNodeConfig } from '../components/nodes/nodeTypes';

interface UseWorkflowLoaderProps {
  setWorkflowId: (id: string | null) => void;
  setWorkflowTitle: (title: string) => void;
  setIsWorkflowActive: (active: boolean) => void;
  setNodes: any;
  setEdges: any;
  setIsLoadingWorkflow: (loading: boolean) => void;
}

export const useWorkflowLoader = ({
  setWorkflowId,
  setWorkflowTitle,
  setIsWorkflowActive,
  setNodes,
  setEdges,
  setIsLoadingWorkflow
}: UseWorkflowLoaderProps) => {
  const { id: urlWorkflowId } = useParams<{ id: string }>();

  useEffect(() => {
    const loadWorkflow = async () => {
      // If no URL workflow ID, do nothing
      if (!urlWorkflowId) {
        setIsLoadingWorkflow(false);
        return;
      }

      try {
        console.log('🚀 Loading workflow from URL:', urlWorkflowId);
        setIsLoadingWorkflow(true);
        
        const response = await getWorkflowById(urlWorkflowId);
        const wf = response.data;
        
        if (!wf) {
          console.error('No workflow data received');
          return;
        }

        console.log('✅ Loaded workflow:', wf.title);

        // Set workflow data immediately (this won't save to localStorage due to URL detection)
        setWorkflowId(wf.id);
        setWorkflowTitle(wf.title || 'Untitled Workflow');
        setIsWorkflowActive(wf.isActive || false);

        // Map nodes quickly
        const mappedNodes = (wf.nodes || []).map((n: any, idx: number) => {
          const type = (n.type || '').toLowerCase();
          const cfg = getNodeConfig(type);
          const id = n.id || n.name || `node-${idx}`;
          const position = Array.isArray(n.position)
            ? { x: n.position[0], y: n.position[1] }
            : { x: 0, y: idx * 120 };

          return {
            id,
            type,
            position,
            data: {
              ...cfg,
              label: n.name || cfg.label,
              parameters: n.parameters || {},
              credentialsId: n.credentials?.id,
              workflowId: wf.id,
              ...(type === 'webhook' && { webhookToken: wf.webhookToken }),
            },
          };
        });

        // Map edges quickly
        const mappedEdges = (wf.connections || []).map((c: any, idx: number) => ({
          id: `${c.source}-${c.target}-${idx}`,
          source: c.source,
          target: c.target,
          type: 'n8n-edge',
          data: { itemCount: 1 },
        }));

        // Set nodes and edges in one batch
        setNodes(mappedNodes);
        setEdges(mappedEdges);
        
        console.log('✅ Workflow loaded successfully');
      } catch (error: any) {
        console.error('❌ Error loading workflow:', error);
        setWorkflowId(null);
        setWorkflowTitle('Error Loading Workflow');
        setNodes([]);
        setEdges([]);
      } finally {
        setIsLoadingWorkflow(false);
      }
    };

    loadWorkflow();
  }, [urlWorkflowId]); // Only depend on urlWorkflowId to prevent unnecessary re-runs
};