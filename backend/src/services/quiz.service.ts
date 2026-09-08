import { prisma } from '../config/database.js';
import { ApiError } from '../utils/api.js';
import { awardXp } from '../utils/gamification.js';

/** Never leak correct answers before submission: strip correctIndex/explanation for students. */
export function sanitizeQuizForStudent(quiz: { questions: Array<Record<string, unknown>> } & Record<string, unknown>) {
  return {
    ...quiz,
    questions: quiz.questions.map((q) => {
      const { correctIndex: _ci, explanation: _ex, ...rest } = q;
      return rest;
    }),
  };
}

export const quizService = {
  async getById(id: string, isPrivileged: boolean) {
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: { orderBy: { order: 'asc' } } },
    });
    if (!quiz) throw new ApiError(404, 'Quiz not found', 'QUIZ_NOT_FOUND');
    if (isPrivileged) return quiz;
    return sanitizeQuizForStudent(quiz as never);
  },

  listByCourse(courseId: string, isPrivileged: boolean) {
    return prisma.quiz
      .findMany({ where: { courseId }, include: { questions: { orderBy: { order: 'asc' } } }, orderBy: { createdAt: 'desc' } })
      .then((quizzes) => (isPrivileged ? quizzes : quizzes.map((q) => sanitizeQuizForStudent(q as never))));
  },

  async create(userId: string, isAdmin: boolean, data: { courseId: string; moduleId?: string | null; title: string; description?: string; passingPercentage: number; timeLimitSec?: number | null; questions: Array<{ text: string; type: 'MCQ' | 'TRUE_FALSE'; options: string[]; correctIndex: number; explanation?: string; order: number; marks: number }> }) {
    const course = await prisma.course.findUnique({ where: { id: data.courseId } });
    if (!course) throw new ApiError(404, 'Course not found', 'COURSE_NOT_FOUND');
    if (!isAdmin && course.instructorId !== userId) throw new ApiError(403, 'Not course owner', 'FORBIDDEN');
    const { questions, ...quizData } = data;
    return prisma.quiz.create({ data: { ...quizData, questions: { create: questions } }, include: { questions: true } });
  },

  async remove(id: string, userId: string, isAdmin: boolean) {
    const quiz = await prisma.quiz.findUnique({ where: { id }, include: { course: true } });
    if (!quiz) throw new ApiError(404, 'Quiz not found', 'QUIZ_NOT_FOUND');
    if (!isAdmin && quiz.course.instructorId !== userId) throw new ApiError(403, 'Not course owner', 'FORBIDDEN');
    await prisma.quiz.delete({ where: { id } });
  },

  /** Score computed fully on backend from stored correct answers. */
  async submit(quizId: string, userId: string, answers: Record<string, number>) {
    const quiz = await prisma.quiz.findUnique({ where: { id: quizId }, include: { questions: true } });
    if (!quiz) throw new ApiError(404, 'Quiz not found', 'QUIZ_NOT_FOUND');

    // Must be enrolled (unless mentor/admin owner — allow preview submit anyway? require enrollment for students)
    const requester = await prisma.user.findUnique({ where: { id: userId } });
    if (requester?.role === 'STUDENT') {
      const enr = await prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId: quiz.courseId } } });
      if (!enr) throw new ApiError(403, 'Enroll in the course first', 'NOT_ENROLLED');
    }

    let score = 0;
    let totalMarks = 0;
    const graded: Record<string, { selected: number | null; correct: number; isCorrect: boolean; marks: number }> = {};
    for (const q of quiz.questions) {
      totalMarks += q.marks;
      const selected = answers[q.id];
      const isCorrect = selected === q.correctIndex;
      if (isCorrect) score += q.marks;
      graded[q.id] = { selected: selected ?? null, correct: q.correctIndex, isCorrect, marks: q.marks };
    }
    const percentage = totalMarks === 0 ? 0 : Math.round((score / totalMarks) * 100 * 100) / 100;
    const passed = percentage >= quiz.passingPercentage;

    const attempt = await prisma.quizAttempt.create({
      data: { quizId, userId, score, totalMarks, percentage, passed, answers: graded },
    });

    if (passed) await awardXp(userId, 25, `quiz-pass:${quizId}`);
    else await awardXp(userId, 5, `quiz-attempt:${quizId}`);

    return attempt;
  },

  myAttempts(userId: string, quizId: string) {
    return prisma.quizAttempt.findMany({ where: { userId, quizId }, orderBy: { createdAt: 'desc' } });
  },
};

export const certificateService = {
  getById(id: string) {
    return prisma.certificate.findUnique({ where: { id }, include: { user: { select: { id: true, name: true, email: true } }, course: { select: { id: true, title: true } } } });
  },
  myCertificates(userId: string) {
    return prisma.certificate.findMany({ where: { userId }, include: { course: { select: { id: true, title: true } } }, orderBy: { issuedAt: 'desc' } });
  },
  verifyByNumber(certificateNumber: string) {
    return prisma.certificate.findUnique({
      where: { certificateNumber },
      include: { user: { select: { id: true, name: true } }, course: { select: { id: true, title: true } } },
    });
  },
};
