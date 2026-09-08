import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().min(3).max(255),
  subtitle: z.string().max(255).optional(),
  description: z.string().min(10),
  category: z.string().min(2).max(100),
  price: z.number().min(0).default(0),
  discountedPrice: z.number().min(0).optional().nullable(),
  thumbnailUrl: z.string().url().optional().nullable(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS']).default('ALL_LEVELS'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  durationHours: z.number().min(0).optional().default(0),
});

export const updateCourseSchema = createCourseSchema.partial();

export const listCoursesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS']).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  sortBy: z.enum(['createdAt', 'title', 'price', 'rating']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const createModuleSchema = z.object({
  title: z.string().min(2).max(255),
  description: z.string().max(5000).optional(),
  order: z.number().int().min(0).default(0),
});

export const createLessonSchema = z.object({
  title: z.string().min(2).max(255),
  content: z.string().optional(),
  videoUrl: z.string().url().optional().nullable(),
  durationSec: z.number().int().min(0).default(0),
  order: z.number().int().min(0).default(0),
  isFreePreview: z.boolean().default(false),
});
