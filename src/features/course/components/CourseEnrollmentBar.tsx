"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";
import { useCourseSelectionStore } from "../store";
import { useEnrollAction } from "../hooks/useEnrollAction";
import { CourseSelectionDialog } from "./CourseSelectionDialog";
import { formatCurrency } from "@/lib/utils";

export function CourseEnrollmentBar() {
  const { handleEnroll, isEnrolling } = useEnrollAction();
  const selectedCoursesMap = useCourseSelectionStore(
    (state) => state.selectedCourses
  );
  const openDialog = useCourseSelectionStore((state) => state.openDialog);

  const selectedCount = selectedCoursesMap.size;
  const hasSelection = selectedCount > 0;

  const totalPrice = useMemo(() => {
    return Array.from(selectedCoursesMap.values()).reduce(
      (sum, course) => sum + course.price,
      0
    );
  }, [selectedCoursesMap]);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg z-50">
        <div className="mx-auto max-w-md space-y-3 pb-[env(safe-area-inset-bottom)]">
          {hasSelection && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">총 결제 금액</span>
              <span className="text-xl font-bold">
                {formatCurrency(totalPrice)}
              </span>
            </div>
          )}
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Button
              onClick={handleEnroll}
              disabled={!hasSelection}
              className="w-full"
              size="lg"
              loading={isEnrolling}
            >
              {hasSelection
                ? `수강 신청하기 (${selectedCount}개)`
                : "수강 신청할 강의를 선택해주세요."}
            </Button>
            <Button size="icon-lg" variant="outline" onClick={openDialog}>
              <List />
            </Button>
          </div>
        </div>
      </div>
      <CourseSelectionDialog />
    </>
  );
}
