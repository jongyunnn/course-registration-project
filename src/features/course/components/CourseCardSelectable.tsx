"use client";

import { Course } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { CourseCard } from "./CourseCard";
import { cn } from "@/lib/utils";
import { ENROLLMENT_RATE } from "../constants";

interface CourseCardSelectableProps {
  course: Course;
  isSelected: boolean;
  isEnrolled: boolean;
  onToggle: (checked: boolean) => void;
}

export function CourseCardSelectable({
  course,
  isSelected,
  isEnrolled,
  onToggle,
}: CourseCardSelectableProps) {
  const { user, isInstructor } = useAuth();

  const isMyCourse = isInstructor() && user?.id === course.instructorId;
  const isSoldOut = course.enrollmentRate >= ENROLLMENT_RATE.SOLD_OUT_THRESHOLD;
  const isDisabled = isSoldOut || isEnrolled || isMyCourse;

  const handleClick = () => {
    if (isDisabled) return;
    onToggle(!isSelected);
  };

  const courseCardClassName = cn(
    "transition-all",
    isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
    isSelected && "ring-2 ring-rose-500",
    isMyCourse && "bg-secondary/10"
  );

  const topRightBadgeStyle = "absolute top-2 right-2 text-white text-xs z-10";

  return (
    <CourseCard
      course={course}
      onClick={handleClick}
      className={courseCardClassName}
      overlay={
        <>
          <div className="absolute top-2 left-2 z-10">
            <Checkbox
              className="size-5 bg-white/80 border-white data-[state=checked]:bg-rose-500 data-[state=checked]:border-white"
              checked={isSelected}
              disabled={isDisabled}
            />
          </div>
          {isEnrolled && (
            <Badge
              className={cn(
                topRightBadgeStyle,
                "bg-emerald-500 hover:bg-emerald-500"
              )}
            >
              수강중
            </Badge>
          )}
          {!isEnrolled && isMyCourse && (
            <Badge
              className={cn(
                topRightBadgeStyle,
                "bg-violet-500 hover:bg-violet-500"
              )}
            >
              내 강의
            </Badge>
          )}
        </>
      }
    />
  );
}
