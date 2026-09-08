import { prisma } from '../config/database.js';

const publicSelect = {
  id: true,
  email: true,
  name: true,
  avatar: true,
  role: true,
  status: true,
  bio: true,
  specialty: true,
  xp: true,
  level: true,
  points: true,
  streakDays: true,
  lastActiveAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },
  findById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: publicSelect });
  },
  findByIdWithHash(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },
  create(data: { email: string; passwordHash: string; name: string; role: 'STUDENT' | 'MENTOR'; avatar?: string }) {
    return prisma.user.create({ data, select: publicSelect });
  },
  update(id: string, data: Record<string, unknown>) {
    return prisma.user.update({ where: { id }, data, select: publicSelect });
  },
  remove(id: string) {
    return prisma.user.delete({ where: { id } });
  },
  list(params: { page: number; limit: number; role?: 'STUDENT' | 'MENTOR' | 'ADMIN'; status?: 'ACTIVE' | 'INACTIVE'; search?: string }) {
    const where: Record<string, unknown> = {};
    if (params.role) where.role = params.role;
    if (params.status) where.status = params.status;
    if (params.search) {
      where.OR = [
        { name: { contains: params.search } },
        { email: { contains: params.search } },
      ];
    }
    return Promise.all([
      prisma.user.findMany({
        where,
        select: publicSelect,
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);
  },
};
