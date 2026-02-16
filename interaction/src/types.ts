export type Role = 'admin' | 'user' | 'guest';

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiError = {
  error?: string;
  message?: string;
  details?: unknown;
};
