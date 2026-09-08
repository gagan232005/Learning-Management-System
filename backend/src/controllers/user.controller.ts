import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/api.js';
import { userService } from '../services/user.service.js';

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const [users, total] = await userService.list(req.query as never);
  const page = Number((req.query as Record<string, string>).page ?? 1);
  const limit = Number((req.query as Record<string, string>).limit ?? 10);
  res.json(ok({ users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }));
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  res.json(ok(await userService.getById(req.params.id)));
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  res.json(ok(await userService.update(req.user!.id, req.body)));
});

export const adminUpdateUser = asyncHandler(async (req: Request, res: Response) => {
  res.json(ok(await userService.update(req.params.id, req.body)));
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await userService.remove(req.params.id);
  res.json(ok({ message: 'User deleted' }));
});

export const systemAnalytics = asyncHandler(async (_req: Request, res: Response) => {
  res.json(ok(await userService.analytics()));
});
