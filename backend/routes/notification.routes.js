import express from 'express';
import { validateAuthorization } from '../middlewares/authorization.middleware.js';
import { deleteNotifications, getNotifications  } from '../controllers/notification.controllers.js';


const router = express.Router();


router.get("/", validateAuthorization, getNotifications);
router.delete("/", validateAuthorization, deleteNotifications);
// router.delete("/:id", validateAuthorization, deleteOneNotifications);



export default router;