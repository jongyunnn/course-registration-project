import { Course, User, Enrollment } from "@/types";

class MockDB {
  public courses: Course[];
  public users: User[];
  public enrollments: Enrollment[];

  constructor() {
    // 테스트용 사용자
    this.users = [
      {
        id: "user-student-test",
        name: "학생",
        email: "student@test.com",
        phone: "010-1234-5678",
        password: "Student1234",
        userType: "STUDENT",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "user-instructor-test",
        name: "강사",
        email: "instructor@test.com",
        phone: "010-9876-5432",
        password: "Instructor1234",
        userType: "INSTRUCTOR",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    this.courses = [];

    // 1,000개의 강의 생성
    for (let i = 1; i <= 1000; i++) {
      const maxStudents = Math.floor(Math.random() * 40) + 10;
      const currentStudents = Math.floor(Math.random() * maxStudents);
      const price = (Math.floor(Math.random() * 50) + 1) * 10000;
      const categories = [
        "프로그래밍",
        "디자인",
        "마케팅",
        "영상편집",
        "데이터 분석",
      ];
      const levels = ["입문", "초급", "중급", "고급", "실전"];
      const category =
        categories[Math.floor(Math.random() * categories.length)];
      const level = levels[Math.floor(Math.random() * levels.length)];

      this.courses.push({
        id: `mock-c-${i}`,
        title: `${category} ${level} 과정 ${i}`,
        maxStudents,
        price,
        instructorId: `inst-${(i % 5) + 1}`,
        instructorName: `김강사${(i % 5) + 1}`,
        currentStudents,
        enrollmentRate: Number((currentStudents / maxStudents).toFixed(2)),
        createdAt: new Date(
          Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)
        ).toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    this.enrollments = [];
  }

  // 사용자의 수강신청 내역 조회
  getEnrollmentsByUserId(userId: string): Enrollment[] {
    return this.enrollments.filter((e) => e.userId === userId);
  }

  // 특정 강의에 이미 수강신청했는지 확인
  isEnrolled(userId: string, courseId: string): boolean {
    return this.enrollments.some(
      (e) => e.userId === userId && e.courseId === courseId
    );
  }

  // 수강신청 추가
  addEnrollment(userId: string, courseId: string): Enrollment {
    const enrollment: Enrollment = {
      id: `enroll-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId,
      courseId,
      createdAt: new Date().toISOString(),
    };
    this.enrollments.push(enrollment);
    return enrollment;
  }
}

// 개발 중 핫 리로드 시 데이터 유지를 위해 globalThis 사용
const globalForMockDB = globalThis as unknown as { mockDB: MockDB };

export const db = globalForMockDB.mockDB || new MockDB();

if (process.env.NODE_ENV !== "production") globalForMockDB.mockDB = db;
