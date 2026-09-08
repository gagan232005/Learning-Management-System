# LMS Platform — Modernized (Node.js + MySQL)

Production-style Learning Management System. React frontend (preserved) + **new Node.js + Express + TypeScript + Prisma + MySQL-only backend**. No MongoDB. No Python.

Source analyzed: https://github.com/Siriwodiyer/LMS (`backend_py/` FastAPI+MySQL/SQLite, `backend/` Express+Mongo/file-JSON, `src/` React).

## Project structure

```
.
├── backend/                 # NEW production backend (MySQL only)
│   ├── src/
│   │   ├── config/ (env, database, swagger)
│   │   ├── controllers/ (auth, user, course, enrollment, quiz)
│   │   ├── middleware/ (auth, role, error, rateLimit, validate)
│   │   ├── routes/ (auth, users, courses, lessons, quizzes, enrollments, certificates)
│   │   ├── services/ (auth, user, course, enrollment/progress, quiz/certificate)
│   │   ├── repositories/ (user, course)
│   │   ├── validators/ (zod: auth, user, course, quiz)
│   │   ├── utils/ (api, asyncHandler, password, tokens, gamification)
│   │   ├── types/ (Role, AuthTokenPayload, express)
│   │   ├── app.ts / server.ts
│   ├── prisma/ (schema.prisma, seed.ts)
│   ├── tests/ (auth, courses, enrollment, quiz — Jest + Supertest)
│   ├── Dockerfile / package.json / tsconfig.json / .env.example / README.md
├── frontend/                # Preserved LMS React app (migrated API client)
│   └── src/services/api.ts  # → new MySQL backend contract + refresh tokens
├── docker-compose.yml       # mysql:8.0 + backend (docker compose up)
├── .github/workflows/ci.yml # backend build + prisma generate + tsc + jest
```

Note: the portfolio site previously at repo root (`src/`, `index.html`, `vite.config.ts`) is unrelated to the LMS and was left untouched; the migrated LMS frontend lives under `frontend/`.

## Architecture

```
React (frontend/src) —Axios/fetch→ Express routes → controllers → services → repositories → Prisma → MySQL 8
                                     ↓ middleware: helmet/cors/rate-limit → auth(JWT) → role(RBAC) → zod-validate → error-handler
Docs: /api/docs (Swagger). Tests: Jest + Supertest with mocked Prisma.
```

## Database ER (MySQL via Prisma)

```
users(1)───*(courses as instructor)   users(1)───*(enrollments)───*(courses)
users(1)───*(lesson_progress)───*(lessons)───*(modules)───*(courses)
courses(1)───*(modules)───*(lessons); courses(1)───*(quizzes)───*(questions)
quizzes(1)───*(quiz_attempts)───*(users); users(1)───*(certificates)───*(courses)
users(1)───*(reviews)───*(courses); users*───*(user_badges)───*(badges); users(1)───*(xp_events); users(1)───*(refresh_tokens)
```

Keys: PK cuid, UNIQUE(email, certificateNumber, [userId,courseId] enrollment, [userId,lessonId] progress, [userId,courseId] review, [userId,badgeId]), INDEX(role,status,category,level,courseId,moduleId), FK cascade except course.instructor RESTRICT.

## Complete API list (base /api)

- Health: `GET /health`
- Auth: `POST /auth/register|/login|/refresh|/logout`, `GET /auth/me`
- Users (ADMIN): `GET /users`, `GET /users/analytics`, `GET /users/:id`, `PATCH /users/me`, `PATCH /users/:id`, `DELETE /users/:id`
- Courses: `GET /courses?page&limit&search&category&level&status&sortBy&sortOrder`, `GET /courses/:id`, `POST /courses` (MENTOR), `PUT /courses/:id`, `DELETE /courses/:id`
- Modules/Lessons: `GET /courses/:courseId/modules`, `POST /courses/:courseId/modules` (MENTOR), `GET /modules/:moduleId/lessons`, `POST /modules/:moduleId/lessons` (MENTOR)
- Enrollment: `POST /courses/:courseId/enroll`, `GET /enrollments/my-courses`
- Progress: `POST /lessons/:lessonId/complete`, `GET /courses/:courseId/progress`
- Quizzes: `GET /quizzes?courseId`, `GET /quizzes/:id` (answers hidden for students), `POST /quizzes` (MENTOR), `DELETE /quizzes/:id`, `POST /quizzes/:id/submit`, `GET /quizzes/:id/attempts`
- Reviews: `POST /courses/:courseId/reviews`
- Certificates: `GET /users/me/certificates`, `GET /certificates/:id`, `GET /certificates/verify/:certificateNumber`
- Docs: `/api/docs`

## Migration summary (Python → Node)

| Python (FastAPI `backend_py/routers/*`) | New Node endpoint | Notes |
|---|---|---|
| `POST /auth/register|/login`, `GET /auth/me`, `POST /auth/token/refresh` | same paths (`/refresh`, + `/logout`) | bcrypt kept; 24h token → 15m access + 7d refresh rotation; lax RBAC → enforced |
| `GET /users?...`, `GET|PUT|DELETE /users/{id}` | `GET /users`, `GET /users/:id`, `PATCH /users/me|/:id`, `DELETE /users/:id` | roles normalized to STUDENT/MENTOR/ADMIN |
| `GET|POST|PUT|DELETE /courses...`, `POST .../enroll`, `GET .../students`, `GET .../progress/{user}` | courses/modules/lessons/enrollment/progress above | JSON blob modules → normalized modules/lessons tables; progress server-computed |
| `GET|POST|DELETE /quizzes...`, `POST .../submit` | same shapes | correct answers never sent pre-submit; scoring backend-only |
| enrolled_students/progress JSON | enrollments + lesson_progress + certificates | duplicate enrollment via DB unique; cert auto-issued at 100% |
| feedback/comments/notifications/rewards-vouchers/approvals/mentors/AI/reels/assignments/assessments | de-scoped (social layer) | frontend stubs throw descriptive errors; core reviews/certificates/XP/badges retained |
| SQLAlchemy `users/courses/reels/quizzes/...` string-PK JSON blobs | Prisma normalized MySQL schema | proper FK/unique/index/cascade, `createdAt/updatedAt` |

Business logic moved: routers → controllers; ad-hoc queries → services (`auth/course/enrollment+progress/quiz+certificate/user`) → repositories → Prisma. Auth: `middleware/auth.py` → `auth.middleware.ts` + `tokens.ts`.

## Tech used

Frontend: React, fetch client, VITE_API_URL. Backend: Node 20, Express 4, TypeScript strict, Prisma 5, MySQL 8, JWT, bcryptjs, Zod, Helmet, CORS, express-rate-limit, Morgan, swagger-ui-express. Tests: Jest + ts-jest + Supertest. DevOps: Docker, Compose, GH Actions, ESLint/Prettier.

## Run locally

```bash
# 1) MySQL (Docker) — or any MySQL 8
docker run -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=lms_db -p 3306:3306 mysql:8.0
# 2) Backend
cd backend && cp .env.example .env && npm install
npx prisma migrate dev && npm run prisma:seed && npm run dev
# 3) Frontend (migrated LMS app)
# from repo root: frontend/src is the LMS React app; wire it to your Vite host and set VITE_API_URL=http://localhost:5000/api
```

## Run with Docker

```bash
docker compose up --build
# backend → http://localhost:5000/api/health, docs → /api/docs
```

## Env vars (backend/.env.example)

`PORT NODE_ENV CLIENT_URL DATABASE_URL JWT_SECRET JWT_REFRESH_SECRET JWT_ACCESS_EXPIRES_IN JWT_REFRESH_EXPIRES_IN BCRYPT_SALT_ROUNDS`

## Test results

`cd backend && npm test` — **4 suites / 14 tests pass** (mocked Prisma, no DB needed):
auth (register 201/duplicate 409/validation 400/me 401), courses (list 200, student create 403, mentor create 201, anon 401), enrollment (enroll 201/duplicate 409, progress 25% server-computed), quiz (answers hidden, submit 1/2=50% fail, cert verify 404/200).

## Python components removed

None in this workspace (no `backend_py/` was ever copied over) — final tree has **zero Python**: no `*.py`, no `requirements.txt`, no `run.py`. The legacy `backend/` (Mongo/file-JSON) from the source repo was not carried over either; it is fully replaced by `backend/` (Prisma+MySQL). Frontend legacy social calls are stubbed, not Python.

## Resume bullets

- Re-engineered LMS backend from FastAPI/Mongo-prototype to production Node.js + Express + TypeScript + Prisma + MySQL with layered architecture and strict TS
- Designed normalized MySQL schema (13 tables) with Prisma migrations: FK cascades, composite uniques preventing duplicate enrollment/progress, search indexes
- Implemented JWT access/refresh rotation, bcrypt, RBAC (STUDENT/MENTOR/ADMIN), rate limiting, Helmet/CORS, Zod validation, centralized error envelope, Swagger docs
- Built server-authoritative progress/quiz/certificate engine (backend-computed %, hidden answers, auto-issue verify flow) plus modular XP/level/badge gamification
- Shipped paginated/search/filter/sort course APIs, Docker Compose (MySQL+API), GH Actions CI, Jest+Supertest suite (14 tests incl. negative RBAC cases)
