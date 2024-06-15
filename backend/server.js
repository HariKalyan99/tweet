import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import express from 'express';
import authRoutes from './routes/auth.routes.js'
import connectToMongo from './db/connectMongoDb.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8082

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectToMongo();
})