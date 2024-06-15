import express from 'express';
import { validateAuthorization } from '../middlewares/authorization.middleware.js';
import { getUserProfile, followUnfollowUser, getSuggestedUsers, updateUserProfile } from '../controllers/user.controllers.js';

const router = express.Router();


router.get("/profile/:username",validateAuthorization, getUserProfile);
router.get("/suggested", validateAuthorization, getSuggestedUsers)
router.post("/follow/:id",validateAuthorization, followUnfollowUser);
router.post("/update", validateAuthorization, updateUserProfile);


export default router;