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

    // Verify workflow exists
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
        userId: userId
      },
    });

    if (!workflow) {
      return res.status(404).json({ error: "Workflow not found or access denied"});
    }

    const executionId = await executeWorkflow(workflowId, userId, "WEBHOOK");

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

// Public webhook endpoint with token authentication
// Token can be passed as query param (?token=xxx) or header (X-Webhook-Token)
export const publicWebhookExecute = async (req: Request, res: Response) => {
  try {
    const { workflowId } = req.params;
    
    // Get token from query parameter or header
    const tokenFromQuery = req.query.token as string;
    const tokenFromHeader = req.headers['x-webhook-token'] as string;
    const providedToken = tokenFromQuery || tokenFromHeader;

    console.log(`🔗 Public webhook triggered for workflow: ${workflowId}`);

    if (!providedToken) {
      return res.status(401).json({ 
        success: false,
        error: "Webhook token is required. Please provide token in query parameter (?token=xxx) or X-Webhook-Token header."
      });
    }

    // Verify workflow exists, is active, and token matches
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
        isActive: true, // Only allow execution if workflow is active
        webhookToken: providedToken // Token must match
      },
    });

    if (!workflow) {
      console.log(`❌ Webhook authentication failed for workflow: ${workflowId}`);
      return res.status(403).json({ 
        success: false,
        error: "Invalid webhook token or workflow not found/inactive. Please check your token and ensure the workflow is active."
      });
    }

    console.log(`✅ Webhook authenticated for workflow: ${workflowId}`);

    // Execute the workflow with the workflow owner's userId
    const executionId = await executeWorkflow(workflowId, workflow.userId, "WEBHOOK");

    return res.status(200).json({
      success: true,
      data: {
        executionId,
        message: "Webhook executed successfully",
        workflowId: workflowId
      }
    })
  } catch (error: any) {
    console.error('❌ Public webhook execution error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || "Failed to execute webhook"
    })
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
    const { status, workflowId, mode } = req.query;

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
  });

    const total = await prisma.execution.count({
      where
    });

    res.json({
      executions,
    });
  } catch (error) {
    console.error("Get all executions error:", error);
    res.status(500).json({ error: "Failed to fetch executions" });
  }
};

export const getWorkFlowExecution = async (req: Request, res: Response) => {
  try {
    const { workflowId } = req.params;
    const { status } = req.query;
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
    });

    const totalCount = await prisma.execution.count({
      where: whereClause,
    })

    return res.status(200).json({
      success: true,
      data: executions,
      count: executions.length,
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

    console.log(`🗑️ Deleting execution ${executionId} for user ${userId}`);

    if (!userId) {
      return res.status(400).json({ error: "User not Authenticated"});
    };

    const execution = await prisma.execution.findFirst({
      where: { id: executionId, userId }
    });

    if (!execution) {
      console.log(`❌ Execution ${executionId} not found or access denied`);
      return res.status(404).json({ error: "Execution not found or access denied"})
    }

    await prisma.execution.delete({
      where: {
        id: executionId,
      }
    });

    console.log(`✅ Execution ${executionId} deleted successfully`);
    return res.status(200).json({ 
      success: true, 
      message: "Execution deleted successfully" 
    });

  } catch (error: any) {
    console.error("❌ Error while deleting execution:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error while deleting execution",
      message: error.message
    }) 
  }
}

