import express from "express";
import { auth } from "../middleware/auth";
import { deleteExecution, getAllExecutions, getExecutionById, getExecutionStatus, getWorkFlowExecution, manualExecute, stopExecution, webhookExecute, publicWebhookExecute } from "../controllers/execution.controller";
import { getWorkflowById } from "../controllers/workflow.controller";


const router = express.Router();

// Public webhook endpoint - NO authentication required
// Must be defined BEFORE auth middleware
router.post("/webhook/:workflowId", publicWebhookExecute);

// Apply authentication middleware to all routes below
router.use(auth);

//execute workflow manually
router.post("/workflow/:workflowId/execute", manualExecute);

router.post("/webhookExecute/:workflowId", webhookExecute)

// get all executions for authenticated user
router.get("/list", getAllExecutions);

// Get execution history for a specific workflow 
router.get("/workflow/:workflowId/history", getWorkFlowExecution);

// Get detailed information for specific execution by Id
router.get("/:executionId/details", getExecutionById);

router.get("/:executionId/status", getExecutionStatus);

// Cancel/stop a running or pending execution
router.post("/:executionId/cancel", stopExecution);

// Delete execution
router.delete("/:executionId", deleteExecution);

export default router;