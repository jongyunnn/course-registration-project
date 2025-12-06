import { NextResponse } from "next/server";
import { User } from "@/types";
import { db } from "@/lib/mock-db";
import { AUTH_MESSAGES } from "@/features/auth/constants";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, password, userType } = body;

    // 네트워크 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 중복 이메일 확인
    const existingEmailUser = db.users.find((user) => user.email === email);
    if (existingEmailUser) {
      return NextResponse.json(
        { success: false, error: AUTH_MESSAGES.SIGNUP.EMAIL_DUPLICATE },
        { status: 409 }
      );
    }

    // 중복 전화번호 확인
    const existingPhoneUser = db.users.find((user) => user.phone === phone);
    if (existingPhoneUser) {
      return NextResponse.json(
        { success: false, error: AUTH_MESSAGES.SIGNUP.PHONE_DUPLICATE },
        { status: 409 }
      );
    }

    // 새 사용자 생성 (비밀번호 포함하여 DB 저장)
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      name,
      email,
      phone,
      password, // MockDB에 저장 (실제 환경에서는 해시 필요)
      userType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 공유 DB에 저장
    db.users.push(newUser);

    // 응답에서 비밀번호 제외
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: AUTH_MESSAGES.SIGNUP.UNKNOWN },
      { status: 500 }
    );
  }
}
