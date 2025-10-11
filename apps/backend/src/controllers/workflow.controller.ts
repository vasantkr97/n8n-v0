import { Request, Response} from "express";
import { prisma } from "@n8n/db";
import crypto from "crypto";

// Generate a secure random webhook token
function generateWebhookToken(): string {
  return crypto.randomBytes(32).toString('hex'); // 64-character hex string
}

export const createWorkflow = async (req: Request, res: Response) => {
    try {
        const { title, isActive, triggerType, nodes, connections } = req.body;

        const userId = req.user?.id
        if (!userId) {
            return res.status(400).json({ msg: "User not authenticated"})
        };

        if (!title || !triggerType) {
            return res.status(400).json({ msg: "title and tirggerType are required"})
        }
     
        // Ensure nodes and connections are arrays
        const workflowNodes = Array.isArray(nodes) ? nodes : [];
        const workflowConnections = Array.isArray(connections) ? connections : [];

        console.log(`📝 Creating workflow "${title}"`);
        console.log(`  - Nodes: ${workflowNodes.length}`);
        console.log(`  - Connections: ${workflowConnections.length}`);
        console.log(`  - Connections data:`, JSON.stringify(workflowConnections, null, 2));

        // Generate webhook token if trigger type is WEBHOOK
        const webhookToken = triggerType === 'WEBHOOK' ? generateWebhookToken() : null;

        const workflow = await prisma.workflow.create({
            data: {
                title,
                isActive: isActive ?? false,
                triggerType,
                userId,
                nodes: workflowNodes,
                connections: workflowConnections,
                webhookToken,
            }
        });

        console.log(`✅ Workflow created with ID: ${workflow.id}`);

        res.status(201).json({
            success: true,
            data: workflow
        })
    } catch (error) {
        console.error("❌ Error creating workflow:", error);
        res.status(500).json({ error: "interval server error at Creating workflow"})
    }
};

export const getallWorkflows = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

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
        const userId = req.user?.id;

        console.log(`📖 Fetching workflow ${workflowId} for user ${userId}`);

        if (!userId) {
            return res.status(400).json({ error: "UserId  is required"})
        };

        if (!workflowId) {
            return res.status(400).json({ error: "Workflow ID is required" });
        }

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
            console.log(`❌ Workflow ${workflowId} not found or access denied`);
            return res.status(404).json({ error: "Workflow not found or access denied"});
        };

        // Log workflow data being returned
        const nodes = workflow.nodes as any;
        const connections = workflow.connections as any;
        console.log(`✅ Workflow ${workflowId} found:`);
        console.log(`  - Title: ${workflow.title}`);
        console.log(`  - Nodes: ${Array.isArray(nodes) ? nodes.length : 'Not an array!'}`);
        console.log(`  - Connections: ${Array.isArray(connections) ? connections.length : 'Not an array!'}`);
        if (Array.isArray(connections)) {
            console.log(`  - Connections data:`, JSON.stringify(connections, null, 2));
        } else {
            console.log(`  - ⚠️ Connections is not an array:`, connections);
        }

        res.status(200).json({
            success: true,
            data: workflow
        })
    } catch(error) {
        console.error("❌ Error fetching workflow using Id:", error);
        res.status(500).json({ error: "internal server error while getting workflow using Id"})
    }
};

export const updateWorkflow = async (req: Request, res: Response) => {
    try {
        const { workflowId } = req.params;
        const userId = (req as any).user?.id

        if (!userId) {
            return res.status(500).json({ msg: "user not found"})
        };

        if (!workflowId) {
            return res.status(400).json({ msg: "WorkflowId is requried"})
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

        console.log(`📝 Updating workflow ${workflowId}`);
        if (nodes !== undefined) {
            const workflowNodes = Array.isArray(nodes) ? nodes : [];
            console.log(`  - Nodes: ${workflowNodes.length}`);
        }
        if (connections !== undefined) {
            const workflowConnections = Array.isArray(connections) ? connections : [];
            console.log(`  - Connections: ${workflowConnections.length}`);
            console.log(`  - Connections data:`, JSON.stringify(workflowConnections, null, 2));
        }

        // Prepare update data, ensuring arrays remain arrays
        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (triggerType !== undefined) {
            updateData.triggerType = triggerType;
            // Generate webhook token if changing to WEBHOOK and doesn't have one
            if (triggerType === 'WEBHOOK' && !existingWorkflow.webhookToken) {
                updateData.webhookToken = generateWebhookToken();
                console.log(`  - Generated new webhook token`);
            }
        }
        if (nodes !== undefined) updateData.nodes = Array.isArray(nodes) ? nodes : [];
        if (connections !== undefined) updateData.connections = Array.isArray(connections) ? connections : [];
        
        const updatedWorkflow = await prisma.workflow.update({
            where: { id: workflowId },
            data: updateData,
        });
        
        console.log(`✅ Workflow ${workflowId} updated successfully`);

        res.status(200).json({
            success: true,
            data: updatedWorkflow
        });

    } catch (error) {
        console.error("❌ Error while updating the workflow:", error);
        return res.status(500).json({ error: "Internal server error"})
    }
};

export const deleteWorkflow = async (req: Request, res: Response) => {
    console.log("request from client")
    try {
        const { workflowId } = req.params;
        const userId  = req.user?.id;

        if (!userId) {
            return res.status(400).json({ error: "userId is required"});
        };

        if (!workflowId) {
            return res.status(400).json({ error: "Workflow ID is required" });
        }

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

