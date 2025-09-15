import express, { Response, Request } from "express";
import { createWorkflow, deleteWorkflow, ExecuteManually, getallWorkflows, getWorkflowById, updateWorkflow } from "../controllers/workflow.controller";
import { auth } from "../middleware/auth";
const router = express.Router();



router.post("/createWorkflow",auth, createWorkflow)

router.get("/getallWorkflows",auth, getallWorkflows)

router.get("/getWorkflowById/:workflowId",auth, getWorkflowById)

router.post("/manual/run/:workflowId",auth, ExecuteManually)

router.put("/updateWorkflow/:workflowId",auth, updateWorkflow)

router.delete("/deleteWorkflow/:workflowId",auth, deleteWorkflow)

export default router;