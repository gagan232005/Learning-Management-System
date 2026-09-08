import { Router } from 'express';
import { myCourses } from '../controllers/enrollment.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/my-courses', authMiddleware, myCourses);

export default router;
