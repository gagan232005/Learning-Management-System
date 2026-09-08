import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';

async function main() {
  if (!process.env.DATABASE_URL) {
    // eslint-disable-next-line no-console
    console.warn('DATABASE_URL not set — API will fail on DB calls until configured.');
  } else {
    try {
      await connectDatabase();
      // eslint-disable-next-line no-console
      console.log('MySQL connected via Prisma');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Database connection failed:', err);
      if (env.isProd) process.exit(1);
    }
  }
  const app = createApp();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`LMS API listening on :${env.port} — docs at /api/docs`);
  });
}

void main();
