import { Skeleton } from "../ui/skeleton";

export default function UserInfoSkeleton() {
  return (
    <div className="flex flex-col gap-1">
      <Skeleton className="w-26 h-3" />
      <Skeleton className="w-24 h-3" />
    </div>
  );
}
