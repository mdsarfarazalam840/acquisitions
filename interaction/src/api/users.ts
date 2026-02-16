import { api } from './client';
import type { User } from '../types';

const getAllUsers = async () => {
  const { data } = await api.get<{
    message: string;
    users: User[];
    count: number;
  }>('/api/users');
  return data;
};

const getUserById = async (id: number) => {
  const { data } = await api.get<{ message: string; user: User }>(
    `/api/users/${id}`
  );
  return data;
};

const updateUserById = async (
  id: number,
  payload: Partial<Pick<User, 'name' | 'role'>>
) => {
  const { data } = await api.put<{ message: string; user: User }>(
    `/api/users/${id}`,
    payload
  );
  return data;
};

const deleteUserById = async (id: number) => {
  const { data } = await api.delete<{ message: string }>(`/api/users/${id}`);
  return data;
};

export { getAllUsers, getUserById, updateUserById, deleteUserById };
