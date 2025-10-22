import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  ButtonHTMLAttributes,
  HTMLAttributes,
} from "react";

type TabsCtx = { value: string; set: (v: string) => void };
const Ctx = createContext<TabsCtx>({ value: "", set: () => {} });

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  className?: string;
  children?: ReactNode;
}
export function Tabs({ defaultValue, value, onValueChange, className, children }: TabsProps) {
  const [val, setVal] = useState<string>(value ?? defaultValue ?? "");
  useEffect(() => {
    if (value !== undefined) setVal(value);
  }, [value]);
  const set = (v: string) => {
    onValueChange?.(v);
    if (value === undefined) setVal(v);
  };
  return (
    <Ctx.Provider value={{ value: val, set }}>
      <div className={className}>{children}</div>
    </Ctx.Provider>
  );
}

interface TabsListProps {
  className?: string;
  children?: ReactNode;
}
export function TabsList({ className, children }: TabsListProps) {
  return <div role="tablist" className={`inline-flex items-center gap-1 ${className || ""}`}>{children}</div>;
}

interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  className?: string;
  children?: ReactNode;
}
export function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
  const { value: v, set } = useContext(Ctx);
  const active = v === value;
  return (
    <button
      {...props}
      role="tab"
      aria-selected={active}
      onClick={() => set(value)}
      className={`px-3 py-1.5 rounded-md text-sm border transition
        ${active ? "bg-primary text-primary-foreground border-primary" : "bg-muted hover:bg-muted/80 border-transparent"}
        ${className || ""}`}
    >
      {children}
    </button>
  );
}

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  className?: string;
  children?: ReactNode;
}
export function TabsContent({ value, className, children, ...props }: TabsContentProps) {
  const { value: v } = useContext(Ctx);
  if (v !== value) return null;
  return (
    <div role="tabpanel" className={className} {...props}>
      {children}
    </div>
  );
}
