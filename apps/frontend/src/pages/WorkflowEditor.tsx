import { useState, useCallback } from "react";
import { 
  ReactFlow, 
  Controls, 
  Background, 
  MiniMap, 
  useNodesState, 
  useEdgesState,
  addEdge,
  type Connection,
  BackgroundVariant
} from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import { ExecutionControls } from "../components/ExecutionControls";
import { ExecutionHistory } from "../components/ExecutionHistory";
import { nodeTypes, createN8nNode, getNodeConfig } from "../components/nodes/nodeTypes";
import { edgeTypes, createN8nEdge } from "../components/edges/edgeTypes";
import { NodeSelector } from "../components/NodeSelector";
import { AddNodeButton } from "../components/AddNodeButton";
import { WorkflowToolbar } from "../components/WorkflowToolbar";
import { useWorkflowManagement } from "../hooks/workflowHooks/useWorkflowManagement";

// Clean canvas - start with completely empty workflow
const getInitialNodes = (): any[] => {
  return [];
};

const getInitialEdges = (): any[] => {
  return [];
};

export default function WorkflowEditor() {
    // Workflow management
    const {
        currentWorkflow,
        createNewWorkflow,
        saveWorkflow,
        executeCurrentWorkflow,
        updateWorkflowData,
        isSaving,
        isExecuting
    } = useWorkflowManagement();

    const [showExecutionPanel, setShowExecutionPanel] = useState(false)
    const [, setCurrentExecutionId] = useState<string | null>(null)
    
    // React Flow state management - start with clean canvas
    const [nodes, setNodes, onNodesChange] = useNodesState(getInitialNodes());
    const [edges, setEdges, onEdgesChange] = useEdgesState(getInitialEdges());
    
    // Node addition state
    const [showNodeSelector, setShowNodeSelector] = useState(false);
    const [nodeSelectorPosition, setNodeSelectorPosition] = useState({ x: 0, y: 0 });
    const [sourceNodeForConnection, setSourceNodeForConnection] = useState<string | null>(null);
    const [addButtonPosition, setAddButtonPosition] = useState({ x: 0, y: 0 });
    const [showAddButton, setShowAddButton] = useState(false);

    const handleExecutionStart = (executionId: string) => {
        setCurrentExecutionId(executionId)
        setShowExecutionPanel(true)
        
        // Simulate execution animation
        simulateWorkflowExecution()
    }

    // Handle workflow title change
    const handleWorkflowTitleChange = useCallback((title: string) => {
        updateWorkflowData({ title });
    }, [updateWorkflowData]);

    // Handle workflow active toggle
    const handleToggleActive = useCallback(() => {
        updateWorkflowData({ isActive: !currentWorkflow.isActive });
    }, [currentWorkflow.isActive, updateWorkflowData]);

    // Handle new workflow creation
    const handleNewWorkflow = useCallback(() => {
        createNewWorkflow();
        setNodes(getInitialNodes());
        setEdges(getInitialEdges());
        setShowExecutionPanel(false);
    }, [createNewWorkflow, setNodes, setEdges]);

    // Handle workflow save
    const handleSaveWorkflow = useCallback(() => {
        // Update workflow with current nodes and edges
        updateWorkflowData({
            nodes: nodes,
            edges: edges
        });
        saveWorkflow();
    }, [nodes, edges, updateWorkflowData, saveWorkflow]);

    // Handle workflow execution
    const handleExecuteWorkflow = useCallback(async () => {
        if (!currentWorkflow.isActive) {
            alert('Please activate the workflow before executing');
            return;
        }
        
        if (nodes.length === 0) {
            alert('Please add some nodes to your workflow before executing');
            return;
        }

        await executeCurrentWorkflow();
        setShowExecutionPanel(true);
    }, [currentWorkflow.isActive, nodes.length, executeCurrentWorkflow]);
    
    // Simulate n8n-style execution animation
    const simulateWorkflowExecution = useCallback(() => {
        // Reset all nodes and edges
        setNodes(nodes => 
          nodes.map(node => ({
            ...node,
            data: { ...node.data, isExecuting: false, hasError: false, isSuccess: false }
          }))
        );
        setEdges(edges =>
          edges.map(edge => ({
            ...edge,
            data: { ...edge.data, isExecuting: false, hasExecuted: false, hasError: false }
          }))
        );

        // Execute nodes sequentially with delays
        setTimeout(() => {
          // Start with manual trigger
          setNodes(nodes => 
            nodes.map(node => 
              node.id === 'manual-trigger' 
                ? { ...node, data: { ...node.data, isExecuting: true } }
                : node
            )
          );
          
          setTimeout(() => {
            // Complete manual trigger, start first edge
            setNodes(nodes => 
              nodes.map(node => 
                node.id === 'manual-trigger' 
                  ? { ...node, data: { ...node.data, isExecuting: false, isSuccess: true } }
                  : node
              )
            );
            setEdges(edges =>
              edges.map(edge => 
                edge.id === 'e1-2'
                  ? { ...edge, data: { ...edge.data, isExecuting: true } }
                  : edge
              )
            );
            
            setTimeout(() => {
              // Complete first edge, start HTTP request
              setEdges(edges =>
                edges.map(edge => 
                  edge.id === 'e1-2'
                    ? { ...edge, data: { ...edge.data, isExecuting: false, hasExecuted: true } }
                    : edge
                )
              );
              setNodes(nodes => 
                nodes.map(node => 
                  node.id === 'http-request' 
                    ? { ...node, data: { ...node.data, isExecuting: true } }
                    : node
                )
              );
              
              setTimeout(() => {
                // Complete HTTP request, start second edge
                setNodes(nodes => 
                  nodes.map(node => 
                    node.id === 'http-request' 
                      ? { ...node, data: { ...node.data, isExecuting: false, isSuccess: true } }
                      : node
                  )
                );
                setEdges(edges =>
                  edges.map(edge => 
                    edge.id === 'e2-3'
                      ? { ...edge, data: { ...edge.data, isExecuting: true } }
                      : edge
                  )
                );
                
                setTimeout(() => {
                  // Complete second edge, start email
                  setEdges(edges =>
                    edges.map(edge => 
                      edge.id === 'e2-3'
                        ? { ...edge, data: { ...edge.data, isExecuting: false, hasExecuted: true } }
                        : edge
                    )
                  );
                  setNodes(nodes => 
                    nodes.map(node => 
                      node.id === 'email-node' 
                        ? { ...node, data: { ...node.data, isExecuting: true } }
                        : node
                    )
                  );
                  
                  setTimeout(() => {
                    // Complete email node
                    setNodes(nodes => 
                      nodes.map(node => 
                        node.id === 'email-node' 
                          ? { ...node, data: { ...node.data, isExecuting: false, isSuccess: true } }
                          : node
                      )
                    );
                  }, 1500);
                }, 800);
              }, 1500);
            }, 800);
          }, 1000);
        }, 500);
    }, [setNodes, setEdges]);

    const onConnect = useCallback(
        (params: Connection) => {
          const newEdge = createN8nEdge(
            `e${params.source}-${params.target}`,
            params.source!,
            params.target!,
            { itemCount: 1 }
          );
          setEdges((eds) => addEdge(newEdge, eds));
        },
        [setEdges]
    );

    // Node click handler - show add button on node hover/click
    const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
      event.stopPropagation();
      
      // Calculate position for add button (to the right of the node)
      const nodeRect = (event.target as HTMLElement).getBoundingClientRect();
      const canvasRect = (event.currentTarget as HTMLElement).closest('.react-flow')?.getBoundingClientRect();
      
      if (canvasRect) {
        const relativeX = nodeRect.right - canvasRect.left + 20;
        const relativeY = nodeRect.top - canvasRect.top + nodeRect.height / 2;
        
        setAddButtonPosition({ x: relativeX, y: relativeY });
        setShowAddButton(true);
        setSourceNodeForConnection(node.id);
        
        // Hide add button after 3 seconds
        setTimeout(() => {
          setShowAddButton(false);
        }, 3000);
      }
    }, []);

    // Handle add node button click
    const handleAddNodeClick = useCallback(() => {
      setShowAddButton(false);
      setNodeSelectorPosition({
        x: addButtonPosition.x + 50,
        y: addButtonPosition.y - 200
      });
      setShowNodeSelector(true);
    }, [addButtonPosition]);

    // Handle node selection from selector
    const handleNodeSelect = useCallback((nodeType: string) => {
      if (!sourceNodeForConnection) return;

      const sourceNode = nodes.find(n => n.id === sourceNodeForConnection);
      if (!sourceNode) return;

      // Create new node ID
      const newNodeId = `${nodeType}-${Date.now()}`;
      
      // Position new node to the right of source node
      const newPosition = {
        x: sourceNode.position.x + 300,
        y: sourceNode.position.y
      };

      // Create new node
      const newNode = createN8nNode(
        newNodeId,
        nodeType,
        newPosition,
        {
          ...getNodeConfig(nodeType),
          description: `New ${nodeType} node`
        }
      );

      // Create connection edge
      const newEdge = createN8nEdge(
        `e${sourceNodeForConnection}-${newNodeId}`,
        sourceNodeForConnection,
        newNodeId,
        { itemCount: 1, label: 'connected' }
      );

      // Add node and edge
      setNodes(nds => [...nds, newNode]);
      setEdges(eds => [...eds, newEdge]);

      // Close selector
      setShowNodeSelector(false);
      setSourceNodeForConnection(null);
    }, [sourceNodeForConnection, nodes, setNodes, setEdges]);

    // Close node selector
    const handleCloseNodeSelector = useCallback(() => {
      setShowNodeSelector(false);
      setSourceNodeForConnection(null);
    }, []);

    // Handle canvas click - close add button
    const onPaneClick = useCallback(() => {
      setShowAddButton(false);
      setShowNodeSelector(false);
    }, []);

    return (
        <div className="h-full w-full flex flex-col">
            {/* Workflow Toolbar */}
            <WorkflowToolbar
                workflowTitle={currentWorkflow.title}
                onWorkflowTitleChange={handleWorkflowTitleChange}
                onSaveWorkflow={handleSaveWorkflow}
                onNewWorkflow={handleNewWorkflow}
                onExecuteWorkflow={handleExecuteWorkflow}
                isWorkflowActive={currentWorkflow.isActive}
                onToggleActive={handleToggleActive}
                isSaving={isSaving}
                isExecuting={isExecuting}
            />

            <div className="flex-1 flex">
            {/* Main workflow editor */}
            <div className="flex-1 relative">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={onNodeClick}
                    onPaneClick={onPaneClick}
                    nodeTypes={nodeTypes as any}
                    edgeTypes={edgeTypes as any}
                    defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                    minZoom={0.2}
                    maxZoom={2}
                    attributionPosition="bottom-left"
                    fitView
                    fitViewOptions={{
                        padding: 0.3,
                        includeHiddenNodes: false,
                    }}
                >
                    <Background 
                        variant={BackgroundVariant.Dots}
                        gap={20}
                        size={1}
                        color="#d1d5db"
                        style={{ backgroundColor: '#f3f4f6' }}
                    />
                    <Controls 
                        position="bottom-right"
                        showZoom={true}
                        showFitView={true}
                        showInteractive={false}
                    />
                    <MiniMap 
                        nodeColor="#e5e7eb"
                        nodeStrokeWidth={3}
                        position="bottom-left"
                        style={{
                            backgroundColor: '#f9fafb',
                            border: '1px solid #e5e7eb',
                        }}
                        zoomable
                        pannable
                    />
                </ReactFlow>

                {/* Empty State Message */}
                {nodes.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <div className="text-gray-400 text-6xl mb-4">⚡</div>
                            <h3 className="text-xl font-medium text-gray-700 mb-2">Add your first step</h3>
                            <p className="text-gray-500 max-w-md">
                                Click anywhere on the canvas to start building your workflow
                            </p>
                        </div>
                    </div>
                )}

                {/* Add Node Button */}
                <AddNodeButton
                    position={addButtonPosition}
                    onClick={handleAddNodeClick}
                    isVisible={showAddButton}
                />

                {/* Node Selector */}
                <NodeSelector
                    position={nodeSelectorPosition}
                    onNodeSelect={handleNodeSelect}
                    onClose={handleCloseNodeSelector}
                    isVisible={showNodeSelector}
                />
                
                {/* Execution Panel Toggle */}
                <button
                    onClick={() => setShowExecutionPanel(!showExecutionPanel)}
                    className="absolute top-4 right-4 z-10 px-4 py-2 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition-colors"
                >
                    {showExecutionPanel ? "Hide" : "Show"} Execution Panel
                </button>
            </div>

            {/* Execution Panel */}
            {showExecutionPanel && (
                <div className="w-96 border-l bg-gray-50 overflow-y-auto">
                    <div className="p-4 border-b bg-white">
                        <h2 className="text-xl font-semibold">Workflow Execution</h2>
                    </div>
                    
                    {/* Execution Controls */}
                    <div className="p-4">
                        <ExecutionControls
                                workflowId={currentWorkflow.id || 'unsaved'}
                                isWorkflowActive={currentWorkflow.isActive}
                            onExecutionStart={handleExecutionStart}
                        />
                    </div>

                    {/* Execution History */}
                    <div className="border-t">
                            <ExecutionHistory workflowId={currentWorkflow.id || 'unsaved'} />
                        </div>
                    </div>
                )}
                </div>
        </div>
    )
}