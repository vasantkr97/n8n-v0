import type { NodeData, NodeType } from "./node.types";

export interface Workflow {
    id: string;
    name: string;
    description?: string;
    nodes: WorkflowNode[];
    connections: WorkflowConnection[];
    active: boolean;
    createdAt: string;
    updated: string;
}

export interface WorkflowNode {
    id: string;
    type: NodeType;
    position: { X: number, y: number};
    data: NodeData;
}

export interface WorkflowConnection {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
}
