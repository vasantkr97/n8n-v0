import { Request, Response } from "express";
import { prisma } from "@n8n/db";
import { executeWorkflow } from "../engine/executeWorkflow";

export const manualExecute = async (req: Request, res: Response) => {
  try {
      const { workflowId } = req.params;
      const userId = req.user!.id; // Get userId from authenticated user

      if (!userId) {
        return res.status(400).json({ error: "User not authenticated"});
      }

      const workflow = await prisma.workflow.findFirst({
          where: {
              id: workflowId,
              userId: userId
          },
      });

      if (!workflow) {
          return res.status(404).json({ error: "Workflow not found or access denied"});
      }

      const executionId = await executeWorkflow(workflowId, userId, "MANUAL")

  
      res.status(200).json({
          success: true,
          data: {
              executionId: executionId,
              message: "Workflow execution started"
          }
      })
  } catch (error) {
      console.error("Error  running workflow:", error);
      res.status(500).json({ error: "Internal server error"})
  }
};

export const webhookExecute = async (req: Request, res: Response) => {
  try {
    const { workflowId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ msg: "User is not Authenticated."})
    };

    const executionId = executeWorkflow(workflowId, userId, "WEBHOOK");

    return res.status(200).json({
      success: true,
      data: {
        executionId,
        message: "webhook workflow triggered successfully"
      }
    })
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message})
  }
}

export const getExecutionById = async (req: Request, res: Response) => {
  try {
  const { executionId }= req.params;
    const userId = req.user!.id;

    if (!userId) {
      return res.status(400).json({ message: "user id is required"})
    };
    
    const execution = await prisma.execution.findFirst({
      where: { id:executionId, userId },
      include: {
        workflow: {
          select: {
            id: true,
            title: true,
            triggerType: true
          }
        }
      }
    })

    if (!execution) {
      return res.status(404).json({msg: "Execution not Found or Access denied!"})
    }

    res.status(200).json({
      success: true,
      data: execution
    });
    
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      msg: "Interval server error while fetching execution By id"
    })
  }
};

// Get all executions for user
export const getAllExecutions = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 20, status, workflowId, mode } = req.query;

    const where: any = {
      userId
    };

    if (status) {
      where.status = status;
    }

    if (workflowId) {
      where.workflowId = workflowId;
    };

    if (mode) {
      where.mode = mode;
    }

    const executions = await prisma.execution.findMany({
      where,
      include: {
        workflow: {
          select: {
            id: true,
            title: true,
            triggerType: true
          }
        }
      ,
    },
    orderBy: { createdAt: "desc"},
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
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

export const getWorkFlowExecution = async (req: Request, res: Response) => {
  try {
    const { workflowId } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    const userId = req.user!.id;

    if (!userId) {
      return res.status(401).json({ msg: "User not Authenticated"})
    }
    //checking if workflow belong to user
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
        userId
      }
    })

    if(!workflow) {
      return res.status(500).json({ msg: "workflow not found or access denied"})
    };

    const whereClause: any = {
      workflowId,
      userId
    };

    if (status) {
      whereClause.status = status;
    }

    const executions = await prisma.execution.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc"
      },
      skip: (Number(page)-1)*Number(limit),
      take: Number(limit)
    });

    const totalCount = await prisma.execution.count({
      where: whereClause,
    })

    return res.status(200).json({
      success: true,
      data: executions,
      count: executions.length,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total:totalCount,
        totalPages: Math.ceil(totalCount/Number(page)),
      }
    })

  } catch (error: any) {
    console.error("Error while fetching the Workflow Executions", error);
    return res.status(500).json({ error: "Internal Server Error while fetching the workflow executions"})
  }
}

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
export const stopExecution = async (req: Request, res: Response) => {
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
        finishedAt: new Date(),
        results: {
          error: "Execution cancelled by user",
          cancelled: true
        }
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

export const deleteExecution = async (req: Request, res: Response) => {
  try {
    const { executionId } = req.params;
    const userId = req.user!.id;

    if (!userId) {
      return res.status(400).json({ msg: "User not Authenticated"});
    };

    const execution = await prisma.execution.findFirst({
      where: { id: executionId, userId }
    });

    if (!execution) {
      return res.status(404).json({ msg: "Execution not found or access denied"})
    }

     await prisma.execution.delete({
      where: {
        id: executionId,
      }
    })

    return res.status(200).json({ success: true, msg: "Execution deleted"})

  } catch (error: any) {
    console.error("Error while deleting execution:", error);
    return res.status(500).json({
      error: "Internal server error while deleting execution",
      msg: error.message
    }) 
  }
}

