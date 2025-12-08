"use client";

import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { courseSchema, CourseFormData } from "../lib/validation";
import { useCreateCourse } from "../hooks/useCreateCourse";
import { DEFAULT_MAX_STUDENTS, DEFAULT_PRICE } from "../constants";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NumberInput } from "@/components/ui/number-input";
import { PageTitle } from "@/components/layout/PageTitle";
import { RequiredMark } from "@/components/ui/required-mark";

export function CreateCourseForm() {
  const router = useRouter();
  const { mutate: createCourse, isPending } = useCreateCourse();

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema) as unknown as Resolver<CourseFormData>,
    defaultValues: {
      title: "",
      maxStudents: DEFAULT_MAX_STUDENTS,
      price: DEFAULT_PRICE,
    },
  });

  const onSubmit = (data: CourseFormData) => {
    createCourse(data, {
      onSuccess: () => {
        toast.success("강의가 등록되었습니다.");
        router.push("/courses");
      },
      onError: (error) => {
        console.warn("Course creation failed:", error);
        toast.error("강의 등록 실패", {
          description: "잠시 후 다시 시도해주세요.",
        });
      },
    });
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <PageTitle
        title="강의 등록"
        description="새로운 강의를 등록하여 수강생을 모집해보세요."
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          aria-label="강의 등록 폼"
          noValidate
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  강의명 <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    placeholder="예: 너나위의 내집마련 기초반"
                    aria-required="true"
                    aria-invalid={!!fieldState.error}
                    {...(fieldState.error && {
                      "aria-describedby": "title-error",
                    })}
                    {...field}
                  />
                </FormControl>
                <FormMessage id="title-error" role="alert" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxStudents"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  수강 인원 <RequiredMark />
                </FormLabel>
                <FormControl>
                  <NumberInput
                    placeholder="10"
                    aria-required="true"
                    aria-invalid={!!fieldState.error}
                    {...(fieldState.error && {
                      "aria-describedby": "maxStudents-error",
                    })}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    suffix="명"
                    className="text-end"
                  />
                </FormControl>
                <FormMessage id="maxStudents-error" role="alert" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  가격 <RequiredMark />
                </FormLabel>
                <FormControl>
                  <NumberInput
                    placeholder="200,000"
                    aria-required="true"
                    aria-invalid={!!fieldState.error}
                    {...(fieldState.error && {
                      "aria-describedby": "price-error",
                    })}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    suffix="원"
                    className="text-end"
                  />
                </FormControl>
                <FormMessage id="price-error" role="alert" />
              </FormItem>
            )}
          />

          <div className="fixed bottom-0 left-0 right-0 border-t p-4 shadow-lg z-50">
            <div className="mx-auto max-w-md flex">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={Object.keys(form.formState.errors).length > 0}
                loading={isPending}
                loadingText="강의 등록 중"
              >
                등록하기
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
