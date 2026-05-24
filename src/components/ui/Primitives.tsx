import { cn } from "@/lib/utils";

export function PageHeader({
  title, description, actions, eyebrow,
}: { title: string; description?: string; actions?: React.ReactNode; eyebrow?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border bg-surface px-6 py-5">
      <div className="min-w-0">
        {eyebrow && <div className="label-uppercase mb-1.5">{eyebrow}</div>}
        <h1 className="font-display text-[26px] font-semibold leading-tight text-text-primary">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-[13px] text-text-secondary">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-lg border border-border bg-surface shadow-e1", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ title, action, hint }: { title: string; action?: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3.5">
      <div>
        <h3 className="text-[14px] font-semibold text-text-primary">{title}</h3>
        {hint && <p className="text-[11px] text-text-secondary">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

type Tone = "success" | "warning" | "error" | "info" | "neutral" | "brand" | "dark";
const toneClasses: Record<Tone, string> = {
  success: "bg-primary-tint text-primary-pressed",
  warning: "bg-[oklch(0.965_0.05_70)] text-[oklch(0.55_0.13_60)]",
  error: "bg-[oklch(0.96_0.06_27)] text-[var(--color-error)]",
  info: "bg-[oklch(0.95_0.04_263)] text-[var(--color-info)]",
  neutral: "bg-surface-2 text-text-secondary",
  brand: "bg-primary-tint text-primary-pressed",
  dark: "bg-foreground/10 text-foreground",
};

export function StatusBadge({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-sm px-1.5 py-0.5 text-[11px] font-medium", toneClasses[tone])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {children}
    </span>
  );
}

export function KpiCard({
  label, value, delta, deltaTone = "success", accent = "brand", suffix,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "success" | "error" | "neutral";
  accent?: "brand" | "info" | "success" | "warning" | "error";
  suffix?: string;
}) {
  const accentColor = {
    brand: "var(--color-primary)",
    info: "var(--color-info)",
    success: "var(--color-success)",
    warning: "var(--color-warning)",
    error: "var(--color-error)",
  }[accent];
  const deltaCls = deltaTone === "success" ? "text-[var(--color-success)]" : deltaTone === "error" ? "text-[var(--color-error)]" : "text-text-secondary";
  return (
    <div className="relative rounded-lg border border-border bg-surface px-5 py-4 shadow-e1 transition hover:shadow-e2">
      <div className="absolute left-0 top-3 bottom-3 w-[2px] rounded-r" style={{ background: accentColor }} />
      <div className="label-uppercase">{label}</div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span className="font-mono text-[26px] font-semibold leading-none tracking-tight text-text-primary">{value}</span>
        {suffix && <span className="text-[12px] text-text-secondary">{suffix}</span>}
      </div>
      {delta && <div className={cn("mt-2 text-[11px] font-medium", deltaCls)}>{delta}</div>}
    </div>
  );
}

export function SectionDivider({ children }: { children: React.ReactNode }) {
  return <div className="label-uppercase mb-3 mt-1 text-text-secondary">{children}</div>;
}

export function Button({
  variant = "primary", size = "md", className, children, ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "outline" | "danger"; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "h-8 px-3 text-[12px]" : "h-9 px-3.5 text-[13px]";
  const styles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary-pressed shadow-e1",
    secondary: "bg-accent text-accent-foreground hover:bg-primary-tint",
    outline: "border border-border bg-surface text-primary hover:bg-surface-2",
    ghost: "text-text-secondary hover:bg-surface-2 hover:text-text-primary",
    danger: "bg-[oklch(0.96_0.06_27)] text-[var(--color-error)] hover:bg-[oklch(0.93_0.09_27)]",
  }[variant];
  return (
    <button {...rest} className={cn("inline-flex items-center gap-1.5 rounded-md font-medium transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30", sz, styles, className)}>
      {children}
    </button>
  );
}
