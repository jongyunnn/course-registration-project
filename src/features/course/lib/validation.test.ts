import { describe, it, expect } from "vitest";
import { courseSchema } from "./validation";

describe("courseSchema", () => {
  const validData = {
    title: "웹 개발 기초",
    maxStudents: 30,
    price: 50000,
  };

  describe("유효한 데이터", () => {
    it("모든 필드가 올바르면 유효성 검사를 통과해야 한다", () => {
      const result = courseSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("가격이 0원이면 통과해야 한다", () => {
      const result = courseSchema.safeParse({
        ...validData,
        price: 0,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.price).toBe(0);
      }
    });

    it("문자열 숫자도 coerce로 변환되어 통과해야 한다", () => {
      const result = courseSchema.safeParse({
        ...validData,
        maxStudents: "50",
        price: "100000",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.maxStudents).toBe(50);
        expect(result.data.price).toBe(100000);
      }
    });
  });

  describe("강의명 필드", () => {
    it("빈 문자열이면 실패해야 한다", () => {
      const result = courseSchema.safeParse({ ...validData, title: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("강의명을 입력해주세요.");
      }
    });

    it("공백만 있으면 실패해야 한다 (trim 후 빈 문자열)", () => {
      const result = courseSchema.safeParse({ ...validData, title: "   " });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("강의명을 입력해주세요.");
      }
    });

    it("null이면 실패해야 한다", () => {
      const result = courseSchema.safeParse({ ...validData, title: null });
      expect(result.success).toBe(false);
    });

    it("undefined이면 실패해야 한다", () => {
      const result = courseSchema.safeParse({ ...validData, title: undefined });
      expect(result.success).toBe(false);
    });

    it("매우 긴 제목도 통과해야 한다", () => {
      const longTitle = "A".repeat(100);
      const result = courseSchema.safeParse({ ...validData, title: longTitle });
      expect(result.success).toBe(true);
    });
  });

  describe("최대 수강 인원 필드", () => {
    it("0이면 실패해야 한다", () => {
      const result = courseSchema.safeParse({ ...validData, maxStudents: 0 });
      expect(result.success).toBe(false);
      if (!result.success) {
        const messages = result.error.issues.map((i) => i.message);
        expect(messages).toContain("양수만 입력 가능합니다.");
      }
    });

    it("음수면 실패해야 한다", () => {
      const result = courseSchema.safeParse({ ...validData, maxStudents: -1 });
      expect(result.success).toBe(false);
      if (!result.success) {
        const messages = result.error.issues.map((i) => i.message);
        expect(messages).toContain("양수만 입력 가능합니다.");
      }
    });

    it("소수점이면 실패해야 한다", () => {
      const result = courseSchema.safeParse({
        ...validData,
        maxStudents: 10.5,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("정수만 입력 가능합니다.");
      }
    });

    it("1이면 통과해야 한다", () => {
      const result = courseSchema.safeParse({ ...validData, maxStudents: 1 });
      expect(result.success).toBe(true);
    });

    it("큰 숫자도 통과해야 한다", () => {
      const result = courseSchema.safeParse({
        ...validData,
        maxStudents: 10000,
      });
      expect(result.success).toBe(true);
    });

    it("null이면 실패해야 한다", () => {
      const result = courseSchema.safeParse({
        ...validData,
        maxStudents: null,
      });
      expect(result.success).toBe(false);
    });

    it("undefined이면 실패해야 한다", () => {
      const result = courseSchema.safeParse({
        ...validData,
        maxStudents: undefined,
      });
      expect(result.success).toBe(false);
    });

    it("빈 문자열은 coerce로 실패해야 한다", () => {
      const result = courseSchema.safeParse({ ...validData, maxStudents: "" });
      expect(result.success).toBe(false);
    });
  });

  describe("가격 필드", () => {
    it("음수면 실패해야 한다", () => {
      const result = courseSchema.safeParse({ ...validData, price: -1 });
      expect(result.success).toBe(false);
      if (!result.success) {
        const messages = result.error.issues.map((i) => i.message);
        expect(messages).toContain("가격은 0원 이상이어야 합니다.");
      }
    });

    it("소수점이면 실패해야 한다", () => {
      const result = courseSchema.safeParse({
        ...validData,
        price: 10000.5,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("정수만 입력 가능합니다.");
      }
    });

    it("큰 금액도 통과해야 한다", () => {
      const result = courseSchema.safeParse({
        ...validData,
        price: 1000000,
      });
      expect(result.success).toBe(true);
    });

    it("0원이면 통과해야 한다", () => {
      const result = courseSchema.safeParse({ ...validData, price: 0 });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.price).toBe(0);
      }
    });

    it("null이면 실패해야 한다", () => {
      const result = courseSchema.safeParse({ ...validData, price: null });
      expect(result.success).toBe(false);
    });

    it("undefined이면 실패해야 한다", () => {
      const result = courseSchema.safeParse({ ...validData, price: undefined });
      expect(result.success).toBe(false);
    });

    it("빈 문자열은 coerce로 실패해야 한다", () => {
      const result = courseSchema.safeParse({ ...validData, price: "" });
      expect(result.success).toBe(false);
    });

    it("콤마가 있는 문자열은 coerce로 실패해야 한다", () => {
      const result = courseSchema.safeParse({ ...validData, price: "50,000" });
      expect(result.success).toBe(false);
    });
  });

  describe("타입 추론", () => {
    it("올바른 타입이 추론되어야 한다", () => {
      const result = courseSchema.safeParse(validData);
      if (result.success) {
        const data = result.data;
        expect(typeof data.title).toBe("string");
        expect(typeof data.maxStudents).toBe("number");
        expect(typeof data.price).toBe("number");
      }
    });
  });
});
