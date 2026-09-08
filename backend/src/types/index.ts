export type Role = 'STUDENT' | 'MENTOR' | 'ADMIN';

export interface AuthTokenPayload {
  userId: string;
  role: Role;
  email: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
