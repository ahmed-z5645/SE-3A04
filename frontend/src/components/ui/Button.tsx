import type { ButtonHTMLAttributes } from "react";
import { cn } from "./cn";

type Variant = "default" | "primary" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

/**
 * Ported 1:1 from prototype styles.btn(variant).
 * - default: transparent w/ border
 * - primary: solid accent
 * - sm: smaller padding
 */
export function Button({
  variant = "default",
  className,
  children,
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-1.5 rounded-md text-[13px] font-medium transition-all font-sans cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed";
  const size = variant === "sm" ? "px-3 py-1.5" : "px-4 py-2";
  const look =
    variant === "primary"
      ? "bg-accent text-white border-0 hover:bg-accent-hover"
      : "bg-transparent text-text border border-border-default hover:border-border-hover";
  return (
    <button className={cn(base, size, look, className)} {...rest}>
      {children}
    </button>
  );
}
