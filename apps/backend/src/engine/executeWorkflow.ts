import { prisma } from "@n8n/db";
import { ExecutionContext, WorkflowConnection, WorkflowNode } from "../types/executionTypes";
import { executeTelegramAction } from "./nodeExecutors/telegramExecutor";
import { executeEmailAction } from "./nodeExecutors/emailExecutor";
import { executeGeminiAction } from "./nodeExecutors/geminiExecutor";

export async function executeWorkflow(
    workflowId: string,
    userId: string,
    mode: "MANUAL" | "WEBHOOK",
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

    executeInBackground(execution.id, workflowId, userId, mode);
    return execution.id
};


async function executeInBackground(
    executionId: string,
    workflowId: string,
    userId: string,
    mode: "MANUAL" | "WEBHOOK"
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
        const connections = workflow.connections as unknown as WorkflowConnection[];

        console.log("📋 Execution data:");
        console.log(`  - Nodes: ${nodes.length}`);
        console.log(`  - Connections: ${connections.length}`);
        console.log("  - Nodes:", JSON.stringify(nodes, null, 2));
        console.log("  - Connections:", JSON.stringify(connections, null, 2));

        //create execution Context
        const context: ExecutionContext = {
            workflowId,
            executionId,
            userId,
            mode: mode,
            data: {},
            nodeResults: {}
        }

        // Find trigger node - check for various trigger types
        const triggerTypes = ["trigger", "manual", "webhook", "schedule", "cron"];
        const triggerNode = nodes.find(node => 
            triggerTypes.includes(node.type?.toLowerCase() || "")
        );

        if (!triggerNode) {
            throw new Error("No trigger node found. Please add a trigger node (webhook, manual, or schedule) to your workflow.");
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
        console.error("❌ Execution failed:", error);
        console.error("Error stack:", error.stack);
        await prisma.execution.update({
            where: { id: executionId },
            data: {
                status: "FAILED",
                results: { 
                    error: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString()
                },
                finishedAt: new Date()
            }
        })
    }

}


async function executeNodeChain(
    currentNode: WorkflowNode,
    allNodes: WorkflowNode[],
    connections: WorkflowConnection[],
    context: ExecutionContext,
): Promise<any> {
    //execute Current Node
    const nodeResult = await executeNode(currentNode, context)
    
    //store the complete node result for future reference
    context.nodeResults[currentNode.name] = nodeResult

    //Update context data with the latest successfull node result for immediate next access
    if (nodeResult && nodeResult.success && nodeResult.data) {
        context.data = nodeResult.data;
    };

    const nextEdges = connections.filter(
        (conn) => conn.source === currentNode.name,
    );

    if(!nextEdges.length) {
        return nodeResult
    };

    for (const edges of nextEdges) {
        const nextNode = allNodes.find((node) => node.name === edges.target);
        if (nextNode) {
            await executeNodeChain(nextNode, allNodes, connections, context)
        }
    }

    //get next node from Connections
    //N8N style connections
    // const nodeConnections = connections[currentNode.name]
    // if (!nodeConnections || !nodeConnections.main) {
    //     return nodeResult
    // };

    // for (const connectionGroup of nodeConnections.main) {
    //     for (const connection of connectionGroup) {
    //         const nextNode = allNodes.find(node => node.name === connection.node);
    //         if (nextNode) {
    //             await executeNodeChain(nextNode, allNodes, connections, context)
    //         }
    //     }
    // }

    return context.nodeResults;
};


async function executeNode(node: WorkflowNode, context: ExecutionContext): Promise<any> {
    console.log(`\n🔄 Executing node: ${node.name} (${node.type})`);
    console.log(`  - Node data:`, JSON.stringify(node, null, 2));

    // Check if this is a trigger node
    const triggerTypes = ["trigger", "manual", "webhook", "schedule", "cron"];
    if (triggerTypes.includes(node.type?.toLowerCase() || "")) {
        console.log(`  ✅ Trigger node executed`);
        return {
            success: true,
            data: context.data,
            timeStamp: new Date().toISOString()
        }
    }
    
    let credentialId = null;
    if (node.credentials) {
        console.log(`  🔑 Credentials found:`, JSON.stringify(node.credentials, null, 2));
        
        if (typeof node.credentials === 'string') {
            credentialId = node.credentials;
            console.log(`  → Extracted as string: ${credentialId}`);
        } else if (node.credentials.id) {
            credentialId = node.credentials.id;
            console.log(`  → Extracted from .id property: ${credentialId}`);
        } else {
            const credentialKey = Object.keys(node.credentials)[0];
            const credentialsInfo = node.credentials[credentialKey];
            console.log(`  → Trying key: ${credentialKey}, value:`, credentialsInfo);

            if (typeof credentialsInfo === "string") {
                credentialId = credentialsInfo;
                console.log(`  → Extracted from key as string: ${credentialId}`);
            } else if (credentialsInfo && credentialsInfo.id) {
                credentialId = credentialsInfo.id;
                console.log(`  → Extracted from key.id: ${credentialId}`);
            }
        }
        
        if (!credentialId) {
            console.error(`  ❌ Failed to extract credential ID from:`, node.credentials);
        } else {
            console.log(`  ✅ Final credential ID: ${credentialId}`);
        }
    } else {
        console.log(`  ⚠️  No credentials attached to this node`);
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