import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getReceivedFriendRequest, sendFriendRequest, acceptFriendRequest, deleteFriendRequest } from '../controllers/request.controller.js';

const router = express.Router();

router.get('/get/:id', protectRoute, getReceivedFriendRequest)
router.post('/send', protectRoute, sendFriendRequest)
router.post('/accept/:id', protectRoute, acceptFriendRequest)
router.delete('/delete/:id', protectRoute, deleteFriendRequest)

export default router