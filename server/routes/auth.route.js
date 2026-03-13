import express from 'express';
import { googleAuth, logout } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post("/google", googleAuth);
authRouter.post("/logout", logout);

export default authRouter;