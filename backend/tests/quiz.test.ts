import { createApp, mockPrisma, request, jwt } from './helpers';

const app = createApp();
const SECRET = process.env.JWT_SECRET as string;
const studentToken = jwt.sign({ userId: 'stu1', role: 'STUDENT', email: 's@t.c' }, SECRET);

beforeEach(() => jest.clearAllMocks());

describe('Quiz + certificates', () => {
  const quiz = {
    id: 'q1',
    courseId: 'c1',
    passingPercentage: 60,
    questions: [
      { id: 'qq1', correctIndex: 1, marks: 1 },
      { id: 'qq2', correctIndex: 0, marks: 1 },
    ],
  };

  test('GET quiz hides correct answers from students', async () => {
    mockPrisma.quiz.findUnique.mockResolvedValue({
      ...quiz,
      questions: quiz.questions.map((q) => ({ ...q, text: 'T', options: ['a', 'b'], explanation: 'E' })),
    });
    const res = await request(app).get('/api/quizzes/q1').set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(200);
    for (const q of res.body.data.questions) {
      expect(q.correctIndex).toBeUndefined();
      expect(q.explanation).toBeUndefined();
    }
  });

  test('Submit quiz scored on backend (1/2 → 50% fail)', async () => {
    mockPrisma.quiz.findUnique.mockResolvedValue(quiz as never);
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'stu1', role: 'STUDENT', status: 'ACTIVE', email: 's@t.c' });
    mockPrisma.enrollment.findUnique.mockResolvedValue({ id: 'e1' } as never);
    mockPrisma.quizAttempt.create.mockImplementation(async (args: { data: Record<string, unknown> }) => ({ id: 'a1', ...args.data }));
    const tx = { xpEvent: { create: jest.fn() }, user: { findUnique: jest.fn().mockResolvedValue({ xp: 0 }), update: jest.fn() } };
    (mockPrisma.$transaction as unknown as jest.Mock).mockImplementation(async (fn: (tx: unknown) => unknown) => fn(tx));

    const res = await request(app)
      .post('/api/quizzes/q1/submit')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ answers: { qq1: 1, qq2: 1 } });
    expect(res.status).toBe(201);
    expect(res.body.data.score).toBe(1);
    expect(res.body.data.percentage).toBe(50);
    expect(res.body.data.passed).toBe(false);
  });

  test('Verify invalid certificate → 404', async () => {
    mockPrisma.certificate.findUnique.mockResolvedValue(null);
    const res = await request(app).get('/api/certificates/verify/NOPE-123');
    expect(res.status).toBe(404);
  });

  test('Verify valid certificate → 200', async () => {
    mockPrisma.certificate.findUnique.mockResolvedValue({ certificateNumber: 'LMS-2026-ABC', user: {}, course: {} });
    const res = await request(app).get('/api/certificates/verify/LMS-2026-ABC');
    expect(res.status).toBe(200);
    expect(res.body.data.valid).toBe(true);
  });
});



