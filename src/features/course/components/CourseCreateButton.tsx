"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function CourseCreateButton() {
  const router = useRouter();
  const { isInstructor, isAuthenticated, isLoading } = useAuth();

  // 로딩 중이거나 로그인하지 않았거나 강사가 아니면 숨김
  if (isLoading || !isAuthenticated || !isInstructor()) {
    return null;
  }

  return (
    <Button onClick={() => router.push("/courses/create")} variant="outline">
      강의등록
    </Button>
  );
}
