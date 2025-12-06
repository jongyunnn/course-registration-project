import { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { LoginFormSkeleton } from "@/features/auth/components/LoginFormSkeleton";

export const metadata: Metadata = {
  title: "로그인",
  description: "수강신청서비스에 로그인하세요.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFormSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
