import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import { ArrowUpRight, Sparkles, Filter, Download } from "lucide-react";
import { PageHeader, Card, CardHeader, KpiCard, StatusBadge, Button } from "@/components/ui-kit/Primitives";
import { revenueTrend, otaBreakdown, roomStatusDonut, arrivalsToday, departuresToday, activityFeed } from "@/lib/mock-data";

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

function Dashboard() {
  return (
    <div>
      <PageHeader
        eyebrow="Friday · 15 May 2026"
        title="Good morning, Aarav"
        description="Here is what's moving across The Grand Palace today."
        actions={
          <>
            <Button variant="outline" size="sm"><Filter className="h-3.5 w-3.5" /> Last 30 days</Button>
            <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5" /> Export</Button>
          </>
        }
      />

      <div className="space-y-6 p-6">
        {/* KPI strip */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <KpiCard label="Occupancy Today" value="84.2%" delta="↑ 3.1% vs last week" accent="info" />
          <KpiCard label="ADR Today" value="₹12,400" delta="↑ ₹800 vs last week" accent="brand" />
          <KpiCard label="RevPAR · MTD" value="₹10,440" delta="↑ 5.4% vs last month" accent="success" />
          <KpiCard label="Arrivals Today" value="24" suffix="guests" delta="6 pending check-in" deltaTone="neutral" accent="warning" />
          <KpiCard label="Departures Today" value="18" suffix="guests" delta="3 pending check-out" deltaTone="neutral" accent="error" />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader title="Revenue & Occupancy" hint="Last 30 days · The Grand Palace" action={
              <div className="flex items-center gap-3 text-[11px] text-text-secondary">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Revenue</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--color-info)]" /> Occupancy %</span>
              </div>
            } />
            <div className="px-3 pb-4 pt-2">
              <ResponsiveContainer width="100%" height={260}>
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

          <Card>
            <CardHeader title="Room Status" hint="Live · 120 rooms" />
            <div className="flex items-center gap-4 p-5">
              <ResponsiveContainer width="55%" height={180}>
                <PieChart>
                  <Pie data={roomStatusDonut} dataKey="value" innerRadius={48} outerRadius={70} paddingAngle={2} stroke="none">
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
                    <span className="font-mono text-[12px] font-medium text-text-primary">{d.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        {/* Row 3 — operational grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader title="Arrivals Today" hint={`${arrivalsToday.length} guests`} action={<a className="text-[12px] font-medium text-primary hover:text-primary-pressed">View all</a>} />
            <ul className="divide-y divide-border-subtle">
              {arrivalsToday.slice(0, 5).map((r) => (
                <li key={r.id} className="flex items-center justify-between px-5 py-3">
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-text-primary">{r.guest}</div>
                    <div className="text-[11px] text-text-secondary">Room {r.room} · {r.type}</div>
                  </div>
                  <StatusBadge tone={r.status === "Confirmed" ? "success" : "warning"}>{r.status}</StatusBadge>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Departures Today" hint={`${departuresToday.length} guests`} action={<a className="text-[12px] font-medium text-primary hover:text-primary-pressed">View all</a>} />
            <ul className="divide-y divide-border-subtle">
              {departuresToday.concat(departuresToday).slice(0, 5).map((r, i) => (
                <li key={i} className="flex items-center justify-between px-5 py-3">
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-text-primary">{r.guest}</div>
                    <div className="text-[11px] text-text-secondary">Room {r.room} · 11:00 checkout</div>
                  </div>
                  <span className="font-mono text-[12px] text-text-primary">₹{r.balance.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Housekeeping Progress" hint="By floor" />
            <div className="space-y-4 p-5">
              {[
                { floor: "Floor 1", pct: 92 },
                { floor: "Floor 2", pct: 74 },
                { floor: "Floor 3", pct: 58 },
                { floor: "Floor 4", pct: 38 },
              ].map((f) => (
                <div key={f.floor}>
                  <div className="mb-1.5 flex items-center justify-between text-[12px]">
                    <span className="text-text-secondary">{f.floor}</span>
                    <span className="font-mono text-text-primary">{f.pct}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${f.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader title="OTA Booking Breakdown" hint="Month to date" />
            <div className="px-3 pb-4 pt-2">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={otaBreakdown} layout="vertical" margin={{ left: 60, right: 16, top: 8, bottom: 0 }}>
                  <CartesianGrid stroke="var(--color-border-subtle)" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" stroke="var(--color-text-disabled)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis dataKey="source" type="category" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="bookings" fill="var(--color-primary)" radius={[0, 4, 4, 0]} barSize={18} />
                </BarChart>
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
                Weekend forecast hits <strong>91% occupancy</strong>. Consider a 12–18% rate uplift on Deluxe rooms for Sat–Sun.
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
