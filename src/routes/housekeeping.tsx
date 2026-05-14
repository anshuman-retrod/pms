import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, CardHeader, StatusBadge, Button } from "@/components/ui-kit/Primitives";
import { housekeepingRooms } from "@/lib/mock-data";
import { Filter, UserPlus } from "lucide-react";

export const Route = createFileRoute("/housekeeping")({
  head: () => ({ meta: [{ title: "Housekeeping — Retrod PMS" }] }),
  component: Housekeeping,
});

const tone = (s: string) =>
  ({ Ready: "success", Cleaning: "warning", Dirty: "error", OOO: "neutral", Inspected: "info" }[s] as any) || "neutral";

const cardBg = (s: string) =>
  ({
    Ready: "border-l-[var(--color-success)] bg-[oklch(0.985_0.025_152)]",
    Cleaning: "border-l-[var(--color-warning)] bg-[oklch(0.985_0.03_70)]",
    Dirty: "border-l-[var(--color-error)] bg-[oklch(0.985_0.03_27)]",
    OOO: "border-l-text-disabled bg-surface-2",
    Inspected: "border-l-[var(--color-info)] bg-[oklch(0.985_0.025_263)]",
  }[s] || "border-l-border bg-surface");

function Housekeeping() {
  return (
    <div>
      <PageHeader eyebrow="Operations" title="Housekeeping" description="Floor-level room status across The Grand Palace." actions={
        <>
          <Button variant="outline" size="sm"><Filter className="h-3.5 w-3.5" />Filter</Button>
          <Button size="sm"><UserPlus className="h-3.5 w-3.5" />Assign staff</Button>
        </>
      } />

      <div className="space-y-6 p-6">
        {/* Top strip */}
        <Card>
          <div className="grid grid-cols-2 divide-x divide-border-subtle md:grid-cols-5">
            {[
              { l: "Total Rooms", v: "120", c: "text-text-primary" },
              { l: "Ready", v: "84", c: "text-[var(--color-success)]" },
              { l: "Cleaning", v: "12", c: "text-[var(--color-warning)]" },
              { l: "Dirty", v: "18", c: "text-[var(--color-error)]" },
              { l: "Out of Order", v: "6", c: "text-text-secondary" },
            ].map((s) => (
              <div key={s.l} className="px-5 py-4">
                <div className="label-uppercase">{s.l}</div>
                <div className={`mt-1 text-[22px] font-semibold ${s.c}`}>{s.v}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Floor tabs */}
        <div className="flex items-center gap-1 rounded-md border border-border bg-surface p-1">
          {["Floor 1", "Floor 2", "Floor 3", "Floor 4"].map((f, i) => (
            <button key={f} className={`rounded px-3 py-1.5 text-[12px] font-medium ${i === 0 ? "bg-foreground text-background" : "text-text-secondary hover:text-text-primary"}`}>{f}</button>
          ))}
          <span className="ml-3 text-[11px] text-text-disabled">Showing Floor 1 · 18 rooms</span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {housekeepingRooms.map((r) => (
            <div key={r.num} className={`rounded-md border border-l-[3px] border-border bg-surface p-3 shadow-e1 ${cardBg(r.status)}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono text-[16px] font-semibold text-text-primary">{r.num}</div>
                  <div className="mt-0.5 text-[11px] text-text-secondary">{r.type}</div>
                </div>
                <StatusBadge tone={tone(r.status)}>{r.status}</StatusBadge>
              </div>
              <div className="mt-3 border-t border-border-subtle pt-2 text-[11px]">
                <span className="text-text-secondary">Assigned: </span>
                <span className="font-medium text-text-primary">{r.staff}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
