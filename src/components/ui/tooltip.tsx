import React, { ReactNode, HTMLAttributes } from "react";

interface TooltipProps {
  children: ReactNode;
  className?: string;
}
export function Tooltip({ children, className }: TooltipProps) {
  return <span className={`relative inline-flex group ${className || ""}`}>{children}</span>;
}

type TriggerProps = HTMLAttributes<HTMLSpanElement> & { children: ReactNode };
export function TooltipTrigger({ children, ...props }: TriggerProps) {
  return <span {...props} className={`inline-flex ${props.className || ""}`}>{children}</span>;
}

interface TooltipContentProps {
  children: ReactNode;
  className?: string;
}
export function TooltipContent({ children, className }: TooltipContentProps) {
  return (
    <span
      role="tooltip"
      className={`pointer-events-none absolute z-50 -top-2 right-1/2 translate-x-1/2 -translate-y-full
                  whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-xs text-white opacity-0
                  transition-opacity duration-150 group-hover:opacity-100 ${className || ""}`}
    >
      {children}
    </span>
  );
}
