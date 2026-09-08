import { z } from 'zod';

const questionSchema = z.object({
  text: z.string().min(3),
  type: z.enum(['MCQ', 'TRUE_FALSE']).default('MCQ'),
  options: z.array(z.string()).min(2).max(6),
  correctIndex: z.number().int().min(0),
  explanation: z.string().optional(),
  order: z.number().int().min(0).default(0),
  marks: z.number().int().min(1).default(1),
});

export const createQuizSchema = z.object({
  courseId: z.string().min(1),
  moduleId: z.string().optional().nullable(),
  title: z.string().min(3).max(255),
  description: z.string().optional(),
  passingPercentage: z.number().min(0).max(100).default(60),
  timeLimitSec: z.number().int().min(0).optional().nullable(),
  questions: z.array(questionSchema).min(1).max(100),
});

export const submitQuizSchema = z.object({
  answers: z.record(z.string(), z.number().int().min(0)),
});

export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
});
