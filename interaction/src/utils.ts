import type { AxiosError } from 'axios';
import type { ApiError } from './types';

const toErrorMessage = (error: unknown) => {
  const axiosError = error as AxiosError<ApiError>;
  const apiMessage =
    axiosError?.response?.data?.message || axiosError?.response?.data?.error;

  return (
    apiMessage || axiosError.message || 'Unexpected error. Please try again.'
  );
};

export { toErrorMessage };
