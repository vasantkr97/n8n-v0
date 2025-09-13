import express from 'express';
import { auth } from '../middleware/auth';
import { me, profile, signin, signout, signup } from '../controllers/auth.controller';

const router = express.Router();

router.post("/signup", signup);

router.post("/signin", signin);

router.post("/signout", signout);

router.use(auth);

router.get("/profile", profile);

router.get('/me', me)

export default router;