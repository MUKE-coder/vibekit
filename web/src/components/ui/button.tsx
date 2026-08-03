import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-full)] font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[color:var(--text-primary)] text-[color:var(--text-inverse)] hover:opacity-90 active:opacity-95",
        accent:
          "bg-[color:var(--accent)] text-[color:var(--accent-fg)] shadow-[var(--shadow-glow)] hover:brightness-110 active:brightness-95",
        outline:
          "border border-[color:var(--border-strong)] bg-transparent text-[color:var(--text-primary)] hover:bg-[color:var(--bg-subtle)]",
        ghost:
          "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-[color:var(--bg-subtle)]",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-[15px]",
        lg: "h-12 px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type StyleProps = VariantProps<typeof buttonStyles>;

type ButtonAsButton = ButtonHTMLAttributes<HTMLButtonElement> &
  StyleProps & { href?: undefined; children: ReactNode };

type ButtonAsLink = AnchorHTMLAttributes<HTMLAnchorElement> &
  StyleProps & { href: string; children: ReactNode };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { className, variant, size, ...rest } = props;
  const classes = cn(buttonStyles({ variant, size }), className);

  if ("href" in rest && rest.href) {
    const isExternal = rest.href.startsWith("http");
    if (isExternal) {
      return (
        <a className={classes} target="_blank" rel="noopener noreferrer" {...rest} />
      );
    }
    return <Link className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })} />;
  }
  return <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)} />;
}
