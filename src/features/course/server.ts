import "server-only";

import { db } from "@/lib/mock-db";
import type { ApiResponse, Course, PaginatedResponse } from "@/types";
import type { SortOption } from "./constants";

const DEFAULT_LIMIT = 20;

interface GetCoursesParams {
  page?: number;
  limit?: number;
  sortBy?: SortOption;
}

export async function getCoursesPaginated(
  params?: GetCoursesParams
): Promise<ApiResponse<PaginatedResponse<Course>>> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? DEFAULT_LIMIT;
  const sortBy = params?.sortBy ?? "recent";

  const sortedCourses = [...db.courses];

  switch (sortBy) {
    case "recent":
      sortedCourses.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "popular":
      sortedCourses.sort((a, b) => b.currentStudents - a.currentStudents);
      break;
    case "rate":
      sortedCourses.sort((a, b) => b.enrollmentRate - a.enrollmentRate);
      break;
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedCourses = sortedCourses.slice(start, end);

  return {
    success: true,
    data: {
      items: paginatedCourses,
      pagination: {
        page,
        limit,
        total: db.courses.length,
        hasMore: end < db.courses.length,
      },
    },
  };
}
