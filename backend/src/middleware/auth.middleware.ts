import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/tokens.js';
import { ApiError } from '../utils/api.js';
import { prisma } from '../config/database.js';

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authentication required', 'UNAUTHORIZED'));
  }
  const token = header.slice(7);
  Promise.resolve()
    .then(async () => {
      const payload = verifyAccessToken(token);
      const user = await prisma.user.findUnique({ where: { id: payload.userId } });
      if (!user || user.status !== 'ACTIVE') {
        throw new ApiError(401, 'Invalid session', 'UNAUTHORIZED');
      }
      req.user = { id: user.id, role: user.role as never, email: user.email };
      next();
    })
    .catch((err) => {
      if (err instanceof ApiError) return next(err);
      return next(new ApiError(401, 'Invalid or expired token', 'UNAUTHORIZED'));
    });
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next();
  try {
    const payload = verifyAccessToken(header.slice(7));
    req.user = { id: payload.userId, role: payload.role as never, email: payload.email };
  } catch {
    // ignore — treat as anonymous
  }
  return next();
}
