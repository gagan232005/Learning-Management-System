import { prisma } from '../config/database.js';
import { ApiError } from '../utils/api.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { refreshExpiryDate, signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokens.js';
import { userRepository } from '../repositories/user.repository.js';
import type { LoginInput, RegisterInput } from '../validators/auth.validator.js';

function toPublic(user: { id: string; role: string; email: string; [k: string]: unknown }) {
  const { passwordHash: _omit, ...rest } = user as Record<string, unknown>;
  return rest;
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await userRepository.findByEmail(input.email.toLowerCase());
    if (existing) throw new ApiError(409, 'Email already registered', 'EMAIL_TAKEN');

    const user = await userRepository.create({
      email: input.email.toLowerCase(),
      passwordHash: await hashPassword(input.password),
      name: input.name,
      role: input.role ?? 'STUDENT',
      avatar: input.avatar,
    });

    const payload = { userId: user.id, role: user.role as never, email: user.email };
    const accessToken = signAccessToken(payload as never);
    const refreshToken = signRefreshToken(payload as never);
    await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt: refreshExpiryDate() } });

    return { user: toPublic(user as never), accessToken, refreshToken };
  },

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email.toLowerCase());
    if (!user) throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    if (user.status !== 'ACTIVE') throw new ApiError(403, 'Account is inactive', 'ACCOUNT_INACTIVE');
    const ok = await verifyPassword(input.password, user.passwordHash);
    if (!ok) throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');

    await prisma.user.update({ where: { id: user.id }, data: { lastActiveAt: new Date() } });

    const payload = { userId: user.id, role: user.role as never, email: user.email };
    const accessToken = signAccessToken(payload as never);
    const refreshToken = signRefreshToken(payload as never);
    await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt: refreshExpiryDate() } });

    const pub = await userRepository.findById(user.id);
    return { user: pub, accessToken, refreshToken };
  },

  async refresh(refreshToken: string) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new ApiError(401, 'Invalid refresh token', 'UNAUTHORIZED');
    }
    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await prisma.refreshToken.delete({ where: { id: stored.id } });
      throw new ApiError(401, 'Refresh token expired', 'UNAUTHORIZED');
    }
    await prisma.refreshToken.delete({ where: { id: stored.id } });
    const user = await userRepository.findByIdWithHash(payload.userId);
    if (!user || user.status !== 'ACTIVE') throw new ApiError(401, 'Invalid session', 'UNAUTHORIZED');

    const next = { userId: user.id, role: user.role as never, email: user.email };
    const accessToken = signAccessToken(next as never);
    const nextRefresh = signRefreshToken(next as never);
    await prisma.refreshToken.create({ data: { token: nextRefresh, userId: user.id, expiresAt: refreshExpiryDate() } });
    return { accessToken, refreshToken: nextRefresh };
  },

  async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  },

  async me(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
    return user;
  },
};
