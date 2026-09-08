import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/api.js';
import type { Role } from '../types/index.js';

export function requireRoles(...allowed: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new ApiError(401, 'Authentication required', 'UNAUTHORIZED'));
    if (req.user.role === 'ADMIN') return next(); // admin bypass
    if (!allowed.includes(req.user.role as Role)) {
      return next(new ApiError(403, 'Forbidden: insufficient role', 'FORBIDDEN'));
    }
    return next();
  };
}
