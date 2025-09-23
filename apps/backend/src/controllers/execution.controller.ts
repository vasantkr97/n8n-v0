import { Request, Response } from "express";
import { prisma } from "@n8n-v0/db";
import { executeWorkflow } from "../engine/executeWorkflow";

export const manualExecute = async (req: Request, res: Response) => {
  try {
      const { workflowId } = req.params;
      const triggerData = req.body;
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

      //checking is workflow is active
      if (!workflow.isActive) {
          return res.status(400).json({ error: "Workflow is not active"});
      }

      const executionId = await executeWorkflow(workflowId, userId, "MANUAL", triggerData)

  
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

export const getExecutionById = async (req: Request, res: Response) => {
  try {
    const executionId = req.body;
    const userId = req.user!.id;

    if (!userId) {
      return res.status(400).json({ message: "user id is required"})
    };
    
    const execution = await prisma.execution.findFirst({
      where: { id:executionId, userId };
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
      return res.status(400).json({msg: "Execution not Found or Access denied!"})
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
}

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
