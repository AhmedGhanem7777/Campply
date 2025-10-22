import React, { ButtonHTMLAttributes } from "react";

interface SwitchProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  id?: string;
  className?: string;
  disabled?: boolean;
}
export function Switch({ checked = false, onCheckedChange, id, className, disabled, ...props }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!checked}
      aria-disabled={!!disabled}
      id={id}
      onClick={() => !disabled && onCheckedChange?.(!checked)}
      className={`inline-flex h-6 w-10 items-center rounded-full transition-colors
                  ${checked ? "bg-emerald-500" : "bg-gray-400"}
                  ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  ${className || ""}`}
      {...props}
    >
      <span
        className={`h-5 w-5 rounded-full bg-white transition-transform translate-y-0.5
                    ${checked ? "translate-x-5" : "translate-x-0.5"}`}
      />
    </button>
  );
}
