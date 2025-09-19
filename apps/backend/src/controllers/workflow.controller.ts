import { Request, Response} from "express";
import { prisma } from "@n8n/db";

export const createWorkflow = async (req: Request, res: Response) => {
    try {
        const { title, isActive, triggerType, webhook, nodes, connections } = req.body;

        const userId = req.user!.id
        if (!userId) {
            return res.status(400).json({ msg: "User not authenticated"})
        };
     

        const workflow = await prisma.workflow.create({
            data: {
                title,
                isActive: isActive ?? false,
                triggerType,
                userId,
                nodes: nodes ?? {},
                connections: connections ?? {},
            }
        });

        res.status(201).json({
            success: true,
            data: workflow
        })
    } catch (error) {
        console.error("Error creating workflow:", error);
        res.status(500).json({ error: "interval server error at Creating workflow"})
    }
};

export const getallWorkflows = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "userId is requried"});
        }

        const workflows = await prisma.workflow.findMany({
            where: {
                userId: userId as string
            },
            include: {
                executions: {
                    select: { id: true, status: true, mode: true },
                    orderBy: { createdAt: "desc" },
                    take: 5
                },
                _count: { select: { executions: true } },
            },
            orderBy: {  updatedAt: "desc" }
        });

        res.status(200).json({
            success: true,
            data: workflows,
            count: workflows.length
        })
    } catch (error) {
        console.error("Error fetching workflows:", error)
        res.status(500).json({ error: "Internal server error while fetching allworkflows"})
    }
};

export const getWorkflowById = async (req: Request, res: Response) => {
    try {
        const { workflowId } = req.params;
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(400).json({ error: "UserId  is required"})
        };

        const workflow = await prisma.workflow.findUnique({
            where: {
                id: workflowId,
                userId: userId 
            },
            include: {
                executions: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 10
                },
                user: {
                    select: {
                        id: true,
                        email: true
                    }
                }
            }
        });

        if (!workflow) {
            return res.status(404).json({ error: "Workflow not found or access denied"});
        };

        res.status(200).json({
            success: true,
            data: workflow
        })
    } catch(error) {
        console.error("Error fetching workflow ising Id:", error);
        res.status(500).json({ error: "internal server error while getting workflow using Id"})
    }
};

export const updateWorkflow = async (req: Request, res: Response) => {
    try {
        const { workflowId } = req.params;
        const userId = (req as any).user?.id

        if (!userId) {
            return res.status(500).json({ msg: "user not found"})
        }

        const { title, isActive, nodes, triggerType, connections } = req.body;

        const existingWorkflow = await prisma.workflow.findFirst({
            where: {
                id: workflowId,
                userId
            }
        });

        if (!existingWorkflow) {
            return res.status(404).json({ error: "Workflow not found or access denied"});
        };

        
        const updatedWorkflow = await prisma.workflow.update({
            where: { id: workflowId },
            data: {
                title: title ?? existingWorkflow.title,
                isActive: isActive ?? existingWorkflow.isActive,
                triggerType: triggerType ?? existingWorkflow.triggerType,
                nodes: nodes ?? existingWorkflow.nodes,
                connections: connections ?? existingWorkflow.connections,
            },
        });
        
        res.status(200).json({
            success: true,
            data: updatedWorkflow
        });

    } catch (error) {
        console.error("Error while updating the workflow:", error);
        return res.status(500).json({ error: "Internal server error"})
    }
};

export const deleteWorkflow = async (req: Request, res: Response) => {
    console.log("request from client")
    try {
        const { workflowId } = req.params;
        const userId  = (req as any).user?.id;

        if (!userId) {
            return res.status(400).json({ error: "userId is required"});
        };

        const workflow = await prisma.workflow.findFirst({
            where: {
                id: workflowId,
                userId: userId
            }
        })

        if (!workflow) {
            return res.status(404).json({ error: "Workflow not found or access denied"})
        };

        await prisma.workflow.delete({
            where: { id: workflowId }
        });

        res.status(200).json({
            success: true,
            message: "Workflow deleted successfully"
        })
    } catch(error) {
        console.log("Error deleting workflow:", error);
        res.status(500).json({ error: "Internal server error while deleting workflow"})
    }
};

export const ExecuteManually = async (req: Request, res: Response) => {
    try {
        const { workflowId } = req.params;
        const { inputData } = req.body;
        const userId = req.user!.id; // Get userId from authenticated user

        const workflow = await prisma.workflow.findFirst({
            where: {
                id: workflowId,
                userId: userId
            },
            include: {
                nodes: true
            }
        });

        if (!workflow) {
            return res.status(404).json({ error: "Workflow not found or access denied"});
        }

        //checking is workflow is active
        if (!workflow.isActive) {
            return res.status(400).json({ error: "Workflow is not active"});
        }

        const execution = await prisma.execution.create({
            data: {
                status: "PENDING",
                mode: "MANUAL",
                data: {
                    inputData: inputData || {},
                    startedAt: new Date(),
                    nodes: workflow.nodes.map(node => ({
                        nodeId: node.nodeId, //use frontend nodeId for tracking
                        type: node.type,
                    }))
                },
                workflowId,
                userId
            }
        });

        await prisma.execution.update({
            where: { id: execution.id },
            data: {
                status: "RUNNING",
                data: {
                    ...execution.data as any,
                }
            }
        });

        // Simulate execution completion after a delay (in a real app, this would be handled by a workflow engine)
        setTimeout(async () => {
            try {
                await simulateWorkflowExecution(execution.id, workflow);
            } catch (error) {
                console.error("Error in workflow simulation:", error);
            }
        }, 2000); // Start simulation after 2 seconds

        res.status(200).json({
            success: true,
            data: {
                executionId: execution.id,
                status: "RUNNING",
                message: "Workflow execution started"
            }
        })
    } catch (error) {
        console.error("Error  running workflow:", error);
        res.status(500).json({ error: "Internal server error"})
    }
}

// Simulate workflow execution (in a real app, this would be handled by a proper workflow engine)
async function simulateWorkflowExecution(executionId: string, workflow: any) {
    try {
        const nodes = workflow.nodes;
        const executionResults: any = {
            nodeResults: {},
            totalNodesExecuted: 0,
            totalDuration: 0
        };

        // Simulate executing each node sequentially
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const startTime = Date.now();
            
            // Simulate node execution time (1-3 seconds)
            const executionTime = Math.random() * 2000 + 1000;
            await new Promise(resolve => setTimeout(resolve, executionTime));
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            // Simulate node execution result
            const nodeResult = {
                nodeId: node.nodeId,
                type: node.type,
                status: Math.random() > 0.1 ? 'SUCCESS' : 'FAILED', // 90% success rate
                startedAt: new Date(startTime),
                finishedAt: new Date(endTime),
                duration,
                data: {
                    input: node.parameters,
                    output: {
                        message: `Node ${node.nodeId} executed successfully`,
                        timestamp: new Date(),
                        data: generateMockNodeOutput(node.type)
                    }
                }
            };
            
            executionResults.nodeResults[node.nodeId] = nodeResult;
            executionResults.totalNodesExecuted++;
            executionResults.totalDuration += duration;
            
            // If a node fails, stop execution
            if (nodeResult.status === 'FAILED') {
                await prisma.execution.update({
                    where: { id: executionId },
                    data: {
                        status: 'FAILED',
                        finishedAt: new Date(),
                        results: {
                            ...executionResults,
                            error: `Node ${node.nodeId} failed during execution`,
                            failedNodeId: node.nodeId
                        }
                    }
                });
                return;
            }
        }

        // If all nodes succeed, mark execution as successful
        await prisma.execution.update({
            where: { id: executionId },
            data: {
                status: 'SUCCESS',
                finishedAt: new Date(),
                results: {
                    ...executionResults,
                    success: true,
                    message: 'Workflow executed successfully'
                }
            }
        });

    } catch (error) {
        console.error("Simulation error:", error);
        // Mark execution as failed if simulation itself fails
        await prisma.execution.update({
            where: { id: executionId },
            data: {
                status: 'FAILED',
                finishedAt: new Date(),
                results: {
                    error: 'Execution simulation failed',
                    details: String(error)
                }
            }
        });
    }
}

// Generate mock output data based on node type
function generateMockNodeOutput(nodeType: string) {
    switch (nodeType.toLowerCase()) {
        case 'http':
            return {
                statusCode: 200,
                headers: { 'content-type': 'application/json' },
                body: { message: 'HTTP request successful', timestamp: new Date() }
            };
        case 'email':
            return {
                messageId: `msg-${Date.now()}`,
                recipients: ['user@example.com'],
                subject: 'Workflow notification',
                delivered: true
            };
        case 'webhook':
            return {
                webhookId: `wh-${Date.now()}`,
                payload: { received: true, timestamp: new Date() }
            };
        case 'manual':
            return {
                triggered: true,
                timestamp: new Date(),
                user: 'manual-trigger'
            };
        default:
            return {
                processed: true,
                timestamp: new Date(),
                nodeType
            };
    }
}
