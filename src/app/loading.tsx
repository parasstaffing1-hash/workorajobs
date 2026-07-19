import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container className="py-24">
      <div className="glass-panel mx-auto max-w-4xl space-y-6 rounded-lg border border-border/70 p-6 shadow-premium">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
        <div className="grid gap-4 pt-6 sm:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    </Container>
  );
}
