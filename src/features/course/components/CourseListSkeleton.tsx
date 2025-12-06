"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { CourseCardSkeleton } from "./CourseCardSkeleton";
import { SKELETON_ITEM_COUNT } from "../constants";

interface CourseListSkeletonProps {
  showCreateButton?: boolean;
}

export function CourseListSkeleton({
  showCreateButton = false,
}: CourseListSkeletonProps) {
  return (
    <main className="w-full max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-32" />
        {showCreateButton && <Skeleton className="h-10 w-24" />}
      </div>

      <Skeleton className="h-10 w-full rounded-lg" />

      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: SKELETON_ITEM_COUNT }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
