import { describe, it, expect } from "vitest";
import { signupSchema, loginSchema } from "./validation";

describe("signupSchema", () => {
  const validData = {
    name: "홍길동",
    email: "test@example.com",
    phone: "010-1234-5678",
    password: "abcD12",
    confirmPassword: "abcD12",
    userType: "STUDENT" as const,
  };

  describe("유효한 데이터", () => {
    it("모든 필드가 올바르면 유효성 검사를 통과해야 한다", () => {
      const result = signupSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("INSTRUCTOR 타입도 유효해야 한다", () => {
      const result = signupSchema.safeParse({
        ...validData,
        userType: "INSTRUCTOR",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("이름 필드", () => {
    it("빈 문자열이면 실패해야 한다", () => {
      const result = signupSchema.safeParse({ ...validData, name: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("이름을 입력해주세요.");
      }
    });

    it("공백만 있으면 실패해야 한다", () => {
      const result = signupSchema.safeParse({ ...validData, name: "   " });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("이름을 입력해주세요.");
      }
    });

    it("null이면 실패해야 한다", () => {
      const result = signupSchema.safeParse({ ...validData, name: null });
      expect(result.success).toBe(false);
    });
  });

  describe("이메일 필드", () => {
    it("유효하지 않은 이메일 형식이면 실패해야 한다", () => {
      const result = signupSchema.safeParse({
        ...validData,
        email: "invalid-email",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "유효한 이메일 형식이 아닙니다."
        );
      }
    });

    it("@가 없는 이메일은 실패해야 한다", () => {
      const result = signupSchema.safeParse({
        ...validData,
        email: "testexample.com",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "유효한 이메일 형식이 아닙니다."
        );
      }
    });
  });

  describe("휴대폰 번호 필드", () => {
    it("올바른 형식(010-XXXX-XXXX)이면 통과해야 한다", () => {
      const result = signupSchema.safeParse({
        ...validData,
        phone: "010-1234-5678",
      });
      expect(result.success).toBe(true);
    });

    it("하이픈이 없으면 실패해야 한다", () => {
      const result = signupSchema.safeParse({
        ...validData,
        phone: "01012345678",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "올바른 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678)"
        );
      }
    });

    it("011로 시작하면 실패해야 한다", () => {
      const result = signupSchema.safeParse({
        ...validData,
        phone: "011-1234-5678",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "올바른 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678)"
        );
      }
    });

    it("자릿수가 부족하면 실패해야 한다", () => {
      const result = signupSchema.safeParse({
        ...validData,
        phone: "010-123-5678",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "올바른 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678)"
        );
      }
    });

    it("019로 시작하면 실패해야 한다", () => {
      const result = signupSchema.safeParse({
        ...validData,
        phone: "019-1234-5678",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "올바른 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678)"
        );
      }
    });

    it("마지막 4자리가 3자리면 실패해야 한다", () => {
      const result = signupSchema.safeParse({
        ...validData,
        phone: "010-1234-567",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "올바른 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678)"
        );
      }
    });
  });

  describe("비밀번호 필드", () => {
    it("6자 미만이면 실패해야 한다", () => {
      const result = signupSchema.safeParse({
        ...validData,
        password: "abc1A",
        confirmPassword: "abc1A",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const messages = result.error.issues.map((i) => i.message);
        expect(messages).toContain("비밀번호는 최소 6자 이상이어야 합니다.");
      }
    });

    it("10자 초과면 실패해야 한다", () => {
      const result = signupSchema.safeParse({
        ...validData,
        password: "abcdefghijK1",
        confirmPassword: "abcdefghijK1",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const messages = result.error.issues.map((i) => i.message);
        expect(messages).toContain("비밀번호는 10자 이하여야 합니다.");
      }
    });

    describe("조합 규칙 (최소 2가지 조합)", () => {
      it("소문자 + 대문자 조합은 통과해야 한다", () => {
        const result = signupSchema.safeParse({
          ...validData,
          password: "abcDEF",
          confirmPassword: "abcDEF",
        });
        expect(result.success).toBe(true);
      });

      it("소문자 + 숫자 조합은 통과해야 한다", () => {
        const result = signupSchema.safeParse({
          ...validData,
          password: "abc123",
          confirmPassword: "abc123",
        });
        expect(result.success).toBe(true);
      });

      it("대문자 + 숫자 조합은 통과해야 한다", () => {
        const result = signupSchema.safeParse({
          ...validData,
          password: "ABC123",
          confirmPassword: "ABC123",
        });
        expect(result.success).toBe(true);
      });

      it("소문자만 있으면 실패해야 한다", () => {
        const result = signupSchema.safeParse({
          ...validData,
          password: "abcdef",
          confirmPassword: "abcdef",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "영문 소문자, 대문자, 숫자 중 최소 2가지 조합이어야 합니다."
          );
        }
      });

      it("대문자만 있으면 실패해야 한다", () => {
        const result = signupSchema.safeParse({
          ...validData,
          password: "ABCDEF",
          confirmPassword: "ABCDEF",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "영문 소문자, 대문자, 숫자 중 최소 2가지 조합이어야 합니다."
          );
        }
      });

      it("숫자만 있으면 실패해야 한다", () => {
        const result = signupSchema.safeParse({
          ...validData,
          password: "123456",
          confirmPassword: "123456",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "영문 소문자, 대문자, 숫자 중 최소 2가지 조합이어야 합니다."
          );
        }
      });
    });
  });

  describe("비밀번호 확인 필드", () => {
    it("비밀번호와 일치하지 않으면 실패해야 한다", () => {
      const result = signupSchema.safeParse({
        ...validData,
        confirmPassword: "different1A",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "비밀번호가 일치하지 않습니다."
        );
      }
    });

    it("빈 문자열이면 실패해야 한다", () => {
      const result = signupSchema.safeParse({
        ...validData,
        confirmPassword: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "비밀번호 확인을 입력해주세요."
        );
      }
    });
  });

  describe("회원 유형 필드", () => {
    it("유효하지 않은 유형이면 실패해야 한다", () => {
      const result = signupSchema.safeParse({
        ...validData,
        userType: "ADMIN",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "회원 유형을 선택해주세요."
        );
      }
    });

    it("null이면 실패해야 한다", () => {
      const result = signupSchema.safeParse({
        ...validData,
        userType: null,
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("loginSchema", () => {
  const validLoginData = {
    email: "test@example.com",
    password: "password123",
  };

  describe("유효한 데이터", () => {
    it("모든 필드가 올바르면 유효성 검사를 통과해야 한다", () => {
      const result = loginSchema.safeParse(validLoginData);
      expect(result.success).toBe(true);
    });
  });

  describe("이메일 필드", () => {
    it("유효하지 않은 이메일 형식이면 실패해야 한다", () => {
      const result = loginSchema.safeParse({
        ...validLoginData,
        email: "invalid-email",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "유효한 이메일 형식이 아닙니다."
        );
      }
    });

    it("@가 없는 이메일은 실패해야 한다", () => {
      const result = loginSchema.safeParse({
        ...validLoginData,
        email: "testexample.com",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "유효한 이메일 형식이 아닙니다."
        );
      }
    });
  });

  describe("비밀번호 필드", () => {
    it("빈 문자열이면 실패해야 한다", () => {
      const result = loginSchema.safeParse({
        ...validLoginData,
        password: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("비밀번호를 입력해주세요.");
      }
    });

    it("null이면 실패해야 한다", () => {
      const result = loginSchema.safeParse({
        ...validLoginData,
        password: null,
      });
      expect(result.success).toBe(false);
    });
  });
});
