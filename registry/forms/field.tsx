"use client";

import * as React from "react";
import { useFormContext, type FieldPath, type FieldValues } from "react-hook-form";

import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/**
 * One-row labeled field for React Hook Form + shadcn Form. Wraps the
 * primitives so you don't repeat the FormField/FormItem/FormLabel/
 * FormControl/FormMessage scaffold on every input.
 *
 *   <Field name="email" label="Email" type="email" placeholder="you@example.com" />
 *   <Field name="bio" label="Bio" as="textarea" rows={4} />
 *   <Field name="title" label="Title" description="Public — shown on your profile." />
 *
 * Always called inside a <Form> (FormProvider) — pulls `control` from
 * useFormContext, so consumers don't have to pass it.
 */

type FieldAs = "input" | "textarea";

type FieldBaseProps<TName extends string = string> = {
  name: TName;
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** Hide the label visually but keep it for screen readers. */
  hideLabel?: boolean;
  className?: string;
  /** Adds a `*` next to the label. Doesn't affect schema-side requiredness. */
  required?: boolean;
};

type FieldInputProps = FieldBaseProps & {
  as?: "input";
} & Omit<React.ComponentProps<typeof Input>, "name">;

type FieldTextareaProps = FieldBaseProps & {
  as: "textarea";
} & Omit<React.ComponentProps<typeof Textarea>, "name">;

export type FieldProps = FieldInputProps | FieldTextareaProps;

export function Field<TFieldValues extends FieldValues = FieldValues>(props: FieldProps) {
  const { control } = useFormContext<TFieldValues>();
  const { name, label, description, hideLabel, className, required, as = "input", ...rest } = props;

  return (
    <FormField
      control={control}
      name={name as FieldPath<TFieldValues>}
      render={({ field }) => (
        <FormItem className={className}>
          {label ? (
            <FormLabel className={cn(hideLabel && "sr-only")}>
              {label}
              {required ? <span aria-hidden className="ml-0.5 text-destructive">*</span> : null}
            </FormLabel>
          ) : null}
          <FormControl>
            {as === "textarea" ? (
              <Textarea {...(rest as React.ComponentProps<typeof Textarea>)} {...field} />
            ) : (
              <Input {...(rest as React.ComponentProps<typeof Input>)} {...field} />
            )}
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
