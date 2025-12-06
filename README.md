# 수강신청 시스템

Next.js 16, TypeScript로 구축된 수강신청 시스템입니다.

## 주요 기능

### 회원가입 `/signup`

- react-hook-form + Zod를 활용한 클라이언트단에서의 1차 폼 검증
- 백엔드에서 이메일과 휴대폰 번호로 중복 채크하여 에러 상태를 반환하고 클라이언트에서의 오류 메세지 표시
- 웹 접근성 준수
- 세션 기반 인증 관리(NextAuth.js): 로그인 및 세션의 user 정보 활용
- autoFocus, password visible toggle, phone number formatting 제공으로 UX 개선

### 강의등록 `/courses/create`

- react-hook-form + Zod를 활용한 폼 검증
- 웹 접근성 준수
- 강사만 등록 가능: 서버 컴포넌트에서 세션 기반으로 인증 상태 및 회원 유형을 확인하여 인증되지 않은 경우 로그인 페이지로, 학생인 경우 강의 목록으로 리다이렉트
- autoFocus, number comma formatting, 단위 suffix 제공으로 UX 개선
- bottom fixed button, safe area bottom padding 제공으로 UX 개선

### 수강신청 `/courses`

- 학생과 강사 모두 수강신청 가능 (이미 수강신청한 강의, 정원 마감, 내가 등록한 강의는 수강 신청 불가)
  - 시각적 상태 표시: "마감", "마감임박", "내 강의", "수강중"
- Zustand를 활용하여 정렬 변경하여 데이터 갱신이 되어도 선택한 강의 유지
  - 현재 선택한 강의 목록 볼 수 있는 화면 추가
  - 로그아웃 또는 수강 신청 완료 이후 초기화
- 수강 신청 완료 이후 목록 데이터 갱신
- 썸네일 기반 2단 그리드의 강의 목록 UI 제공
- bottom fixed button, safe area bottom padding 제공으로 UX 개선

### 성능 최적화

- 강의목록 화면에서 @tanstack/react-virtual를 활용한 무한 스크롤 가상화
  - viewport 근처의 ui만 렌더하여 데이터가 많아져도 성능 최적화
  - @tanstack/react-query의 useInfiniteQuery와 함께 사용하여 하단 근처 스크롤 시 자동으로 다음 페이지 가져오기
- Suspense와 Skeleton UI를 활용한 점진적 로딩
- 서버 사이드 렌더링 및 하이드레이션
- Next/Image를 활용한 이미지 최적화

### 백엔드

- Next.js API Routes로 API 구현
- mock-db.ts를 활용한 인메모리 데이터베이스
  - 서버 실행 시 초기화
  - 강의 목록 성능 테스트를 위해 1,000개의 강의 생성
  - 계정 중복 체크 테스트를 위한 테스트 계정 추가

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS 4, shadcn-ui
- **인증**: NextAuth.js v4
- **상태 관리**:
  - 서버 상태: @tanstack/react-query
  - 전역 상태: Zustand
  - 세션 상태: NextAuth
- **폼**: react-hook-form + @hookform/resolvers
- **검증**: Zod v4
- **HTTP 클라이언트**: Axios
- **가상화**: @tanstack/react-virtual
- **테스팅**:
  - Vitest (테스트 러너)
  - @testing-library/react (컴포넌트 테스팅)
  - @testing-library/jest-dom (DOM 매처)
  - jsdom (DOM 환경)

## 프로젝트 구조

```
src/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes (NextAuth 및 백엔드)
│   │   ├── auth/
│   │   ├── courses/
│   │   └── enrollments/
│   ├── courses/
│   ├── login/
│   └── signup/
├── components/               # 공유 컴포넌트
│   ├── ui/                   # shadcn-ui 컴포넌트
│   ├── layout/               # 레이아웃 컴포넌트
│   └── providers.tsx         # 전역 프로바이더 (React Query, Session)
├── constants/                # 전역 상수
├── features/                 # 기능별 모듈
│   ├── auth/
│   │   ├── components/       # 로그인/회원가입 폼 및 스켈레톤
│   │   ├── hooks/            # useAuth, useLogin, useSignup
│   │   ├── lib/              # validation.ts
│   │   └── api.ts            # 인증 API
│   └── course/
│       ├── components/       # 강의 카드, 그리드, 폼
│       ├── hooks/            # useCourses, useCreateCourse, useEnroll
│       ├── lib/              # validation.ts, thumbnail.ts
│       ├── api.ts            # 강의 관련 API
│       ├── server.ts         # 강의 관련 서버 액션
│       └── store.ts          # 강의 선택을 위한 Zustand 스토어
├── lib/
│   ├── api-client.ts         # Axios 인스턴스
│   ├── auth.ts               # NextAuth 설정
│   ├── mock-db.ts            # 인메모리 데이터베이스
│   └── utils.ts              # 유틸리티 함수
├── types/                    # 전역 TypeScript 타입
└── hooks/                    # 공유 훅
```

## 시작하기

1. **의존성 설치:**

   ```bash
   npm install
   ```

2. **개발 서버 실행:**

   ```bash
   npm run dev
   ```

3. **브라우저에서 열기:**
   [http://localhost:3000](http://localhost:3000) 접속

## 테스트

테스트 실행 명령어:

```bash
npm test              # 워치 모드로 테스트 실행
npm run test:coverage # 커버리지 리포트와 함께 테스트 실행
```

테스트 파일은 소스 파일과 함께 `.test.ts` 또는 `.test.tsx` 확장자로 위치합니다.
