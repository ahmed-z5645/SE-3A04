import type { HTMLAttributes } from "react";
import { cn } from "./cn";

type CardProps = HTMLAttributes<HTMLDivElement>;

/** Ported from styles.card: bg-bg-card, border, rounded-xl, padding 20, transition. */
export function Card({ className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border-default bg-bg-card p-5 transition-all",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
