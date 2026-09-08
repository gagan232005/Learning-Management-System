import { Router } from 'express';
import {
  createQuiz,
  deleteQuiz,
  getCertificate,
  getQuiz,
  listQuizzes,
  myAttempts,
  myCertificates,
  submitQuiz,
  verifyCertificate,
} from '../controllers/quiz.controller.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.middleware.js';
import { requireRoles } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createQuizSchema, submitQuizSchema } from '../validators/quiz.validator.js';

const router = Router();

// Quizzes
router.get('/', optionalAuth, listQuizzes);
router.get('/:id', optionalAuth, getQuiz);
router.post('/', authMiddleware, requireRoles('MENTOR'), validate(createQuizSchema), createQuiz);
router.delete('/:id', authMiddleware, requireRoles('MENTOR'), deleteQuiz);
router.post('/:id/submit', authMiddleware, validate(submitQuizSchema), submitQuiz);
router.get('/:id/attempts', authMiddleware, myAttempts);

export default router;

export function certificateRouter() {
  const r = Router();
  r.get('/users/me/certificates', authMiddleware, myCertificates);
  r.get('/certificates/verify/:certificateNumber', verifyCertificate);
  r.get('/certificates/:id', authMiddleware, getCertificate);
  return r;
}
