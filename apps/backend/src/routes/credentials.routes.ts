import  express, { type Request, Response } from "express";
import { postCredentials, getCredentials, updateCredentials, deleteCredentials, getCredentialById } from "../controllers/credentials.controller";
import { auth } from "../middleware/auth";

const router = express.Router()

router.use(auth);

router.post("/postCredentials", postCredentials);

router.get("/getCredentials", getCredentials);

router.get("/getCredentiaslById/:id", getCredentialById);

router.put("/updateCred/:id", updateCredentials);

router.delete("/deleteCred/:id", deleteCredentials);

export default router;