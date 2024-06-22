import express from 'express';
import { validateAuthorization } from '../middlewares/authorization.middleware.js';
import { createPost, deletePost,commentOnPost, likeUnlikePost, getAllPosts, getlikedPosts, getFollowingPosts, getUserPosts } from '../controllers/post.controllers.js';

const router = express.Router();

router.get("/all", validateAuthorization, getAllPosts);
router.get("/following", validateAuthorization, getFollowingPosts);
router.get("/likes/:id", validateAuthorization, getlikedPosts);
router.get("/user/:username", validateAuthorization, getUserPosts);
router.post("/create", validateAuthorization, createPost);
router.post("/like/:id", validateAuthorization, likeUnlikePost);
router.post("/comment/:id", validateAuthorization, commentOnPost);
router.delete("/delete/:id", validateAuthorization, deletePost);


export default router;