import { Router } from 'express';
import {
  createCourse,
  createLesson,
  createModule,
  deleteCourse,
  getCourse,
  listCourses,
  listLessons,
  listModules,
  updateCourse,
} from '../controllers/course.controller.js';
import { courseProgress, enroll, myCourses } from '../controllers/enrollment.controller.js';
import { submitReview } from '../controllers/quiz.controller.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.middleware.js';
import { requireRoles } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createCourseSchema,
  createLessonSchema,
  createModuleSchema,
  listCoursesQuerySchema,
  updateCourseSchema,
} from '../validators/course.validator.js';
import { createReviewSchema } from '../validators/quiz.validator.js';

const router = Router();

router.get('/', optionalAuth, validate(listCoursesQuerySchema, 'query'), listCourses);
router.get('/:id', optionalAuth, getCourse);
router.post('/', authMiddleware, requireRoles('MENTOR'), validate(createCourseSchema), createCourse);
router.put('/:id', authMiddleware, requireRoles('MENTOR'), validate(updateCourseSchema), updateCourse);
router.delete('/:id', authMiddleware, requireRoles('MENTOR'), deleteCourse);

router.get('/:courseId/modules', optionalAuth, listModules);
router.post('/:courseId/modules', authMiddleware, requireRoles('MENTOR'), validate(createModuleSchema), createModule);

router.post('/:courseId/enroll', authMiddleware, enroll);
router.get('/:courseId/progress', authMiddleware, courseProgress);
router.post('/:courseId/reviews', authMiddleware, requireRoles('STUDENT'), validate(createReviewSchema), submitReview);

export default router;

// Sub-routers mounted in app.ts for modules/lessons/enrollments to match required URL shapes:
export function moduleLessonRouter() {
  const r = Router();
  r.get('/modules/:moduleId/lessons', optionalAuth, listLessons);
  r.post('/modules/:moduleId/lessons', authMiddleware, requireRoles('MENTOR'), validate(createLessonSchema), createLesson);
  r.get('/enrollments/my-courses', authMiddleware, myCourses);
  return r;
}
