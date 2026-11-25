"use client";

import { useState } from "react";
import { Card, StatusPill } from "@/components/ui";
import { cn } from "@/lib/cn";
import { istDateString, relativeDayLabel } from "@/lib/date";
import type { DayOrderItem } from "@/lib/home-types";
import { Calendar, CalendarDays, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

export function DayView({
  selectedDay,
  isToday,
  anyTime,
  timeline,
  ghosts,
  onSelectDay,
  onSelectOrder,
  onSelectGhost,
  onNewOrder,
  nextOrderDay,
}: {
  selectedDay: string;
  selectedDayLabel?: string;
  isToday: boolean;
  anyTime: DayOrderItem[];
  timeline: DayOrderItem[];
  ghosts: DayOrderItem[];
  onSelectDay: (day: string) => void;
  onSelectOrder?: (id: string) => void;
  onSelectGhost?: (id: string) => void;
  onNewOrder?: () => void;
  /** When today has no commitments, the nearest upcoming day that has one. */
  nextOrderDay?: string;
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
  const showNextOrder = isToday && !hasOrders && Boolean(nextOrderDay);
  const commitmentCount = anyTime.length + timeline.length + ghosts.length;

  // Storefront requests are commitments too: place them at their requested
  // time alongside orders instead of appending them after the whole day.
  const anyTimeWithGhosts = [
    ...anyTime,
    ...ghosts.filter((ghost) => !ghost.timeSlot),
  ];
  const timelineWithGhosts = [
    ...timeline,
    ...ghosts.filter((ghost) => Boolean(ghost.timeSlot)),
  ].sort((a, b) => (a.timeSlot ?? "").localeCompare(b.timeSlot ?? ""));

  function renderRow(item: DayOrderItem, withTime: boolean) {
    const isGhost = Boolean(item.isGhost);
    function open() {
      if (isGhost) onSelectGhost?.(item.id);
      else onSelectOrder?.(item.id);
    }
    const hasDue = item.due !== "₹0.00";

    return (
      <div
        key={item.id}
        role="button"
        tabIndex={0}
        onClick={open}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            open();
          }
        }}
        className={cn(
          "flex cursor-pointer items-center justify-between gap-2 rounded-xl border-l-[3px] border-y border-r px-3 py-2.5 text-xs transition",
          isGhost
            ? "border-l-warning border-y-warning/25 border-r-warning/25 bg-warning-soft/50 hover:bg-warning-soft"
            : "border-l-accent border-y-line border-r-line bg-surface hover:border-y-accent/30 hover:bg-accent-soft/30",
        )}
      >
        <div className="min-w-0">
          <p
            className="truncate text-ink"
            title={`${item.timeSlot ? `${item.timeSlot} · ` : ""}${isGhost ? "Request: " : ""}${item.customerName} · ${item.itemsSummary}`}
          >
            {withTime && item.timeSlot ? (
              <span
                className={cn(
                  "font-bold",
                  isGhost ? "text-warning" : "text-accent-strong",
                )}
              >
                {item.timeSlot}{" "}
              </span>
            ) : null}
            {isGhost ? (
              <span className="font-bold text-warning">Request: </span>
            ) : !withTime ? (
              <span className="text-ink-subtle">· </span>
            ) : null}
            <span className="font-semibold text-ink">{item.customerName}</span> ·{" "}
            <span className="text-ink-muted">{item.itemsSummary}</span>
            {item.note ? (
              <span
                className="ml-1 inline-flex text-warning"
                title={item.note}
                aria-label={`Buyer's note: ${item.note}`}
              >
                <MessageSquare className="h-3 w-3" aria-hidden="true" />
              </span>
            ) : null}
          </p>
        </div>
        <div className="ml-1 flex shrink-0 items-center gap-2">
          <span className="tnum font-semibold text-ink">{item.total}</span>
          {hasDue ? (
            <span className="tnum text-[10px] font-semibold text-warning">
              {item.due} due
            </span>
          ) : null}
          {isGhost ? (
            <span className="rounded-full bg-warning px-2 py-0.5 text-[10px] font-bold text-white">
              Review
            </span>
          ) : (
            <StatusPill status={item.status} />
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="p-4">
      {/* Date navigation header */}
      <div className="flex items-center justify-between gap-1 border-b border-line pb-2">
        <div className="flex items-center">
          <button
            type="button"
            onClick={prevDay}
            className="grid h-11 w-11 place-items-center rounded-xl text-ink-muted transition hover:bg-muted hover:text-accent-strong active:bg-line"
            aria-label="Previous day"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <span className="flex min-w-0 items-center justify-center gap-1.5 whitespace-nowrap text-xs font-bold text-ink sm:min-w-[100px] sm:text-sm">
            <CalendarDays className="h-4 w-4 shrink-0 text-accent-strong" aria-hidden="true" />
            {label}
          </span>
          <button
            type="button"
            onClick={nextDay}
            className="grid h-11 w-11 place-items-center rounded-xl text-ink-muted transition hover:bg-muted hover:text-accent-strong active:bg-line"
            aria-label="Next day"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          {hasOrders ? (
            <span className="hidden rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-ink-muted sm:inline-flex">
              {commitmentCount} {commitmentCount === 1 ? "commitment" : "commitments"}
            </span>
          ) : null}
          {!isToday ? (
            <button
              type="button"
              onClick={goToday}
              aria-label="Go to today"
              className="min-h-11 whitespace-nowrap rounded-lg px-1 text-[11px] font-bold text-accent-strong transition hover:bg-accent-soft sm:px-2 sm:text-xs"
            >
              Go to today
            </button>
          ) : null}

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="grid h-11 w-11 place-items-center rounded-xl text-ink-muted transition hover:bg-muted hover:text-accent-strong"
              aria-label="Pick date"
            >
              <Calendar className="h-4 w-4" aria-hidden="true" />
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

      {/* Scrollable commitment list. It holds every order for the day; only the
          viewport is capped so the page and the desktop column stay put. */}
      <div
        className="lg:max-h-[340px] lg:overflow-y-auto lg:overscroll-contain"
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
            {showNextOrder && nextOrderDay ? (
              <>
                <p className="text-sm text-ink-muted">
                  Nothing for today. Next order{" "}
                  <span className="font-semibold text-ink">
                    {relativeDayLabel(nextOrderDay)}
                  </span>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => onSelectDay(nextOrderDay)}
                  className="mt-2 text-sm font-bold text-accent-strong hover:underline"
                >
                  Go to {relativeDayLabel(nextOrderDay)}
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-ink-muted">Nothing for this day.</p>
                <button
                  type="button"
                  onClick={onNewOrder}
                  className="mt-2 text-sm font-bold text-accent-strong hover:underline"
                >
                  Add sale
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {anyTimeWithGhosts.length > 0 ? (
              <div>
                <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">
                  Any time
                </p>
                <div className="space-y-1.5">
                  {anyTimeWithGhosts.map((item) => renderRow(item, false))}
                </div>
              </div>
            ) : null}

            {timelineWithGhosts.length > 0 ? (
              <div className="space-y-1.5">
                {timelineWithGhosts.map((item) => renderRow(item, true))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </Card>
  );
}
