import { api } from './client';
import type { User } from '../types';

type SignInPayload = { email: string; password: string };
type SignUpPayload = {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
};

type AuthResponse = {
  message: string;
  user: User;
};

const signIn = async (payload: SignInPayload) => {
  const { data } = await api.post<AuthResponse>('/api/auth/sign-in', payload);
  return data;
};

const signUp = async (payload: SignUpPayload) => {
  const { data } = await api.post<AuthResponse>('/api/auth/sign-up', payload);
  return data;
};

const signOut = async () => {
  const { data } = await api.post<{ message: string }>('/api/auth/sign-out');
  return data;
};

export { signIn, signOut, signUp };
