import { Skeleton } from "@/components/ui/skeleton";

export function LoginFormSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex w-full items-center justify-between h-10">
          <Skeleton className="h-9 w-24" />
        </div>
        <Skeleton className="h-5 w-48" />
      </div>

      <div className="space-y-6">
        {/* Email */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="flex flex-col gap-4">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-5 w-40 mx-auto" />
        </div>
      </div>
    </div>
  );
}
