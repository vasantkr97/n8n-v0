import { Request, Response } from "express";
import { prisma } from "@n8n-v0/db";

// Get execution history for a workflow
export const getExecutionHistory = async (req: Request, res: Response) => {
  try {
    const { workflowId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const executions = await prisma.execution.findMany({
      where: {
        workflowId: workflowId,
        userId: req.user!.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: parseInt(limit as string),
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      include: {
        workflow: {
          select: {
            title: true
          }
        }
      }
    });

    const total = await prisma.execution.count({
      where: {
        workflowId: workflowId,
        userId: req.user!.id
      }
    });

    res.json({
      executions,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error("Get execution history error:", error);
    res.status(500).json({ error: "Failed to fetch execution history" });
  }
};

// Get execution status
export const getExecutionStatus = async (req: Request, res: Response) => {
  try {
    const { executionId } = req.params;

    const execution = await prisma.execution.findFirst({
      where: {
        id: executionId,
        userId: req.user!.id
      },
      include: {
        workflow: {
          select: {
            title: true
          }
        }
      }
    });

    if (!execution) {
      return res.status(404).json({ error: "Execution not found" });
    }

    res.json(execution);
  } catch (error) {
    console.error("Get execution status error:", error);
    res.status(500).json({ error: "Failed to fetch execution status" });
  }
};

// Cancel execution
export const cancelExecution = async (req: Request, res: Response) => {
  try {
    const { executionId } = req.params;

    // Find the execution
    const execution = await prisma.execution.findFirst({
      where: {
        id: executionId,
        userId: req.user!.id
      }
    });

    if (!execution) {
      return res.status(404).json({ error: "Execution not found" });
    }

    if (execution.status !== 'RUNNING' && execution.status !== 'PENDING') {
      return res.status(400).json({ error: "Cannot cancel execution that is not running" });
    }

    // Update execution status to cancelled (we'll add CANCELLED to enum later)
    const updatedExecution = await prisma.execution.update({
      where: {
        id: executionId
      },
      data: {
        status: 'FAILED', // Using FAILED for now, we can add CANCELLED later
        // finishedAt: new Date(), // TODO: Regenerate Prisma client if this field exists in schema
        // results: {
        //   error: "Execution cancelled by user",
        //   cancelled: true
        // } // TODO: Regenerate Prisma client if this field exists in schema
      }
    });

    res.json({
      message: "Execution cancelled successfully",
      execution: updatedExecution
    });
  } catch (error) {
    console.error("Cancel execution error:", error);
    res.status(500).json({ error: "Failed to cancel execution" });
  }
};

// Get all executions for user
export const getAllExecutions = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, status, workflowId } = req.query;

    const where: any = {
      userId: req.user!.id
    };

    if (status) {
      where.status = status;
    }

    if (workflowId) {
      where.workflowId = workflowId;
    }

    const executions = await prisma.execution.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      take: parseInt(limit as string),
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      include: {
        workflow: {
          select: {
            title: true,
            triggerType: true
          }
        }
      }
    });

    const total = await prisma.execution.count({
      where
    });

    res.json({
      executions,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error("Get all executions error:", error);
    res.status(500).json({ error: "Failed to fetch executions" });
  }
};

// Delete execution
export const deleteExecution = async (req: Request, res: Response) => {
  try {
    const { executionId } = req.params;

    // Check if execution exists and belongs to user
    const execution = await prisma.execution.findFirst({
      where: {
        id: executionId,
        userId: req.user!.id
      }
    });

    if (!execution) {
      return res.status(404).json({ error: "Execution not found" });
    }

    // Delete the execution
    await prisma.execution.delete({
      where: {
        id: executionId
      }
    });

    res.json({ message: "Execution deleted successfully" });
  } catch (error) {
    console.error("Delete execution error:", error);
    res.status(500).json({ error: "Failed to delete execution" });
  }
};

// Get execution statistics
export const getExecutionStats = async (req: Request, res: Response) => {
  try {
    const { workflowId } = req.query;

    const where: any = {
      userId: req.user!.id
    };

    if (workflowId) {
      where.workflowId = workflowId;
    }

    const stats = await prisma.execution.groupBy({
      by: ['status'],
      where,
      _count: {
        status: true
      }
    });

    const totalExecutions = await prisma.execution.count({
      where
    });

    const recentExecutions = await prisma.execution.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      take: 5,
      include: {
        workflow: {
          select: {
            title: true
          }
        }
      }
    });

    const statusStats = stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.status;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      total: totalExecutions,
      statusBreakdown: statusStats,
      recentExecutions
    });
  } catch (error) {
    console.error("Get execution stats error:", error);
    res.status(500).json({ error: "Failed to fetch execution statistics" });
  }
};
