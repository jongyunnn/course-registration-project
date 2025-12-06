"use client";

import type { Course } from "@/types";
import { useMounted } from "@/hooks/useMounted";
import { CourseGridStatic } from "./CourseGridStatic";
import { CourseGridVirtual } from "./CourseGridVirtual";

interface CourseGridProps {
  courses: Course[];
  isSelected: (courseId: string) => boolean;
  isEnrolled: (courseId: string) => boolean;
  onToggle: (courseId: string) => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export function CourseGrid({
  courses,
  isSelected,
  isEnrolled,
  onToggle,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: CourseGridProps) {
  const mounted = useMounted();

  // SSR/hydration 전: 정적 그리드
  if (!mounted) {
    return <CourseGridStatic courses={courses} />;
  }

  // hydration 후: 가상화 그리드
  return (
    <CourseGridVirtual
      courses={courses}
      isSelected={isSelected}
      isEnrolled={isEnrolled}
      onToggle={onToggle}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
}
