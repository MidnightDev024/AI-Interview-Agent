import express from "express";
import { upload } from "../middlewares/multer.js";
import { analyzeResume, finishInterview, genrateQuestions, getInterviewReport, getMyInterviews, submitAnswer } from "../controllers/interview.controller.js";
import isAuth from "../middlewares/isAuth.js";

const interviewRouter = express.Router();

interviewRouter.post("/resume",isAuth,upload.single("resume"), analyzeResume);
interviewRouter.post("/generate-questions",isAuth, genrateQuestions);
interviewRouter.post("/submit-answer",isAuth,submitAnswer);
interviewRouter.post("/finish", isAuth, finishInterview);
interviewRouter.get("/get-interview", isAuth, getMyInterviews);
interviewRouter.get("/report/:interviewId", isAuth, getInterviewReport);

export default interviewRouter;