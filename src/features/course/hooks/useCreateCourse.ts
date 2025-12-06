import { useMutation, useQueryClient } from '@tanstack/react-query';
import { courseApi } from '../api';
import { CourseFormData } from '../lib/validation';
import { ApiResponse, Course } from '@/types';

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Course>, Error, CourseFormData>({
    mutationFn: courseApi.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};
