import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/auth.routes.js'
import connectToMongo from './db/connectMongoDb.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8082

app.use("/api/auth", authRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectToMongo();
})