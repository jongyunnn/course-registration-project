"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { loginSchema, LoginFormData } from "../lib/validation";
import { useLogin } from "../hooks/useLogin";
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
import { toast } from "sonner";
import { PageTitle } from "@/components/layout/PageTitle";
import { RequiredMark } from "@/components/ui/required-mark";
import { AUTH_MESSAGES } from "../constants";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/courses";

  const { mutate: login, isPending } = useLogin();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: (result) => {
        if (result.success) {
          toast.success(AUTH_MESSAGES.LOGIN.SUCCESS);
          router.push(callbackUrl);
          router.refresh();
        } else {
          toast.error(result.error || AUTH_MESSAGES.LOGIN.FAIL);
        }
      },
      onError: () => {
        toast.error(AUTH_MESSAGES.LOGIN.UNKNOWN);
      },
    });
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <PageTitle title="로그인" description="수강신청 서비스에 로그인하세요." />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          aria-label="로그인 폼"
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
                    placeholder="비밀번호를 입력하세요"
                    autoComplete="current-password"
                    aria-required="true"
                    aria-invalid={!!fieldState.error}
                    aria-describedby={
                      fieldState.error ? "password-error" : undefined
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage id="password-error" role="alert" />
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
              loadingText="로그인 중"
            >
              로그인
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              아직 계정이 없으신가요?{" "}
              <Link
                href="/signup"
                className="font-medium text-primary hover:underline"
              >
                회원가입
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
