import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight, AlertCircle, KeyRound, Search, MoveRight, Wrench,
  MessageSquare, Headset, Package, ArrowUpCircle, BellRing,
} from "lucide-react";
import { PageHeader, Card, CardHeader, StatusBadge, Button, KpiCard } from "@/components/ui-kit/Primitives";
import { arrivalsToday, departuresToday } from "@/lib/mock-data";

export const Route = createFileRoute("/front-desk")({
  head: () => ({ meta: [{ title: "Front Desk — Retrod PMS" }] }),
  component: FrontDeskPage,
});

const floors = [1, 2, 3, 4];
const sample = (floor: number) => Array.from({ length: 10 }, (_, i) => {
  const num = `${floor}${(i + 1).toString().padStart(2, "0")}`;
  const statuses = ["Ready", "Occupied", "Dirty", "Ready", "Occupied", "Maintenance"];
  return { num, status: statuses[(floor + i) % statuses.length] };
});

const colorFor = (s: string) => ({
  Ready: "border-[var(--color-success)] bg-[oklch(0.96_0.04_152)] text-[var(--color-success)]",
  Occupied: "border-[var(--color-info)] bg-[oklch(0.95_0.04_263)] text-[var(--color-info)]",
  Dirty: "border-[var(--color-warning)] bg-[oklch(0.96_0.05_70)] text-[var(--color-warning)]",
  Maintenance: "border-border-strong bg-surface-2 text-text-secondary",
}[s] || "border-border bg-surface text-text-secondary");

type Tab = "checkin" | "move" | "ooo" | "services" | "upgrade";

function FrontDeskPage() {
  const [tab, setTab] = useState<Tab>("checkin");

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Front Desk"
        description="Built for speed. Complete any check-in in three clicks."
        actions={<Link to="/check-in"><Button size="sm">Open check-in wizard<ArrowRight className="h-3.5 w-3.5" /></Button></Link>}
      />

      <div className="space-y-6 p-6">
        {/* KPI strip */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <KpiCard label="In House" value="84" accent="info" />
          <KpiCard label="Arrivals" value="24" accent="success" />
          <KpiCard label="Departures" value="18" accent="warning" />
          <KpiCard label="VIPs" value="6" accent="brand" />
          <KpiCard label="Pending key" value="3" accent="error" />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 rounded-md border border-border bg-surface p-1 w-fit">
          {([
            { id: "checkin", label: "Active check-in", icon: KeyRound },
            { id: "move", label: "Room move", icon: MoveRight },
            { id: "ooo", label: "Out of order", icon: Wrench },
            { id: "upgrade", label: "Upgrade", icon: ArrowUpCircle },
            { id: "services", label: "Guest services", icon: Headset },
          ] as { id: Tab; label: string; icon: any }[]).map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-[12px] font-medium ${tab === t.id ? "bg-foreground text-background" : "text-text-secondary hover:text-text-primary"}`}>
                <Icon className="h-3.5 w-3.5" />{t.label}
              </button>
            );
          })}
        </div>

        {tab === "checkin" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[35%_1fr]">
            {/* Left queues */}
            <div className="space-y-4">
              <Card>
                <CardHeader title="Arrivals queue" hint="Sorted by ETA" />
                <ul className="divide-y divide-border-subtle">
                  {arrivalsToday.map((r, i) => (
                    <li key={r.id} className={`flex items-center gap-3 px-4 py-3 ${i === 0 ? "bg-primary-tint/40" : ""}`}>
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">{r.guest.split(" ").map(s => s[0]).slice(0, 2).join("")}</div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-medium text-text-primary">{r.guest}</div>
                        <div className="text-[11px] text-text-secondary">{r.id} · {r.room} · {r.nights}N</div>
                      </div>
                      <StatusBadge tone={r.status === "Confirmed" ? "success" : "warning"}>{r.status}</StatusBadge>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card>
                <CardHeader title="Departures queue" />
                <ul className="divide-y divide-border-subtle">
                  {departuresToday.concat(departuresToday).slice(0, 4).map((r, i) => (
                    <li key={i} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <div className="text-[13px] font-medium text-text-primary">{r.guest}</div>
                        <div className="text-[11px] text-text-secondary">Room {r.room} · 11:00</div>
                      </div>
                      <span className="font-mono text-[12px]">{r.balance ? <span className="text-[var(--color-error)]">₹{r.balance.toLocaleString()}</span> : "Settled"}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Right: room grid */}
            <Card>
              <CardHeader
                title="Assign room"
                hint="Floor 2 · Deluxe King available"
                action={
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-disabled" />
                    <input className="h-8 w-44 rounded-md border border-border bg-surface pl-8 pr-2 text-[12px]" placeholder="Search room…" />
                  </div>
                }
              />
              <div className="space-y-4 p-5">
                {floors.map(f => (
                  <div key={f}>
                    <div className="label-uppercase mb-2">Floor {f}</div>
                    <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                      {sample(f).map(r => (
                        <button key={r.num}
                          className={`group relative aspect-[3/2.4] rounded-md border text-left transition hover:scale-[1.03] hover:shadow-e2 ${colorFor(r.status)}`}
                          title={`${r.num} · ${r.status}`}>
                          <span className="absolute left-1.5 top-1 font-mono text-[11px] font-medium">{r.num}</span>
                          <span className="absolute bottom-1 right-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-border-subtle bg-surface-2/40 px-5 py-3">
                <div className="text-[12px] text-text-secondary">Selected: <span className="font-mono text-text-primary">Room 204</span></div>
                <Link to="/check-in"><Button size="sm"><KeyRound className="h-3.5 w-3.5" />Continue to wizard</Button></Link>
              </div>
            </Card>
          </div>
        )}

        {tab === "move" && (
          <Card>
            <CardHeader title="Room move" hint="Transfer folio + key card to new room" />
            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
              <div>
                <div className="label-uppercase mb-2">Current</div>
                <div className="rounded-md border border-border bg-surface p-4">
                  <div className="font-mono text-[20px] font-semibold text-text-primary">204</div>
                  <div className="text-[12px] text-text-secondary">Deluxe King · John Mathews</div>
                  <div className="mt-3 text-[11px] text-text-secondary">Folio balance · ₹26,800 · 3 charges</div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <MoveRight className="h-7 w-7 text-text-disabled" />
              </div>
              <div>
                <div className="label-uppercase mb-2">New room</div>
                <select className="h-9 w-full rounded-md border border-primary bg-surface px-3 text-[13px]">
                  <option>308 · Premier Suite · Ready · ₹+11,000/night</option>
                  <option>402 · Heritage Suite · Ready · ₹+24,000/night</option>
                  <option>211 · Deluxe King · Ready · ₹0</option>
                </select>
                <label className="mt-3 block">
                  <div className="label-uppercase mb-1">Reason</div>
                  <input className="h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px]" placeholder="Guest preference / maintenance / upgrade" />
                </label>
                <div className="mt-3 flex items-center gap-2">
                  <input type="checkbox" id="reissue" defaultChecked />
                  <label htmlFor="reissue" className="text-[12px]">Re-issue key cards · Lock sync</label>
                </div>
                <Button className="mt-4 w-full" size="sm">Confirm room move</Button>
              </div>
            </div>
          </Card>
        )}

        {tab === "ooo" && (
          <Card>
            <CardHeader title="Out of Order management" hint="Removed from inventory · auto work order" action={<Button size="sm">+ Mark room OOO</Button>} />
            <table className="w-full text-[13px]">
              <thead className="bg-surface-2/40 text-left">
                <tr>{["Room", "Type", "Reason", "From", "Until", "Work order", "Status"].map(h => <th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">{h}</th>)}</tr>
              </thead>
              <tbody>
                {[
                  { r: "207", t: "Deluxe King", reason: "HVAC failure", f: "14 May", u: "16 May", wo: "WO-1102", s: "In progress", tone: "warning" },
                  { r: "105", t: "Executive", reason: "Carpet replacement", f: "12 May", u: "20 May", wo: "WO-1098", s: "Scheduled", tone: "info" },
                  { r: "318", t: "Premier Suite", reason: "Renovation", f: "01 Apr", u: "30 Jun", wo: "WO-1042", s: "Long-term", tone: "neutral" },
                ].map((x, i) => (
                  <tr key={i} className="border-t border-border-subtle">
                    <td className="px-4 py-3 font-mono font-semibold text-text-primary">{x.r}</td>
                    <td className="px-4 py-3 text-text-secondary">{x.t}</td>
                    <td className="px-4 py-3 text-text-primary">{x.reason}</td>
                    <td className="px-4 py-3 text-text-secondary">{x.f}</td>
                    <td className="px-4 py-3 text-text-secondary">{x.u}</td>
                    <td className="px-4 py-3 font-mono text-text-secondary">{x.wo}</td>
                    <td className="px-4 py-3"><StatusBadge tone={x.tone as any}>{x.s}</StatusBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {tab === "upgrade" && (
          <Card>
            <CardHeader title="Upgrade recommendations" hint="Loyalty + occupancy-driven · GM approval for comp" />
            <ul className="divide-y divide-border-subtle">
              {[
                { g: "Hiroshi Tanaka", cur: "Executive 108", up: "Premier Suite 312", reason: "Platinum loyalty · 6 stays", price: "Comp" },
                { g: "Sophie Laurent", cur: "Heritage Suite 405", up: "Presidential 501", reason: "VIP1 · 4-night stay", price: "Comp" },
                { g: "Marcus Weber", cur: "Deluxe Twin 215", up: "Deluxe King 211", reason: "Available · same-type cleaner", price: "₹0" },
              ].map((u, i) => (
                <li key={i} className="flex items-center gap-4 px-5 py-4">
                  <ArrowUpCircle className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <div className="text-[13px] font-medium text-text-primary">{u.g}</div>
                    <div className="text-[11px] text-text-secondary">{u.cur} → <span className="text-text-primary">{u.up}</span> · {u.reason}</div>
                  </div>
                  <span className="font-mono text-[12px] text-primary">{u.price}</span>
                  <Button size="sm">Apply upgrade</Button>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {tab === "services" && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader title="Messages & wake-up calls" action={<Button size="sm" variant="outline">+ New</Button>} />
              <ul className="divide-y divide-border-subtle">
                {[
                  { icon: BellRing, t: "06:30 wake-up · Room 204", s: "Scheduled" },
                  { icon: MessageSquare, t: "Message for Tanaka · 'Driver arrived at 09:00'", s: "Delivered" },
                  { icon: BellRing, t: "05:45 wake-up · Room 312", s: "Scheduled" },
                ].map((m, i) => (
                  <li key={i} className="flex items-center gap-3 px-5 py-3">
                    <m.icon className="h-4 w-4 text-text-secondary" />
                    <div className="flex-1 text-[12px] text-text-primary">{m.t}</div>
                    <StatusBadge tone="info">{m.s}</StatusBadge>
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <CardHeader title="Concierge requests" action={<Button size="sm" variant="outline">+ New</Button>} />
              <ul className="divide-y divide-border-subtle">
                {[
                  { c: "Restaurant", t: "Indian Accent · 8 PM · 4 pax", s: "Confirmed", tone: "success" },
                  { c: "Tour", t: "Old Delhi heritage walk · 09:00", s: "In progress", tone: "warning" },
                  { c: "Airport", t: "Pickup IGI T3 · BA257 · 14:30", s: "Pending", tone: "neutral" },
                ].map((r, i) => (
                  <li key={i} className="px-5 py-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[12px] font-medium text-text-primary">{r.c}</div>
                      <StatusBadge tone={r.tone as any}>{r.s}</StatusBadge>
                    </div>
                    <div className="mt-0.5 text-[11px] text-text-secondary">{r.t}</div>
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <CardHeader title="Lost & Found" action={<Button size="sm" variant="outline">+ Log item</Button>} />
              <ul className="divide-y divide-border-subtle">
                {[
                  { i: Package, item: "Black Ray-Ban sunglasses", loc: "Room 204 · housekeeping", s: "Found", tone: "info" },
                  { i: Package, item: "iPhone 15 charger", loc: "Lobby table 3", s: "Claimed", tone: "success" },
                  { i: Package, item: "Silk scarf · cream", loc: "Pool deck", s: "Donated", tone: "neutral" },
                ].map((x, i) => (
                  <li key={i} className="flex items-center gap-3 px-5 py-3">
                    <x.i className="h-4 w-4 text-text-secondary" />
                    <div className="flex-1">
                      <div className="text-[12px] font-medium text-text-primary">{x.item}</div>
                      <div className="text-[11px] text-text-secondary">{x.loc}</div>
                    </div>
                    <StatusBadge tone={x.tone as any}>{x.s}</StatusBadge>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
