import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"

export function SkeletonCard() {
  return (
    <Card className="border-muted-foreground/10 rounded-sm border w-full min-h-[220px] flex flex-col">
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-center w-full justify-between">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-6 w-[60px] rounded-full" />
        </div>
        <Skeleton className="h-10 w-[180px] my-1.5" />
      </CardHeader>
      <CardFooter className="flex flex-col border-none items-start gap-2 mt-auto">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-[90%]" />
      </CardFooter>
    </Card>
  )
}
