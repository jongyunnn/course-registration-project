export const AUTH_MESSAGES = {
  SIGNUP: {
    SUCCESS: "회원가입이 성공적으로 완료되었습니다.",
    FAIL: "회원가입에 실패했습니다.",
    EMAIL_DUPLICATE: "이미 사용 중인 이메일입니다.",
    PHONE_DUPLICATE: "이미 사용 중인 휴대폰 번호입니다.",
    UNKNOWN: "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  },
  LOGIN: {
    SUCCESS: "로그인되었습니다.",
    FAIL: "이메일 또는 비밀번호가 올바르지 않습니다.",
    UNKNOWN: "로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  },
  LOGOUT: {
    SUCCESS: "로그아웃되었습니다.",
  },
} as const;
