"use client";

import { create } from "zustand";
import type { Course } from "@/types";

interface CourseSelectionState {
  selectedCourses: Map<string, Course>;
  isDialogOpen: boolean;

  // 액션
  toggleCourse: (course: Course) => void;
  removeCourse: (courseId: string) => void;
  clearSelection: () => void;
  isSelected: (courseId: string) => boolean;
  openDialog: () => void;
  closeDialog: () => void;

  // 계산된 상태
  getSelectedCount: () => number;
  getSelectedCourseIds: () => string[];
  getSelectedCoursesList: () => Course[];
}

export const useCourseSelectionStore = create<CourseSelectionState>()(
  (set, get) => ({
    selectedCourses: new Map(),
    isDialogOpen: false,

    toggleCourse: (course: Course) => {
      set((state) => {
        const newMap = new Map(state.selectedCourses);
        if (newMap.has(course.id)) {
          newMap.delete(course.id);
        } else {
          newMap.set(course.id, course);
        }
        return { selectedCourses: newMap };
      });
    },

    removeCourse: (courseId: string) => {
      set((state) => {
        const newMap = new Map(state.selectedCourses);
        newMap.delete(courseId);
        return { selectedCourses: newMap };
      });
    },

    clearSelection: () => {
      set({ selectedCourses: new Map() });
    },

    isSelected: (courseId: string) => {
      return get().selectedCourses.has(courseId);
    },

    openDialog: () => {
      set({ isDialogOpen: true });
    },

    closeDialog: () => {
      set({ isDialogOpen: false });
    },

    getSelectedCount: () => {
      return get().selectedCourses.size;
    },

    getSelectedCourseIds: () => {
      return Array.from(get().selectedCourses.keys());
    },

    getSelectedCoursesList: () => {
      return Array.from(get().selectedCourses.values());
    },
  })
);
