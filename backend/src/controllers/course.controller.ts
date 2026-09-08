import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/api.js';
import { courseService, lessonService, moduleService } from '../services/course.service.js';

export const listCourses = asyncHandler(async (req: Request, res: Response) => {
  const [courses, total] = await courseService.list(req.query as never);
  const page = Number((req.query as Record<string, string>).page ?? 1);
  const limit = Number((req.query as Record<string, string>).limit ?? 10);
  res.json(ok({ courses, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }));
});

export const getCourse = asyncHandler(async (req: Request, res: Response) => {
  res.json(ok(await courseService.getById(req.params.id)));
});

export const createCourse = asyncHandler(async (req: Request, res: Response) => {
  const course = await courseService.create(req.user!.id, req.body);
  res.status(201).json(ok(course));
});

export const updateCourse = asyncHandler(async (req: Request, res: Response) => {
  const course = await courseService.update(req.params.id, req.user!.id, req.user!.role === 'ADMIN', req.body);
  res.json(ok(course));
});

export const deleteCourse = asyncHandler(async (req: Request, res: Response) => {
  await courseService.remove(req.params.id, req.user!.id, req.user!.role === 'ADMIN');
  res.json(ok({ message: 'Course deleted' }));
});

export const listModules = asyncHandler(async (req: Request, res: Response) => {
  res.json(ok(await moduleService.listByCourse(req.params.courseId)));
});

export const createModule = asyncHandler(async (req: Request, res: Response) => {
  const mod = await moduleService.create(req.params.courseId, req.user!.id, req.user!.role === 'ADMIN', req.body);
  res.status(201).json(ok(mod));
});

export const listLessons = asyncHandler(async (req: Request, res: Response) => {
  res.json(ok(await lessonService.listByModule(req.params.moduleId)));
});

export const createLesson = asyncHandler(async (req: Request, res: Response) => {
  const lesson = await lessonService.create(req.params.moduleId, req.user!.id, req.user!.role === 'ADMIN', req.body);
  res.status(201).json(ok(lesson));
});
