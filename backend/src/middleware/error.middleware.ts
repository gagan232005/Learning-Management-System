import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/api.js';
import { env } from '../config/env.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: 'VALIDATION_ERROR',
      details: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
  }
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ success: false, message: err.message, error: err.code });
  }
  // Prisma known errors
  const anyErr = err as { code?: string; message?: string };
  if (anyErr?.code === 'P2002') {
    return res.status(409).json({ success: false, message: 'Duplicate record', error: 'CONFLICT' });
  }
  if (anyErr?.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Record not found', error: 'NOT_FOUND' });
  }
  if (!env.isProd) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  return res.status(500).json({ success: false, message: 'Internal server error', error: 'INTERNAL_ERROR' });
}

export function notFoundMiddleware(_req: Request, res: Response) {
  return res.status(404).json({ success: false, message: 'Route not found', error: 'NOT_FOUND' });
}
