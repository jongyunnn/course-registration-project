import { useInfiniteQuery } from "@tanstack/react-query";
import { courseApi } from "../api";
import type { ApiResponse, Course, PaginatedResponse } from "@/types";

type CoursesPage = ApiResponse<PaginatedResponse<Course>>;

interface UseCoursesOptions {
  initialData?: CoursesPage;
}

export const useCourses = (
  sortBy: string = "recent",
  options?: UseCoursesOptions
) => {
  return useInfiniteQuery({
    queryKey: ["courses", sortBy],
    queryFn: ({ pageParam = 1 }) =>
      courseApi.getCourses({ page: pageParam, limit: 20, sortBy }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.data.pagination.hasMore) {
        return lastPage.data.pagination.page + 1;
      }
      return undefined;
    },
    ...(options?.initialData && {
      initialData: {
        pages: [options.initialData],
        pageParams: [1],
      },
    }),
  });
};
