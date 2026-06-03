// import express from 'express';
// import connectDB from './config/connectDB.js';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import authRouter from './routes/auth.route.js';
// import userRouter from './routes/user.route.js';
// import interviewRouter from './routes/interview.route.js';
// import PaymentRouter from './routes/payment.route.js';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// const allowedOrigins = [
//     'https://ai-interview-agent-client-bgax.onrender.com',
//     'https://ai-interview-agent-1-0h0w.onrender.com'
// ];

// app.use(cors({
//     origin: function(origin, callback) {
//         // allow requests with no origin (like mobile apps or curl)
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.indexOf(origin) !== -1) {
//             return callback(null, true);
//         } else {
//             return callback(new Error('CORS policy: This origin is not allowed'));
//         }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
// }));

// app.use(express.json());
// app.use(cookieParser());

// app.use("/api/auth", authRouter);
// app.use("/api/user", userRouter);  
// app.use("/api/interview", interviewRouter); 
// app.use("/api/payment", PaymentRouter); 

// app.listen(PORT, () => {
//     console.log(`Server running on PORT ${PORT}`);
//     connectDB();
// });

// import express from 'express';
// import connectDB from './config/connectDB.js';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import authRouter from './routes/auth.route.js';
// import userRouter from './routes/user.route.js';
// import interviewRouter from './routes/interview.route.js';
// import PaymentRouter from './routes/payment.route.js';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // 1. Keep your production domains, but add flexibility for local mobile testing
// const allowedOrigins = [
//     'https://ai-interview-agent-client-bgax.onrender.com',
//     'https://ai-interview-agent-1-0h0w.onrender.com',
//     'http://localhost:3000',
//     'http://localhost:5173'
// ];

// // 2. Updated CORS configuration to handle mobile requests cleanly
// app.use(cors({
//     origin: function(origin, callback) {
//         // Allow requests with no origin (like mobile apps, curl, or specific mobile file uploads)
//         if (!origin) return callback(null, true);
        
//         // Check if the origin matches our allowed list, OR if we are in development mode
//         const isAllowed = allowedOrigins.indexOf(origin) !== -1;
//         const isDevelopment = process.env.NODE_ENV !== 'production' || origin.startsWith('http://192.168.');

//         if (isAllowed || isDevelopment) {
//             return callback(null, true);
//         } else {
//             return callback(new Error('CORS policy: This origin is not allowed'));
//         }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "Cookie"] // Explicitly allowed for mobile pre-flight checks
// }));

// app.use(express.json());
// app.use(cookieParser());

// app.use("/api/auth", authRouter);
// app.use("/api/user", userRouter);  
// app.use("/api/interview", interviewRouter); 
// app.use("/api/payment", PaymentRouter); 

// app.listen(PORT, () => {
//     console.log(`Server running on PORT ${PORT}`);
//     connectDB();
// });

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

// 1. Keep your production domains, but add flexibility for local mobile testing
const allowedOrigins = [
    'https://ai-interview-agent-client-bgax.onrender.com',
    'https://ai-interview-agent-1-0h0w.onrender.com',
    'http://localhost:3000',
    'http://localhost:5173'
];

// 2. Updated CORS configuration to handle mobile requests cleanly
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or specific mobile file uploads)
        if (!origin) return callback(null, true);
        
        // Check if the origin matches our allowed list, OR if we are in development mode
        const isAllowed = allowedOrigins.indexOf(origin) !== -1;
        const isDevelopment = process.env.NODE_ENV !== 'production' || origin.startsWith('http://192.168.');

        if (isAllowed || isDevelopment) {
            return callback(null, true);
        } else {
            return callback(new Error('CORS policy: This origin is not allowed'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"] // Explicitly allowed for mobile pre-flight checks
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