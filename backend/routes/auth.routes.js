import express from 'express';
import { authLogin, authLogout, authSignup, getMe } from '../controllers/auth.controllers.js';
import { validateAuthorization } from '../middlewares/authorization.middleware.js';


const router = express.Router();

router.get("/me", validateAuthorization ,getMe)
router.post("/signup", authSignup)
router.post("/login", authLogin)
router.post("/logout", authLogout)

export default router;