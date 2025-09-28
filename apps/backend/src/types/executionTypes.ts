
export interface WorkflowNode {
    id: string,
    name: string,
    type: "Trigger" | "Action"
    parameters: Record<string, any>;
    positiond: [number, number]
    webhook?: string,
    credentials?: Record<string, {id: string, name: string} >
}

export interface WorkflowConnection {
    [nodeName: string]: {
        main: Array<Array<{ node: string, type: string }>>
    }
};

export interface ExecutionContext {
    executionId: string,
    workflowId: string,
    userId: string,
    mode: "MANUAL" | "WEBHOOK",
    nodeResults: Record<string, any>
}