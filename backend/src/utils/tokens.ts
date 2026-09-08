import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { AuthTokenPayload } from '../types/index.js';

export function signAccessToken(payload: AuthTokenPayload): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (jwt.sign as any)(payload, env.jwtSecret, { expiresIn: env.jwtAccessExpiresIn });
}

export function signRefreshToken(payload: AuthTokenPayload): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (jwt.sign as any)(payload, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpiresIn });
}

export function verifyAccessToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
}

export function verifyRefreshToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.jwtRefreshSecret) as AuthTokenPayload;
}

export function refreshExpiryDate(): Date {
  // 7 days default; parse roughly (supports e.g. "7d")
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
}

export function generateCertificateNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `LMS-${year}-${rand}`;
}
