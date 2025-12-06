import type { Course } from "@/types";
import { CourseCard } from "./CourseCard";
import { COURSE_GRID_LAYOUT } from "../constants";

interface CourseGridStaticProps {
  courses: Course[];
}

export function CourseGridStatic({ courses }: CourseGridStaticProps) {
  return (
    <div className={COURSE_GRID_LAYOUT}>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
