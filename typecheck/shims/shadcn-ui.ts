/**
 * Stand-in for shadcn/ui components (`@/components/ui/*`).
 *
 * Those files are generated into a USER's project by `shadcn init` / `shadcn add`
 * — they don't live in this repo, so there is nothing real to point at. This shim
 * lets every registry primitive resolve its shadcn imports so the rest of the
 * file can be typechecked.
 *
 * Deliberate limitation: components are typed loosely, so this harness will NOT
 * catch "you passed the wrong prop to <Button>". It DOES catch everything else —
 * syntax errors, bad hook signatures, wrong Next.js APIs, type errors in the
 * primitive's own logic, and imports that don't resolve at all. That's the class
 * of bug that has actually shipped.
 */
import type * as React from "react";

type AnyProps = Record<string, unknown> & { children?: React.ReactNode };
type AnyComponent = React.ComponentType<AnyProps>;

declare const component: AnyComponent;

/**
 * Components whose callback props must be typed precisely.
 *
 * Presentational components can stay loose, but anything a primitive passes a
 * handler to must carry a real signature — otherwise `onCheckedChange={(v) => …}`
 * infers `v: any`, the file "passes", and the harness reports noise instead of
 * signal. These mirror the real shadcn/Radix types.
 */
type Toggleable = AnyProps & { onCheckedChange?: (checked: boolean) => void; checked?: boolean };
type Openable = AnyProps & { onOpenChange?: (open: boolean) => void; open?: boolean };
type Valuable = AnyProps & { onValueChange?: (value: string) => void; value?: string };
type Selectable = AnyProps & { onSelect?: (value: any) => void };
type InputLike = React.InputHTMLAttributes<HTMLInputElement> & Record<string, unknown>;
type TextareaLike = React.TextareaHTMLAttributes<HTMLTextAreaElement> & Record<string, unknown>;
// `React.ComponentProps<"button">` rather than ButtonHTMLAttributes: under
// React 19 `ref` is an ordinary prop, and real shadcn/ui declares Button this
// way. ButtonHTMLAttributes omits `ref`, which would wrongly reject a primitive
// that forwards one.
type ButtonLike = React.ComponentProps<"button"> & {
  variant?: string;
  size?: string;
  asChild?: boolean;
};

// Every named export any primitive pulls from `@/components/ui/*`.
export const Accordion: AnyComponent = component;
export const AccordionContent: AnyComponent = component;
export const AccordionItem: AnyComponent = component;
export const AccordionTrigger: AnyComponent = component;
export const Alert: AnyComponent = component;
export const AlertDescription: AnyComponent = component;
export const AlertDialog: React.ComponentType<Openable> = component as any;
export const AlertDialogAction: AnyComponent = component;
export const AlertDialogCancel: AnyComponent = component;
export const AlertDialogContent: AnyComponent = component;
export const AlertDialogDescription: AnyComponent = component;
export const AlertDialogFooter: AnyComponent = component;
export const AlertDialogHeader: AnyComponent = component;
export const AlertDialogTitle: AnyComponent = component;
export const AlertTitle: AnyComponent = component;
export const Avatar: AnyComponent = component;
export const AvatarFallback: AnyComponent = component;
export const AvatarImage: AnyComponent = component;
export const Badge: AnyComponent = component;
export const Button: React.ComponentType<ButtonLike> = component as any;
export const Calendar: React.ComponentType<Selectable> = component as any;
export const Card: AnyComponent = component;
export const CardContent: AnyComponent = component;
export const CardDescription: AnyComponent = component;
export const CardFooter: AnyComponent = component;
export const CardHeader: AnyComponent = component;
export const CardTitle: AnyComponent = component;
export const Checkbox: React.ComponentType<Toggleable> = component as any;
export const Collapsible: React.ComponentType<Openable> = component as any;
export const CollapsibleContent: AnyComponent = component;
export const CollapsibleTrigger: AnyComponent = component;
export const Command: AnyComponent = component;
export const CommandDialog: React.ComponentType<Openable> = component as any;
export const CommandEmpty: AnyComponent = component;
export const CommandGroup: AnyComponent = component;
export const CommandInput: AnyComponent = component;
export const CommandItem: React.ComponentType<Selectable> = component as any;
export const CommandList: AnyComponent = component;
export const CommandSeparator: AnyComponent = component;
export const CommandShortcut: AnyComponent = component;
export const Dialog: React.ComponentType<Openable> = component as any;
export const DialogContent: AnyComponent = component;
export const DialogDescription: AnyComponent = component;
export const DialogFooter: AnyComponent = component;
export const DialogHeader: AnyComponent = component;
export const DialogTitle: AnyComponent = component;
export const DialogTrigger: AnyComponent = component;
export const DropdownMenu: AnyComponent = component;
export const DropdownMenuCheckboxItem: React.ComponentType<Toggleable> = component as any;
export const DropdownMenuContent: AnyComponent = component;
export const DropdownMenuGroup: AnyComponent = component;
export const DropdownMenuItem: React.ComponentType<Selectable> = component as any;
export const DropdownMenuLabel: AnyComponent = component;
export const DropdownMenuRadioGroup: React.ComponentType<Valuable> = component as any;
export const DropdownMenuRadioItem: AnyComponent = component;
export const DropdownMenuSeparator: AnyComponent = component;
export const DropdownMenuSub: AnyComponent = component;
export const DropdownMenuSubContent: AnyComponent = component;
export const DropdownMenuSubTrigger: AnyComponent = component;
export const DropdownMenuTrigger: AnyComponent = component;
export const Form: AnyComponent = component;
export const FormControl: AnyComponent = component;
export const FormDescription: AnyComponent = component;

/**
 * shadcn's FormField is a re-export of react-hook-form's <Controller>, so its
 * `render` prop receives RHF's ControllerRenderProps. Typing it here is what
 * makes `render={({ field }) => …}` check instead of inferring `any`.
 */
type FormFieldRenderArgs = {
  field: {
    name: string;
    value: any;
    onChange: (...event: any[]) => void;
    onBlur: () => void;
    ref: React.Ref<any>;
    disabled?: boolean;
  };
  fieldState: { invalid: boolean; isDirty: boolean; isTouched: boolean; error?: { message?: string } };
  formState: Record<string, unknown>;
};
export const FormField: React.ComponentType<
  AnyProps & { render?: (args: FormFieldRenderArgs) => React.ReactElement }
> = component as any;
export const FormItem: AnyComponent = component;
export const FormLabel: AnyComponent = component;
export const FormMessage: AnyComponent = component;
export const Input: React.ComponentType<InputLike> = component as any;
export const Label: AnyComponent = component;
export const Popover: React.ComponentType<Openable> = component as any;
export const PopoverContent: AnyComponent = component;
export const PopoverTrigger: AnyComponent = component;
export const Progress: AnyComponent = component;
export const RadioGroup: React.ComponentType<Valuable> = component as any;
export const RadioGroupItem: AnyComponent = component;
export const ScrollArea: AnyComponent = component;
export const Select: React.ComponentType<Valuable> = component as any;
export const SelectContent: AnyComponent = component;
export const SelectItem: AnyComponent = component;
export const SelectTrigger: AnyComponent = component;
export const SelectValue: AnyComponent = component;
export const Separator: AnyComponent = component;
export const Sheet: React.ComponentType<Openable> = component as any;
export const SheetContent: AnyComponent = component;
export const SheetDescription: AnyComponent = component;
export const SheetHeader: AnyComponent = component;
export const SheetTitle: AnyComponent = component;
export const SheetTrigger: AnyComponent = component;
export const Skeleton: AnyComponent = component;
export const Slider: AnyComponent = component;
export const Switch: React.ComponentType<Toggleable> = component as any;
export const Table: AnyComponent = component;
export const TableBody: AnyComponent = component;
export const TableCell: AnyComponent = component;
export const TableHead: AnyComponent = component;
export const TableHeader: AnyComponent = component;
export const TableRow: AnyComponent = component;
export const Tabs: React.ComponentType<Valuable> = component as any;
export const TabsContent: AnyComponent = component;
export const TabsList: AnyComponent = component;
export const TabsTrigger: AnyComponent = component;
export const Textarea: React.ComponentType<TextareaLike> = component as any;
export const Tooltip: AnyComponent = component;
export const TooltipContent: AnyComponent = component;
export const TooltipProvider: AnyComponent = component;
export const TooltipTrigger: AnyComponent = component;

export const SheetClose: AnyComponent = component;
export const SheetFooter: AnyComponent = component;
export const SheetOverlay: AnyComponent = component;
export const SheetPortal: AnyComponent = component;

// Some shadcn modules also export hooks/helpers.
export declare const useFormField: () => Record<string, unknown>;
export declare const buttonVariants: (...args: unknown[]) => string;
export declare const badgeVariants: (...args: unknown[]) => string;

// Prop TYPES that primitives extend. shadcn exports these from the component
// module, so a primitive doing `interface X extends ButtonProps` needs them here.
export interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: string;
  size?: string;
  asChild?: boolean;
}
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
}
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
