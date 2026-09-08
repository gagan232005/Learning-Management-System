import { prisma } from '../config/database.js';

/** Modular gamification: award XP + auto-level (level = floor(sqrt(xp/100)) + 1). */
export async function awardXp(userId: string, amount: number, reason: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.xpEvent.create({ data: { userId, amount, reason } });
    const user = await tx.user.findUnique({ where: { id: userId }, select: { xp: true } });
    const xp = (user?.xp ?? 0) + amount;
    const level = Math.floor(Math.sqrt(Math.max(xp, 0) / 100)) + 1;
    await tx.user.update({ where: { id: userId }, data: { xp, level, points: { increment: amount } } });
  });
}

export async function maybeAwardBadge(userId: string, slug: string): Promise<void> {
  const badge = await prisma.badge.findUnique({ where: { slug } });
  if (!badge) return;
  try {
    await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
    if (badge.xpReward > 0) await awardXp(userId, badge.xpReward, `badge:${slug}`);
  } catch {
    // already awarded — ignore (unique constraint)
  }
}
