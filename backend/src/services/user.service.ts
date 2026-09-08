import { prisma } from '../config/database.js';
import { ApiError } from '../utils/api.js';

export const userService = {
  list(query: { page: number; limit: number; role?: 'STUDENT' | 'MENTOR' | 'ADMIN'; status?: 'ACTIVE' | 'INACTIVE'; search?: string }) {
    const where: Record<string, unknown> = {};
    if (query.role) where.role = query.role;
    if (query.status) where.status = query.status;
    if (query.search) where.OR = [{ name: { contains: query.search } }, { email: { contains: query.search } }];
    return Promise.all([
      prisma.user.findMany({
        where,
        select: { id: true, email: true, name: true, avatar: true, role: true, status: true, xp: true, level: true, createdAt: true },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);
  },

  async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, avatar: true, role: true, status: true, bio: true, specialty: true, xp: true, level: true, points: true, streakDays: true, createdAt: true },
    });
    if (!user) throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
    return user;
  },

  update(id: string, data: Record<string, unknown>) {
    return prisma.user.update({
      where: { id },
      data: data as never,
      select: { id: true, email: true, name: true, avatar: true, role: true, status: true, bio: true, specialty: true },
    });
  },

  async remove(id: string) {
    await prisma.user.delete({ where: { id } });
  },

  analytics() {
    return Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.quizAttempt.count(),
      prisma.certificate.count(),
    ]).then(([totalUsers, totalCourses, totalEnrollments, totalQuizAttempts, totalCertificates]) => ({
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalQuizAttempts,
      totalCertificates,
    }));
  },
};
