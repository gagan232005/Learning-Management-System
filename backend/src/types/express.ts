import type { Role } from './index.js';

declare global {
  namespace Express {
    interface User {
      id: string;
      role: Role;
      email: string;
    }
    interface Request {
      user?: User;
    }
  }
}

export {};
