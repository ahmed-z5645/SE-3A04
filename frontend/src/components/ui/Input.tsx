import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "./cn";

const INPUT_BASE =
  "w-full rounded-md border border-border-default bg-bg-input px-3 py-2 text-sm text-text font-sans outline-none transition-all placeholder:text-text-muted focus:border-border-hover";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...rest }: InputProps) {
  return <input className={cn(INPUT_BASE, className)} {...rest} />;
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...rest }: SelectProps) {
  return (
    <select className={cn(INPUT_BASE, "cursor-pointer", className)} {...rest}>
      {children}
    </select>
  );
}
