export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string; // 필요한 경우 클라이언트 사이드 사용을 위한 선택 사항이지만 일반적으로 노출되지 않음
  userType: "STUDENT" | "INSTRUCTOR";
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  maxStudents: number;
  price: number;
  instructorId: string;
  instructorName: string;
  currentStudents: number;
  enrollmentRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

// HTTP 상태 코드
export const HTTP_STATUS = {
  CONFLICT: 409,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}
