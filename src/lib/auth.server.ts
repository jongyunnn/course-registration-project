import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { User } from "@/types";

export async function getAuthUser(): Promise<User | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  // NextAuth 세션의 user를 User 타입으로 변환
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    phone: session.user.phone,
    userType: session.user.userType,
    createdAt: new Date().toISOString(), // 세션에는 없으므로 현재 시간 사용
    updatedAt: new Date().toISOString(),
  };
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return session !== null;
}

export async function isInstructor(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return session?.user?.userType === "INSTRUCTOR";
}
