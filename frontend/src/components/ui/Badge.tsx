import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: "bg-border-default text-text-secondary",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  error: "bg-error-bg text-error",
  info: "bg-accent-bg text-accent",
};

/** Ported from styles.badge(type): pill, 11px, 500 weight, tinted bg. */
export function Badge({
  variant = "default",
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[11px] font-medium",
        VARIANT_CLASSES[variant],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
