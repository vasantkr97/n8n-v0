import { prisma } from "@n8n/db";
import { ExecutionContext, WorkflowConnection, WorkflowNode } from "../types/executionTypes";
import { executeTelegramAction } from "./nodeExecutors/telegramExecutor";
import { executeEmailAction } from "./nodeExecutors/emailExecutor";
import { executeGeminiAction } from "./nodeExecutors/geminiExecutor";
import { WatchDirectoryFlags } from "typescript";


export async function executeWorkflow(
    workflowId: string,
    userId: string,
    mode: "MANUAL",
): Promise<string> {

    const workflow = await prisma.workflow.findFirst({
        where: {
            id: workflowId,
        },
        
    })

    if (!workflow) {
        throw new Error("Workflow not found")
    };

    if (!workflow.isActive) {
        await prisma.workflow.update({
            where: { id: workflowId},
            data: {
                isActive: true,
            }
        })
    }


    const execution = await prisma.execution.create({
        data: {
            workflowId,
            userId,
            mode: mode as any,
            status: "PENDING",
            startedAt: new Date(),
            data: {}
        }
    })

    executeInBackground(execution.id, workflowId, userId);

    return execution.id
};


async function executeInBackground(
    executionId: string,
    workflowId: string,
    userId: string,
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
            mode: "MANUAL",
            data: {},
            nodeResults: {}
        }

        const triggerNode =  nodes.find(node => node.type === "Trigger")

        if (!triggerNode) {
            throw new Error("no trigger node found");
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
    const nodeResult = await executeNode(currentNode, context)
    
    //store the complete node result for future reference
    context.nodeResults[currentNode.name] = nodeResult

    //Update context data with the latest successfull node result for immediate next access
    if (nodeResult && nodeResult.success && nodeResult.data) {
        context.data = nodeResult.data;
    }

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
    console.log(`Executing node: ${node.name} (${node.type})`);

    if (node.type === "Trigger") {
        return {
            success: true,
            data: context.data,
            timeStamp: new Date().toISOString()
        }
    }
    let credentialId = null;
    if (node.credentials) {
        //the credentials object contains the credentials ID directly

        if (typeof node.credentials === 'string') {
            //if credentials is a string, its the ID
            credentialId = node.credentials;
        } else if (node.credentials.id) {
            //if credentials is an object with an id property
            credentialId = node.credentials.id;
        } else {
            //if credentials is an object where the key maps to the ID
            const credentialKey = Object.keys(node.credentials)[0];
            const credentialsInfo = node.credentials[credentialKey];

          if (typeof credentialsInfo === "string") {
            credentialId = credentialsInfo;
          } else if( credentialsInfo && credentialsInfo.id){
            credentialId = credentialsInfo.id
          }
        }
        console.log("credentials id:", JSON.stringify(credentialId, null ,2));
    }

    //Route tp appropriate executor
    if (node.type.toLowerCase().includes("telegram")) {
        return await executeTelegramAction(node, context, credentialId);
    } else if (node.type.toLowerCase().includes('email')) {
        return await executeEmailAction(node, context, credentialId);
    } else if (node.type.toLowerCase().includes("gemini")) {
        return await executeGeminiAction(node, context, credentialId);
    };

    return {
        success: true,
        data: { message: `Generic node ${node.name} executed`}
    }
}