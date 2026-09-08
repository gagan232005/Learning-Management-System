import { Router } from 'express';
import { adminUpdateUser, deleteUser, getUser, listUsers, systemAnalytics, updateProfile } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRoles } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { adminUpdateUserSchema, listUsersQuerySchema, updateUserSchema } from '../validators/user.validator.js';

const router = Router();

router.get('/', authMiddleware, requireRoles('ADMIN'), validate(listUsersQuerySchema, 'query'), listUsers);
router.get('/analytics', authMiddleware, requireRoles('ADMIN'), systemAnalytics);
router.get('/:id', authMiddleware, getUser);
router.patch('/me', authMiddleware, validate(updateUserSchema), updateProfile);
router.patch('/:id', authMiddleware, requireRoles('ADMIN'), validate(adminUpdateUserSchema), adminUpdateUser);
router.delete('/:id', authMiddleware, requireRoles('ADMIN'), deleteUser);

export default router;
