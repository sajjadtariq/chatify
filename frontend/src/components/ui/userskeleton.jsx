import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonDemo() {
    return (
        <div className="flex items-center space-x-4 my-2">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    )
}
