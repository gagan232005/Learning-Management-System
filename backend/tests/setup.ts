process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'mysql://root:password@localhost:3306/lms_test';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-access-secret-min-32-chars-1234567890';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'test-refresh-secret-min-32-chars-1234567890';
process.env.NODE_ENV = 'test';
