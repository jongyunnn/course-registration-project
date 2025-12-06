import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth.server";
import { CreateCourseForm } from "@/features/course/components/CreateCourseForm";

export const metadata: Metadata = {
  title: "강의등록",
  description: "새로운 강의를 등록하여 수강생을 모집해보세요.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function CreateCoursePage() {
  const user = await getAuthUser();

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!user) {
    redirect("/login?callbackUrl=/courses/create");
  }

  // 강사가 아닌 경우 강의 목록으로 리다이렉트
  if (user.userType !== "INSTRUCTOR") {
    redirect("/courses");
  }

  return <CreateCourseForm />;
}
