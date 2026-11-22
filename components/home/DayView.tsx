"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, StatusPill } from "@/components/ui";
import { addDaysIst, istDateString, relativeDayLabel } from "@/lib/date";
import type { DayOrderItem } from "@/lib/home-types";

export function DayView({
  selectedDay,
  isToday,
  anyTime,
  timeline,
  ghosts,
  isOwner,
  onSelectDay,
  onSelectOrder,
  onSelectGhost,
  onNewOrder,
}: {
  selectedDay: string;
  selectedDayLabel?: string;
  isToday: boolean;
  anyTime: DayOrderItem[];
  timeline: DayOrderItem[];
  ghosts: DayOrderItem[];
  isOwner: boolean;
  onSelectDay: (day: string) => void;
  onSelectOrder?: (id: string) => void;
  onSelectGhost?: (id: string) => void;
  onNewOrder?: () => void;
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const label = relativeDayLabel(selectedDay);

  function prevDay() {
    const [y, m, d] = selectedDay.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d - 1));
    onSelectDay(istDateString(date));
  }

  function nextDay() {
    const [y, m, d] = selectedDay.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d + 1));
    onSelectDay(istDateString(date));
  }

  function goToday() {
    onSelectDay(istDateString());
  }

  const hasOrders = anyTime.length > 0 || timeline.length > 0 || ghosts.length > 0;

  return (
    <Card className="p-4">
      {/* Date navigation header */}
      <div className="flex items-center justify-between gap-1 border-b border-line pb-1">
        <div className="flex items-center">
          <button
            type="button"
            onClick={prevDay}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-lg text-ink-muted hover:bg-muted hover:text-ink active:bg-muted"
            aria-label="Previous day"
          >
            ‹
          </button>
          <span className="min-w-[92px] text-center text-sm font-semibold text-ink">
            {label}
          </span>
          <button
            type="button"
            onClick={nextDay}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-lg text-ink-muted hover:bg-muted hover:text-ink active:bg-muted"
            aria-label="Next day"
          >
            ›
          </button>
        </div>

        <div className="flex items-center gap-0.5">
          {!isToday ? (
            <button
              type="button"
              onClick={goToday}
              aria-label="Go to today"
              className="min-h-11 whitespace-nowrap rounded-lg px-2 text-xs font-semibold text-accent-strong hover:bg-accent-soft"
            >
              Go to today
            </button>
          ) : null}

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-muted hover:bg-muted hover:text-ink"
              aria-label="Pick date"
            >
              ▤
            </button>
            {showDatePicker ? (
              <div className="absolute right-0 top-12 z-30 rounded-xl border border-line bg-surface p-2 shadow-xl">
                <input
                  type="date"
                  value={selectedDay}
                  onChange={(e) => {
                    if (e.target.value) {
                      onSelectDay(e.target.value);
                      setShowDatePicker(false);
                    }
                  }}
                  className="rounded-lg border border-line p-1 text-sm text-ink"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
        onTouchEnd={(event) => {
          if (touchStartX === null) return;
          const delta = event.changedTouches[0].clientX - touchStartX;
          setTouchStartX(null);
          if (Math.abs(delta) < 48) return;
          if (delta > 0) prevDay();
          else nextDay();
        }}
      >
        {!hasOrders ? (
          <div className="py-8 text-center">
            <p className="text-sm text-ink-muted">Nothing for this day.</p>
            {isOwner ? (
              <Link
                href="/app/sales/new"
                className="mt-2 inline-block text-sm font-semibold text-accent hover:underline"
              >
                Add sale
              </Link>
            ) : (
              <button
                type="button"
                onClick={onNewOrder}
                className="mt-2 text-sm font-semibold text-accent hover:underline"
              >
                Add sale
              </button>
            )}
          </div>
        ) : (
          <div className="mt-3 space-y-3">
          {/* Any time orders */}
          {anyTime.length > 0 ? (
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
                Any time
              </p>
              <div className="space-y-1.5">
                {anyTime.map((item) => (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectOrder?.(item.id)}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-line/80 bg-surface px-3 py-2 text-xs transition hover:border-line active:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <p
                        className="truncate font-medium text-ink"
                        title={`${item.customerName} · ${item.itemsSummary}`}
                      >
                        · {item.customerName} · {item.itemsSummary}
                      </p>
                    </div>
                    <div className="ml-2 flex shrink-0 items-center gap-2">
                      <span className="tnum font-semibold text-ink">
                        {item.total}
                      </span>
                      <StatusPill status={item.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Timeline orders */}
          {timeline.length > 0 ? (
            <div className="space-y-1.5">
              {timeline.map((item) => (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectOrder?.(item.id)}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-line/80 bg-surface px-3 py-2 text-xs transition hover:border-line active:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p
                      className="truncate text-ink"
                      title={`${item.timeSlot ? `${item.timeSlot} · ` : ""}${item.customerName} · ${item.itemsSummary}`}
                    >
                      <span className="font-semibold text-ink-muted">
                        {item.timeSlot}
                      </span>{" "}
                      · <span className="font-medium text-ink">{item.customerName}</span>{" "}
                      · <span className="text-ink-muted">{item.itemsSummary}</span>
                    </p>
                  </div>
                  <div className="ml-2 flex shrink-0 items-center gap-2">
                    <span className="tnum font-semibold text-ink">
                      {item.total}
                    </span>
                    <StatusPill status={item.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {/* Ghost cards for pending storefront requests */}
          {ghosts.length > 0 ? (
            <div className="space-y-1.5">
              {ghosts.map((ghost) => (
                <div
                  key={ghost.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectGhost?.(ghost.id)}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs transition hover:bg-accent-soft/60"
                >
                  <div className="min-w-0">
                    <p
                      className="truncate text-ink"
                      title={`${ghost.timeSlot ? `${ghost.timeSlot} · ` : ""}Request: ${ghost.customerName} · ${ghost.itemsSummary}`}
                    >
                      <span className="font-semibold text-accent-strong">
                        {ghost.timeSlot ? `${ghost.timeSlot} · ` : ""}
                        Request:
                      </span>{" "}
                      <span className="font-medium">{ghost.customerName}</span> ·{" "}
                      <span className="text-ink-muted">{ghost.itemsSummary}</span>
                    </p>
                  </div>
                  <div className="ml-2 flex shrink-0 items-center gap-2">
                    <span className="tnum font-semibold text-ink">
                      {ghost.total}
                    </span>
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent-strong">
                      Review
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        )}
      </div>
    </Card>
  );
}
