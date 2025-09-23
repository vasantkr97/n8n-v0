import { useState, useCallback, useEffect } from "react";
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
import WorkflowToolbar from "../components/WorkflowToolbar";
import { NodeParametersPanel } from "../components/parameters/NodeParametersPanel";
import { useWorkflowManagement } from "../hooks/executionHooks/useWorkflowManagement";

// Helper function to generate UUID
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

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

    // Sync with workflow management state
    useEffect(() => {
      if (currentWorkflow.nodes && currentWorkflow.nodes.length > 0) {
        setNodes(currentWorkflow.nodes);
      }
      if (currentWorkflow.connections) {
        // Convert connections back to edges for React Flow
        const convertedEdges = Object.entries(currentWorkflow.connections).flatMap(([sourceName, connectionData]) => {
          if (connectionData.main && connectionData.main[0]) {
            return connectionData.main[0].map((conn: any) => ({
              id: `${sourceName}-${conn.node}`,
              source: sourceName,
              target: conn.node,
              type: 'default',
              data: { itemCount: 1 }
            }));
          }
          return [];
        });
        setEdges(convertedEdges);
      }
    }, [currentWorkflow.nodes, currentWorkflow.connections, setNodes, setEdges]);
    
    // Node addition state
    const [showNodeSelector, setShowNodeSelector] = useState(false);
    const [nodeSelectorPosition, setNodeSelectorPosition] = useState({ x: 0, y: 0 });
    const [sourceNodeForConnection, setSourceNodeForConnection] = useState<string | null>(null);
    const [addButtonPosition, setAddButtonPosition] = useState({ x: 0, y: 0 });
    const [showAddButton, setShowAddButton] = useState(false);
    const [hasAddedFirstNode, setHasAddedFirstNode] = useState(false);
    const [hasTrigger, setHasTrigger] = useState(false);

    // Node selection and parameters
    const [selectedNode, setSelectedNode] = useState<any | null>(null);
    const [showParametersPanel, setShowParametersPanel] = useState(false);

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
    setShowExecutionPanel(false);
  }, [createNewWorkflow]);

  // Handle workflow save
  const handleSaveWorkflow = useCallback(() => {
    // Convert edges to connections format
    const connections: any = {};
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);

      if (sourceNode && targetNode) {
        const sourceName = sourceNode.data?.label || sourceNode.data?.type || 'Node';
        const targetName = targetNode.data?.label || targetNode.data?.type || 'Node';

        if (!connections[sourceName]) {
          connections[sourceName] = { main: [[]] };
        }

        connections[sourceName].main[0].push({
          node: targetName,
          type: 'main',
          index: 0
        });
      }
    });

    // Update workflow with current nodes and connections
    updateWorkflowData({
      nodes: nodes,
      connections: connections,
      updatedAt: new Date().toISOString()
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
      // Create new node ID using UUID
      const newNodeId = generateId();
      
      let newPosition;
      let newEdge = null;

      if (sourceNodeForConnection) {
        // Adding node connected to existing node
        const sourceNode = nodes.find(n => n.id === sourceNodeForConnection);
        if (!sourceNode) return;

        // Position new node to the right of source node
        newPosition = {
          x: sourceNode.position.x + 300,
          y: sourceNode.position.y
        };

        // Create connection edge
        newEdge = createN8nEdge(
          `e${sourceNodeForConnection}-${newNodeId}`,
          sourceNodeForConnection,
          newNodeId,
          { itemCount: 1, label: 'connected' }
        );
      } else {
        // Adding first node - use selector position
        newPosition = {
          x: nodeSelectorPosition.x - 100, // Center the node
          y: nodeSelectorPosition.y - 50
        };
      }

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

      // Add node and edge (if exists)
      setNodes(nds => [...nds, newNode]);
      if (newEdge) {
        setEdges(eds => [...eds, newEdge]);
      }

      setHasAddedFirstNode(true);

      // Set trigger flag if this is a trigger node
      if (getNodeConfig(nodeType).isTrigger) {
        setHasTrigger(true);
      }

      // Close selector
      setShowNodeSelector(false);
      setSourceNodeForConnection(null);
    }, [sourceNodeForConnection, nodes, nodeSelectorPosition, setNodes, setEdges, getNodeConfig, setHasTrigger]);

    // Close node selector
    const handleCloseNodeSelector = useCallback(() => {
      setShowNodeSelector(false);
      setSourceNodeForConnection(null);
    }, []);

    // Handle canvas click - close add button or show node selector
    const onPaneClick = useCallback((event: React.MouseEvent) => {
      setShowAddButton(false);
      setShowNodeSelector(false);

      // Show node selector at click position (works for empty canvas or adding nodes)
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setNodeSelectorPosition({ x, y });
      setShowNodeSelector(true);
      setSourceNodeForConnection(null); // No source node for canvas click
    }, []);

    // Handle node click - open parameters panel
    const handleNodeClick = useCallback((event: React.MouseEvent, node: any) => {
      event.stopPropagation();
      setSelectedNode(node);
      setShowParametersPanel(true);
    }, []);

  // Handle closing parameters panel
  const handleCloseParametersPanel = useCallback(() => {
    setShowParametersPanel(false);
    setSelectedNode(null);
  }, []);

  // Update node data from parameters panel
  const handleUpdateNodeData = useCallback(
    (nodeId: string, data: any) => {
      setNodes((nodes) =>
        nodes.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n))
      );
    },
    [setNodes]
  );

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
                    onNodeClick={handleNodeClick}
                    onPaneClick={onPaneClick}
                    nodeTypes={nodeTypes as any}
                    edgeTypes={edgeTypes as any}
                    defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                    minZoom={0.1}
                    maxZoom={4}
                    attributionPosition="bottom-left"
                    // fitView={nodes.length > 0}
                    fitViewOptions={{
                        padding: 0.2,
                        includeHiddenNodes: false,
                    }}
                    deleteKeyCode={['Backspace', 'Delete']}
                    multiSelectionKeyCode={['Meta', 'Ctrl']}
                    selectionKeyCode={['Shift']}
                    panOnDrag={true}
                    selectNodesOnDrag={false}
                    nodesDraggable={true}
                    nodesConnectable={true}
                    elementsSelectable={true}
                    zoomOnScroll={true}
                    zoomOnPinch={true}
                    panOnScroll={false}
                    preventScrolling={false}
                >
                    <Background 
                        variant={BackgroundVariant.Dots}
                        gap={20}
                        size={1}
                        color="#d1d5db"
                        style={{ backgroundColor: '#374151' }}
                    />
                    <Controls 
                        position="bottom-left"
                        showZoom={true}
                        showFitView={true}
                        showInteractive={false}
                        style={{  bottom: 20, width: 96, height: 96, fontSize:40 }}
                    />
                    <MiniMap
                        nodeColor={(node) => {
                            // color based on node status or type
                            if ((node.data as any)?.hasError) return '#ff6b6b';
                            if ((node.data as any)?.isSuccess) return '#51cf66';
                            if ((node.data as any)?.isExecuting) return '#339af0';
                            return '#9ca3af'; // default gray
                        }}
                        nodeStrokeWidth={2}
                        position="bottom-right"  // move to bottom-right to avoid overlapping Controls
                        style={{
                            height: 120,            // adjust height
                            width: 180,             // adjust width
                            backgroundColor: '#1f2937', // dark gray canvas
                            border: '1px solid #4b5563', // proper border
                            borderRadius: '8px',    // optional rounding
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
                            <h3 className="text-xl font-medium text-gray-700 mb-2">Start Building Your Workflow</h3>
                            <p className="text-gray-500 max-w-md mb-4">
                                Click anywhere on the canvas to add your first node
                            </p>
                            <div className="text-sm text-gray-400">
                                Choose from triggers, actions, and integrations
                            </div>
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
                    hasTrigger={hasTrigger}
                />
                
                {/* Execution Panel Toggle */}
                <button
                    onClick={() => setShowExecutionPanel(!showExecutionPanel)}
                    className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition-colors"
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

                {/* Node Parameters Panel */}
                {showParametersPanel && selectedNode && (
                    <NodeParametersPanel
                        node={selectedNode}
                        onClose={handleCloseParametersPanel}
                        onSave={handleUpdateNodeData}
                    />
                )}
        </div>
    )
}