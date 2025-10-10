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
// import { ExecutionControls } from "../components/ExecutionControls";
// import { ExecutionHistory } from "../components/ExecutionHistory";
import { nodeTypes, getNodeConfig } from "../components/nodes/nodeTypes";
import { edgeTypes, createN8nEdge } from "../components/edges/edgeTypes";
import WorkflowToolbar from "../components/WorkflowToolbar";
import { NodeParametersPanel } from "../components/parameters/NodeParametersPanel";
// import { useWorkflowManagement } from "../hooks/executionHooks/useWorkflowManagement";

// Helper function to generate UUID
// const generateId = () => {
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//     const r = Math.random() * 16 | 0;
//     const v = c === 'x' ? r : (r & 0x3 | 0x8);
//     return v.toString(16);
//   });
// };

// Clean canvas - start with completely empty workflow
const getInitialNodes = (): any[] => {
  return [];
};

const getInitialEdges = (): any[] => {
  return [];
};

export default function WorkflowEditor() {
    // Workflow management
    // const {
    //     currentWorkflow,
    //     createNewWorkflow,
    //     saveWorkflow,
    //     executeCurrentWorkflow,
    //     updateWorkflowData,
    //     isSaving,
    //     isExecuting
    // } = useWorkflowManagement();

    const [workflowTitle, setWorkflowTitle] = useState<string>('My workfe');
    const [isWorkflowActive, setIsWorkflowActive] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isExecuting] = useState<boolean>(false);
    
  //   // React Flow state management - start with clean canvas
    const [nodes, setNodes, onNodesChange] = useNodesState(getInitialNodes());
    const [edges, setEdges, onEdgesChange] = useEdgesState(getInitialEdges());

  //   // Sync with workflow management state
  //   // useEffect(() => {
  //   //   if (currentWorkflow.nodes && currentWorkflow.nodes.length > 0) {
  //   //     setNodes(currentWorkflow.nodes);
  //   //   }
  //   //   if (currentWorkflow.connections) {
  //   //     // Convert connections back to edges for React Flow
  //   //     const convertedEdges = Object.entries(currentWorkflow.connections).flatMap(([sourceName, connectionData]) => {
  //   //       if (connectionData.main && connectionData.main[0]) {
  //   //         return connectionData.main[0].map((conn: any) => ({
  //   //           id: `${sourceName}-${conn.node}`,
  //   //           source: sourceName,
  //   //           target: conn.node,
  //   //           type: 'default',
  //   //           data: { itemCount: 1 }
  //   //         }));
  //   //       }
  //   //       return [];
  //   //     });
  //   //     setEdges(convertedEdges);
  //   //   }
  //   // }, [currentWorkflow.nodes, currentWorkflow.connections, setNodes, setEdges]);
    
    // Node addition state
    // node selector currently unused in this flow
    // const [showNodeSelector] = useState(false);
    // const [nodeSelectorPosition] = useState({ x: 0, y: 0 });
    // const [sourceNodeForConnection] = useState<string | null>(null);
    // const [hasTrigger] = useState(false);

    // Node selection and parameters
    const [selectedNode, setSelectedNode] = useState<any | null>(null);
    const [showParametersPanel, setShowParametersPanel] = useState(false);

    //Handle workflow title change
    const handleWorkflowTitleChange = useCallback((title: string) => {
        setWorkflowTitle(title);
    }, []);

    //Handle workflow active toggle
    const handleToggleActive = useCallback(() => {
        setIsWorkflowActive((v: boolean) => !v);
    }, []);

    // Handle new workflow creation
  const handleNewWorkflow = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setShowParametersPanel(false);
    setWorkflowTitle('Untitled Workflow');
    setIsWorkflowActive(false);
  }, [setNodes, setEdges]);

  // Handle workflow save
  const handleSaveWorkflow = useCallback(() => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 300);
  }, []);
    // Convert edges to connections format
//     const connections: any = {};
//     edges.forEach(edge => {
//       const sourceNode = nodes.find(n => n.id === edge.source);
//       const targetNode = nodes.find(n => n.id === edge.target);

//       if (sourceNode && targetNode) {
//         const sourceName = sourceNode.data?.label || sourceNode.data?.type || 'Node';
//         const targetName = targetNode.data?.label || targetNode.data?.type || 'Node';

//         if (!connections[sourceName]) {
//           connections[sourceName] = { main: [[]] };
//         }

//         connections[sourceName].main[0].push({
//           node: targetName,
//           type: 'main',
//           index: 0
//         });
//       }
//     });

//     // Update workflow with current nodes and connections
//     updateWorkflowData({
//       nodes: nodes,
//       connections: connections,
//       updatedAt: new Date().toISOString()
//     });
//     saveWorkflow();
//   }, [nodes, edges, updateWorkflowData, saveWorkflow]);

//     //Handle workflow execution
    const handleExecuteWorkflow = useCallback(async () => {
        if (nodes.length === 0) {
            alert('Please add some nodes to your workflow before executing');
            return;
        }
        // simple UI feedback only
        alert('Executing workflow...');
    }, [nodes.length]);
    
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
    const onNodeClick = useCallback((_event: React.MouseEvent, node: any) => {
      setSelectedNode(node);
      setShowParametersPanel(true);
    }, []);

    // Handle add node button click
     const handleAddNodeClick = useCallback(() => {}, []);

    // Handle node selection from selector
    // currently not using palette add in this flow
    // const handleNodeSelect = useCallback((nodeType: string) => {
    //   // Create new node ID using UUID
    //   const newNodeId = generateId();
      
    //   let newPosition;
    //   let newEdge = null;

    //   if (sourceNodeForConnection) {
    //     // Adding node connected to existing node
    //     const sourceNode = nodes.find(n => n.id === sourceNodeForConnection);
    //     if (!sourceNode) return;

    //     // Position new node to the right of source node
    //     newPosition = {
    //       x: sourceNode.position.x + 300,
    //       y: sourceNode.position.y
    //     };

    //     // Create connection edge
    //     newEdge = createN8nEdge(
    //       `${sourceNodeForConnection}-${newNodeId}`,
    //       sourceNodeForConnection,
    //       newNodeId,
    //       { itemCount: 1, label: 'connected' }
    //     );
    //   } else {
    //     // Adding first node - use selector position
    //     newPosition = {
    //       x: nodeSelectorPosition.x - 100, // Center the node
    //       y: nodeSelectorPosition.y - 50
    //     };
    //   }

    //   // Create new node
    //   const newNode = createN8nNode(
    //     newNodeId,
    //     nodeType,
    //     newPosition,
    //     {
    //       ...getNodeConfig(nodeType),
    //       description: `New ${nodeType} node`
    //     }
    //   );

    //   // Add node and edge (if exists)
    //   setNodes(nds => [...nds, newNode]);
    //   if (newEdge) {
    //     setEdges(eds => [...eds, newEdge]);
    //   }

    //   // track if we have a trigger elsewhere

    //   // Set trigger flag if this is a trigger node
    //   if (getNodeConfig(nodeType).isTrigger) {
    //     setHasTrigger(true);
    //   }

    //   // Close selector
    //   setSourceNodeForConnection(null);
    // }, [sourceNodeForConnection, nodes, nodeSelectorPosition, setNodes, setEdges, getNodeConfig, setHasTrigger]); 

    // Close node selector
    const handleCloseNodeSelector = useCallback(() => {}, []);

    // Handle canvas click - close add button or show node selector
    const onPaneClick = useCallback((_event: React.MouseEvent) => {}, []);

    //Handle node click - open parameters panel
    const handleNodeClick = useCallback((_event: React.MouseEvent, node: any) => {
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

  // Initialize from provided workflow JSON (example inject via window or replace here)
  useEffect(() => {
    const provided = (window as any).__PROVIDED_WORKFLOW__ as any;
    const wf = provided || {
      title: "My workfe",
      isActive: false,
      nodes: [
        { name: "When user triggers workflow", type: "manual", parameters: { options: {} }, position: [-224, 32] },
        { name: "Send a text message", type: "telegram", parameters: { chatId: "1349567450", message: "Hello, telegram worked successfully" }, credentials: { id: "cmg68gjne0001upqour5aju4p" }, position: [-16, 32] },
        { name: "Generate AI content", type: "gemini", parameters: { prompt: "Generate a few lines about Virat greatness", model: "gemini-1.5-flash", temperature: 0.7 }, credentials: { id: "cmg68gout0003upqoyjajdmfb" }, position: [192, 32] },
        { name: "Send email notification", type: "email", parameters: { from: "onboarding@resend.dev", to: "vasantkr97@gmail.com", subject: "workflow executions complete", text: "", html: "" }, credentials: { id: "cmg68hs950007upqotvssa7xc" }, position: [400, 32] }
      ],
      connections: [
        { id: 1, source: "When user triggers workflow", target: "Send a text message" },
        { id: 2, source: "Send a text message", target: "Generate AI content" },
        { id: 3, source: "Generate AI content", target: "Send email notification" }
      ]
    };

    // Map nodes
    const mappedNodes = (wf.nodes || []).map((n: any, idx: number) => {
      const type = (n.type || '').toLowerCase();
      const cfg = getNodeConfig(type);
      const id = n.name || `node-${idx}`;
      const position = Array.isArray(n.position)
        ? { x: n.position[0], y: n.position[1] }
        : { x: 0, y: idx * 120 };
      const params = n.parameters || {};
      const credentialsId = n.credentials?.id;
      return {
        id,
        type,
        position,
        data: {
          ...cfg,
          label: n.name || cfg.label,
          parameters: params,
          credentialsId,
        },
      } as any;
    });

    // Map connections array [{source,target}] to edges
    const mappedEdges = (wf.connections || []).map((c: any, idx: number) => ({
      id: `${c.source}-${c.target}-${idx}`,
      source: c.source,
      target: c.target,
      type: 'n8n-edge',
      data: { itemCount: 1 },
    }));

    setNodes(mappedNodes);
    setEdges(mappedEdges);
    // trigger tracking unused for now
  }, [setNodes, setEdges]);

  return (
        <div className="h-full w-full flex flex-col">
            {/* Workflow Toolbar */}
            <WorkflowToolbar
                workflowTitle={workflowTitle}
                onWorkflowTitleChange={handleWorkflowTitleChange}
                onSaveWorkflow={handleSaveWorkflow}
                onNewWorkflow={handleNewWorkflow}
                onExecuteWorkflow={handleExecuteWorkflow}
                isWorkflowActive={isWorkflowActive}
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
                    onNodeClick={(_event, node) => {
                        setSelectedNode(node);
                        setShowParametersPanel(true);
                    }}
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
                        style={{ backgroundColor: '#000000' }}
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
                            backgroundColor: '#000000', // dark gray canvas
                            border: '1px solid #4b5563', // proper border
                            borderRadius: '8px',    // optional rounding
                        }}
                        zoomable
                        pannable
                    />
                </ReactFlow>
            </div>
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
    );
}
