import { Router } from 'express';
import { completeLesson } from '../controllers/enrollment.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/:lessonId/complete', authMiddleware, completeLesson);

export default router;
