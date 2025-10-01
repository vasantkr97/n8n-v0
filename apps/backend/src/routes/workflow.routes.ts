import express, { Response, Request } from "express";
import { createWorkflow, deleteWorkflow, getallWorkflows, getWorkflowById, updateWorkflow } from "../controllers/workflow.controller";
import {  manualExecute, webhookExecute } from "../controllers/execution.controller";
import { auth } from "../middleware/auth";
const router = express.Router();

router.use(auth)

router.post("/createWorkflow", createWorkflow);

router.get("/getallWorkflows", getallWorkflows);

router.get("/getWorkflowById/:workflowId", getWorkflowById);

router.post("/manual/run/:workflowId", manualExecute);

router.put("/updateWorkflow/:workflowId", updateWorkflow);

router.delete("/deleteWorkflow/:workflowId", deleteWorkflow);

export default router;