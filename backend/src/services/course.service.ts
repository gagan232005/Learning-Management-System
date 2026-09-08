import { prisma } from '../config/database.js';
import { ApiError } from '../utils/api.js';
import { courseRepository } from '../repositories/course.repository.js';

export const courseService = {
  list(query: Parameters<typeof courseRepository.list>[0]) {
    return courseRepository.list(query);
  },

  async getById(id: string) {
    const course = await courseRepository.findById(id);
    if (!course) throw new ApiError(404, 'Course not found', 'COURSE_NOT_FOUND');
    return course;
  },

  create(instructorId: string, data: Record<string, unknown>) {
    return courseRepository.create({ ...data, instructorId });
  },

  async update(id: string, userId: string, isAdmin: boolean, data: Record<string, unknown>) {
    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) throw new ApiError(404, 'Course not found', 'COURSE_NOT_FOUND');
    if (!isAdmin && course.instructorId !== userId) throw new ApiError(403, 'Not course owner', 'FORBIDDEN');
    return courseRepository.update(id, data);
  },

  async remove(id: string, userId: string, isAdmin: boolean) {
    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) throw new ApiError(404, 'Course not found', 'COURSE_NOT_FOUND');
    if (!isAdmin && course.instructorId !== userId) throw new ApiError(403, 'Not course owner', 'FORBIDDEN');
    return courseRepository.remove(id);
  },
};

export const moduleService = {
  listByCourse(courseId: string) {
    return prisma.module.findMany({ where: { courseId }, orderBy: { order: 'asc' }, include: { lessons: { orderBy: { order: 'asc' } } } });
  },
  async create(courseId: string, userId: string, isAdmin: boolean, data: { title: string; description?: string; order: number }) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new ApiError(404, 'Course not found', 'COURSE_NOT_FOUND');
    if (!isAdmin && course.instructorId !== userId) throw new ApiError(403, 'Not course owner', 'FORBIDDEN');
    return prisma.module.create({ data: { ...data, courseId } });
  },
};

export const lessonService = {
  listByModule(moduleId: string) {
    return prisma.lesson.findMany({ where: { moduleId }, orderBy: { order: 'asc' } });
  },
  async create(moduleId: string, userId: string, isAdmin: boolean, data: { title: string; content?: string; videoUrl?: string | null; durationSec: number; order: number; isFreePreview: boolean }) {
    const mod = await prisma.module.findUnique({ where: { id: moduleId }, include: { course: true } });
    if (!mod) throw new ApiError(404, 'Module not found', 'MODULE_NOT_FOUND');
    if (!isAdmin && mod.course.instructorId !== userId) throw new ApiError(403, 'Not course owner', 'FORBIDDEN');
    return prisma.lesson.create({ data: { ...data, moduleId } });
  },
};
