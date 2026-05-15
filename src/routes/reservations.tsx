import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, Fragment } from "react";
import { Filter, Plus, Search, Ban, Lock, AlertOctagon } from "lucide-react";
import { PageHeader, Card, CardHeader, StatusBadge, Button } from "@/components/ui-kit/Primitives";
import { reservations, availabilityMatrix, rateCalendar, restrictions } from "@/lib/mock-data";

export const Route = createFileRoute("/reservations")({
  head: () => ({ meta: [{ title: "Reservations — Retrod PMS" }] }),
  component: ReservationsPage,
});

const days = ["14 May", "15 May", "16 May", "17 May", "18 May", "19 May", "20 May"];
const rooms = [
  { num: "204", type: "Deluxe King" },
  { num: "108", type: "Executive" },
  { num: "215", type: "Deluxe Twin" },
  { num: "302", type: "Premier Suite" },
  { num: "312", type: "Premier Suite" },
  { num: "401", type: "Heritage Suite" },
  { num: "405", type: "Heritage Suite" },
];

const bars = [
  { room: "204", start: 1, span: 3, label: "John Mathews", source: "Booking.com" },
  { room: "108", start: 1, span: 5, label: "H. Tanaka", source: "Expedia" },
  { room: "215", start: 0, span: 1, label: "M. Weber", source: "Agoda" },
  { room: "302", start: 1, span: 1, label: "A. Khan", source: "Booking.com" },
  { room: "312", start: 1, span: 2, label: "P. Sharma", source: "Direct" },
  { room: "401", start: 2, span: 3, label: "E. Rodriguez", source: "Direct" },
  { room: "405", start: 2, span: 5, label: "S. Laurent", source: "Direct" },
];

const sourceColor: Record<string, string> = {
  "Booking.com": "var(--color-info)",
  Expedia: "var(--color-warning)",
  Direct: "var(--color-primary)",
  Agoda: "var(--color-success)",
  Airbnb: "var(--color-error)",
};

const statusTone = (s: string) =>
  ({ Confirmed: "success", "Checked-In": "info", "Checked-Out": "neutral", Pending: "warning", Cancelled: "error", "No-Show": "dark" }[s] as any) || "neutral";

type View = "timeline" | "table" | "availability" | "rate" | "restrictions";

function ReservationsPage() {
  const [view, setView] = useState<View>("timeline");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filtered = statusFilter === "All" ? reservations : reservations.filter(r => r.status === statusFilter);

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Reservations"
        description="Plan, view, and manage every booking across rooms and channels."
        actions={
          <>
            <Button variant="outline" size="sm"><Filter className="h-3.5 w-3.5" />Filters</Button>
            <Link to="/reservations/new"><Button size="sm"><Plus className="h-3.5 w-3.5" />New reservation</Button></Link>
          </>
        }
      />

      <div className="space-y-6 p-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-disabled" />
            <input className="h-9 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" placeholder="Search guest, ID, room, phone, email…" />
          </div>
          <div className="flex rounded-md border border-border bg-surface p-0.5 text-[12px]">
            {(["timeline", "table", "availability", "rate", "restrictions"] as View[]).map(v => (
              <button key={v}
                onClick={() => setView(v)}
                className={`rounded px-3 py-1 capitalize transition ${view === v ? "bg-foreground text-background" : "text-text-secondary hover:text-text-primary"}`}>
                {v === "rate" ? "Rate Cal" : v === "restrictions" ? "Restrictions" : v === "availability" ? "Availability" : v}
              </button>
            ))}
          </div>
          {view === "table" && (
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="h-8 rounded-md border border-border bg-surface px-2 text-[12px]">
              {["All", "Confirmed", "Checked-In", "Pending", "Cancelled", "No-Show", "Checked-Out"].map(s => <option key={s}>{s}</option>)}
            </select>
          )}
          <div className="ml-auto flex items-center gap-2 text-[11px] text-text-secondary">
            {Object.entries(sourceColor).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: v }} />{k}</span>
            ))}
          </div>
        </div>

        {view === "timeline" && (
          <Card>
            <CardHeader title="7-day timeline" hint="14 May → 20 May 2026" />
            <div className="overflow-x-auto">
              <div className="min-w-[900px]">
                <div className="grid border-b border-border-subtle bg-surface-2/50" style={{ gridTemplateColumns: `200px repeat(${days.length}, 1fr)` }}>
                  <div className="label-uppercase px-4 py-2.5">Room</div>
                  {days.map((d) => (
                    <div key={d} className="border-l border-border-subtle px-3 py-2.5 text-center">
                      <div className="text-[10px] uppercase tracking-wider text-text-disabled">{d.split(" ")[1]}</div>
                      <div className="text-[12px] font-semibold text-text-primary">{d.split(" ")[0]}</div>
                    </div>
                  ))}
                </div>
                {rooms.map((r) => {
                  const rowBars = bars.filter((b) => b.room === r.num);
                  return (
                    <div key={r.num} className="relative grid border-b border-border-subtle hover:bg-surface-2/40" style={{ gridTemplateColumns: `200px repeat(${days.length}, 1fr)` }}>
                      <div className="px-4 py-3">
                        <div className="text-[13px] font-medium text-text-primary">Room {r.num}</div>
                        <div className="text-[11px] text-text-secondary">{r.type}</div>
                      </div>
                      {days.map((_, i) => <div key={i} className="border-l border-border-subtle" />)}
                      {rowBars.map((b, i) => (
                        <div key={i}
                          className="absolute top-3 h-9 rounded-md px-2.5 py-1.5 text-[11px] font-medium text-white shadow-e1"
                          style={{
                            left: `calc(200px + (100% - 200px) * ${b.start / days.length})`,
                            width: `calc((100% - 200px) * ${b.span / days.length} - 4px)`,
                            background: sourceColor[b.source],
                          }}>
                          <div className="truncate">{b.label}</div>
                          <div className="truncate text-[10px] opacity-80">{b.source}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        )}

        {view === "table" && (
          <Card>
            <CardHeader title="All reservations" hint={`${filtered.length} records`} />
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-surface-2/40 text-left">
                    {["Reservation", "Guest", "Room", "Check-in", "Check-out", "Source", "Amount", "Balance", "Status", ""].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-b border-border-subtle hover:bg-surface-2/50">
                      <td className="px-4 py-3 font-mono text-[12px] text-text-primary">{r.id}</td>
                      <td className="px-4 py-3 font-medium text-text-primary">{r.guest}</td>
                      <td className="px-4 py-3 text-text-secondary">{r.room} · <span className="text-text-disabled">{r.type}</span></td>
                      <td className="px-4 py-3 text-text-secondary">{r.ci}</td>
                      <td className="px-4 py-3 text-text-secondary">{r.co}</td>
                      <td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 text-[12px] text-text-secondary"><span className="h-2 w-2 rounded-sm" style={{ background: sourceColor[r.source] || "var(--color-text-disabled)" }} />{r.source}</span></td>
                      <td className="px-4 py-3 font-mono text-text-primary">₹{r.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono">{r.balance ? <span className="text-[var(--color-error)]">₹{r.balance.toLocaleString()}</span> : <span className="text-text-disabled">—</span>}</td>
                      <td className="px-4 py-3"><StatusBadge tone={statusTone(r.status)}>{r.status}</StatusBadge></td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button className="text-[11px] text-primary hover:underline">Modify</button>
                          <span className="text-text-disabled">·</span>
                          <button className="text-[11px] text-[var(--color-error)] hover:underline">Cancel</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {view === "availability" && (
          <Card>
            <CardHeader title="Availability calendar" hint="14-day · click a cell to quick-book" />
            <div className="overflow-x-auto">
              <div className="min-w-[900px] p-4">
                <div className="grid gap-px bg-border-subtle" style={{ gridTemplateColumns: `160px repeat(14, 1fr)` }}>
                  <div className="bg-surface px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-text-secondary">Room type</div>
                  {Array.from({ length: 14 }, (_, i) => (
                    <div key={i} className="bg-surface px-1 py-2 text-center text-[10px] font-medium text-text-secondary">{15 + i}</div>
                  ))}
                  {availabilityMatrix.map(row => (
                    <>
                      <div key={row.type} className="bg-surface px-3 py-2 text-[12px] font-medium text-text-primary">{row.type}</div>
                      {row.days.map((d, i) => {
                        const free = d.total - d.sold;
                        const pct = free / d.total;
                        const cls = free === 0 ? "bg-[oklch(0.96_0.06_27)] text-[var(--color-error)]" :
                          pct < 0.2 ? "bg-[oklch(0.96_0.06_70)] text-[var(--color-warning)]" :
                            "bg-[oklch(0.96_0.05_152)] text-[var(--color-success)]";
                        return (
                          <button key={i} className={`flex flex-col items-center justify-center py-2 text-[11px] font-mono font-medium transition hover:scale-105 ${cls}`}>
                            <span>{free}</span>
                            <span className="text-[9px] opacity-60">/{d.total}</span>
                          </button>
                        );
                      })}
                    </>
                  ))}
                </div>
                <div className="mt-3 flex gap-4 text-[11px] text-text-secondary">
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[oklch(0.96_0.05_152)]" />Available</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[oklch(0.96_0.06_70)]" />Few left</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[oklch(0.96_0.06_27)]" />Sold out</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {view === "rate" && (
          <Card>
            <CardHeader title="Rate calendar" hint="BAR per room type · click to edit" action={<Button size="sm" variant="outline">Bulk update</Button>} />
            <div className="overflow-x-auto">
              <div className="min-w-[900px] p-4">
                <div className="grid gap-px bg-border-subtle" style={{ gridTemplateColumns: `160px repeat(14, 1fr)` }}>
                  <div className="bg-surface px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-text-secondary">Room type</div>
                  {Array.from({ length: 14 }, (_, i) => (
                    <div key={i} className="bg-surface px-1 py-2 text-center text-[10px] font-medium text-text-secondary">{15 + i}</div>
                  ))}
                  {rateCalendar.map(row => (
                    <>
                      <div key={row.type} className="bg-surface px-3 py-2 text-[12px] font-medium text-text-primary">{row.type}</div>
                      {row.days.map((d, i) => {
                        const cls = d.tag === "Event" ? "bg-primary-tint text-primary-pressed" :
                          d.tag === "Weekend" ? "bg-[oklch(0.96_0.06_70)] text-[var(--color-warning)]" :
                            "bg-surface text-text-primary";
                        return (
                          <button key={i} className={`flex flex-col items-center justify-center py-2 text-[10px] font-mono transition hover:opacity-80 ${cls}`}>
                            <span className="font-semibold">₹{(d.rate / 1000).toFixed(1)}k</span>
                            <span className="text-[8px] opacity-60">{d.tag}</span>
                          </button>
                        );
                      })}
                    </>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {view === "restrictions" && (
          <Card>
            <CardHeader title="Restriction calendar" hint="Min Stay · CTA · CTD · Stop Sell" action={<Button size="sm"><Plus className="h-3.5 w-3.5" />Add restriction</Button>} />
            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
              <div>
                <div className="label-uppercase mb-2">Active restrictions</div>
                <ul className="divide-y divide-border-subtle rounded-md border border-border">
                  {restrictions.map((r, i) => {
                    const Icon = r.kind.includes("Stop") ? Lock : r.kind.includes("CTA") || r.kind.includes("CTD") ? Ban : AlertOctagon;
                    const tone = r.kind.includes("Stop") ? "error" : r.kind.includes("CTA") || r.kind.includes("CTD") ? "warning" : "info";
                    return (
                      <li key={i} className="flex items-center gap-3 px-4 py-3">
                        <Icon className={`h-4 w-4 ${tone === "error" ? "text-[var(--color-error)]" : tone === "warning" ? "text-[var(--color-warning)]" : "text-[var(--color-info)]"}`} />
                        <div className="flex-1">
                          <div className="text-[13px] font-medium text-text-primary">{r.kind} · {r.type}</div>
                          <div className="text-[11px] text-text-secondary">{r.date} May 2026</div>
                        </div>
                        <button className="text-[11px] text-text-disabled hover:text-[var(--color-error)]">Remove</button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div>
                <div className="label-uppercase mb-2">Calendar overview</div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 14 }, (_, i) => {
                    const day = 15 + i;
                    const r = restrictions.find(x => x.date === day);
                    return (
                      <div key={i} className={`aspect-square rounded-md border p-1.5 text-[10px] ${r ? "border-[var(--color-warning)] bg-[oklch(0.97_0.05_70)]" : "border-border bg-surface"}`}>
                        <div className="font-mono font-semibold text-text-primary">{day}</div>
                        {r && <div className="mt-0.5 truncate font-medium text-[var(--color-warning)]">{r.kind}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
