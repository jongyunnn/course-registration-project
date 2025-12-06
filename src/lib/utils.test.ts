import { describe, it, expect } from "vitest";
import {
  cn,
  formatCurrency,
  formatDate,
  formatNumberWithCommas,
  formatPhoneNumber,
  parseFormattedNumber,
} from "./utils";

describe("cn", () => {
  it("단일 클래스를 반환해야 한다", () => {
    expect(cn("text-red-500")).toBe("text-red-500");
  });

  it("여러 클래스를 병합해야 한다", () => {
    expect(cn("text-red-500", "bg-blue-500")).toBe("text-red-500 bg-blue-500");
  });

  it("조건부 클래스를 처리해야 한다", () => {
    expect(cn("base", true && "active", false && "inactive")).toBe(
      "base active"
    );
  });

  it("Tailwind 충돌을 해결해야 한다", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("빈 입력을 처리해야 한다", () => {
    expect(cn()).toBe("");
    expect(cn("")).toBe("");
  });

  it("객체 구문을 지원해야 한다", () => {
    expect(cn({ "text-red-500": true, "text-blue-500": false })).toBe(
      "text-red-500"
    );
  });

  it("배열 구문을 지원해야 한다", () => {
    expect(cn(["text-red-500", "bg-blue-500"])).toBe(
      "text-red-500 bg-blue-500"
    );
  });
});

describe("formatCurrency", () => {
  it("원화 형식으로 포맷해야 한다", () => {
    expect(formatCurrency(1000)).toBe("₩1,000");
    expect(formatCurrency(50000)).toBe("₩50,000");
    expect(formatCurrency(1000000)).toBe("₩1,000,000");
  });

  it("0을 올바르게 포맷해야 한다", () => {
    expect(formatCurrency(0)).toBe("₩0");
  });

  it("음수를 올바르게 포맷해야 한다", () => {
    expect(formatCurrency(-5000)).toBe("-₩5,000");
  });

  it("소수점이 있는 숫자를 처리해야 한다", () => {
    const result = formatCurrency(1234.56);
    expect(result).toMatch(/₩1,23[45]/);
  });
});

describe("formatDate", () => {
  it("날짜를 한국어 형식으로 포맷해야 한다", () => {
    const result = formatDate("2024-03-15T14:30:00");
    expect(result).toBe("2024.03.15.(금) 14:30");
  });

  it("오전 시간을 올바르게 표시해야 한다", () => {
    const result = formatDate("2024-01-01T09:00:00");
    expect(result).toBe("2024.01.01.(월) 09:00");
  });

  it("자정을 올바르게 표시해야 한다", () => {
    const result = formatDate("2024-06-15T00:00:00");
    expect(result).toBe("2024.06.15.(토) 00:00");
  });

  describe("모든 요일 테스트", () => {
    it("월요일을 올바르게 표시해야 한다", () => {
      const result = formatDate("2024-01-01T12:00:00");
      expect(result).toBe("2024.01.01.(월) 12:00");
    });

    it("화요일을 올바르게 표시해야 한다", () => {
      const result = formatDate("2024-01-02T12:00:00");
      expect(result).toBe("2024.01.02.(화) 12:00");
    });

    it("수요일을 올바르게 표시해야 한다", () => {
      const result = formatDate("2024-01-03T12:00:00");
      expect(result).toBe("2024.01.03.(수) 12:00");
    });

    it("목요일을 올바르게 표시해야 한다", () => {
      const result = formatDate("2024-01-04T12:00:00");
      expect(result).toBe("2024.01.04.(목) 12:00");
    });

    it("금요일을 올바르게 표시해야 한다", () => {
      const result = formatDate("2024-01-05T12:00:00");
      expect(result).toBe("2024.01.05.(금) 12:00");
    });

    it("토요일을 올바르게 표시해야 한다", () => {
      const result = formatDate("2024-01-06T12:00:00");
      expect(result).toBe("2024.01.06.(토) 12:00");
    });

    it("일요일을 올바르게 표시해야 한다", () => {
      const result = formatDate("2024-01-07T12:00:00");
      expect(result).toBe("2024.01.07.(일) 12:00");
    });
  });

  describe("엣지 케이스", () => {
    it("윤년을 올바르게 처리해야 한다", () => {
      const result = formatDate("2024-02-29T12:00:00");
      expect(result).toBe("2024.02.29.(목) 12:00");
    });

    it("연말을 올바르게 처리해야 한다", () => {
      const result = formatDate("2024-12-31T23:59:59");
      expect(result).toBe("2024.12.31.(화) 23:59");
    });

    it("ISO 문자열이 아닌 날짜도 처리해야 한다", () => {
      const result = formatDate("2024/03/15 14:30:00");
      expect(result).toMatch(/2024\.03\.15/);
    });
  });
});

describe("formatPhoneNumber", () => {
  describe("숫자 입력에 따른 포맷팅", () => {
    it("3자리 이하는 그대로 반환해야 한다", () => {
      expect(formatPhoneNumber("0")).toBe("0");
      expect(formatPhoneNumber("01")).toBe("01");
      expect(formatPhoneNumber("010")).toBe("010");
    });

    it("4-7자리는 XXX-XXXX 형식으로 포맷해야 한다", () => {
      expect(formatPhoneNumber("0101")).toBe("010-1");
      expect(formatPhoneNumber("01012")).toBe("010-12");
      expect(formatPhoneNumber("010123")).toBe("010-123");
      expect(formatPhoneNumber("0101234")).toBe("010-1234");
    });

    it("8-10자리도 XXX-XXXX-XXXX 형식으로 포맷해야 한다", () => {
      expect(formatPhoneNumber("01012345")).toBe("010-1234-5");
      expect(formatPhoneNumber("010123456")).toBe("010-1234-56");
      expect(formatPhoneNumber("0101234567")).toBe("010-1234-567");
    });

    it("11자리는 XXX-XXXX-XXXX 형식으로 포맷해야 한다", () => {
      expect(formatPhoneNumber("01012345678")).toBe("010-1234-5678");
    });

    it("12자리 이상은 11자리까지만 포맷해야 한다", () => {
      expect(formatPhoneNumber("010123456789")).toBe("010-1234-5678");
      expect(formatPhoneNumber("010123456789999")).toBe("010-1234-5678");
    });
  });

  describe("특수 문자 처리", () => {
    it("이미 하이픈이 있는 입력을 처리해야 한다", () => {
      expect(formatPhoneNumber("010-1234-5678")).toBe("010-1234-5678");
    });

    it("공백을 제거해야 한다", () => {
      expect(formatPhoneNumber("010 1234 5678")).toBe("010-1234-5678");
    });

    it("괄호와 기타 문자를 제거해야 한다", () => {
      expect(formatPhoneNumber("(010)1234-5678")).toBe("010-1234-5678");
    });
  });

  describe("엣지 케이스", () => {
    it("빈 문자열을 처리해야 한다", () => {
      expect(formatPhoneNumber("")).toBe("");
    });

    it("숫자가 아닌 문자만 있으면 빈 문자열을 반환해야 한다", () => {
      expect(formatPhoneNumber("abc")).toBe("");
    });

    it("12자리 이상은 11자리까지만 포맷해야 한다", () => {
      expect(formatPhoneNumber("010123456789999")).toBe("010-1234-5678");
    });

    it("소수점이 포함된 숫자는 정수 부분만 포맷해야 한다", () => {
      expect(formatPhoneNumber("010.1234.5678")).toBe("010-1234-5678");
    });
  });
});

describe("formatNumberWithCommas", () => {
  describe("숫자 입력", () => {
    it("천 단위 구분자를 추가해야 한다", () => {
      expect(formatNumberWithCommas(1000)).toBe("1,000");
      expect(formatNumberWithCommas(1000000)).toBe("1,000,000");
      expect(formatNumberWithCommas(1234567890)).toBe("1,234,567,890");
    });

    it("1000 미만은 그대로 반환해야 한다", () => {
      expect(formatNumberWithCommas(0)).toBe("0");
      expect(formatNumberWithCommas(1)).toBe("1");
      expect(formatNumberWithCommas(999)).toBe("999");
    });

    it("음수를 올바르게 포맷해야 한다", () => {
      expect(formatNumberWithCommas(-1000)).toBe("-1,000");
      expect(formatNumberWithCommas(-1234567)).toBe("-1,234,567");
    });
  });

  describe("문자열 입력", () => {
    it("숫자 문자열을 포맷해야 한다", () => {
      expect(formatNumberWithCommas("1000")).toBe("1,000");
      expect(formatNumberWithCommas("50000")).toBe("50,000");
    });

    it("이미 콤마가 있는 문자열을 처리해야 한다", () => {
      expect(formatNumberWithCommas("1,000")).toBe("1,000");
      expect(formatNumberWithCommas("1,000,000")).toBe("1,000,000");
    });

    it("잘못된 형식의 콤마를 정규화해야 한다", () => {
      expect(formatNumberWithCommas("10,00")).toBe("1,000");
    });
  });

  describe("엣지 케이스", () => {
    it("빈 문자열은 빈 문자열을 반환해야 한다", () => {
      expect(formatNumberWithCommas("")).toBe("");
    });

    it("숫자가 아닌 문자열은 빈 문자열을 반환해야 한다", () => {
      expect(formatNumberWithCommas("abc")).toBe("");
      expect(formatNumberWithCommas("!@#")).toBe("");
    });

    it("혼합 문자열은 숫자가 아닌 문자가 있으면 빈 문자열을 반환해야 한다", () => {
      expect(formatNumberWithCommas("$1,000")).toBe("");
      expect(formatNumberWithCommas("1,000원")).toBe("");
      expect(formatNumberWithCommas("abc123")).toBe("");
    });

    it("소수점이 있는 문자열은 정수로 변환해야 한다", () => {
      expect(formatNumberWithCommas("1234.56")).toBe("1,235");
      expect(formatNumberWithCommas("1000.99")).toBe("1,001");
    });

    it("음수 문자열을 올바르게 처리해야 한다", () => {
      expect(formatNumberWithCommas("-1,000")).toBe("-1,000");
      expect(formatNumberWithCommas("-50000")).toBe("-50,000");
    });
  });
});

describe("parseFormattedNumber", () => {
  describe("콤마가 있는 문자열 파싱", () => {
    it("콤마를 제거하고 숫자로 변환해야 한다", () => {
      expect(parseFormattedNumber("1,000")).toBe(1000);
      expect(parseFormattedNumber("1,000,000")).toBe(1000000);
      expect(parseFormattedNumber("50,000")).toBe(50000);
    });
  });

  describe("콤마가 없는 문자열 파싱", () => {
    it("숫자 문자열을 정수로 변환해야 한다", () => {
      expect(parseFormattedNumber("1000")).toBe(1000);
      expect(parseFormattedNumber("50000")).toBe(50000);
    });
  });

  describe("엣지 케이스", () => {
    it("빈 문자열은 0을 반환해야 한다", () => {
      expect(parseFormattedNumber("")).toBe(0);
    });

    it("숫자가 아닌 문자열은 0을 반환해야 한다", () => {
      expect(parseFormattedNumber("abc")).toBe(0);
      expect(parseFormattedNumber("!@#")).toBe(0);
    });

    it("0을 올바르게 파싱해야 한다", () => {
      expect(parseFormattedNumber("0")).toBe(0);
    });

    it("음수를 올바르게 파싱해야 한다", () => {
      expect(parseFormattedNumber("-1,000")).toBe(-1000);
    });

    it("앞에 공백이 있어도 파싱해야 한다", () => {
      expect(parseFormattedNumber(" 1,000")).toBe(1000);
    });

    it("뒤에 공백이 있어도 파싱해야 한다", () => {
      expect(parseFormattedNumber("1,000 ")).toBe(1000);
    });

    it("양수 기호가 있어도 파싱해야 한다", () => {
      expect(parseFormattedNumber("+1,000")).toBe(1000);
    });

    it("소수점이 있는 문자열은 정수 부분만 파싱해야 한다", () => {
      expect(parseFormattedNumber("1,000.56")).toBe(1000);
      expect(parseFormattedNumber("1234.99")).toBe(1234);
    });

    it("혼합 문자열은 숫자 부분만 파싱해야 한다", () => {
      expect(parseFormattedNumber("$1,000")).toBe(1000);
      expect(parseFormattedNumber("1,000원")).toBe(1000);
      expect(parseFormattedNumber("abc123")).toBe(123);
    });
  });

  describe("formatNumberWithCommas와 parseFormattedNumber 왕복 테스트", () => {
    it("포맷 후 파싱하면 원래 숫자가 되어야 한다", () => {
      const numbers = [0, 1, 100, 1000, 10000, 100000, 1000000];
      numbers.forEach((num) => {
        const formatted = formatNumberWithCommas(num);
        const parsed = parseFormattedNumber(formatted);
        expect(parsed).toBe(num);
      });
    });
  });
});
