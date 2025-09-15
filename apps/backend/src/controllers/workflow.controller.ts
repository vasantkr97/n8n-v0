import { Request, Response} from "express";
import { CreateWorkflowSchema } from "@n8n/validator";
import { prisma } from "@n8n/db";

export const createWorkflow = async (req: Request, res: Response) => {
    try {
        const parsed = CreateWorkflowSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({ success: false, error: parsed.error })
        }

        const { title, isActive, triggerType, webhookId, nodes } = parsed.data;

        const userId  = (req as any).user?.id;

        const workflow = await prisma.workflow.create({
            data: {
                title,
                isActive: isActive ?? false,
                triggerType,
                userId,
                webhookId,
                nodes: {
                       create: nodes?.map((n) => ({
                        nodeId: n.nodeId,
                        type: n.type,
                        position: n.position,
                        parameters: n.parameters,
                        connections: n.connections,
                       })) || []
                },
            },
            include: {
                nodes: true,
                webhook: true
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
                nodes: {
                    select: {
                        id: true,
                        nodeId: true,
                        type: true,
                        position: true
                    }
                },
                webhook: true,
                executions: {
                    select: {
                        id: true,
                        status: true,
                        mode: true,
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    take: 5
                },
                _count: {
                    select: {
                        executions: true,
                        nodes: true
                    }
                }
            },
            orderBy: {
                updatedAt: "desc"
            }
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
        const { userId } = (req as any).user?.id;

        if (!userId) {
            return res.status(400).json({ error: "UserId  is required"})
        };

        const workflow = await prisma.workflow.findUnique({
            where: {
                id: workflowId,
                userId: userId 
            },
            include: {
                nodes: {
                    orderBy: {
                        createdAt: "asc"
                    }
                },
                webhook: true,
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

        const { title, isActive, nodes, triggerType, webhookData } = req.body;

        const existingWorkflow = await prisma.workflow.findFirst({
            where: {
                id: workflowId,
                userId: userId
            },
            include: {
                nodes: true,
                webhook: true
            }
        });

        if (!existingWorkflow) {
            return res.status(404).json({ error: "Workflow not found or access denied"});
        };

        let webhookId: string | null = existingWorkflow.webhookId;
        if(triggerType === "WEBHOOK" && webhookData) {
            if(existingWorkflow.webhook) {
                await prisma.webhook.update({
                    where: { id: existingWorkflow.webhook.id },
                    data: {
                        name: webhookData.name,
                        path: webhookData.path,
                        method: webhookData.method
                    },
                })
            } else {
                const newWebhook = await prisma.webhook.create({
                    data: {
                        name: webhookData.name,
                        path: webhookData.path,
                        method: webhookData.method
                    }
                });
                webhookId = newWebhook.id;
            }
        } else if (triggerType !== "WEBHOOK" && existingWorkflow.webhook) {
            await prisma.webhook.delete({
                where: { id: existingWorkflow.webhook.id }
            });
            webhookId = null;
        }

        await prisma.node.deleteMany({
            where: { workflowId }
        });

        const updatedWorkflow = await prisma.workflow.update({
            where: { id: workflowId },
            data: {
                title: title ?? existingWorkflow.title,
                isActive: isActive ?? existingWorkflow.isActive,
                triggerType: triggerType ?? existingWorkflow.triggerType,
                webhookId,
                nodes: {
                    create: nodes?.map((node: any) => ({
                        nodeId: node.nodeId,
                        title: node.title,
                        position: node.position,
                        parameters: node.parameters,
                        connections: node.connections
                    })) || [],
                }
            },
            include: {
                nodes: true,
                webhook: true
            }
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
    try {
        const { workflowId } = req.params;
        const { userId } = (req as any).user?.id;

        if (userId) {
            return res.status(400).json({ error: "userId is required"});
        };

        const workflow = await prisma.workflow.findFirst({
            where: {
                id: workflowId,
                userId: userId
            },
            include: {
                webhook: true
            }
        })

        if (!workflow) {
            return res.status(404).json({ error: "Workflow not found or access denied"})
        }

        if (workflow.webhook) {
            await prisma.webhook.delete({
                where: {
                    id: workflow.webhook.id
                }
            })
        }

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


