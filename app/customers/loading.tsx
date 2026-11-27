import { Card } from "@/components/ui";

export default function CustomersLoading() {
  return (
    <div aria-busy="true" aria-label="Loading customers">
      <div className="mb-6 h-10 w-48 animate-pulse rounded-xl bg-muted" />
      <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-4">
        {[0, 1, 2, 3].map((card) => (
          <div
            key={card}
            className="h-28 animate-pulse rounded-2xl border border-line bg-muted/70 p-3.5"
          >
            <div className="h-3 w-2/3 rounded bg-muted" />
            <div className="mt-4 h-6 w-1/2 rounded bg-muted" />
            <div className="mt-2 h-2.5 w-3/4 rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="mb-4 h-11 animate-pulse rounded-xl bg-muted" />
      <Card className="overflow-hidden p-0">
        <div className="h-12 animate-pulse border-b border-line bg-muted/40" />
        <div className="divide-y divide-line">
          {[0, 1, 2, 3, 4].map((row) => (
            <div key={row} className="h-24 animate-pulse px-3 py-3">
              <div className="h-4 w-1/3 rounded bg-muted" />
              <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
