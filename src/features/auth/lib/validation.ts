import { z } from "zod";

// 로그인 스키마
export const loginSchema = z.object({
  email: z.email("유효한 이메일 형식이 아닙니다."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// 회원가입 스키마
export const signupSchema = z
  .object({
    name: z.string().trim().min(1, "이름을 입력해주세요."),
    email: z.email("유효한 이메일 형식이 아닙니다."),
    phone: z
      .string()
      .regex(
        /^010-\d{4}-\d{4}$/,
        "올바른 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678)"
      ),
    password: z
      .string()
      .min(6, "비밀번호는 최소 6자 이상이어야 합니다.")
      .max(10, "비밀번호는 10자 이하여야 합니다.")
      // 영문 소문자, 대문자, 숫자 중 최소 2가지 조합 확인
      .regex(
        /^(?:(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*\d)|(?=.*[A-Z])(?=.*\d)).+$/,
        "영문 소문자, 대문자, 숫자 중 최소 2가지 조합이어야 합니다."
      ),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요."),
    userType: z.enum(["STUDENT", "INSTRUCTOR"], {
      message: "회원 유형을 선택해주세요.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
export type SignupRequestData = Omit<SignupFormData, "confirmPassword">;
