import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/mock-db";

// User 타입 확장을 위한 모듈 선언
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
      userType: "STUDENT" | "INSTRUCTOR";
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    userType: "STUDENT" | "INSTRUCTOR";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    phone: string;
    userType: "STUDENT" | "INSTRUCTOR";
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("이메일과 비밀번호를 입력해주세요.");
        }

        // MockDB에서 사용자 조회
        const user = db.users.find(
          (u) =>
            u.email === credentials.email &&
            u.password === credentials.password
        );

        if (!user) {
          throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          userType: user.userType,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7일
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // 최초 로그인 시 user 정보를 token에 저장
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.phone = user.phone;
        token.userType = user.userType;
      }
      return token;
    },
    async session({ session, token }) {
      // token 정보를 session에 전달
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        phone: token.phone,
        userType: token.userType,
      };
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
