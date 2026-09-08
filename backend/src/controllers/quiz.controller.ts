import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/api.js';
import { ApiError } from '../utils/api.js';
import { certificateService, quizService } from '../services/quiz.service.js';
import { prisma } from '../config/database.js';

function isPrivileged(role?: string) {
  return role === 'MENTOR' || role === 'ADMIN';
}

export const getQuiz = asyncHandler(async (req: Request, res: Response) => {
  res.json(ok(await quizService.getById(req.params.id, isPrivileged(req.user?.role))));
});

export const listQuizzes = asyncHandler(async (req: Request, res: Response) => {
  const courseId = req.query.courseId as string | undefined;
  if (!courseId) throw new ApiError(400, 'courseId query param required', 'VALIDATION_ERROR');
  res.json(ok(await quizService.listByCourse(courseId, isPrivileged(req.user?.role))));
});

export const createQuiz = asyncHandler(async (req: Request, res: Response) => {
  const quiz = await quizService.create(req.user!.id, req.user!.role === 'ADMIN', req.body);
  res.status(201).json(ok(quiz));
});

export const deleteQuiz = asyncHandler(async (req: Request, res: Response) => {
  await quizService.remove(req.params.id, req.user!.id, req.user!.role === 'ADMIN');
  res.json(ok({ message: 'Quiz deleted' }));
});

export const submitQuiz = asyncHandler(async (req: Request, res: Response) => {
  const attempt = await quizService.submit(req.params.id, req.user!.id, req.body.answers);
  res.status(201).json(ok(attempt));
});

export const myAttempts = asyncHandler(async (req: Request, res: Response) => {
  res.json(ok(await quizService.myAttempts(req.user!.id, req.params.id)));
});

export const submitReview = asyncHandler(async (req: Request, res: Response) => {
  const { rating, comment } = req.body as { rating: number; comment?: string };
  const courseId = req.params.courseId;
  try {
    const review = await prisma.review.create({ data: { userId: req.user!.id, courseId, rating, comment } });
    const agg = await prisma.review.aggregate({ where: { courseId }, _avg: { rating: true }, _count: true });
    await prisma.course.update({
      where: { id: courseId },
      data: { rating: agg._avg.rating ?? 0, reviewsCount: agg._count },
    });
    res.status(201).json(ok(review));
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err?.code === 'P2002') throw new ApiError(409, 'Already reviewed', 'ALREADY_REVIEWED');
    throw e;
  }
});

export const getCertificate = asyncHandler(async (req: Request, res: Response) => {
  const cert = await certificateService.getById(req.params.id);
  if (!cert) throw new ApiError(404, 'Certificate not found', 'CERTIFICATE_NOT_FOUND');
  res.json(ok(cert));
});

export const myCertificates = asyncHandler(async (req: Request, res: Response) => {
  res.json(ok(await certificateService.myCertificates(req.user!.id)));
});

export const verifyCertificate = asyncHandler(async (req: Request, res: Response) => {
  const cert = await certificateService.verifyByNumber(req.params.certificateNumber);
  if (!cert) throw new ApiError(404, 'Invalid certificate number', 'CERTIFICATE_NOT_FOUND');
  res.json(ok({ valid: true, certificate: cert }));
});
