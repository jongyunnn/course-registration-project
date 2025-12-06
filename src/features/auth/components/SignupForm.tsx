"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { signupSchema, SignupFormData } from "../lib/validation";
import { useSignup } from "../hooks/useSignup";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { formatPhoneNumber } from "@/lib/utils";
import { PageTitle } from "@/components/layout/PageTitle";
import { RequiredMark } from "@/components/ui/required-mark";
import { AUTH_MESSAGES } from "../constants";
import Link from "next/link";

interface UserTypeRadioItemProps {
  value: string;
  label: string;
  description: string;
}

function UserTypeRadioItem({
  value,
  label,
  description,
}: UserTypeRadioItemProps) {
  const descriptionId = `userType-${value}-desc`;
  return (
    <FormItem className="has-data-[state=checked]:[&_label]:border-primary">
      <FormLabel className="w-full flex items-start gap-3 rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all">
        <FormControl>
          <RadioGroupItem value={value} aria-describedby={descriptionId} />
        </FormControl>

        <div className="flex flex-col">
          <span className="font-medium">{label}</span>

          <span
            id={descriptionId}
            className="text-xs text-muted-foreground mt-1"
          >
            {description}
          </span>
        </div>
      </FormLabel>
    </FormItem>
  );
}

export function SignupForm() {
  const router = useRouter();
  const { mutate: signup, isPending } = useSignup();
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      userType: undefined,
    },
  });

  const onSubmit = (data: SignupFormData) => {
    signup(data, {
      onSuccess: async () => {
        toast.success(AUTH_MESSAGES.SIGNUP.SUCCESS);

        // 회원가입 후 자동 로그인
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.ok) {
          router.push("/courses");
          router.refresh();
        } else {
          // 자동 로그인 실패 시 로그인 페이지로 이동
          router.push("/login");
        }
      },
      onError: (error) => {
        const serverMessage = error.response?.data?.error;
        if (serverMessage) {
          toast.error(serverMessage);
        } else {
          toast.error(AUTH_MESSAGES.SIGNUP.FAIL);
        }
      },
    });
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <PageTitle
        title="회원가입"
        description="수강신청서비스 수강신청 서비스를 이용하기 위해 회원가입을 진행해주세요."
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          aria-label="회원가입 폼"
          noValidate
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  이메일 <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    autoComplete="email"
                    aria-required="true"
                    aria-invalid={!!fieldState.error}
                    aria-describedby={
                      fieldState.error ? "email-error" : undefined
                    }
                    autoFocus
                    {...field}
                  />
                </FormControl>
                <FormMessage id="email-error" role="alert" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  비밀번호 <RequiredMark />
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="영문, 숫자, 대문자 포함 6-10자"
                    autoComplete="new-password"
                    maxLength={10}
                    aria-required="true"
                    aria-invalid={!!fieldState.error}
                    aria-describedby={
                      fieldState.error
                        ? "password-error password-hint"
                        : "password-hint"
                    }
                    {...field}
                  />
                </FormControl>
                <p id="password-hint" className="text-sm text-muted-foreground">
                  영문, 숫자, 대문자를 포함한 6-10자
                </p>
                <FormMessage id="password-error" role="alert" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  비밀번호 확인 <RequiredMark />
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="비밀번호를 다시 입력해주세요"
                    autoComplete="new-password"
                    maxLength={10}
                    aria-required="true"
                    aria-invalid={!!fieldState.error}
                    aria-describedby={
                      fieldState.error ? "confirmPassword-error" : undefined
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage id="confirmPassword-error" role="alert" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  이름 <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="홍길동"
                    autoComplete="name"
                    aria-required="true"
                    aria-invalid={!!fieldState.error}
                    aria-describedby={
                      fieldState.error ? "name-error" : undefined
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage id="name-error" role="alert" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  휴대폰 번호 <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="010-1234-5678"
                    autoComplete="tel"
                    aria-required="true"
                    aria-invalid={!!fieldState.error}
                    aria-describedby={
                      fieldState.error ? "phone-error phone-hint" : "phone-hint"
                    }
                    {...field}
                    onChange={(e) => {
                      field.onChange(formatPhoneNumber(e.target.value));
                    }}
                  />
                </FormControl>
                <p id="phone-hint" className="text-sm text-muted-foreground">
                  하이픈(-)은 자동으로 입력됩니다
                </p>
                <FormMessage id="phone-error" role="alert" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userType"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  회원 유형 <RequiredMark />
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-2 gap-2"
                    aria-required="true"
                    aria-invalid={!!fieldState.error}
                    aria-describedby={
                      fieldState.error ? "userType-error" : undefined
                    }
                  >
                    <UserTypeRadioItem
                      value="STUDENT"
                      label="수강생"
                      description="강의를 수강합니다"
                    />
                    <UserTypeRadioItem
                      value="INSTRUCTOR"
                      label="강사"
                      description="강의를 등록합니다"
                    />
                  </RadioGroup>
                </FormControl>
                <FormMessage id="userType-error" role="alert" />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={Object.keys(form.formState.errors).length > 0}
              loading={isPending}
              loadingText="회원가입 진행 중"
            >
              가입하기
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              이미 계정이 있으신가요?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                로그인
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
