"use client";

import type { Course } from "@/types";
import { CourseCardSelectable } from "./CourseCardSelectable";
import { CourseCardSkeleton } from "./CourseCardSkeleton";
import { COURSE_GRID_LAYOUT, COURSE_GRID_ROW_PADDING } from "../constants";
import { cn } from "@/lib/utils";
import { useCourseVirtualizer } from "../hooks/useCourseVirtualizer";

interface CourseGridVirtualProps {
  courses: Course[];
  isSelected: (courseId: string) => boolean;
  isEnrolled: (courseId: string) => boolean;
  onToggle: (courseId: string) => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export function CourseGridVirtual({
  courses,
  isSelected,
  isEnrolled,
  onToggle,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: CourseGridVirtualProps) {
  const { virtualizer, virtualItems, totalSize, getRowItems, isLoaderRow } =
    useCourseVirtualizer({
      itemCount: courses.length,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
    });
  return (
    <div
      style={{
        height: `${totalSize}px`,
        width: "100%",
        position: "relative",
      }}
    >
      {virtualItems.map((virtualRow) => {
        const isLoader = isLoaderRow(virtualRow.index);
        const { leftItem: leftCourse, rightItem: rightCourse } = getRowItems(
          courses,
          virtualRow.index
        );

        return (
          <div
            key={virtualRow.key}
            data-index={virtualRow.index}
            ref={virtualizer.measureElement}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {isLoader ? (
              <LoaderRow />
            ) : (
              <CourseRow
                leftCourse={leftCourse}
                rightCourse={rightCourse}
                isSelected={isSelected}
                isEnrolled={isEnrolled}
                onToggle={onToggle}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function LoaderRow() {
  return (
    <div className={cn(COURSE_GRID_LAYOUT, COURSE_GRID_ROW_PADDING)}>
      <CourseCardSkeleton />
      <CourseCardSkeleton />
    </div>
  );
}

interface CourseRowProps {
  leftCourse: Course | undefined;
  rightCourse: Course | undefined;
  isSelected: (courseId: string) => boolean;
  isEnrolled: (courseId: string) => boolean;
  onToggle: (courseId: string) => void;
}

function CourseRow({
  leftCourse,
  rightCourse,
  isSelected,
  isEnrolled,
  onToggle,
}: CourseRowProps) {
  return (
    <div className={cn(COURSE_GRID_LAYOUT, COURSE_GRID_ROW_PADDING)}>
      {leftCourse && (
        <CourseCardSelectable
          course={leftCourse}
          isSelected={isSelected(leftCourse.id)}
          isEnrolled={isEnrolled(leftCourse.id)}
          onToggle={() => onToggle(leftCourse.id)}
        />
      )}
      {rightCourse && (
        <CourseCardSelectable
          course={rightCourse}
          isSelected={isSelected(rightCourse.id)}
          isEnrolled={isEnrolled(rightCourse.id)}
          onToggle={() => onToggle(rightCourse.id)}
        />
      )}
    </div>
  );
}
