import { NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';
import { HTTP_STATUS } from '@/types';

export async function POST(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const body = await request.json();
    const { courseIds } = body as { courseIds: string[] };

    // 이미 수강신청한 강의가 있는지 확인
    const alreadyEnrolledCourses = courseIds.filter((courseId) =>
      db.isEnrolled(userId, courseId)
    );

    if (alreadyEnrolledCourses.length > 0) {
      const courseNames = alreadyEnrolledCourses
        .map((id) => db.courses.find((c) => c.id === id)?.title)
        .filter(Boolean)
        .join(', ');

      return NextResponse.json(
        {
          success: false,
          error: `이미 수강신청한 강의가 포함되어 있습니다: ${courseNames}`,
          alreadyEnrolledCourseIds: alreadyEnrolledCourses,
        },
        { status: HTTP_STATUS.CONFLICT }
      );
    }

    // 네트워크 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const enrolledCourses: string[] = [];
    const failedCourses: { courseId: string; reason: string }[] = [];

    // 공유 DB 로직 업데이트
    courseIds.forEach((courseId: string) => {
      const course = db.courses.find((c) => c.id === courseId);
      if (course) {
        // 정원 초과 체크
        if (course.currentStudents >= course.maxStudents) {
          failedCourses.push({ courseId, reason: '정원이 마감되었습니다.' });
          return;
        }

        // 수강신청 처리
        course.currentStudents += 1;
        course.enrollmentRate = course.currentStudents / course.maxStudents;
        db.addEnrollment(userId, courseId);
        enrolledCourses.push(courseId);
      } else {
        failedCourses.push({ courseId, reason: '강의를 찾을 수 없습니다.' });
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        enrolledCourses,
        failedCourses,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

// 사용자의 수강신청 내역 조회
export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    // 네트워크 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 300));

    const enrollments = db.getEnrollmentsByUserId(userId);
    const enrolledCourseIds = enrollments.map((e) => e.courseId);

    return NextResponse.json({
      success: true,
      data: {
        enrolledCourseIds,
        enrollments,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
