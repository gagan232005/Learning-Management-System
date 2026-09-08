import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { errorMiddleware, notFoundMiddleware } from './middleware/error.middleware.js';
import { generalRateLimiter } from './middleware/rateLimit.middleware.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import courseRoutes, { moduleLessonRouter } from './routes/course.routes.js';
import lessonRoutes from './routes/lesson.routes.js';
import quizRoutes, { certificateRouter } from './routes/quiz.routes.js';
import enrollmentRoutes from './routes/enrollment.routes.js';
import { swaggerDocument } from './config/swagger.js';
import './types/express.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.clientUrl.split(','), credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  if (!env.isProd) app.use(morgan('dev'));
  app.use(generalRateLimiter);

  app.get('/api/health', (_req, res) => {
    res.json({ success: true, data: { status: 'healthy', service: 'LMS MySQL API', version: '2.0.0' } });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/courses', courseRoutes);
  app.use('/api', moduleLessonRouter());
  app.use('/api/lessons', lessonRoutes);
  app.use('/api/quizzes', quizRoutes);
  app.use('/api/enrollments', enrollmentRoutes);
  app.use('/api', certificateRouter());

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use('/api', notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
