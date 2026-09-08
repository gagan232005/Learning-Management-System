# LMS Backend (MySQL)

Node.js + Express + TypeScript + Prisma + MySQL + JWT + Zod + Swagger.

## Setup

```bash
cd backend
cp .env.example .env   # set DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET
npm install
npx prisma migrate dev # creates MySQL tables
npm run prisma:seed
npm run dev            # http://localhost:5000/api/health, docs at /api/docs
```

## Scripts

- `npm run dev` — tsx watch
- `npm run build` / `npm start`
- `npm test` — Jest + Supertest (mocked Prisma, no DB needed)
- `npx prisma studio` — DB GUI

## Env

See `.env.example`. MySQL only (`DATABASE_URL=mysql://...`). Never commit real secrets.
