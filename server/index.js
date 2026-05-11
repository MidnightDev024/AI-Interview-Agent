import express from 'express';
import connectDB from './config/connectDB.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import interviewRouter from './routes/interview.route.js';
import PaymentRouter from './routes/payment.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'https://ai-interview-agent-client-bgax.onrender.com',
    'https://ai-interview-agent-1-0h0w.onrender.com'
];

const isAllowedOrigin = (origin) => {
    if (allowedOrigins.includes(origin)) return true;
    if (/^https:\/\/ai-interview-agent(?:-client)?-[a-z0-9-]+\.onrender\.com$/i.test(origin)) return true;
    if (/^https?:\/\/localhost(?::\d+)?$/i.test(origin)) return true;
    if (/^https?:\/\/127\.0\.0\.1(?::\d+)?$/i.test(origin)) return true;
    return false;
};

app.use(cors({
    origin: function(origin, callback) {
        // allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (isAllowedOrigin(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('CORS policy: This origin is not allowed'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);  
app.use("/api/interview", interviewRouter); 
app.use("/api/payment", PaymentRouter); 

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
    connectDB();
});
