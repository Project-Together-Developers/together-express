import { Request } from 'express';

export interface AuthPayload {
  userId: string;
  phone: string;
  role: 'user' | 'admin';
}

export interface RefreshPayload extends AuthPayload {
  tokenId: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export type SupportedLocale = 'en' | 'ru' | 'uz';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
