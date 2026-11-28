"use client";

import type { ReactNode } from "react";
import { MetricTile, PageHeader } from "@/components/ui";
import type { ReportTile } from "@/lib/report-types";

/**
 * The four zones every report shares: title, summary strip, filters, list.
 * The header comes from MerchantShell and stays identical on every page.
 * See ADR-040 and ADR-041.
 */
export function ReportShell({
  title,
  subtitle,
  action,
  tiles,
  tileColumns = 3,
  summary,
  filters,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  tiles: ReportTile[];
  /** Reports with four metrics opt in; the rest keep the shared three-up strip. */
  tileColumns?: 3 | 4;
  /** Replaces the metric tiles with a custom summary, for example filter cards. */
  summary?: ReactNode;
  filters: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} action={action} />

      {summary ??
        (tiles.length > 0 ? (
          <section
            aria-label={`${title} summary`}
            className={`mb-5 grid grid-cols-2 gap-2 ${tileColumns === 4 ? "md:grid-cols-4" : "md:grid-cols-3"}`}
          >
            {tiles.map((tile) => (
              <MetricTile
                key={tile.label}
                label={tile.label}
                value={tile.value}
                period={tile.period}
                tone={tile.tone}
                hint={tile.hint}
              />
            ))}
          </section>
        ) : null)}

      <div className="mb-4">{filters}</div>

      {children}
    </>
  );
}
