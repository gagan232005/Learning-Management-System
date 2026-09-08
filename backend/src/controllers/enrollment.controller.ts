import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/api.js';
import { enrollmentService, progressService } from '../services/enrollment.service.js';

export const enroll = asyncHandler(async (req: Request, res: Response) => {
  const enrollment = await enrollmentService.enroll(req.user!.id, req.params.courseId);
  res.status(201).json(ok(enrollment));
});

export const myCourses = asyncHandler(async (req: Request, res: Response) => {
  res.json(ok(await enrollmentService.myCourses(req.user!.id)));
});

export const completeLesson = asyncHandler(async (req: Request, res: Response) => {
  res.json(ok(await progressService.completeLesson(req.user!.id, req.params.lessonId)));
});

export const courseProgress = asyncHandler(async (req: Request, res: Response) => {
  res.json(ok(await progressService.courseProgress(req.user!.id, req.params.courseId)));
});
