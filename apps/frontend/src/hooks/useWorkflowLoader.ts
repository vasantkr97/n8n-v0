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
      console.log('🔄 WorkflowLoader: URL workflow ID:', urlWorkflowId);
      if (!urlWorkflowId) {
        console.log('⚠️ No workflow ID in URL, skipping load');
        return;
      }

      try {
        setIsLoadingWorkflow(true);
        console.log('📥 Loading workflow from backend:', urlWorkflowId);
        const response = await getWorkflowById(urlWorkflowId);
        
        const wf = response.data;
        if (!wf) return;

        console.log('✅ Workflow loaded successfully:', wf);
        setWorkflowId(wf.id);
        setWorkflowTitle(wf.title || 'Untitled Workflow');
        setIsWorkflowActive(wf.isActive || false);

        const mappedNodes = (wf.nodes || []).map((n: any, idx: number) => {
          const type = (n.type || '').toLowerCase();
          const cfg = getNodeConfig(type);
          const id = n.name || `node-${idx}`;
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
              webhookToken: wf.webhookToken, // Add webhook token to node data
            },
          };
        });

        const mappedEdges = (wf.connections || []).map((c: any, idx: number) => ({
          id: `${c.source}-${c.target}-${idx}`,
          source: c.source,
          target: c.target,
          type: 'n8n-edge',
          data: { itemCount: 1 },
        }));

        console.log('📋 Mapped nodes:', mappedNodes);
        console.log('🔗 Mapped edges:', mappedEdges);
        setNodes(mappedNodes);
        setEdges(mappedEdges);
      } catch (error: any) {
        console.error('Error loading workflow:', error);
        alert(`Failed to load workflow: ${error.response?.data?.error || error.message}`);
      } finally {
        setIsLoadingWorkflow(false);
      }
    };

    loadWorkflow();
  }, [urlWorkflowId, setWorkflowId, setWorkflowTitle, setIsWorkflowActive, setNodes, setEdges, setIsLoadingWorkflow]);
};

