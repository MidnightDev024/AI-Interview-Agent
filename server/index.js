import express from 'express';
import connectDB from './config/connectDB.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'; 

dotenv.config();
app.use(cors({
    origin: 'http://localhost:3000', // Adjust this to your frontend URL
     credentials: true
}))

app.use(express.json());
app.use(cookieParser())

app.use("/api/auth", authRouter);


const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
    connectDB();
})