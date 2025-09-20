import { Request, Response} from "express";
import { prisma } from "@n8n/db";

export const createWorkflow = async (req: Request, res: Response) => {
    try {
        const { title, isActive, triggerType, nodes, connections } = req.body;

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

