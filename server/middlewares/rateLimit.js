import rateLimit from "express-rate-limit";

export const resumeRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many resume analysis requests. Please wait and try again." },
});

export const interviewRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many interview requests. Please wait and try again." },
});
