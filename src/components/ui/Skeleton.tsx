import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-slate-800/80 border border-slate-700/10", className)}
      {...props}
    />
  );
}
export function CardSkeleton() {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-12 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
    </div>
  );
}
