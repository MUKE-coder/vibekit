"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format, startOfDay, startOfMonth, startOfQuarter, startOfYear } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/**
 * Calendar-in-popover date range picker tailored for dashboards. Bundles
 * the standard presets (Today / Last 7 / Last 30 / This month / This
 * quarter / YTD) with a custom-range calendar so users can drive every
 * widget on a dashboard from a single control.
 *
 *   const [range, setRange] = useState<DateRange>({ from: startOfMonth(new Date()), to: new Date() });
 *
 *   <DateRangePicker value={range} onChange={setRange} />
 *
 *   // Then drive charts:
 *   <Sparkline data={chartFor(range)} />
 *   <MetricGrid metrics={metricsFor(range)} />
 *
 * `value` is uncontrolled-friendly: pass `defaultValue` instead and read
 * the latest from `onChange` events.
 */

export interface DateRange {
  from: Date;
  to: Date;
}

interface Preset {
  label: string;
  value: () => DateRange;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  /** Override the default preset list. */
  presets?: Preset[];
  /** Earliest selectable date. */
  fromDate?: Date;
  /** Latest selectable date. */
  toDate?: Date;
  /** Format string for the trigger label. Default: "PP". */
  format?: string;
  className?: string;
}

const DEFAULT_PRESETS: Preset[] = [
  { label: "Today", value: () => ({ from: startOfDay(new Date()), to: new Date() }) },
  {
    label: "Last 7 days",
    value: () => ({ from: startOfDay(addDays(new Date(), -6)), to: new Date() }),
  },
  {
    label: "Last 30 days",
    value: () => ({ from: startOfDay(addDays(new Date(), -29)), to: new Date() }),
  },
  {
    label: "Last 90 days",
    value: () => ({ from: startOfDay(addDays(new Date(), -89)), to: new Date() }),
  },
  { label: "This month", value: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
  { label: "This quarter", value: () => ({ from: startOfQuarter(new Date()), to: new Date() }) },
  { label: "Year to date", value: () => ({ from: startOfYear(new Date()), to: new Date() }) },
];

export function DateRangePicker({
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  fromDate,
  toDate,
  format: dateFormat = "PP",
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  const triggerLabel = React.useMemo(() => {
    if (!value.from || !value.to) return "Pick a date range";
    const sameDay = format(value.from, "yyyy-MM-dd") === format(value.to, "yyyy-MM-dd");
    return sameDay
      ? format(value.from, dateFormat)
      : `${format(value.from, dateFormat)} → ${format(value.to, dateFormat)}`;
  }, [value, dateFormat]);

  function applyPreset(preset: Preset) {
    onChange(preset.value());
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={cn("h-9 justify-start font-normal", className)}>
          <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" aria-hidden />
          {triggerLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="flex flex-col sm:flex-row">
          <ul className="flex shrink-0 flex-col gap-0.5 p-2 sm:w-40">
            {presets.map((p) => (
              <li key={p.label}>
                <button
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="w-full rounded-sm px-3 py-1.5 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {p.label}
                </button>
              </li>
            ))}
          </ul>

          <Separator orientation="vertical" className="hidden sm:block" />

          <div className="p-2">
            <Calendar
              mode="range"
              selected={{ from: value.from, to: value.to }}
              onSelect={(next) => {
                if (next?.from && next?.to) onChange({ from: next.from, to: next.to });
                else if (next?.from) onChange({ from: next.from, to: next.from });
              }}
              numberOfMonths={2}
              fromDate={fromDate}
              toDate={toDate}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
