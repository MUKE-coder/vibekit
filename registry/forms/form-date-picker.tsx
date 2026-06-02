"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useFormContext, type FieldPath, type FieldValues } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/**
 * Calendar-in-popover date picker bound to React Hook Form. Stores a Date in
 * form state (NOT an ISO string — convert on submit if your API wants ISO).
 *
 *   <FormDatePicker name="dueDate" label="Due date" />
 *   <FormDatePicker
 *     name="startsAt"
 *     label="Starts"
 *     fromDate={new Date()}
 *     dateFormat="PPP 'at' p"
 *   />
 *
 * Replaces native <input type="date">, which has terrible cross-browser UX.
 */

interface FormDatePickerProps {
  name: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  placeholder?: string;
  /** date-fns format string. Default: "PPP" (e.g. "May 18, 2026"). */
  dateFormat?: string;
  /** Earliest selectable date. */
  fromDate?: Date;
  /** Latest selectable date. */
  toDate?: Date;
  disabled?: boolean;
  className?: string;
}

export function FormDatePicker<V extends FieldValues = FieldValues>({
  name,
  label,
  description,
  placeholder = "Pick a date",
  dateFormat = "PPP",
  fromDate,
  toDate,
  disabled,
  className,
}: FormDatePickerProps) {
  const { control } = useFormContext<V>();

  return (
    <FormField
      control={control}
      name={name as FieldPath<V>}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", className)}>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  type="button"
                  variant="outline"
                  disabled={disabled}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value instanceof Date && !isNaN(field.value.getTime())
                    ? format(field.value, dateFormat)
                    : placeholder}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value instanceof Date ? field.value : undefined}
                onSelect={field.onChange}
                fromDate={fromDate}
                toDate={toDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
