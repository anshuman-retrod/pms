import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { ROLE_LABEL } from "@/lib/rbac";
import {
  Lock, User as UserIcon, Eye, EyeOff, ChevronDown, ChevronLeft, ChevronRight,
  Sparkles, Quote, ShieldCheck, BedDouble, BarChart3, Building2,
  Brain, Users, Wallet, Sun, ArrowUpRight, ArrowRight, Globe,
  TrendingUp, CalendarDays, CircleCheck, Smartphone, Loader2, AlertCircle,
  LifeBuoy,
} from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Retrod PMS" }] }),
  component: LoginPage,
});

type Mode = "otp" | "password";
type ErrorKind = null | "credentials" | "otp_expired" | "network";

function LoginPage() {
  const { users, login, isAuthenticated } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<Mode>("password");
  const [selected, setSelected] = useState<string>(users[0]?.id ?? "");

  // OTP state
  const [contact, setContact] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  // Password state
  const [username, setUsername] = useState("aarav_admin");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);

  // Async UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorKind>(null);

  useEffect(() => { if (isAuthenticated) nav({ to: "/" }); }, [isAuthenticated, nav]);

  const errorMsg = useMemo(() => {
    switch (error) {
      case "credentials": return "Invalid credentials. Please check your username and password.";
      case "otp_expired": return "OTP expired. Please request a new code.";
      case "network":     return "Network issue. Check your connection and try again.";
      default: return null;
    }
  }, [error]);

  const fakeDelay = () => new Promise<void>(r => setTimeout(r, 700));

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setLoading(true);
    await fakeDelay();
    const match =
      users.find(u => u.email.toLowerCase().startsWith(username.toLowerCase())) ??
      users.find(u => u.id === selected);
    setLoading(false);
    if (!match || !password) { setError("credentials"); return; }
    login(match.id); nav({ to: "/" });
  };

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) { setError("credentials"); return; }
    setError(null); setLoading(true);
    await fakeDelay();
    setLoading(false); setOtpSent(true);
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setLoading(true);
    await fakeDelay();
    setLoading(false);
    if (otp.length < 4) { setError("otp_expired"); return; }
    const match = users.find(u => u.id === selected) ?? users[0];
    if (match) { login(match.id); nav({ to: "/" }); }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.9fr_1fr] bg-background">
      {/* ====================== LEFT — Premium branding ====================== */}
      <div className="relative hidden lg:flex flex-col overflow-hidden text-white
                      bg-[radial-gradient(120%_90%_at_0%_0%,oklch(0.22_0.10_285)_0%,oklch(0.13_0.05_270)_45%,oklch(0.10_0.03_265)_100%)]">
        {/* Decorative gradients */}
        <div className="pointer-events-none absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full
                        bg-[radial-gradient(circle,oklch(0.55_0.22_295/.45),transparent_60%)] blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -right-32 h-[460px] w-[460px] rounded-full
                        bg-[radial-gradient(circle,oklch(0.65_0.18_55/.25),transparent_60%)] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full
                        bg-[radial-gradient(circle,oklch(0.45_0.20_265/.35),transparent_60%)] blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]
                        bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)]
                        bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />

        {/* Top bar */}
        <div className="relative flex items-center justify-between px-12 pt-10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-primary to-[oklch(0.55_0.22_295)] font-display text-[18px] font-semibold text-white shadow-lg shadow-primary/30">R</div>
            <span className="font-display text-[26px] font-semibold tracking-tight">Retrod</span>
            <span className="ml-1 rounded-sm bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-white/70">PMS</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/70 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_oklch(0.7_0.18_155)]" />
            All systems operational
          </div>
        </div>

        {/* Body grid */}
        <div className="relative grid flex-1 grid-cols-12 gap-8 px-12 pt-12 pb-10">
          {/* Left col: hero + benefits + trust */}
          <div className="col-span-7 flex flex-col">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/70 backdrop-blur">
              <Sparkles className="h-3 w-3 text-[oklch(0.78_0.14_85)]" />
              All-in-one operating system
            </div>

            <h1 className="mt-5 font-display text-[52px] leading-[1.02] tracking-tight">
              Smart hospitality
              <br />
              starts with{" "}
              <span className="bg-gradient-to-r from-[oklch(0.78_0.14_85)] via-[oklch(0.72_0.18_310)] to-primary bg-clip-text text-transparent">
                Retrod.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-white/60">
              The unified operating system for modern hotels — reservations, front office, housekeeping,
              billing and revenue, orchestrated by AI-powered hospitality workflows across every property you run.
            </p>

            {/* Benefits */}
            <div className="mt-9 grid grid-cols-2 gap-3">
              {[
                { icon: BedDouble, title: "Reservation OS",         body: "Real-time inventory across all channels." },
                { icon: Building2, title: "Multi-property",         body: "Operate every property from one cockpit." },
                { icon: BarChart3, title: "Revenue optimization",   body: "Dynamic rates, RevPAR you can defend." },
                { icon: Brain,     title: "AI hospitality insights",body: "Anticipate demand, automate decisions." },
                { icon: Users,     title: "Guest experience",       body: "Personalized stays at every touchpoint." },
                { icon: Wallet,    title: "Centralized billing",    body: "Folios, POS and payouts — unified." },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="group rounded-xl border border-white/8 bg-white/[0.03] p-3.5 backdrop-blur transition-colors hover:border-white/15 hover:bg-white/[0.05]">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary/25 to-[oklch(0.55_0.22_295)]/20 text-[oklch(0.85_0.10_290)] ring-1 ring-white/10">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="text-[13px] font-medium text-white">{title}</div>
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-white/55">{body}</p>
                </div>
              ))}
            </div>

            {/* Trust strip */}
            <div className="mt-auto pt-8">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <Trust icon={ShieldCheck} label="SOC 2 Type II" />
                <Trust icon={ShieldCheck} label="ISO 27001" />
                <Trust icon={Globe} label="PCI-DSS · GDPR" />
                <div className="hidden h-4 w-px bg-white/10 md:block" />
                <span className="text-[11px] text-white/45">Trusted by 1,200+ properties worldwide</span>
              </div>
            </div>
          </div>

          {/* Right col: KPI + calendar + testimonial */}
          <div className="col-span-5 flex flex-col gap-4">
            <KPIRow />
            <CalendarCard />
            <OccupancyCard />
            <TestimonialCard />
          </div>
        </div>
      </div>

      {/* ====================== RIGHT — Compact sign-in ====================== */}
      <div className="relative flex flex-col bg-[oklch(0.985_0.003_240)]">
        <div className="absolute right-6 top-6 flex items-center gap-2">
          <button className="flex h-8 items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 text-[11.5px] text-text-secondary shadow-sm hover:text-text-primary">
            <Globe className="h-3.5 w-3.5" /> EN
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-text-secondary shadow-sm hover:text-text-primary" aria-label="Theme">
            <Sun className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-auto flex w-full max-w-[360px] flex-1 flex-col justify-center px-5 py-12">
          <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-primary">Welcome back</div>
          <h2 className="mt-2 font-display text-[30px] font-semibold leading-tight text-text-primary">Sign in to Retrod</h2>
          <p className="mt-2 text-[13px] text-text-secondary">
            Use your assigned credentials to access the property.
          </p>

          {/* Mode toggle */}
          <div className="mt-6 grid grid-cols-2 rounded-full border border-border bg-surface p-1 shadow-sm">
            {(["otp", "password"] as Mode[]).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError(null); }}
                className={[
                  "h-9 rounded-full text-[12.5px] font-medium transition-all",
                  mode === m
                    ? "bg-gradient-to-r from-primary to-[oklch(0.55_0.22_295)] text-primary-foreground shadow-sm"
                    : "text-text-secondary hover:text-text-primary",
                ].join(" ")}
              >
                {m === "otp" ? "OTP login" : "Password login"}
              </button>
            ))}
          </div>

          {errorMsg && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-[12px] text-destructive">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ===================== OTP MODE ===================== */}
          {mode === "otp" && (
            <form onSubmit={otpSent ? verifyOtp : sendOtp} className="mt-5 space-y-4">
              <Field label="Phone number or email ID">
                <div className="relative">
                  <Smartphone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-disabled" />
                  <input
                    type="text" value={contact} onChange={(e) => setContact(e.target.value)}
                    placeholder="Enter phone or email" disabled={otpSent}
                    className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-3 text-[13.5px] text-text-primary placeholder:text-text-disabled shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 disabled:bg-muted/50"
                  />
                </div>
              </Field>

              {otpSent && (
                <Field label="Enter the 6-digit code">
                  <input
                    type="text" inputMode="numeric" maxLength={6}
                    value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="••••••"
                    className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-center text-[16px] tracking-[0.5em] text-text-primary placeholder:text-text-disabled shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                  />
                  <div className="mt-1.5 flex justify-between text-[11.5px] text-text-secondary">
                    <span>Code sent to <b className="text-text-primary">{contact}</b></span>
                    <button type="button" onClick={() => { setOtpSent(false); setOtp(""); }} className="font-medium text-primary hover:underline">Change</button>
                  </div>
                </Field>
              )}

              <PrimaryButton loading={loading}>
                {otpSent ? "Verify & sign in" : "Continue with OTP"}
              </PrimaryButton>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <button type="button" onClick={() => { setMode("password"); setError(null); }}
                        className="text-[11.5px] font-medium uppercase tracking-[0.16em] text-text-secondary hover:text-primary">
                  Or login with password
                </button>
                <div className="h-px flex-1 bg-border" />
              </div>
            </form>
          )}

          {/* ===================== PASSWORD MODE ===================== */}
          {mode === "password" && (
            <form onSubmit={submitPassword} className="mt-5 space-y-4">
              <Field label="Username">
                <div className="relative">
                  <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-disabled" />
                  <input
                    type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                    placeholder="aarav_admin"
                    className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-3 text-[13.5px] text-text-primary placeholder:text-text-disabled shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </Field>

              <Field label="Password">
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-disabled" />
                  <input
                    type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-10 text-[13.5px] text-text-primary placeholder:text-text-disabled shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
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

              <PrimaryButton loading={loading}>Sign in</PrimaryButton>
            </form>
          )}

          {/* Demo access */}
          <div className="mt-6 rounded-xl border border-border bg-surface p-3.5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-primary">Demo access</div>
              <Sparkles className="h-3.5 w-3.5 text-primary/70" />
            </div>
            <div className="relative">
              <select
                value={selected}
                onChange={(e) => {
                  setSelected(e.target.value);
                  const u = users.find(x => x.id === e.target.value);
                  if (u) setUsername(u.email.split("@")[0]);
                }}
                className="h-10 w-full appearance-none rounded-lg border border-border bg-surface px-3 pr-9 text-[12.5px] text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} — {ROLE_LABEL[u.role]}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 space-y-2 border-t border-border pt-4 text-[11px] text-text-disabled">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Building2 className="h-3 w-3" /> The Grand Palace · New Delhi</span>
              <span className="flex items-center gap-1.5"><LifeBuoy className="h-3 w-3" /> support@retrod.io</span>
            </div>
            <div className="flex items-center justify-between">
              <span>© 2026 Retrod Systems</span>
              <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> v4.2.0 · build 2026.05</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrimaryButton({ loading, children }: { loading?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit" disabled={loading}
      className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-[oklch(0.55_0.22_295)] text-[13.5px] font-medium text-primary-foreground shadow-sm shadow-primary/25 transition-all hover:shadow-md hover:shadow-primary/35 disabled:opacity-70"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
        <>
          {children}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </>
      )}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-text-primary">{label}</label>
      {children}
    </div>
  );
}

function Trust({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[11.5px] text-white/55">
      <Icon className="h-3.5 w-3.5 text-[oklch(0.78_0.14_85)]" />
      <span>{label}</span>
    </div>
  );
}

/* ====================== Widgets ====================== */

function KPIRow() {
  const kpis = [
    { label: "Occupancy", value: "82%",     delta: "+4.2%", tone: "emerald" },
    { label: "ADR",       value: "₹9,240",  delta: "+1.8%", tone: "emerald" },
    { label: "RevPAR",    value: "₹7,580",  delta: "+6.1%", tone: "emerald" },
  ];
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {kpis.map(k => (
        <div key={k.label} className="rounded-xl border border-white/8 bg-white/[0.03] p-3 backdrop-blur">
          <div className="text-[10.5px] font-medium uppercase tracking-wider text-white/45">{k.label}</div>
          <div className="mt-1.5 font-display text-[18px] font-semibold text-white">{k.value}</div>
          <div className="mt-1 inline-flex items-center gap-1 text-[10.5px] text-emerald-300/90">
            <TrendingUp className="h-3 w-3" />
            {k.delta}
          </div>
        </div>
      ))}
    </div>
  );
}

function CalendarCard() {
  const today = 14;
  // Days with bookings (mock)
  const arrivals = new Set([3, 7, 10, 14, 18, 22, 27]);
  const checkouts = new Set([5, 9, 13, 17, 21, 25, 30]);
  const days = useMemo(() => {
    const empty = Array.from({ length: 4 }, () => null);
    const cur = Array.from({ length: 31 }, (_, i) => i + 1);
    return [...empty, ...cur];
  }, []);

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4 backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-white/70" />
          <div className="text-[13px] font-medium text-white/90">May 2026</div>
        </div>
        <div className="flex items-center gap-1">
          <button className="flex h-6 w-6 items-center justify-center rounded text-white/60 hover:bg-white/5"><ChevronLeft className="h-3.5 w-3.5" /></button>
          <button className="flex h-6 w-6 items-center justify-center rounded text-white/60 hover:bg-white/5"><ChevronRight className="h-3.5 w-3.5" /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-1.5 text-center">
        {["M","T","W","T","F","S","S"].map((d, i) => (
          <div key={i} className="text-[9.5px] font-medium tracking-wider text-white/35">{d}</div>
        ))}
        {days.map((d, idx) => {
          const isToday = d === today;
          const isArr = d !== null && arrivals.has(d);
          const isOut = d !== null && checkouts.has(d);
          return (
            <div key={idx} className="flex items-center justify-center">
              {d !== null ? (
                <div className={[
                  "relative flex h-7 w-7 items-center justify-center rounded-full text-[11px]",
                  isToday ? "bg-gradient-to-br from-primary to-[oklch(0.55_0.22_295)] font-semibold text-white shadow-md shadow-primary/40"
                          : "text-white/75 hover:bg-white/5",
                ].join(" ")}>
                  {d}
                  {!isToday && (isArr || isOut) && (
                    <span className={[
                      "absolute -bottom-0.5 h-1 w-1 rounded-full",
                      isArr ? "bg-emerald-400" : "bg-[oklch(0.78_0.14_85)]"
                    ].join(" ")} />
                  )}
                </div>
              ) : <div className="h-7 w-7" />}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-3 text-[10.5px] text-white/55">
        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Arrivals</span>
        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.14_85)]" /> Check-outs</span>
        <span className="ml-auto flex items-center gap-1 text-white/70 hover:text-white cursor-pointer">View calendar <ArrowUpRight className="h-3 w-3" /></span>
      </div>
    </div>
  );
}

function OccupancyCard() {
  const bars = [62, 71, 58, 80, 74, 88, 82];
  const labels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10.5px] font-medium uppercase tracking-wider text-white/45">Occupancy · This week</div>
          <div className="mt-1 flex items-baseline gap-2">
            <div className="font-display text-[20px] font-semibold text-white">73.8%</div>
            <div className="text-[11px] text-emerald-300/90">▲ 5.2 vs last week</div>
          </div>
        </div>
        <CircleCheck className="h-4 w-4 text-emerald-400/80" />
      </div>
      <div className="mt-3 flex h-16 items-end gap-1.5">
        {bars.map((b, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-sm bg-gradient-to-t from-primary/40 to-[oklch(0.72_0.18_310)]/80"
              style={{ height: `${b}%` }}
            />
            <div className="text-[9px] text-white/40">{labels[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialCard() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/8 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-4">
      <Quote className="h-4 w-4 text-[oklch(0.78_0.14_85)]" />
      <p className="mt-2 text-[12.5px] leading-relaxed text-white/80">
        "Retrod transformed our operations across 14 properties. RevPAR is up 18% and our teams finally work from a single source of truth."
      </p>
      <div className="mt-3 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.55_0.22_295)] text-[11px] font-semibold text-white">AV</div>
        <div>
          <div className="text-[12px] font-medium text-white">Aman Verma</div>
          <div className="text-[10.5px] text-white/45">VP Operations · Palace Hotels Group</div>
        </div>
      </div>
      <Sparkles className="absolute -right-2 -bottom-2 h-20 w-20 text-white/[0.04]" />
    </div>
  );
}
