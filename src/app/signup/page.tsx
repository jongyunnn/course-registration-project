import { Metadata } from "next";
import { SignupForm } from "@/features/auth/components/SignupForm";

export const metadata: Metadata = {
  title: "회원가입",
  description: "수강신청서비스에 가입하고 다양한 재테크 강의를 수강하세요.",
};

export default function SignupPage() {
  return <SignupForm />;
}
