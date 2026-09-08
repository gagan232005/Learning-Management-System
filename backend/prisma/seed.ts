import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password.js';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@lms.ai';
  const mentorEmail = 'mentor@lms.ai';
  const studentEmail = 'user@lms.ai';

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin',
      passwordHash: await hashPassword('admin123'),
      role: 'ADMIN',
      xp: 5000,
      level: 8,
      points: 5000,
    },
  });

  const mentor = await prisma.user.upsert({
    where: { email: mentorEmail },
    update: {},
    create: {
      email: mentorEmail,
      name: 'Mentor',
      passwordHash: await hashPassword('mentor123'),
      role: 'MENTOR',
      specialty: 'Full-stack development',
      bio: 'Senior mentor',
    },
  });

  await prisma.user.upsert({
    where: { email: studentEmail },
    update: {},
    create: {
      email: studentEmail,
      name: 'Student',
      passwordHash: await hashPassword('password123'),
      role: 'STUDENT',
      xp: 1000,
      level: 4,
      points: 500,
    },
  });

  const course = await prisma.course.upsert({
    where: { id: 'seed-course-java-101' },
    update: {},
    create: {
      id: 'seed-course-java-101',
      title: 'Java for Beginners',
      subtitle: 'From zero to OOP',
      description: 'Learn Java fundamentals, OOP, collections and basic projects.',
      category: 'Programming',
      price: 0,
      level: 'BEGINNER',
      status: 'PUBLISHED',
      instructorId: mentor.id,
      durationHours: 12,
      modules: {
        create: [
          {
            title: 'Getting started',
            order: 0,
            lessons: {
              create: [
                { title: 'Welcome + setup', order: 0, durationSec: 600, isFreePreview: true },
                { title: 'Variables and types', order: 1, durationSec: 900 },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.badge.upsert({
    where: { slug: 'course-finisher' },
    update: {},
    create: { slug: 'course-finisher', title: 'Course Finisher', description: 'Completed a full course', xpReward: 50 },
  });

  // eslint-disable-next-line no-console
  console.log(`Seeded: admin=${admin.email} mentor=${mentor.email} course=${course.id}`);
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
