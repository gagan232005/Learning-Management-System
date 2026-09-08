import { createApp, mockPrisma, request, jwt } from './helpers';

const app = createApp();
const SECRET = process.env.JWT_SECRET as string;

function token(role: 'STUDENT' | 'MENTOR' | 'ADMIN') {
  return jwt.sign({ userId: 'u-' + role, role, email: `${role}@t.c` }, SECRET);
}

beforeEach(() => jest.clearAllMocks());

describe('Courses + RBAC', () => {
  test('GET /api/courses → 200 paginated', async () => {
    mockPrisma.course.findMany.mockResolvedValue([]);
    mockPrisma.course.count.mockResolvedValue(0);
    const res = await request(app).get('/api/courses?page=1&limit=10&search=java&level=BEGINNER');
    expect(res.status).toBe(200);
    expect(res.body.data.pagination.total).toBe(0);
  });

  test('Student creating course → 403', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'u-STUDENT', role: 'STUDENT', status: 'ACTIVE', email: 's@t.c' });
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${token('STUDENT')}`)
      .send({ title: 'Java 101', description: 'Learn java basics here', category: 'Programming' });
    expect(res.status).toBe(403);
  });

  test('Mentor creating course → 201', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'u-MENTOR', role: 'MENTOR', status: 'ACTIVE', email: 'm@t.c' });
    mockPrisma.course.create.mockResolvedValue({ id: 'c1', title: 'Java 101' });
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${token('MENTOR')}`)
      .send({ title: 'Java 101', description: 'Learn java basics here', category: 'Programming' });
    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe('c1');
  });

  test('Unauthenticated course create → 401', async () => {
    const res = await request(app).post('/api/courses').send({ title: 'Java 101', description: 'Learn java basics here', category: 'Programming' });
    expect(res.status).toBe(401);
  });
});



