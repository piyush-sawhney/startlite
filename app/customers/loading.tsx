import { Card } from "@/components/ui";

export default function CustomersLoading() {
  return (
    <div aria-busy="true" aria-label="Loading customers">
      <div className="mb-6 h-10 w-48 animate-pulse rounded-xl bg-muted" />
      <div className="mb-5 grid grid-cols-2 gap-2 md:grid-cols-3">
        {[0, 1, 2].map((tile) => (
          <div
            key={tile}
            className="h-24 animate-pulse rounded-2xl bg-muted/70"
          />
        ))}
      </div>
      <div className="mb-4 h-11 animate-pulse rounded-xl bg-muted" />
      <Card className="overflow-hidden p-0">
        <div className="h-12 animate-pulse border-b border-line bg-muted/40" />
        <div className="divide-y divide-line">
          {[0, 1, 2, 3, 4].map((row) => (
            <div key={row} className="h-20 animate-pulse px-3 py-3">
              <div className="h-4 w-1/3 rounded bg-muted" />
              <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
