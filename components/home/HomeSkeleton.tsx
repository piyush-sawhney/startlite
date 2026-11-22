import { Card } from "@/components/ui";

export function HomeSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[640px] space-y-4 px-4 pb-28 pt-4 lg:max-w-6xl lg:px-8 lg:pb-16 lg:pt-6">
      {/* Header Skeleton (56px) */}
      <div className="flex h-14 items-center justify-between border-b border-line pb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
          <div className="space-y-1.5">
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="h-7 w-24 animate-pulse rounded-full bg-muted" />
      </div>

      {/* Prominent Request Bar / Banner Skeleton */}
      <div className="h-14 w-full animate-pulse rounded-2xl bg-muted/70" />

      {/* Responsive layout: Main vs Right */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_360px] lg:items-start">
        <div className="space-y-6">
          {/* Quick Actions Skeleton */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
            <div className="h-11 animate-pulse rounded-xl bg-muted" />
            <div className="h-11 animate-pulse rounded-xl bg-muted" />
            <div className="h-11 animate-pulse rounded-xl bg-muted" />
            <div className="h-11 animate-pulse rounded-xl bg-muted" />
          </div>

          {/* Active Orders List Skeleton (Order list seen FIRST) */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-16 animate-pulse rounded-xl bg-muted/60" />
              <div className="h-16 animate-pulse rounded-xl bg-muted/60" />
            </div>
          </Card>

          {/* KPI Strip Skeleton (Metrics after order lists) */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-2.5 lg:grid-cols-5">
            <div className="h-24 animate-pulse rounded-2xl bg-muted" />
            <div className="h-24 animate-pulse rounded-2xl bg-muted" />
            <div className="h-24 animate-pulse rounded-2xl bg-muted" />
            <div className="h-24 animate-pulse rounded-2xl bg-muted" />
            <div className="col-span-2 h-24 animate-pulse rounded-2xl bg-muted lg:col-span-1" />
          </div>

          {/* Customers Skeleton */}
          <Card className="space-y-3">
            <div className="h-4 w-44 animate-pulse rounded bg-muted" />
            <div className="space-y-2">
              <div className="h-12 animate-pulse rounded-xl bg-muted/60" />
              <div className="h-12 animate-pulse rounded-xl bg-muted/60" />
            </div>
          </Card>
        </div>

        {/* Day View Column Skeleton (Desktop Sticky) */}
        <div className="hidden space-y-4 lg:block">
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="h-5 w-28 animate-pulse rounded bg-muted" />
              <div className="h-6 w-16 animate-pulse rounded bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-14 animate-pulse rounded-xl bg-muted/60" />
              <div className="h-14 animate-pulse rounded-xl bg-muted/60" />
              <div className="h-14 animate-pulse rounded-xl bg-muted/60" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
