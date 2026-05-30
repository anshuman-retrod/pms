import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Filter, UserPlus, Smartphone } from "lucide-react";
import { PageHeader, Button, KpiCard } from "@/components/ui/Primitives";
import { housekeepingRooms } from "@/services/mock/db";
import { HousekeepingStatus } from "./HousekeepingStatus";
import { RoomCardGrid } from "./RoomCardGrid";
import { HousekeepingListView } from "./HousekeepingListView";
import { HousekeepingKanban } from "./HousekeepingKanban";

type StatusTone = "success" | "warning" | "error" | "info" | "neutral" | "brand" | "dark";

const tone = (s: string): StatusTone =>
  (({
    Ready: "success",
    Cleaning: "warning",
    Dirty: "error",
    OOO: "neutral",
    Inspected: "info",
  }[s] as StatusTone | undefined) ?? "neutral");

const cardBg = (s: string) =>
  (({
    Ready: "border-l-[var(--color-success)] bg-[oklch(0.985_0.025_152)]",
    Cleaning: "border-l-[var(--color-warning)] bg-[oklch(0.985_0.03_70)]",
    Dirty: "border-l-[var(--color-error)] bg-[oklch(0.985_0.03_27)]",
    OOO: "border-l-text-disabled bg-surface-2",
    Inspected: "border-l-[var(--color-info)] bg-[oklch(0.985_0.025_263)]",
  }[s] as string) || "border-l-border bg-surface");

type View = "board" | "list" | "kanban";

export function HousekeepingFeature() {
  const [view, setView] = useState<View>("board");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const stats = useMemo(() => {
    const ready = housekeepingRooms.filter((r) => r.status === "Ready").length;
    const dirty = housekeepingRooms.filter((r) => r.status === "Dirty").length;
    const cleaning = housekeepingRooms.filter((r) => r.status === "Cleaning").length;
    const inspected = housekeepingRooms.filter((r) => r.status === "Inspected").length;
    const ooo = housekeepingRooms.filter((r) => r.status === "OOO").length;
    return { ready, dirty, cleaning, inspected, ooo };
  }, []);

  const filtered = useMemo(
    () => (statusFilter === "All" ? housekeepingRooms : housekeepingRooms.filter((r) => r.status === statusFilter)),
    [statusFilter],
  );

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Housekeeping"
        description="Floor-level room status across The Grand Palace."
        actions={
          <>
            <Link to="/housekeeping/mobile">
              <Button variant="outline" size="sm">
                <Smartphone className="h-3.5 w-3.5" />
                Mobile
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </Button>
            <Button size="sm">
              <UserPlus className="h-3.5 w-3.5" />
              Assign staff
            </Button>
          </>
        }
      />

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <KpiCard label="Clean rooms" value={String(stats.ready)} accent="success" />
          <KpiCard label="Dirty rooms" value={String(stats.dirty)} accent="error" />
          <KpiCard label="Cleaning" value={String(stats.cleaning)} accent="warning" />
          <KpiCard label="Inspection pending" value={String(stats.inspected)} accent="info" />
          <KpiCard label="Out of service" value={String(stats.ooo)} accent="warning" />
        </div>

        <HousekeepingStatus />

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-md border border-border bg-surface p-0.5 text-[12px]">
            {(
              [
                { id: "board" as const, label: "Board" },
                { id: "list" as const, label: "List" },
                { id: "kanban" as const, label: "By attendant" },
              ] as const
            ).map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setView(v.id)}
                className={`rounded px-3 py-1 transition ${
                  view === v.id ? "bg-foreground text-background" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 rounded-md border border-border bg-surface px-2 text-[12px]"
          >
            {["All", "Ready", "Dirty", "Cleaning", "Inspected", "OOO"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {view === "board" && (
          <RoomCardGrid housekeepingRooms={filtered} tone={tone} cardBg={cardBg} />
        )}
        {view === "list" && <HousekeepingListView rooms={filtered} tone={tone} />}
        {view === "kanban" && <HousekeepingKanban rooms={filtered} tone={tone} />}
      </div>
    </div>
  );
}
export default HousekeepingFeature;
