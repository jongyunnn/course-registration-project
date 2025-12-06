"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCourseSelectionStore } from "../store";
import { useEnrollAction } from "../hooks/useEnrollAction";
import { CourseCardHorizontal } from "./CourseCardHorizontal";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";

export function CourseSelectionDialog() {
  const { handleEnroll: onEnroll, isEnrolling } = useEnrollAction();
  const isDialogOpen = useCourseSelectionStore((state) => state.isDialogOpen);
  const closeDialog = useCourseSelectionStore((state) => state.closeDialog);
  const removeCourse = useCourseSelectionStore((state) => state.removeCourse);
  const clearSelection = useCourseSelectionStore(
    (state) => state.clearSelection
  );

  const selectedCoursesMap = useCourseSelectionStore(
    (state) => state.selectedCourses
  );

  const selectedCourses = Array.from(selectedCoursesMap.values());
  const totalPrice = selectedCourses.reduce(
    (sum, course) => sum + course.price,
    0
  );

  const handleEnroll = () => {
    onEnroll();
    closeDialog();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
      <DialogContent className="h-dvh max-h-dvh w-full max-w-full sm:max-w-full rounded-none flex flex-col p-0">
        <DialogHeader className="p-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              선택한 강의 ({selectedCourses.length}개)
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            수강 신청할 강의 목록입니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {selectedCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mb-4 opacity-50" />
              <p>선택한 강의가 없습니다.</p>
              <p className="text-sm">강의를 선택해주세요.</p>
            </div>
          ) : (
            <div className="space-y-3 max-w-md mx-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={clearSelection}
                className="ml-auto flex"
              >
                전체 삭제
              </Button>
              {selectedCourses.map((course) => (
                <CourseCardHorizontal
                  key={course.id}
                  course={course}
                  onRemove={removeCourse}
                />
              ))}
            </div>
          )}
        </div>

        <div className="bg-background shrink-0 border-t p-4">
          <div className="max-w-md mx-auto space-y-3 pb-[env(safe-area-inset-bottom)]">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">총 결제 금액</span>
              <span className="text-xl font-bold">
                {formatCurrency(totalPrice)}
              </span>
            </div>
            <Button
              onClick={handleEnroll}
              disabled={selectedCourses.length === 0}
              className="w-full"
              size="lg"
              loading={isEnrolling}
            >
              {selectedCourses.length > 0
                ? `수강 신청하기 (${selectedCourses.length}개)`
                : "강의를 선택해주세요"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
