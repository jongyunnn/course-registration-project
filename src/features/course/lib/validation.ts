import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(1, "강의명을 입력해주세요."),
  maxStudents: z.coerce
    .number()
    .int("정수만 입력 가능합니다.")
    .positive("양수만 입력 가능합니다.")
    .min(1, "최소 1명 이상이어야 합니다."),
  price: z.coerce
    .number()
    .int("정수만 입력 가능합니다.")
    .min(0, "가격은 0원 이상이어야 합니다."),
});

export type CourseFormData = z.infer<typeof courseSchema>;
