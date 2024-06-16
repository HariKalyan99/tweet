import express from 'express';
import { validateAuthorization } from '../middlewares/authorization.middleware.js';
import { createPost, deletePost } from '../controllers/post.controllers.js';

const router = express.Router();


router.post("/create", validateAuthorization, createPost);
// router.post("/like/:id", validateAuthorization, likeUnlikePost);
// router.post("/comment/:id", validateAuthorization, commentOnPost);
router.delete("/delete/:id", validateAuthorization, deletePost);


export default router;