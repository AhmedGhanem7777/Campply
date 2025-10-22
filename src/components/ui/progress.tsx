import React from "react";

interface ProgressProps {
  value?: number;
  className?: string;
}
export function Progress({ value = 0, className }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className={`h-2 w-full overflow-hidden rounded-full bg-muted ${className || ""}`}
    >
      <div className="h-full bg-primary transition-transform" style={{ transform: `translateX(-${100 - pct}%)` }} />
    </div>
  );
}
