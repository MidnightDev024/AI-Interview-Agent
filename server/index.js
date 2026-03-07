import express from 'express';
import connectDB from './config/connectDB.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();


const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    return res.send({message: "Server Started"});
})

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
    connectDB();
})