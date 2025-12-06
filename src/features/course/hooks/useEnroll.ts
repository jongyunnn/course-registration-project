import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types';

interface EnrollResponse {
  enrolledCourses: string[];
  failedCourses: { courseId: string; reason: string }[];
}

export const useEnroll = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<EnrollResponse>, Error, string[]>({
    mutationFn: async (courseIds) => {
      return apiClient.post('/enrollments', { courseIds });
    },
    onSuccess: () => {
      // 강의 목록과 수강신청 내역 모두 갱신
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
};
