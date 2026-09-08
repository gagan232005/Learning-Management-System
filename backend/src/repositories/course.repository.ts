import { prisma } from '../config/database.js';

export const courseRepository = {
  list(params: {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    sortBy: 'createdAt' | 'title' | 'price' | 'rating';
    sortOrder: 'asc' | 'desc';
  }) {
    const where: Record<string, unknown> = {};
    if (params.category) where.category = params.category;
    if (params.level) where.level = params.level;
    if (params.status) where.status = params.status;
    if (params.search) {
      where.OR = [
        { title: { contains: params.search } },
        { description: { contains: params.search } },
        { category: { contains: params.search } },
      ];
    }
    return Promise.all([
      prisma.course.findMany({
        where,
        include: { instructor: { select: { id: true, name: true, avatar: true } } },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        orderBy: { [params.sortBy]: params.sortOrder },
      }),
      prisma.course.count({ where }),
    ]);
  },

  findById(id: string) {
    return prisma.course.findUnique({
      where: { id },
      include: {
        instructor: { select: { id: true, name: true, avatar: true, bio: true } },
        modules: { orderBy: { order: 'asc' }, include: { lessons: { orderBy: { order: 'asc' } } } },
        _count: { select: { enrollments: true, reviews: true } },
      },
    });
  },

  create(data: Record<string, never> | Record<string, unknown>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return prisma.course.create({ data: data as any });
  },

  update(id: string, data: Record<string, unknown>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return prisma.course.update({ where: { id }, data: data as any });
  },

  remove(id: string) {
    return prisma.course.delete({ where: { id } });
  },

  countLessonsInCourse(courseId: string) {
    return prisma.lesson.count({ where: { module: { courseId } } });
  },
};
