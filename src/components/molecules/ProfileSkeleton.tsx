import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="space-y-5 max-w-md mx-auto flex flex-col items-center  min-h-screen">
      {/* Name Field */}
      <Skeleton className="h-25 w-25 rounded-full" />
      <div className="space-y-2 w-full">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Email Field */}
      <div className="space-y-2 w-full">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Phone Field */}
      <div className="space-y-2 w-full">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Submit Button */}
      <Skeleton className="h-12 w-full rounded-full mt-4" />
    </div>
  );
}
