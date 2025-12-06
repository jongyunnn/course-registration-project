"use client";

import { useState, useMemo, useCallback } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCourses } from "../hooks/useCourses";
import { useEnrollments } from "../hooks/useEnrollments";
import { useCourseSelectionStore } from "../store";
import { DEFAULT_SORT_OPTION, type SortOption } from "../constants";
import { CourseEmptyState } from "./CourseEmptyState";
import { CourseSortSelect } from "./CourseSortSelect";
import { CourseGrid } from "./CourseGrid";
import { CourseEnrollmentBar } from "./CourseEnrollmentBar";
import type { ApiResponse, Course, PaginatedResponse } from "@/types";
import { PageTitle } from "@/components/layout/PageTitle";
import { CourseCreateButton } from "./CourseCreateButton";

interface CourseListProps {
  initialData: ApiResponse<PaginatedResponse<Course>>;
}

export function CourseList({ initialData }: CourseListProps) {
  const { isAuthenticated } = useAuth();
  const [sortBy, setSortBy] = useState<SortOption>(DEFAULT_SORT_OPTION);

  const isDefaultSort = sortBy === DEFAULT_SORT_OPTION;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useCourses(sortBy, {
      initialData: isDefaultSort ? initialData : undefined,
    });

  // 수강신청 내역 조회
  const { data: enrollmentsData } = useEnrollments();
  const enrolledCourseIds = useMemo(() => {
    if (!isAuthenticated) return new Set<string>();
    return new Set(enrollmentsData?.data?.enrolledCourseIds ?? []);
  }, [enrollmentsData, isAuthenticated]);

  // 강의 선택을 위한 Zustand 저장소
  const selectedCourses = useCourseSelectionStore(
    (state) => state.selectedCourses
  );
  const toggleCourse = useCourseSelectionStore((state) => state.toggleCourse);
  const isSelected = useCallback(
    (courseId: string) => selectedCourses.has(courseId),
    [selectedCourses]
  );

  const isEnrolled = useCallback(
    (courseId: string) => enrolledCourseIds.has(courseId),
    [enrolledCourseIds]
  );

  const allCourses = useMemo(
    () =>
      data?.pages.flatMap((page) => page.data.items) ?? initialData.data.items,
    [data, initialData.data.items]
  );

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
  };

  const handleToggleCourse = useCallback(
    (courseId: string) => {
      const course = allCourses.find((c) => c.id === courseId);
      if (course) {
        toggleCourse(course);
      }
    },
    [allCourses, toggleCourse]
  );

  const isEmpty = allCourses.length === 0 && !isLoading;

  return (
    <>
      <main className="w-full max-w-md mx-auto space-y-6">
        <PageTitle title="강의목록" action={<CourseCreateButton />} />
        <CourseSortSelect value={sortBy} onChange={handleSortChange} />
        {isEmpty ? (
          <CourseEmptyState />
        ) : (
          <CourseGrid
            courses={allCourses}
            isSelected={isSelected}
            isEnrolled={isEnrolled}
            onToggle={handleToggleCourse}
            hasNextPage={hasNextPage ?? false}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        )}
      </main>
      <CourseEnrollmentBar />
    </>
  );
}
