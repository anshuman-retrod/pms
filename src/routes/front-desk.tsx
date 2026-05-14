import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, KeyRound, Search, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
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

function FrontDeskPage() {
  return (
    <div>
      <PageHeader eyebrow="Operations" title="Front Desk" description="Built for speed. Complete any check-in in three clicks." />

      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[35%_1fr]">
        {/* Left panel */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <KpiCard label="In House" value="84" accent="info" />
            <KpiCard label="Arrivals" value="24" accent="success" />
            <KpiCard label="Departures" value="18" accent="warning" />
          </div>

          <Card>
            <CardHeader title="Arrivals queue" hint="Sorted by ETA" />
            <ul className="divide-y divide-border-subtle">
              {arrivalsToday.map((r, i) => (
                <li key={r.id} className={`flex items-center gap-3 px-4 py-3 hover:bg-surface-2/60 ${i === 0 ? "bg-primary-tint/40" : ""}`}>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">{r.guest.split(" ").map(s=>s[0]).slice(0,2).join("")}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium text-text-primary">{r.guest}</div>
                    <div className="text-[11px] text-text-secondary">{r.id} · Room {r.room} · {r.nights}N</div>
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
                  <span className="font-mono text-[12px] text-text-primary">{r.balance ? <span className="text-[var(--color-error)]">₹{r.balance.toLocaleString()}</span> : "Settled"}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Right panel: active check-in */}
        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Express check-in"
              hint="John Mathews · RES-2041"
              action={<StatusBadge tone="warning">Pending balance</StatusBadge>}
            />

            {/* Stepper */}
            <div className="flex items-center gap-2 border-b border-border-subtle px-5 py-3 text-[12px]">
              {["Find guest", "Confirm", "Assign room", "Payment", "Issue key"].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${i < 2 ? "bg-primary text-primary-foreground" : i === 2 ? "border border-primary text-primary" : "border border-border text-text-disabled"}`}>{i + 1}</span>
                  <span className={i <= 2 ? "text-text-primary" : "text-text-disabled"}>{s}</span>
                  {i < 4 && <ArrowRight className="h-3 w-3 text-text-disabled" />}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
              <div className="space-y-3">
                <Field label="Guest name" value="John Mathews" />
                <Field label="ID number" value="UK-PP 893421" mono />
                <Field label="Email" value="john.mathews@email.com" />
                <Field label="Phone" value="+44 7700 900812" mono />
              </div>
              <div className="space-y-3">
                <Field label="Reservation" value="RES-2041" mono />
                <Field label="Stay" value="15 May → 18 May · 3 nights" />
                <Field label="Source" value="Booking.com" />
                <Field label="Rate plan" value="BAR · Bed & Breakfast" />
              </div>
            </div>

            <div className="mx-5 mb-5 flex items-start gap-3 rounded-md border border-[var(--color-warning)]/30 bg-[oklch(0.97_0.05_70)] p-3 text-[12px]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-warning)]" />
              <div className="flex-1">
                <div className="font-medium text-text-primary">Outstanding balance: ₹4,800</div>
                <div className="text-text-secondary">Collect before issuing key. Payment can be split across cards.</div>
              </div>
              <Button size="sm" variant="outline"><CreditCard className="h-3.5 w-3.5" />Collect now</Button>
            </div>
          </Card>

          {/* Room assignment */}
          <Card>
            <CardHeader
              title="Assign room"
              hint="Floor 2 · Deluxe King available"
              action={
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-disabled" />
                    <input className="h-8 w-44 rounded-md border border-border bg-surface pl-8 pr-2 text-[12px] focus:border-primary focus:outline-none" placeholder="Search room…" />
                  </div>
                </div>
              }
            />
            <div className="space-y-4 p-5">
              {floors.map((f) => (
                <div key={f}>
                  <div className="label-uppercase mb-2">Floor {f}</div>
                  <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                    {sample(f).map((r) => (
                      <button
                        key={r.num}
                        className={`group relative aspect-[3/2.4] rounded-md border text-left transition hover:scale-[1.03] hover:shadow-e2 ${colorFor(r.status)}`}
                        title={`${r.num} · ${r.status}`}
                      >
                        <span className="absolute left-1.5 top-1 font-mono text-[11px] font-medium">{r.num}</span>
                        <span className="absolute bottom-1 right-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-border-subtle bg-surface-2/40 px-5 py-3">
              <div className="flex items-center gap-2 text-[12px] text-text-secondary">
                <CheckCircle2 className="h-4 w-4 text-[var(--color-success)]" /> Selected: <span className="font-mono text-text-primary">Room 204</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Print receipt</Button>
                <Button size="sm"><KeyRound className="h-3.5 w-3.5" />Issue key & complete</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="label-uppercase text-[10px]">{label}</div>
      <div className={`mt-1 text-[13px] text-text-primary ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}
