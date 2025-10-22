// src/components/ui/SwitchRtl.tsx
import React, { useEffect, useMemo, useState } from "react";

type SwitchRtlProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
};

export default function SwitchRtl({
  checked,
  onChange,
  label,
  disabled,
  className = "",
  id,
}: SwitchRtlProps) {
  // اكتشاف اتجاه الصفحة من عنصر html أو document.dir
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    const dir =
      document.documentElement.getAttribute("dir") ||
      (document as any).dir ||
      "ltr";
    setIsRtl(dir === "rtl");
  }, []);

  // قلب التراصف حسب RTL: في LTR => false: start, true: end
  // في RTL => false: end,   true: start
  const justifyClass = useMemo(() => {
    if (isRtl) return checked ? "justify-start" : "justify-end";
    return checked ? "justify-end" : "justify-start";
  }, [isRtl, checked]);

  const trackClasses = useMemo(
    () =>
      [
        "inline-flex",
        "items-center",
        "h-7",
        "w-12",
        "rounded-full",
        "border",
        "transition-colors",
        "p-0.5",
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-offset-2",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        // لون المسار حسب الحالة
        checked ? "bg-primary/30 border-primary/40" : "bg-secondary border-border",
        justifyClass,
        className,
      ].join(" "),
    [checked, disabled, justifyClass, className]
  );

  const thumbClasses = useMemo(
    () =>
      [
        "h-5",
        "w-5",
        "rounded-full",
        "bg-primary",
        "shadow",
        "transition-transform",
        "will-change-transform",
      ].join(" "),
    []
  );

  function toggle() {
    if (disabled) return;
    onChange(!checked);
  }

  // دعم لوحة المفاتيح مع مراعاة RTL لأسهم الاتجاه
  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      // في RTL السهم لليسار يزيد (true)، في LTR ينقص (false)
      onChange(isRtl ? true : false);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      // في RTL السهم لليمين ينقص (false)، في LTR يزيد (true)
      onChange(isRtl ? false : true);
    }
  }

  return (
    <div className="flex items-center gap-3" dir="auto">
      {label && (
        <label
          htmlFor={id}
          className="text-sm select-none cursor-pointer"
          onClick={toggle}
        >
          {label}
        </label>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        id={id}
        className={trackClasses}
        onClick={toggle}
        onKeyDown={onKeyDown}
      >
        <span className={thumbClasses} />
      </button>
    </div>
  );
}
