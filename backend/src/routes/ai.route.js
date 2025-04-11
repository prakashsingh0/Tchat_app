import express from 'express'
import { AIChat } from '../controllers/ai.controller.js';

const router = express.Router()

router.post("/aichat",AIChat);

export default router;