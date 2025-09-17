import { ReactFlow, Controls, Background } from "@xyflow/react";
import '@xyflow/react/dist/style.css';

const initialNodes = [
    {
      id: 'n1',
      position: { x: 100, y: 100 },
      data: { label: 'Node 1' },
      type: 'input',
    },
    {
      id: 'n2',
      position: { x: 300, y: 300 },
      data: { label: 'Node 2' },
    },
  ];

export default function WorkflowEditor() {

    return (
        <div style={{ height: "100%", width: "100%"}}>
            <ReactFlow nodes={initialNodes}>
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    )
}