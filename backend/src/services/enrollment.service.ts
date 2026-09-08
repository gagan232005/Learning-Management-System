import { prisma } from '../config/database.js';
import { ApiError } from '../utils/api.js';
import { awardXp, maybeAwardBadge } from '../utils/gamification.js';
import { generateCertificateNumber } from '../utils/tokens.js';

export const enrollmentService = {
  async enroll(userId: string, courseId: string) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new ApiError(404, 'Course not found', 'COURSE_NOT_FOUND');
    try {
      const enrollment = await prisma.enrollment.create({ data: { userId, courseId } });
      await prisma.course.update({ where: { id: courseId }, data: { studentsCount: { increment: 1 } } });
      return enrollment;
    } catch (e: unknown) {
      const err = e as { code?: string };
      if (err?.code === 'P2002') throw new ApiError(409, 'Already enrolled', 'ALREADY_ENROLLED');
      throw e;
    }
  },

  myCourses(userId: string) {
    return prisma.enrollment.findMany({
      where: { userId },
      include: { course: { include: { instructor: { select: { id: true, name: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
  },
};

export const progressService = {
  /** Mark lesson complete (server-computed). Updates enrollment %, awards XP, issues certificate at 100%. */
  async completeLesson(userId: string, lessonId: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { select: { courseId: true } } },
    });
    if (!lesson) throw new ApiError(404, 'Lesson not found', 'LESSON_NOT_FOUND');
    const courseId = lesson.module.courseId;

    const enrollment = await prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } } });
    if (!enrollment) throw new ApiError(403, 'Enroll in the course first', 'NOT_ENROLLED');

    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, completed: true },
      update: { completed: true, completedAt: new Date() },
    });

    await awardXp(userId, 10, `lesson:${lessonId}`);

    const totalLessons = await prisma.lesson.count({ where: { module: { courseId } } });
    const doneLessons = await prisma.lessonProgress.count({
      where: { userId, completed: true, lesson: { module: { courseId } } },
    });
    const percent = totalLessons === 0 ? 0 : Math.round((doneLessons / totalLessons) * 100 * 100) / 100;

    const completedAt = percent >= 100 ? new Date() : null;
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { progressPercent: percent, lastLessonId: lessonId, ...(completedAt ? { completedAt } : {}) },
    });

    let certificate = null;
    if (percent >= 100) {
      const existing = await prisma.certificate.findFirst({ where: { userId, courseId } });
      if (!existing) {
        certificate = await prisma.certificate.create({
          data: { userId, courseId, certificateNumber: generateCertificateNumber() },
        });
        await awardXp(userId, 100, `course-complete:${courseId}`);
        await maybeAwardBadge(userId, 'course-finisher');
      } else {
        certificate = existing;
      }
    }

    return { progressPercent: percent, completedLessons: doneLessons, totalLessons, certificate };
  },

  async courseProgress(userId: string, courseId: string) {
    const enrollment = await prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } } });
    if (!enrollment) throw new ApiError(404, 'Enrollment not found', 'NOT_ENROLLED');
    const totalLessons = await prisma.lesson.count({ where: { module: { courseId } } });
    const done = await prisma.lessonProgress.findMany({
      where: { userId, completed: true, lesson: { module: { courseId } } },
      select: { lessonId: true, completedAt: true },
    });
    return { ...enrollment, totalLessons, completedLessons: done.length, completedLessonIds: done.map((d) => d.lessonId) };
  },
};
