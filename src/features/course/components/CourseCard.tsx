import Image from "next/image";
import type { Course } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, cn, formatNumberWithCommas } from "@/lib/utils";
import { getThumbnailUrl } from "../lib/thumbnail";
import { ENROLLMENT_RATE } from "../constants";

interface CourseCardProps {
  course: Course;
  overlay?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

function SoldOutOverlay() {
  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
      <span className="text-white font-bold text-lg">마감</span>
    </div>
  );
}

function NearSoldOutBadge() {
  return (
    <Badge className="absolute top-2 right-2 bg-rose-500 hover:bg-rose-500 text-white text-xs">
      마감임박
    </Badge>
  );
}

export function CourseCard({
  course,
  overlay,
  className,
  onClick,
}: CourseCardProps) {
  const enrollmentPercent = Math.round(course.enrollmentRate * 100);
  const isSoldOut = course.enrollmentRate >= ENROLLMENT_RATE.SOLD_OUT_THRESHOLD;
  const isNearSoldOut =
    !isSoldOut &&
    course.enrollmentRate >= ENROLLMENT_RATE.NEAR_SOLD_OUT_THRESHOLD;

  return (
    <div
      className={cn("rounded-md overflow-hidden", className)}
      onClick={onClick}
    >
      <div className="relative aspect-video w-full">
        <Image
          src={getThumbnailUrl(course.id)}
          alt={course.title}
          fill
          className="object-cover rounded-md"
          sizes="(max-width: 768px) 50vw, 240px"
          loading="eager"
        />
        {isSoldOut && <SoldOutOverlay />}
        {isNearSoldOut && <NearSoldOutBadge />}
        {overlay}
      </div>

      <div className="py-3 px-2 space-y-1">
        <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
          {course.title}
        </h3>
        <p className="text-xs text-muted-foreground">{course.instructorName}</p>
        <p className="font-bold text-base text-foreground">
          {formatCurrency(course.price)}
        </p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>
            {formatNumberWithCommas(course.currentStudents)}/
            {formatNumberWithCommas(course.maxStudents)}명
          </span>
          <Badge variant="secondary" className="py-0">
            신청률 {enrollmentPercent}%
          </Badge>
        </div>
      </div>
    </div>
  );
}
