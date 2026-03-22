import express from "express";
import { upload } from "../middlewares/multer";
import { analyzeResume } from "../controllers/interview.controller.js";
import { isAuth } from "../middlewares/auth.js";

const interviewRouter = express.Router();

interviewRouter.post("/resume",isAuth,upload.single("resume"), analyzeResume);

export default interviewRouter;