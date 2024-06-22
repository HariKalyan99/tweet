dotenv.config();
import path from 'path';
import {v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import express from 'express';
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import postRoutes from './routes/post.routes.js'
import notificationRoutes from './routes/notification.routes.js'
import connectToMongo from './db/connectMongoDb.js';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key :process.env.CLOUDINARY_API_KEY,
    api_secret :process.env.CLOUDINARY_API_SECRET
})

const app = express();
const PORT = process.env.PORT || 8082

const __dirname = path.resolve()

app.use(express.json({limit: '5mb'}))
app.use(cookieParser())
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (request, response) => {
        response.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectToMongo();
})