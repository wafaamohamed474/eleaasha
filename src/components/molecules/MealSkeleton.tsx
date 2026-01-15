import { Skeleton } from "../ui/skeleton";

export default function MealSkeleton() {
  return (
    <div className="">
      <div className="sec-class">
        <div className="flex flex-col  lg:flex-row gap-4">
          <div className="lg:w-[45%] shrink-0">
            <Skeleton className="aspect-square w-full rounded-2xl" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-12 w-3/4 rounded-xl" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-6 w-32 rounded-lg" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-6 w-32 rounded-lg" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-8 w-24 rounded-xl" />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Skeleton className="h-6 w-32 rounded-lg" />
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 w-16 rounded-2xl" />
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-14 w-40 rounded-xl mt-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
