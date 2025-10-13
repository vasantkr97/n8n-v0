import { prisma } from "@n8n/db";
import { ExecutionContext, WorkflowConnection, WorkflowNode } from "../types/executionTypes";
import { executeTelegramAction } from "./nodeExecutors/telegramExecutor";
import { executeEmailAction } from "./nodeExecutors/emailExecutor";
import { executeGeminiAction } from "./nodeExecutors/geminiExecutor";

// Helper function to safely clone data and avoid circular references
function safeClone(obj: any, maxDepth: number = 10, depth: number = 0, seen: WeakSet<any> = new WeakSet()): any {
    if (depth > maxDepth) {
        return '[Max Depth Reached]';
    }
    
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    if (obj instanceof Date) {
        return obj;
    }
    
    // Check for circular reference
    if (seen.has(obj)) {
        return '[Circular Reference]';
    }
    
    // Mark this object as seen
    seen.add(obj);
    
    if (Array.isArray(obj)) {
        return obj.map(item => safeClone(item, maxDepth, depth + 1, seen));
    }
    
    const cloned: any = {};
    
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = safeClone(obj[key], maxDepth, depth + 1, seen);
        }
    }
    
    return cloned;
}

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
                results: safeClone(results),
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
    previousNodeId?: string,
    visitedNodes: Set<string> = new Set()
): Promise<any> {
    // Get unique identifier for current node
    const currentKey = (currentNode as any).id || currentNode.name;
    
    // Check if we've already visited this node to prevent infinite loops
    if (visitedNodes.has(currentKey)) {
        console.log(`⚠️  Cycle detected: Node ${currentNode.name} (${currentKey}) already visited. Skipping to prevent infinite loop.`);
        return context.nodeResults[currentNode.name];
    }
    
    // Mark this node as visited
    visitedNodes.add(currentKey);
    
    //execute Current Node
    const nodeResult = await executeNode(currentNode, context, previousNodeId)
    
    // Use safeClone to prevent circular references
    const safeNodeResult = safeClone(nodeResult);
    
    //store the complete node result for future reference (support duplicate names)
    if (context.nodeResults[currentNode.name]) {
        const existing = context.nodeResults[currentNode.name];
        if (Array.isArray(existing)) {
            existing.push(safeNodeResult);
        } else {
            context.nodeResults[currentNode.name] = [existing, safeNodeResult];
        }
    } else {
        context.nodeResults[currentNode.name] = safeNodeResult;
    }

    // Update context data map keyed by node id for targeted lookups
    if (nodeResult && nodeResult.success && nodeResult.data !== undefined) {
        const key = (currentNode as any).id || currentNode.name;
        if (!context.data) (context as any).data = {} as any;
        (context.data as any)[key] = safeClone(nodeResult.data);
    }

    // Support connections by id or by name (backward compatibility)
    const nextEdges = connections.filter(
        (conn) => conn.source === currentKey || conn.source === currentNode.name,
    );

    if(!nextEdges.length) {
        return nodeResult
    };

    // Execute each distinct target once. Match nodes by id or by name.
    const targetKeys = Array.from(new Set(nextEdges.map(e => e.target)));
    const candidateNextNodes = allNodes.filter(n => {
        const nodeId = (n as any).id;
        // prefer id match; fall back to name for older workflows
        return (nodeId && targetKeys.includes(nodeId as any)) || targetKeys.includes(n.name);
    });

    for (const nextNode of candidateNextNodes) {
        const currentNodeId = (currentNode as any).id || currentNode.name;
        // Pass the visitedNodes set to track cycles across the entire execution path
        await executeNodeChain(nextNode, allNodes, connections, context, currentNodeId, visitedNodes)
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


async function executeNode(node: WorkflowNode, context: ExecutionContext, previousNodeId?: string): Promise<any> {
    console.log(`\n🔄 Executing node: ${node.name} (${node.type})`);

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

    //Route to appropriate executor
    if (node.type.toLowerCase().includes("telegram")) {
        return await executeTelegramAction(node, context, credentialId, previousNodeId);
    } else if (node.type.toLowerCase().includes('email')) {
        return await executeEmailAction(node, context, credentialId, previousNodeId);
    } else if (node.type.toLowerCase().includes("gemini")) {
        return await executeGeminiAction(node, context, credentialId, previousNodeId);
    };

    return {
        success: true,
        data: { message: `Generic node ${node.name} executed`}
    }
}