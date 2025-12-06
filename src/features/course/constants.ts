export const SORT_OPTIONS = [
  { value: "recent", label: "최근 등록순" },
  { value: "popular", label: "신청자 많은 순" },
  { value: "rate", label: "신청률 높은 순" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export const DEFAULT_SORT_OPTION: SortOption = "recent";

export const SKELETON_ITEM_COUNT = 6;

// 강의 폼 기본값
export const DEFAULT_MAX_STUDENTS = 100;
export const DEFAULT_PRICE = 10000;

// 등록률 임계값
export const ENROLLMENT_RATE = {
  SOLD_OUT_THRESHOLD: 1,
  NEAR_SOLD_OUT_THRESHOLD: 0.8,
} as const;

// 레이아웃
export const COURSE_GRID_LAYOUT = "grid grid-cols-2 gap-3";
export const COURSE_GRID_ROW_PADDING = "pb-3";
