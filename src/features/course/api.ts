import { apiClient } from '@/lib/api-client';
import { CourseFormData } from './lib/validation';
import { ApiResponse, Course, PaginatedResponse } from '@/types';

export const courseApi = {
  createCourse: async (data: CourseFormData): Promise<ApiResponse<Course>> => {
    return apiClient.post('/courses', data);
  },
  getCourses: async (params?: { page?: number; limit?: number; sortBy?: string }): Promise<ApiResponse<PaginatedResponse<Course>>> => {
    return apiClient.get('/courses', { params });
  },
};
