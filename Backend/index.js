import express from 'express'
const app = express();
import cors from 'cors'
import userRoute from './routes/user.js'
import canvasRoute from './routes/canvas.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser';

import {checkToken} from './middlewares/authMiddleware.js'

dotenv.config();

const url = process.env.MONGO_URL;
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5174",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://zenithboard.vercel.app"
  ],
  credentials: true
}));
app.use(cookieParser());

app.use('/api', userRoute);
app.use('/api', checkToken, canvasRoute);

const connectToDB = async () => {
    try {
        await mongoose.connect(url);
        console.log("connected to db");
    }
    catch(err) {
        console.log("Failed to connect to DB")
    }
}

app.listen(3000, () => {
    console.log("listening to server", 3000);
    connectToDB();
})