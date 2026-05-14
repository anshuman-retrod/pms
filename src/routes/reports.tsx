import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, CardHeader, KpiCard, Button } from "@/components/ui-kit/Primitives";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar,
} from "recharts";
import { revenueTrend, otaBreakdown } from "@/lib/mock-data";
import { Download, FileSpreadsheet, FileText, Printer } from "lucide-react";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports & Analytics — Retrod PMS" }] }),
  component: ReportsPage,
});

const categories = ["Occupancy", "Revenue", "ADR & RevPAR", "Arrival / Departure", "Housekeeping", "OTA Performance", "Tax (GST)", "Staff Activity"];
const tooltipStyle = { background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 };

function ReportsPage() {
  return (
    <div>
      <PageHeader eyebrow="Intelligence" title="Reports & Analytics" actions={
        <>
          <Button variant="outline" size="sm"><FileText className="h-3.5 w-3.5" />PDF</Button>
          <Button variant="outline" size="sm"><FileSpreadsheet className="h-3.5 w-3.5" />Excel</Button>
          <Button variant="outline" size="sm"><Printer className="h-3.5 w-3.5" />Print</Button>
          <Button size="sm"><Download className="h-3.5 w-3.5" />Export CSV</Button>
        </>
      } />

      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[220px_1fr]">
        <Card>
          <CardHeader title="Categories" />
          <ul className="p-2">
            {categories.map((c, i) => (
              <li key={c}>
                <button className={`w-full rounded-md px-3 py-2 text-left text-[13px] ${i === 1 ? "bg-primary-tint text-primary-pressed font-medium" : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"}`}>
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <KpiCard label="Total Revenue" value="₹1.42 Cr" delta="↑ 12.4% YoY" accent="brand" />
            <KpiCard label="Occupancy" value="78.4%" delta="↑ 2.1 pts" accent="info" />
            <KpiCard label="ADR" value="₹11,820" delta="↑ ₹420" accent="success" />
            <KpiCard label="RevPAR" value="₹9,267" delta="↑ ₹680" accent="success" />
          </div>

          <Card>
            <CardHeader title="Revenue · Last 30 days" hint="All sources" />
            <div className="px-3 pb-4 pt-2">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueTrend} margin={{ left: 8, right: 16, top: 8 }}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border-subtle)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--color-text-disabled)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-text-disabled)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} fill="url(#rev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader title="Revenue by channel" />
              <div className="px-3 pb-4 pt-2">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={otaBreakdown} margin={{ left: 8, right: 16, top: 8 }}>
                    <CartesianGrid stroke="var(--color-border-subtle)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="source" stroke="var(--color-text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--color-text-disabled)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="revenue" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <CardHeader title="Occupancy by room type" />
              <div className="space-y-3 p-5">
                {[
                  { t: "Heritage Suite", v: 92 },
                  { t: "Premier Suite", v: 84 },
                  { t: "Executive", v: 78 },
                  { t: "Deluxe King", v: 71 },
                  { t: "Deluxe Twin", v: 64 },
                ].map((r) => (
                  <div key={r.t}>
                    <div className="mb-1 flex justify-between text-[12px]">
                      <span className="text-text-secondary">{r.t}</span>
                      <span className="font-mono text-text-primary">{r.v}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-surface-2">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${r.v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
