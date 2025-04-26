import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import { getFriend, removeFriend } from '../controllers/friend.controller.js';

const router = express.Router();

router.get('/get', protectRoute, getFriend)
router.delete('/remove/:id', protectRoute, removeFriend)

export default router