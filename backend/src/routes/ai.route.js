import express from 'express'
import { AIChat } from '../controllers/ai.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router()

router.post("/aichat",protectRoute,AIChat);

export default router;