import express from "express";
import { upload } from "../middlewares/multer.js";
import { analyzeResume, finishInterview, genrateQuestions, getInterviewReport, getMyInterviews, submitAnswer } from "../controllers/interview.controller.js";
import isAuth from "../middlewares/isAuth.js";
import { interviewRateLimit, resumeRateLimit } from "../middlewares/rateLimit.js";

const interviewRouter = express.Router();

interviewRouter.post("/resume", resumeRateLimit, isAuth, upload.single("resume"), analyzeResume);
interviewRouter.post("/generate-questions", interviewRateLimit, isAuth, genrateQuestions);
interviewRouter.post("/submit-answer", interviewRateLimit, isAuth, submitAnswer);
interviewRouter.post("/finish", interviewRateLimit, isAuth, finishInterview);
interviewRouter.get("/get-interview", interviewRateLimit, isAuth, getMyInterviews);
interviewRouter.get("/report/:interviewId", interviewRateLimit, isAuth, getInterviewReport);

export default interviewRouter;