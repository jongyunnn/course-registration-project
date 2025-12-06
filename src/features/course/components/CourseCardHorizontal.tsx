"use client";

import Image from "next/image";
import type { Course } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { X } from "lucide-react";
import { getThumbnailUrl } from "../lib/thumbnail";

interface CourseCardHorizontalProps {
  course: Course;
  onRemove: (courseId: string) => void;
}

export function CourseCardHorizontal({
  course,
  onRemove,
}: CourseCardHorizontalProps) {
  const enrollmentPercent = Math.round(course.enrollmentRate * 100);

  return (
    <div className="flex gap-3">
      <div className="relative w-24 h-16 shrink-0">
        <Image
          src={getThumbnailUrl(course.id)}
          alt={course.title}
          fill
          className="object-cover rounded-md"
          sizes="96px"
        />
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <h3 className="font-semibold text-sm line-clamp-1">{course.title}</h3>
        <p className="text-xs text-muted-foreground">{course.instructorName}</p>
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm">
            {formatCurrency(course.price)}
          </span>
          <Badge variant="secondary" className="text-xs py-0">
            신청률 {enrollmentPercent}%
          </Badge>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 size-5"
        onClick={() => onRemove(course.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
