import express from 'express';
import { authLogin, authLogout, authSignup } from '../controllers/auth.controllers.js';


const router = express.Router();


router.get("/signup", authSignup)
router.get("/login", authLogin)
router.get("/logout", authLogout)

export default router;