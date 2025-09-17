import  express, { type Request, Response } from "express";
import { postCredentials, getCredentials, updateCredentials, deleteCredentials } from "../controllers/credentials.controller";
import { auth } from "../middleware/auth";

const router = express.Router()

router.use(auth);

router.post("/postCred", postCredentials);

router.get("/getCred", getCredentials);

router.put("/updateCred/:CredId", updateCredentials);

router.delete("/deleteCred/:id", deleteCredentials);

export default router;