import request from 'supertest';
import jwt from 'jsonwebtoken';

jest.mock('../src/config/database', () => ({
  prisma: {
    user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn(), findMany: jest.fn(), count: jest.fn() },
    refreshToken: { create: jest.fn(), findUnique: jest.fn(), delete: jest.fn(), deleteMany: jest.fn() },
    course: { findMany: jest.fn(), count: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
    module: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn() },
    lesson: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), count: jest.fn() },
    enrollment: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    lessonProgress: { upsert: jest.fn(), count: jest.fn(), findMany: jest.fn() },
    quiz: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), delete: jest.fn() },
    quizAttempt: { create: jest.fn(), findMany: jest.fn(), count: jest.fn() },
    certificate: { create: jest.fn(), findFirst: jest.fn(), findUnique: jest.fn(), findMany: jest.fn(), count: jest.fn() },
    review: { create: jest.fn(), aggregate: jest.fn() },
    badge: { findUnique: jest.fn() },
    userBadge: { create: jest.fn() },
    xpEvent: { create: jest.fn() },
    $transaction: jest.fn(async (fn: (tx: unknown) => unknown) => fn((global as unknown as { __tx: unknown }).__tx ?? {})),
  },
  connectDatabase: jest.fn(),
  disconnectDatabase: jest.fn(),
}));

import { prisma } from '../src/config/database';
import { createApp } from '../src/app';

export const mockPrisma = prisma as unknown as Record<string, Record<string, jest.Mock>> & { $transaction: jest.Mock };
export { request, createApp, jwt };
