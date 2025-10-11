import { useState } from "react";
import { ReactFlow, Controls, Background, MiniMap, BackgroundVariant } from "@xyflow/react";
import '@xyflow/react/dist/style.css';

import { nodeTypes } from "../components/nodes/nodeTypes";
import { edgeTypes } from "../components/edges/edgeTypes";
import WorkflowToolbar from "../components/WorkflowToolbar";
import { NodeParametersPanel } from "../components/parameters/NodeParametersPanel";
import { NodeSelector } from "../components/NodeSelector";

import { useWorkflowState } from "../hooks/useWorkflowState";
import { useWorkflowActions } from "../hooks/useWorkflowActions";
import { useNodeActions } from "../hooks/useNodeActions";
import { useWorkflowLoader } from "../hooks/useWorkflowLoader";

export default function WorkflowEditor() {
  const state = useWorkflowState();
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [showParametersPanel, setShowParametersPanel] = useState(false);
  const [showNodeSelector, setShowNodeSelector] = useState(false);
  const [nodeSelectorPosition, setNodeSelectorPosition] = useState({ x: 0, y: 0 });

  const actions = useWorkflowActions({
    workflowId: state.workflowId,
    setWorkflowId: state.setWorkflowId,
    workflowTitle: state.workflowTitle,
    setWorkflowTitle: state.setWorkflowTitle,
    isWorkflowActive: state.isWorkflowActive,
    setIsWorkflowActive: state.setIsWorkflowActive,
    setIsSaving: state.setIsSaving,
    setIsExecuting: state.setIsExecuting,
    nodes: state.nodes,
    edges: state.edges,
    resetWorkflow: state.resetWorkflow
  });

  const nodeActions = useNodeActions({
    workflowId: state.workflowId,
    setNodes: state.setNodes,
    setEdges: state.setEdges
  });

  useWorkflowLoader({
    setWorkflowId: state.setWorkflowId,
    setWorkflowTitle: state.setWorkflowTitle,
    setIsWorkflowActive: state.setIsWorkflowActive,
    setNodes: state.setNodes,
    setEdges: state.setEdges,
    setIsLoadingWorkflow: state.setIsLoadingWorkflow
  });

  // Always get the fresh node from the nodes array
  const selectedNode = selectedNodeId 
    ? state.nodes.find((n: any) => n.id === selectedNodeId) 
    : null;

  const handlePaneClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('react-flow__pane')) {
      setNodeSelectorPosition({
        x: event.clientX - 190,
        y: event.clientY - 225
      });
      setShowNodeSelector(true);
    }
  };

  const handleAddNodeClick = () => {
    setNodeSelectorPosition({
      x: window.innerWidth / 2 - 190,
      y: window.innerHeight / 2 - 225
    });
    setShowNodeSelector(true);
  };

  if (state.isLoadingWorkflow) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-black">
        <div className="text-white text-lg">Loading workflow...</div>
      </div>
    );
  }

  return (
        <div className="h-full w-full flex flex-col">
            <WorkflowToolbar
        workflowTitle={state.workflowTitle}
        onWorkflowTitleChange={actions.handleTitleChange}
        onSaveWorkflow={actions.handleSave}
        onNewWorkflow={actions.handleNewWorkflow}
        onExecuteWorkflow={actions.handleExecute}
        onWebhookExecute={actions.handleWebhookExecute}
        isWorkflowActive={state.isWorkflowActive}
        onToggleActive={actions.handleToggleActive}
        isSaving={state.isSaving}
        isExecuting={state.isExecuting}
      />
      
      <div className="flex-1">
                <ReactFlow
          nodes={state.nodes}
          edges={state.edges}
          onNodesChange={state.onNodesChange}
          onEdgesChange={state.onEdgesChange}
          onConnect={nodeActions.onConnect}
                    onNodeClick={(_event, node: any) => {
                        setSelectedNodeId(node.id);
                        setShowParametersPanel(true);
                    }}
          onPaneClick={handlePaneClick}
                    nodeTypes={nodeTypes as any}
                    edgeTypes={edgeTypes as any}
                    defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                    minZoom={0.1}
                    maxZoom={4}
                    deleteKeyCode={['Backspace', 'Delete']}
                    panOnDrag={true}
                    nodesDraggable={true}
                    nodesConnectable={true}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} style={{ backgroundColor: '#000000' }} />
          <Controls position="bottom-left" />
                    <MiniMap
                        nodeColor={(node) => {
                            if ((node.data as any)?.hasError) return '#ff6b6b';
                            if ((node.data as any)?.isSuccess) return '#51cf66';
                            if ((node.data as any)?.isExecuting) return '#339af0';
              return '#9ca3af';
            }}
            position="bottom-right"
            style={{ height: 120, width: 180, backgroundColor: '#000000', border: '1px solid #4b5563', borderRadius: '8px' }}
          />
          
          {state.nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="text-center bg-gray-800 bg-opacity-90 p-8 rounded-lg border-2 border-dashed border-gray-600">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold text-white mb-2">Start Building</h3>
                <p className="text-gray-400 mb-4">Add your first node to get started</p>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>Click the <span className="bg-blue-600 px-2 py-1 rounded">+</span> button</div>
                  <div className="text-gray-400">or</div>
                  <div>Click anywhere on canvas</div>
                </div>
              </div>
            </div>
          )}
                </ReactFlow>
            </div>

      <button
        onClick={handleAddNodeClick}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl font-bold z-30 transition-all hover:scale-110"
      >
        +
      </button>

      <NodeSelector
        isVisible={showNodeSelector}
        position={nodeSelectorPosition}
        onNodeSelect={(nodeType) => {
          nodeActions.handleNodeSelect(nodeType);
          setShowNodeSelector(false);
        }}
        onClose={() => setShowNodeSelector(false)}
        hasTrigger={state.nodes.some((n: any) => n?.data?.isTrigger === true)}
      />

            {showParametersPanel && selectedNode && (
                <NodeParametersPanel
                    node={selectedNode}
          onClose={() => {
            setShowParametersPanel(false);
            setSelectedNodeId(null);
          }}
          onSave={nodeActions.handleUpdateNodeData}
                />
            )}
        </div>
    );
}
