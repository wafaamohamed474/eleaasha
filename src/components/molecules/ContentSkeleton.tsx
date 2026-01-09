import { Skeleton } from "@/components/ui/skeleton";

export default function ContentSkeleton() {
    return (
        <div className="w-full flex flex-col items-center justify-center space-y-8 animate-in fade-in-50">
            {/* Page Title */}
            <Skeleton className="h-8 w-48" />

            {/* Intro Text */}
            <div className="w-full max-w-2xl space-y-2 flex flex-col items-center">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Sections */}
            <div className="w-full space-y-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-3">
                        {/* Section Title */}
                        <Skeleton className="h-6 w-32" />

                        {/* Paragraph lines */}
                        <div className="space-y-2 pl-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-11/12" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
