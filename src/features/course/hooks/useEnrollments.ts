import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse, Enrollment } from "@/types";

interface EnrollmentsResponse {
  enrolledCourseIds: string[];
  enrollments: Enrollment[];
}

export function useEnrollments() {
  const { isAuthenticated, user } = useAuth();
  console.log(user);
  return useQuery<ApiResponse<EnrollmentsResponse>>({
    queryKey: ["enrollments"],
    queryFn: () => apiClient.get("/enrollments"),
    // 로그인한 경우에만 쿼리 실행
    enabled: isAuthenticated && !!user,
  });
}
