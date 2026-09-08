import dotenv from 'dotenv';

dotenv.config();

function required(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing required env var ${name}`);
  return v;
}

export const env = {
  port: parseInt(process.env.PORT ?? '5000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  databaseUrl: required('DATABASE_URL', 'mysql://root:password@localhost:3306/lms_db'),
  jwtSecret: required('JWT_SECRET', 'dev-access-secret-min-32-chars-please-change'),
  jwtRefreshSecret: required('JWT_REFRESH_SECRET', 'dev-refresh-secret-min-32-chars-please-change'),
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  bcryptRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10),
  isProd: (process.env.NODE_ENV ?? 'development') === 'production',
};
