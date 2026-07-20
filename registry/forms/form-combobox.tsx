"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useFormContext, type FieldPath, type FieldValues } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
 * Searchable combobox bound to React Hook Form. Supports either a static
 * options array OR an async loader keyed by the current query string.
 *
 *   <FormCombobox
 *     name="categoryId"
 *     label="Category"
 *     options={[{ value: "1", label: "Sales" }, ...]}
 *   />
 *
 *   <FormCombobox
 *     name="contactId"
 *     label="Contact"
 *     loadOptions={async (q) => await fetch(`/api/contacts?q=${q}`).then(r => r.json())}
 *     getOptionLabel={(c) => c.name}
 *     getOptionValue={(c) => c.id}
 *   />
 *
 * Stores the selected value on the form (whatever `getOptionValue` returns)
 * and shows the label in the trigger.
 */

export interface ComboboxOption<T = string> {
  label: string;
  value: T;
}

type StaticProps<T> = {
  options: ComboboxOption<T>[];
  loadOptions?: never;
  getOptionLabel?: (opt: ComboboxOption<T>) => string;
  getOptionValue?: (opt: ComboboxOption<T>) => T;
};

type AsyncProps<T> = {
  options?: never;
  loadOptions: (query: string) => Promise<T[]>;
  getOptionLabel: (item: T) => string;
  getOptionValue: (item: T) => string | number;
};

type CommonProps = {
  name: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
};

export type FormComboboxProps<T = string> = CommonProps & (StaticProps<T> | AsyncProps<T>);

export function FormCombobox<T = string, V extends FieldValues = FieldValues>(
  props: FormComboboxProps<T>,
) {
  const { control } = useFormContext<V>();
  const {
    name,
    label,
    description,
    placeholder = "Select…",
    emptyMessage = "No results.",
    disabled,
    className,
  } = props;

  const isAsync = "loadOptions" in props && props.loadOptions !== undefined;

  return (
    <FormField
      control={control}
      name={name as FieldPath<V>}
      render={({ field }) => (
        <FormItem className={className}>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>
            <ComboboxInner
              {...props}
              value={field.value}
              onChange={field.onChange}
              isAsync={isAsync}
              placeholder={placeholder}
              emptyMessage={emptyMessage}
              disabled={disabled}
            />
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface ComboboxInnerProps<T> {
  options?: ComboboxOption<T>[];
  loadOptions?: (query: string) => Promise<T[]>;
  /**
   * Accessors are declared in METHOD syntax on purpose. The list this component
   * renders is heterogeneous — `ComboboxOption<T>` in static mode, bare `T` in
   * async mode — so the parameter has to be `unknown` here. Method-syntax
   * parameters are bivariant, which lets the caller's narrower signature
   * (`(opt: ComboboxOption<T>) => string` or `(item: T) => string`) be assigned;
   * arrow-property syntax would be strictly contravariant and reject both.
   */
  getOptionLabel?(item: unknown): string;
  getOptionValue?(item: unknown): unknown;
  value: unknown;
  onChange: (value: unknown) => void;
  isAsync: boolean;
  placeholder: string;
  emptyMessage: string;
  disabled?: boolean;
}

function ComboboxInner<T>({
  options,
  loadOptions,
  getOptionLabel,
  getOptionValue,
  value,
  onChange,
  isAsync,
  placeholder,
  emptyMessage,
  disabled,
}: ComboboxInnerProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [asyncResults, setAsyncResults] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Default extractors
  const labelOf = React.useCallback(
    (item: unknown) =>
      getOptionLabel ? getOptionLabel(item) : (item as ComboboxOption<T>).label,
    [getOptionLabel],
  );
  const valueOf = React.useCallback(
    (item: unknown) =>
      getOptionValue ? getOptionValue(item) : (item as ComboboxOption<T>).value,
    [getOptionValue],
  );

  // Async loading with simple debounce
  React.useEffect(() => {
    if (!isAsync || !loadOptions) return;
    let cancelled = false;
    setLoading(true);
    const id = setTimeout(async () => {
      try {
        const res = await loadOptions(query);
        if (!cancelled) setAsyncResults(res);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [isAsync, loadOptions, query]);

  const items: unknown[] = isAsync ? asyncResults : (options ?? []);
  const selected = items.find((it) => valueOf(it) === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between font-normal", !selected && "text-muted-foreground")}
        >
          {selected ? labelOf(selected) : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={!isAsync}>
          <CommandInput
            placeholder="Search…"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </div>
            ) : items.length === 0 ? (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            ) : (
              <CommandGroup>
                {items.map((item, i) => {
                  const v = valueOf(item);
                  const label = labelOf(item);
                  return (
                    <CommandItem
                      key={String(v) + i}
                      value={label}
                      onSelect={() => {
                        onChange(v);
                        setOpen(false);
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", v === value ? "opacity-100" : "opacity-0")} />
                      {label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
