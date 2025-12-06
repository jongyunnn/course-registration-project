import { apiClient } from '@/lib/api-client';
import { SignupRequestData, LoginFormData } from './lib/validation';
import { ApiResponse, User } from '@/types';

export const authApi = {
  signup: async (data: SignupRequestData): Promise<ApiResponse<User>> => {
    return apiClient.post('/auth/signup', data);
  },

  login: async (data: LoginFormData): Promise<ApiResponse<User>> => {
    return apiClient.post('/auth/login', data);
  },
};
