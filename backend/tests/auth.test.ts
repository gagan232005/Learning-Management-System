import { createApp, mockPrisma, request } from './helpers';

const app = createApp();

beforeEach(() => jest.clearAllMocks());

describe('Auth', () => {
  test('POST /api/auth/register → 201 with tokens', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({ id: 'u1', email: 'alice@example.com', name: 'A', role: 'STUDENT', status: 'ACTIVE' });
    mockPrisma.refreshToken.create.mockResolvedValue({});

    const res = await request(app).post('/api/auth/register').send({ name: 'Alice', email: 'alice@example.com', password: 'password123' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
  });

  test('POST /api/auth/register duplicate → 409', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1' });
    const res = await request(app).post('/api/auth/register').send({ name: 'Alice', email: 'alice@example.com', password: 'password123' });
    expect(res.status).toBe(409);
    expect(res.body.error).toBe('EMAIL_TAKEN');
  });

  test('POST /api/auth/register validation → 400', async () => {
    const res = await request(app).post('/api/auth/register').send({ name: 'Alice', email: 'bad', password: 'short' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });

  test('GET /api/auth/me without token → 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});



