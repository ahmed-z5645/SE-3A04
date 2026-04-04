import type { LabelHTMLAttributes } from "react";
import { cn } from "./cn";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

/** Ported from styles.label: 13px, 500, text-secondary, block, mb 6. */
export function Label({ className, children, ...rest }: LabelProps) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-[13px] font-medium text-text-secondary",
        className
      )}
      {...rest}
    >
      {children}
    </label>
  );
}
