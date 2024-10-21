import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MessageSkeleton() {
  return (
    <Card className="mb-4 bg-muted/5 border-none shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-grow">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
