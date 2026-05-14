import { createFileRoute } from "@tanstack/react-router";
import { Filter, Plus, Search } from "lucide-react";
import { PageHeader, Card, CardHeader, StatusBadge, Button } from "@/components/ui-kit/Primitives";
import { reservations } from "@/lib/mock-data";

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

function ReservationsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Reservations"
        description="Plan, view, and manage every booking across rooms and channels."
        actions={
          <>
            <Button variant="outline" size="sm"><Filter className="h-3.5 w-3.5" />Filters</Button>
            <Button size="sm"><Plus className="h-3.5 w-3.5" />New reservation</Button>
          </>
        }
      />

      <div className="space-y-6 p-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-disabled" />
            <input className="h-9 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" placeholder="Search guest, ID, room…" />
          </div>
          <div className="flex rounded-md border border-border bg-surface p-0.5 text-[12px]">
            <button className="rounded bg-foreground px-3 py-1 text-background">Timeline</button>
            <button className="px-3 py-1 text-text-secondary hover:text-text-primary">Table</button>
            <button className="px-3 py-1 text-text-secondary hover:text-text-primary">Calendar</button>
          </div>
          <div className="ml-auto flex items-center gap-2 text-[11px] text-text-secondary">
            {Object.entries(sourceColor).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: v }} />{k}</span>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <Card>
          <CardHeader title="7-day timeline" hint="14 May → 20 May 2026" />
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Header */}
              <div className="grid border-b border-border-subtle bg-surface-2/50" style={{ gridTemplateColumns: `200px repeat(${days.length}, 1fr)` }}>
                <div className="label-uppercase px-4 py-2.5">Room</div>
                {days.map((d) => (
                  <div key={d} className="border-l border-border-subtle px-3 py-2.5 text-center">
                    <div className="text-[10px] uppercase tracking-wider text-text-disabled">{d.split(" ")[1]}</div>
                    <div className="text-[12px] font-semibold text-text-primary">{d.split(" ")[0]}</div>
                  </div>
                ))}
              </div>
              {/* Rows */}
              {rooms.map((r) => {
                const rowBars = bars.filter((b) => b.room === r.num);
                return (
                  <div key={r.num} className="relative grid border-b border-border-subtle hover:bg-surface-2/40" style={{ gridTemplateColumns: `200px repeat(${days.length}, 1fr)` }}>
                    <div className="px-4 py-3">
                      <div className="text-[13px] font-medium text-text-primary">Room {r.num}</div>
                      <div className="text-[11px] text-text-secondary">{r.type}</div>
                    </div>
                    {days.map((d, i) => <div key={i} className="border-l border-border-subtle" />)}
                    {/* bars overlay */}
                    {rowBars.map((b, i) => (
                      <div
                        key={i}
                        className="absolute top-3 h-9 rounded-md px-2.5 py-1.5 text-[11px] font-medium text-white shadow-e1"
                        style={{
                          left: `calc(200px + (100% - 200px) * ${b.start / days.length})`,
                          width: `calc((100% - 200px) * ${b.span / days.length} - 4px)`,
                          background: sourceColor[b.source],
                        }}
                      >
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

        {/* Table */}
        <Card>
          <CardHeader title="All reservations" hint={`${reservations.length} records`} />
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border bg-surface-2/40 text-left">
                  {["Reservation", "Guest", "Room", "Check-in", "Check-out", "Source", "Amount", "Balance", "Status"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id} className="border-b border-border-subtle hover:bg-surface-2/50">
                    <td className="px-4 py-3 font-mono text-[12px] text-text-primary">{r.id}</td>
                    <td className="px-4 py-3 font-medium text-text-primary">{r.guest}</td>
                    <td className="px-4 py-3 text-text-secondary">{r.room} · <span className="text-text-disabled">{r.type}</span></td>
                    <td className="px-4 py-3 text-text-secondary">{r.ci}</td>
                    <td className="px-4 py-3 text-text-secondary">{r.co}</td>
                    <td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 text-[12px] text-text-secondary"><span className="h-2 w-2 rounded-sm" style={{ background: sourceColor[r.source] || "var(--color-text-disabled)" }} />{r.source}</span></td>
                    <td className="px-4 py-3 font-mono text-text-primary">₹{r.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-text-primary">{r.balance ? <span className="text-[var(--color-error)]">₹{r.balance.toLocaleString()}</span> : <span className="text-text-disabled">—</span>}</td>
                    <td className="px-4 py-3"><StatusBadge tone={statusTone(r.status)}>{r.status}</StatusBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border-subtle px-4 py-3 text-[12px] text-text-secondary">
            <span>Showing 1–{reservations.length} of 312</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
