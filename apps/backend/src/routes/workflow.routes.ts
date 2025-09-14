import express, { Response, Request } from "express";

const router = express.Router();


router.post("/createWorkflow", )

router.get("/getallWorkflows", )

router.get("/getWorkflowById/:workflowId", )

router.post("/manual/run/:workflowId", )

router.put("/updateWorkflow/:workflowId", )

router.delete("/deleteWorkflow/:workflow",)

export default router;