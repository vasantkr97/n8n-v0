import { prisma } from "@n8n/db";
import { ExecutionContext, WorkflowConnection, WorkflowNode } from "../types/executionTypes";
import { executeTelegramAction } from "./nodeExecutors/telegramExecutor";
import { executeEmailAction } from "./nodeExecutors/emailExecutor";
import { executeGeminiAction } from "./nodeExecutors/geminiExecutor";


export async function executeWorkflow(
    workflowId: string,
    userId: string,
    mode: "MANUAL" | "WEBHOOK" | "CRON",
    triggerData: any | {}
): Promise<string> {


    const execution = await prisma.execution.create({
        data: {
            workflowId,
            userId,
            mode: mode as any,
            status: "PENDING",
            data: triggerData,
            startedAt: new Date()
        }
    })

    executeInBackground(execution.id, workflowId, userId, mode, triggerData);

    return execution.id
};


async function executeInBackground(
    executionId: string,
    workflowId: string,
    userId: string,
    mode: string,
    triggerData: any
) {

    try {
        await prisma.execution.update({
            where: { id: executionId },
            data: { status: "RUNNING"}
        })

        const workflow = await prisma.workflow.findUnique({
            where: { id: workflowId }
        })

        if (!workflow) {
            throw new Error("Workflow not found")
        };

        const nodes = workflow.nodes as unknown as WorkflowNode[];
        const connections = workflow.connections as unknown as WorkflowConnection;

        //create execution Context
        const context: ExecutionContext = {
            workflowId,
            executionId,
            userId,
            mode: mode as any,
            data: triggerData,
            nodeResults: {}
        };

        //finding trigger node
        const triggerNode =  nodes.find(node => node.type === "Trigger");
        if (!triggerNode) {
            throw new Error("node trigger node found");
        }

        //Execute trigger node starting from trigger node
        const results = await executeNodeChain(triggerNode, nodes, connections, context)

        await prisma.execution.update({
            where: { id: executionId },
            data: {
                status: "SUCCESS",
                results,
                finishedAt: new Date()
            }
        })
    } catch (error: any) {
        await prisma.execution.update({
            where: { id: executionId },
            data: {
                status: "FAILED",
                results: { error: error.message},
                finishedAt: new Date()
            }
        })
    }

}


async function executeNodeChain(
    currentNode: WorkflowNode,
    allNodes: WorkflowNode[],
    connections: WorkflowConnection,
    context: ExecutionContext,
): Promise<any> {

    //execute Current Node

    const nodeResult = executeNode(currentNode, context)
    context.nodeResults[currentNode.name] = nodeResult

    //get next node from Connections
    const nodeConnections = connections[currentNode.name]
    if (!nodeConnections || !nodeConnections.main) {
        return nodeResult
    };

    for (const connectionGroup of nodeConnections.main) {
        for (const connection of connectionGroup) {
            const nextNode = allNodes.find(node => node.name === connection.node);
            if (nextNode) {
                await executeNodeChain(nextNode, allNodes, connections, context)
            }
        }
    }

    return context.nodeResults;
};


async function executeNode(node: WorkflowNode, context: ExecutionContext): Promise<any> {
    console.log(`Executing node: ${node.name} (${node}.type)`);

    if (node.type === "Trigger") {
        return {
            success: true,
            data: context.data,
            timeStamp: new Date().toISOString()
        }
    }
    
    let credentials = null;
    if (node.credentials) {
        const credentialKey = Object.keys(node.credentials)[0];
        const credentialInfo = node.credentials[credentialKey];

        credentials = await prisma.credentials.findUnique({
            where: { id: credentialInfo.id}
        });
    }

    //Route tp appropriate executor
    if (node.name.toLowerCase().includes("telegram")) {
        return await executeTelegramAction(node, context, credentials);
    } else if (node.name.toLowerCase().includes('email')) {
        return await executeEmailAction(node, context, credentials);
    } else if (node.name.toLowerCase().includes("gemini")) {
        return await executeGeminiAction(node, context, credentials);
    };

    return {
        success: true,
        data: { message: `Generic node ${node.name} executed`}
    }
}