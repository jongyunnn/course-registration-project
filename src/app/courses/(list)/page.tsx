import { Metadata } from "next";
import { CourseList } from "@/features/course/components/CourseList";
import { getCoursesPaginated } from "@/features/course/server";

export const metadata: Metadata = {
  title: "강의목록",
  description: "부동산, 주식, 재테크 등 다양한 강의를 만나보세요.",
};

export default async function CoursesPage() {
  const initialData = await getCoursesPaginated({ page: 1, sortBy: "recent" });

  return <CourseList initialData={initialData} />;
}
