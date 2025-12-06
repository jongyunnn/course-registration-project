import { NextResponse } from 'next/server';
import { Course } from '@/types';
import { db } from '@/lib/mock-db';

export async function POST(request: Request) {
  try {
    // 기본 권한 확인
    const userType = request.headers.get('x-user-type');
    const userId = request.headers.get('x-user-id');
    
    if (userType !== 'INSTRUCTOR') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Only instructors can create courses' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, maxStudents, price } = body;

    // DB에서 강사 이름 찾기 또는 대체 값
    const instructor = db.users.find(u => u.id === userId);
    const instructorName = instructor ? instructor.name : '알 수 없는 강사';

    // 네트워크 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newCourse: Course = {
      id: Math.random().toString(36).substring(7),
      title,
      maxStudents,
      price,
      instructorId: userId || 'unknown', 
      instructorName,
      currentStudents: 0,
      enrollmentRate: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.courses.unshift(newCourse); // 공유 DB의 맨 앞에 추가

    return NextResponse.json({
      success: true,
      data: newCourse,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'recent';

    // 네트워크 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 공유 DB에서 복제 및 정렬 로직
    const sortedCourses = [...db.courses];
    
    switch (sortBy) {
      case 'recent':
        sortedCourses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        sortedCourses.sort((a, b) => b.currentStudents - a.currentStudents);
        break;
      case 'rate':
        sortedCourses.sort((a, b) => b.enrollmentRate - a.enrollmentRate);
        break;
      default:
        sortedCourses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedCourses = sortedCourses.slice(start, end);

    return NextResponse.json({
      success: true,
      data: {
        items: paginatedCourses,
        pagination: {
          page,
          limit,
          total: db.courses.length,
          hasMore: end < db.courses.length,
        },
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
