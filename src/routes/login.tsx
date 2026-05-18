import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { ROLE_LABEL } from "@/lib/rbac";
import {
  Lock, User, Eye, EyeOff, ChevronDown, ChevronLeft, ChevronRight,
  Sun, Plane, PlaneLanding, Gauge, TrendingUp, Sparkles, Zap, BarChart3, Heart, Quote,
} from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Retrod PMS" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { users, login, isAuthenticated } = useAuth();
  const nav = useNavigate();
  const [selected, setSelected] = useState<string>(users[0]?.id ?? "");
  const [email, setEmail] = useState("you@hotel.com");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);

  useEffect(() => { if (isAuthenticated) nav({ to: "/" }); }, [isAuthenticated, nav]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const match =
      users.find(u => u.email.toLowerCase() === email.toLowerCase()) ??
      users.find(u => u.id === selected);
    if (match) { login(match.id); nav({ to: "/" }); }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.35fr_1fr] bg-background">
      {/* LEFT — dark marketing panel */}
      <div className="relative hidden lg:flex flex-col overflow-hidden bg-[oklch(0.13_0.02_260)] text-white">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-12 pt-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary font-display text-[18px] font-semibold text-primary-foreground">R</div>
          <span className="font-display text-[26px] font-semibold tracking-tight">Retrod</span>
          <span className="ml-1 rounded-sm bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-white/70">PMS</span>
        </div>

        <div className="grid flex-1 grid-cols-[1fr_1.05fr] gap-10 px-12 pt-10 pb-8">
          {/* Copy + benefits */}
          <div className="flex flex-col">
            <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[oklch(0.7_0.18_300)]">
              All-in-one operating system
            </div>
            <h1 className="mt-4 font-display text-[44px] leading-[1.05] tracking-tight">
              Powering hospitality<br/>excellence.
            </h1>
            <p className="mt-5 max-w-md text-[13px] leading-relaxed text-white/60">
              Retrod PMS unifies your hotel operations — from reservations to revenue — so you can deliver outstanding guest experiences and drive profitability.
            </p>

            <ul className="mt-9 space-y-5">
              {[
                { icon: Plane,     title: "Increase direct bookings",  body: "Centralize inventory and rates across all channels." },
                { icon: Zap,       title: "Streamline operations",     body: "Automate front office, housekeeping and billing workflows." },
                { icon: BarChart3, title: "Real-time insights",        body: "Make data-driven decisions with live dashboards and reports." },
                { icon: Heart,     title: "Delight every guest",       body: "Personalize stays and build lasting guest loyalty." },
              ].map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/20">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[13.5px] font-medium text-white">{title}</div>
                    <div className="text-[12.5px] text-white/55">{body}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Calendar + KPIs + testimonial */}
          <div className="flex flex-col gap-5">
            <CalendarCard />
            <TodayCard />
            <TestimonialCard />
          </div>
        </div>

        {/* Trusted by */}
        <div className="px-12 pb-10">
          <div className="mb-5 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
            Trusted by leading hotels
          </div>
          <div className="grid grid-cols-5 items-center gap-6 opacity-70">
            {[
              { name: "The Grand",     sub: "Palace" },
              { name: "Majestic",      sub: "Suites" },
              { name: "Ocean Breeze",  sub: "Resort & Spa" },
              { name: "The Capital",   sub: "Hotel" },
              { name: "Royal Orchid",  sub: "Hotels" },
            ].map((b) => (
              <div key={b.name} className="text-center">
                <div className="font-display text-[14px] tracking-[0.18em] text-white/85">{b.name.toUpperCase()}</div>
                <div className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.22em] text-white/40">{b.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — light sign-in panel */}
      <div className="relative flex flex-col bg-[oklch(0.985_0.003_240)]">
        <button className="absolute right-8 top-8 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-text-secondary shadow-sm hover:text-text-primary" aria-label="Theme">
          <Sun className="h-4 w-4" />
        </button>

        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center px-6 py-16">
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Welcome back</div>
          <h2 className="mt-2 font-display text-[34px] font-semibold leading-tight text-text-primary">Sign in to Retrod</h2>
          <p className="mt-2 text-[13.5px] text-text-secondary">Use your assigned credentials to access the property.</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <Field label="Email">
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-disabled" />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@hotel.com"
                  className="h-11 w-full rounded-md border border-border bg-surface pl-10 pr-3 text-[13.5px] text-text-primary placeholder:text-text-disabled focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                />
              </div>
            </Field>

            <Field label="Password">
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-disabled" />
                <input
                  type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"
                  className="h-11 w-full rounded-md border border-border bg-surface pl-10 pr-10 text-[13.5px] text-text-primary placeholder:text-text-disabled focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                />
                <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-disabled hover:text-text-secondary" aria-label="Toggle password">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-text-secondary">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border-border accent-primary" />
                Remember me
              </label>
              <button type="button" className="text-[12.5px] font-medium text-primary hover:underline">Forgot password?</button>
            </div>

            <button type="submit" className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-[13.5px] font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-pressed">
              <Lock className="h-3.5 w-3.5" /> Sign in
            </button>
          </form>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-text-disabled">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="rounded-lg border border-border bg-surface p-4 shadow-sm">
            <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-primary">Demo access</div>
            <div className="relative">
              <select
                value={selected}
                onChange={(e) => {
                  setSelected(e.target.value);
                  const u = users.find(x => x.id === e.target.value);
                  if (u) setEmail(u.email);
                }}
                className="h-11 w-full appearance-none rounded-md border border-border bg-surface px-3 pr-9 text-[13px] text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} — {ROLE_LABEL[u.role]}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            </div>
            <p className="mt-2 text-[11.5px] text-text-secondary">Experience Retrod with full access to all features.</p>
          </div>

          <div className="mt-10 text-center text-[11px] text-text-disabled">
            © 2026 Retrod Systems · The Grand Palace, New Delhi
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12.5px] font-medium text-text-primary">{label}</label>
      {children}
    </div>
  );
}

function CalendarCard() {
  const today = 14;
  const days = useMemo(() => {
    // May 2026 starts on Friday. Show preceding Mon-Thu from April (27,28,29,30).
    const prev = [27, 28, 29, 30];
    const cur = Array.from({ length: 31 }, (_, i) => i + 1);
    return [...prev, ...cur];
  }, []);

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-5 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[14px] font-medium text-white/90">May 2026</div>
        <div className="flex items-center gap-1">
          <button className="flex h-7 w-7 items-center justify-center rounded-md text-white/60 hover:bg-white/5 hover:text-white"><ChevronLeft className="h-4 w-4" /></button>
          <button className="flex h-7 w-7 items-center justify-center rounded-md text-white/60 hover:bg-white/5 hover:text-white"><ChevronRight className="h-4 w-4" /></button>
          <button className="ml-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/80 hover:bg-white/10">Today</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-2 text-center">
        {["MON","TUE","WED","THU","FRI","SAT","SUN"].map(d => (
          <div key={d} className="text-[10px] font-medium tracking-wider text-white/35">{d}</div>
        ))}
        {days.map((d, idx) => {
          const isPrev = idx < 4;
          const isToday = !isPrev && d === today;
          return (
            <div key={idx} className="flex items-center justify-center">
              <div className={[
                "flex h-8 w-8 items-center justify-center rounded-full text-[12.5px]",
                isToday ? "bg-primary font-semibold text-primary-foreground" : isPrev ? "text-white/25" : "text-white/75 hover:bg-white/5",
              ].join(" ")}>{d}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TodayCard() {
  const items = [
    { label: "Arrivals",   value: "12",      icon: Plane,        tone: "text-[oklch(0.78_0.16_300)]" },
    { label: "Departures", value: "08",      icon: PlaneLanding, tone: "text-[oklch(0.78_0.13_150)]" },
    { label: "Occupancy",  value: "72%",     icon: Gauge,        tone: "text-[oklch(0.82_0.14_85)]" },
    { label: "RevPAR",     value: "₹ 8,540", icon: TrendingUp,   tone: "text-[oklch(0.78_0.13_220)]" },
  ];
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[13px] font-medium text-white/85">Today at a glance</div>
        <div className="text-[11px] text-white/40">May 14, 2026</div>
      </div>
      <div className="grid grid-cols-4 gap-2.5">
        {items.map((it) => (
          <div key={it.label} className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-wider text-white/45">{it.label}</div>
              <it.icon className={`h-3.5 w-3.5 ${it.tone}`} />
            </div>
            <div className="mt-2 font-display text-[18px] font-semibold text-white">{it.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialCard() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/8 bg-white/[0.03] p-5">
      <Quote className="h-5 w-5 text-primary" />
      <p className="mt-2.5 max-w-[80%] text-[13px] leading-relaxed text-white/80">
        "Retrod PMS has transformed how we operate. Our team saves hours every day and our guests feel the difference."
      </p>
      <div className="mt-3.5">
        <div className="text-[12.5px] font-medium text-white">Aman Verma</div>
        <div className="text-[11px] text-white/45">General Manager, The Grand Palace</div>
      </div>
      <Sparkles className="absolute -right-2 -bottom-2 h-24 w-24 text-white/[0.04]" />
    </div>
  );
}
