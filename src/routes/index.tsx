import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import {
  ArrowUpRight, Sparkles, Filter, Download, AlertTriangle, Crown,
  Clock, Wrench, Bell, ArrowRight,
} from "lucide-react";
import { PageHeader, Card, CardHeader, KpiCard, StatusBadge, Button } from "@/components/ui-kit/Primitives";
import {
  revenueTrend, roomStatusDonut, arrivalsToday, departuresToday, activityFeed,
  occupancyByType, revenueKpis, dashboardAlerts, forecast7d,
} from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — Retrod PMS" }, { name: "description", content: "Operational heartbeat for The Grand Palace, New Delhi." }] }),
  component: Dashboard,
});

const tooltipStyle = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12,
  boxShadow: "var(--shadow-e2)",
};

const fmtINR = (n: number) =>
  n >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr` :
  n >= 100000 ? `₹${(n / 100000).toFixed(2)} L` :
  n >= 1000 ? `₹${(n / 1000).toFixed(1)}k` : `₹${n}`;

function Dashboard() {
  const totalRooms = occupancyByType.reduce((a, b) => a + b.total, 0);
  const occupied = occupancyByType.reduce((a, b) => a + b.occupied, 0);
  const occPct = Math.round((occupied / totalRooms) * 1000) / 10;

  return (
    <div>
      <PageHeader
        eyebrow="Friday · 15 May 2026 · Live"
        title="Good morning, Aarav"
        description="Real-time command center for The Grand Palace, New Delhi."
        actions={
          <>
            <Button variant="outline" size="sm"><Filter className="h-3.5 w-3.5" /> Today</Button>
            <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5" /> Export</Button>
          </>
        }
      />

      <div className="space-y-6 p-6">
        {/* === Row 1: Live Occupancy Gauge + Revenue KPI cards === */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
          {/* 1.1 Live Occupancy Widget */}
          <Card>
            <CardHeader title="Live Occupancy" hint="Auto-refresh · 60s" action={<span className="flex items-center gap-1.5 text-[11px] text-text-secondary"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-success)]" />Live</span>} />
            <div className="flex items-center gap-5 px-5 py-4">
              <div className="relative h-[140px] w-[140px] shrink-0">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={[{ v: occPct }, { v: 100 - occPct }]}
                      dataKey="v"
                      innerRadius={52}
                      outerRadius={68}
                      startAngle={90}
                      endAngle={-270}
                      stroke="none"
                    >
                      <Cell fill="var(--color-primary)" />
                      <Cell fill="var(--color-surface-2)" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="font-display text-[28px] font-semibold leading-none text-text-primary">{occPct}%</div>
                  <div className="mt-1 text-[10px] uppercase tracking-wider text-text-disabled">{occupied}/{totalRooms} rooms</div>
                </div>
              </div>
              <ul className="flex-1 space-y-1.5 text-[12px]">
                {occupancyByType.map((t) => {
                  const pct = Math.round((t.occupied / t.total) * 100);
                  return (
                    <li key={t.type}>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">{t.type}</span>
                        <span className="font-mono text-text-primary">{t.occupied}/{t.total}</span>
                      </div>
                      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-surface-2">
                        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Card>

          {/* 1.2 Revenue KPI Cards */}
          <Card>
            <CardHeader title="Revenue · Today vs Budget vs STLY" hint="Visible to GM, Revenue, Finance" />
            <div className="grid grid-cols-2 gap-px bg-border-subtle md:grid-cols-4">
              {revenueKpis.map((k) => {
                const vBudget = ((k.today - k.budget) / k.budget) * 100;
                const vSTLY = ((k.today - k.sty) / k.sty) * 100;
                const okB = vBudget >= 0;
                const okS = vSTLY >= 0;
                return (
                  <div key={k.label} className="bg-surface px-4 py-4">
                    <div className="label-uppercase">{k.label}</div>
                    <div className="mt-1 text-[20px] font-semibold tracking-tight text-text-primary">{fmtINR(k.today)}</div>
                    <div className="mt-2 space-y-0.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-text-disabled">vs Budget</span>
                        <span className={okB ? "text-[var(--color-success)]" : "text-[var(--color-error)]"}>{okB ? "↑" : "↓"} {Math.abs(vBudget).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-disabled">vs STLY</span>
                        <span className={okS ? "text-[var(--color-success)]" : "text-[var(--color-error)]"}>{okS ? "↑" : "↓"} {Math.abs(vSTLY).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* === KPI strip === */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="ADR Today" value="₹12,400" delta="↑ ₹800 vs LW" accent="brand" />
          <KpiCard label="RevPAR · MTD" value="₹10,440" delta="↑ 5.4% vs LM" accent="success" />
          <KpiCard label="In-House Guests" value="84" delta="6 VIPs" deltaTone="neutral" accent="info" />
          <KpiCard label="Open Work Orders" value="11" delta="2 critical" deltaTone="error" accent="warning" />
        </div>

        {/* === Row 2: Arrivals/Departures + Alerts === */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* 1.3 Arrivals & Departures Board */}
          <Card>
            <CardHeader
              title="Arrivals · Departures"
              hint={`${arrivalsToday.length} arr · ${departuresToday.length} dep`}
              action={<Link to="/front-desk" className="text-[12px] font-medium text-primary hover:text-primary-pressed">Open Front Desk →</Link>}
            />
            <div className="grid grid-cols-2 divide-x divide-border-subtle">
              <div>
                <div className="border-b border-border-subtle bg-surface-2/40 px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-text-secondary">Arrivals · 24</div>
                <ul className="divide-y divide-border-subtle">
                  {arrivalsToday.slice(0, 4).map((r) => (
                    <li key={r.id} className="flex items-center gap-2 px-3 py-2.5">
                      {r.guest === "Sophie Laurent" || r.id === "RES-2042" ? <Crown className="h-3 w-3 shrink-0 text-[var(--color-gold,#c9a84c)]" /> : <span className="h-3 w-3" />}
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12px] font-medium text-text-primary">{r.guest}</div>
                        <div className="text-[10px] text-text-secondary">{r.room} · {r.type}</div>
                      </div>
                      <StatusBadge tone={r.status === "Confirmed" ? "success" : "warning"}>{r.status}</StatusBadge>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="border-b border-border-subtle bg-surface-2/40 px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-text-secondary">Departures · 18</div>
                <ul className="divide-y divide-border-subtle">
                  {departuresToday.concat(departuresToday).slice(0, 4).map((r, i) => (
                    <li key={i} className="flex items-center gap-2 px-3 py-2.5">
                      {r.balance > 0 ? <AlertTriangle className="h-3 w-3 shrink-0 text-[var(--color-warning)]" /> : <span className="h-3 w-3" />}
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12px] font-medium text-text-primary">{r.guest}</div>
                        <div className="text-[10px] text-text-secondary">{r.room} · 11:00</div>
                      </div>
                      <span className={`font-mono text-[11px] ${r.balance ? "text-[var(--color-error)]" : "text-text-disabled"}`}>{r.balance ? `₹${r.balance.toLocaleString()}` : "Settled"}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* 1.4 Alerts panel */}
          <Card className="lg:col-span-2">
            <CardHeader
              title="Alert Notifications"
              hint="Filtered to your role · GM"
              action={<button className="text-[12px] font-medium text-primary hover:text-primary-pressed">Mark all read</button>}
            />
            <ul className="divide-y divide-border-subtle">
              {dashboardAlerts.map((a) => {
                const Icon = a.tone === "brand" ? Crown : a.tone === "warning" ? Clock : a.tone === "error" ? Wrench : a.tone === "info" ? Bell : AlertTriangle;
                return (
                  <li key={a.id} className="flex items-start gap-3 px-5 py-3 hover:bg-surface-2/40">
                    <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${a.tone === "brand" ? "bg-primary-tint text-primary-pressed" : a.tone === "warning" ? "bg-[oklch(0.96_0.06_70)] text-[var(--color-warning)]" : a.tone === "error" ? "bg-[oklch(0.96_0.06_27)] text-[var(--color-error)]" : "bg-[oklch(0.95_0.04_263)] text-[var(--color-info)]"}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <div className="truncate text-[13px] font-medium text-text-primary">{a.title}</div>
                        <div className="font-mono text-[10px] text-text-disabled">{a.at}</div>
                      </div>
                      <div className="text-[11px] text-text-secondary">{a.body}</div>
                    </div>
                    <button className="shrink-0 text-text-disabled hover:text-text-primary"><ArrowRight className="h-3.5 w-3.5" /></button>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>

        {/* === Row 3: 1.5 HK Status overview + 1.6 Forecast === */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader title="Housekeeping Overview" hint="120 rooms" action={<Link to="/housekeeping" className="text-[12px] font-medium text-primary">Open →</Link>} />
            <div className="flex items-center gap-4 p-5">
              <ResponsiveContainer width="55%" height={170}>
                <PieChart>
                  <Pie data={roomStatusDonut} dataKey="value" innerRadius={42} outerRadius={66} paddingAngle={2} stroke="none">
                    {roomStatusDonut.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <ul className="flex-1 space-y-2 text-[12px]">
                {roomStatusDonut.map((d) => (
                  <li key={d.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-text-secondary">
                      <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                      {d.name}
                    </span>
                    <span className="font-mono font-medium text-text-primary">{d.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* 1.6 7-Day Revenue Forecast */}
          <Card className="lg:col-span-2">
            <CardHeader title="7-Day Revenue Forecast" hint="On-books + historical pickup curve" action={<span className="text-[11px] text-text-secondary">Total: <span className="font-mono text-text-primary">{fmtINR(forecast7d.reduce((a, b) => a + b.revenue, 0))}</span></span>} />
            <div className="px-3 pb-4 pt-2">
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={forecast7d} margin={{ left: 8, right: 16, top: 8, bottom: 0 }}>
                  <CartesianGrid stroke="var(--color-border-subtle)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--color-text-disabled)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-text-disabled)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number, n) => n === "revenue" ? fmtINR(v) : `${v}%`} />
                  <Bar dataKey="revenue" fill="var(--color-primary)" radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-2 grid grid-cols-7 gap-1 px-2">
                {forecast7d.map((f) => (
                  <div key={f.day} className="text-center">
                    <div className="text-[10px] text-text-disabled">Occ</div>
                    <div className="font-mono text-[11px] font-medium text-text-primary">{f.occ}%</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* === Row 4: Trend + Activity === */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader title="Revenue & Occupancy" hint="Last 30 days" action={
              <div className="flex items-center gap-3 text-[11px] text-text-secondary">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Revenue</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--color-info)]" /> Occupancy</span>
              </div>
            } />
            <div className="px-3 pb-4 pt-2">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={revenueTrend} margin={{ left: 8, right: 16, top: 8, bottom: 0 }}>
                  <CartesianGrid stroke="var(--color-border-subtle)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--color-text-disabled)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="r" stroke="var(--color-text-disabled)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <YAxis yAxisId="o" orientation="right" stroke="var(--color-text-disabled)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line yAxisId="r" type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
                  <Line yAxisId="o" type="monotone" dataKey="occupancy" stroke="var(--color-info)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader title="Activity" hint="Live feed" />
              <ul className="max-h-[180px] space-y-3 overflow-y-auto p-5 scrollbar-thin">
                {activityFeed.map((e, i) => (
                  <li key={i} className="flex gap-3 text-[12px]">
                    <span className="font-mono text-[11px] text-text-disabled">{e.time}</span>
                    <span className="text-text-secondary">{e.text}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <div className="rounded-lg border border-primary/20 bg-primary-tint/40 p-4">
              <div className="mb-2 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-primary-pressed">
                <Sparkles className="h-3 w-3" /> Retrod AI
              </div>
              <p className="text-[13px] leading-snug text-text-primary">
                Weekend forecast hits <strong>91% occupancy</strong>. Consider 12–18% rate uplift on Deluxe rooms.
              </p>
              <button className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:text-primary-pressed">
                Apply suggestion <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
