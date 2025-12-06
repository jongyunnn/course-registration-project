"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useEnroll } from "./useEnroll";
import { useCourseSelectionStore } from "../store";

export function useEnrollAction() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { mutate: enrollCourses, isPending: isEnrolling } = useEnroll();

  const getSelectedCourseIds = useCourseSelectionStore(
    (state) => state.getSelectedCourseIds
  );
  const clearSelection = useCourseSelectionStore(
    (state) => state.clearSelection
  );

  const handleEnroll = useCallback(() => {
    if (!isAuthenticated) {
      toast.error("로그인이 필요합니다.");
      router.push("/login?callbackUrl=/courses");
      return;
    }

    const courseIds = getSelectedCourseIds();
    enrollCourses(courseIds, {
      onSuccess: () => {
        toast.success("수강 신청이 완료되었습니다.");
        clearSelection();
      },
      onError: (error) => {
        toast.error(error.message || "수강 신청에 실패했습니다.");
      },
    });
  }, [
    isAuthenticated,
    router,
    getSelectedCourseIds,
    enrollCourses,
    clearSelection,
  ]);

  return { handleEnroll, isEnrolling };
}
