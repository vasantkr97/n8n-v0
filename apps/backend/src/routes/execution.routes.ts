import express from "express";
import { auth } from "../middleware/auth";
import {
  getExecutionHistory,
  getExecutionStatus,
  cancelExecution,
  getAllExecutions,
  deleteExecution,
  getExecutionStats
} from "../controllers/execution.controller";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// Get execution statistics
router.get("/stats", getExecutionStats);

// Get all executions for user (with filtering)
router.get("/", getAllExecutions);

// Get execution history for a specific workflow
router.get("/workflow/:workflowId", getExecutionHistory);

// Get specific execution status
router.get("/:executionId", getExecutionStatus);

// Cancel execution
router.post("/cancel/:executionId", cancelExecution);

// Delete execution
router.delete("/:executionId", deleteExecution);

export default router;