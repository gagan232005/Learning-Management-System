import { createApp, mockPrisma, request, jwt } from './helpers';

const app = createApp();
const SECRET = process.env.JWT_SECRET as string;
const studentToken = jwt.sign({ userId: 'stu1', role: 'STUDENT', email: 's@t.c' }, SECRET);

beforeEach(() => jest.clearAllMocks());

describe('Enrollment + progress', () => {
  test('Enroll → 201; duplicate → 409', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'stu1', role: 'STUDENT', status: 'ACTIVE', email: 's@t.c' });
    mockPrisma.course.findUnique.mockResolvedValue({ id: 'c1' });
    mockPrisma.course.update.mockResolvedValue({});
    mockPrisma.enrollment.create.mockResolvedValueOnce({ id: 'e1' });
    const err = Object.assign(new Error('dup'), { code: 'P2002' });
    mockPrisma.enrollment.create.mockRejectedValueOnce(err);

    const ok = await request(app).post('/api/courses/c1/enroll').set('Authorization', `Bearer ${studentToken}`);
    expect(ok.status).toBe(201);

    const dup = await request(app).post('/api/courses/c1/enroll').set('Authorization', `Bearer ${studentToken}`);
    expect(dup.status).toBe(409);
    expect(dup.body.error).toBe('ALREADY_ENROLLED');
  });

  test('Complete lesson computes progress server-side', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'stu1', role: 'STUDENT', status: 'ACTIVE', email: 's@t.c' });
    mockPrisma.lesson.findUnique.mockResolvedValue({ id: 'l1', module: { courseId: 'c1' } } as never);
    mockPrisma.enrollment.findUnique.mockResolvedValue({ id: 'e1' } as never);
    mockPrisma.lessonProgress.upsert.mockResolvedValue({});
    mockPrisma.lesson.count.mockResolvedValue(4);
    mockPrisma.lessonProgress.count.mockResolvedValue(1);
    mockPrisma.enrollment.update.mockResolvedValue({});
    // gamification $transaction passthrough with tx mock
    const tx = { xpEvent: { create: jest.fn() }, user: { findUnique: jest.fn().mockResolvedValue({ xp: 0 }), update: jest.fn() } };
    (mockPrisma.$transaction as unknown as jest.Mock).mockImplementation(async (fn: (tx: unknown) => unknown) => fn(tx));

    const res = await request(app).post('/api/lessons/l1/complete').set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.progressPercent).toBe(25);
  });
});



