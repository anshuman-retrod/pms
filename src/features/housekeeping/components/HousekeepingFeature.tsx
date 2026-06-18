import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Filter, UserPlus, Smartphone } from "lucide-react";
import { PageHeader, Button, KpiCard } from "@/components/ui/Primitives";
import { useHousekeepingRoomsQuery } from "@/services/mock/queries";
import { toast } from "sonner";
import type { HousekeepingRoom } from "@/types/pms";
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
  })[s] as StatusTone | undefined) ?? "neutral";

const cardBg = (s: string) =>
  (({
    Ready: "border-l-[var(--color-success)] bg-[oklch(0.985_0.025_152)]",
    Cleaning: "border-l-[var(--color-warning)] bg-[oklch(0.985_0.03_70)]",
    Dirty: "border-l-[var(--color-error)] bg-[oklch(0.985_0.03_27)]",
    OOO: "border-l-text-disabled bg-surface-2",
    Inspected: "border-l-[var(--color-info)] bg-[oklch(0.985_0.025_263)]",
  })[s] as string) || "border-l-border bg-surface";

type View = "board" | "list" | "kanban";

export function HousekeepingFeature() {
  const { data: housekeepingRooms = [] } = useHousekeepingRoomsQuery();

  const [view, setView] = useState<View>("board");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [staffName, setStaffName] = useState("Priya");
  const [staffOverrides, setStaffOverrides] = useState<Record<string, string>>({});
  const [selectedRoomNums, setSelectedRoomNums] = useState<string[]>([]);

  const effectiveRooms = useMemo(
    () =>
      housekeepingRooms.map((room) => ({
        ...room,
        staff: staffOverrides[room.num] ?? room.staff,
      })),
    [housekeepingRooms, staffOverrides],
  );

  const stats = useMemo(() => {
    const ready = effectiveRooms.filter((r) => r.status === "Ready").length;
    const dirty = effectiveRooms.filter((r) => r.status === "Dirty").length;
    const cleaning = effectiveRooms.filter((r) => r.status === "Cleaning").length;
    const inspected = effectiveRooms.filter((r) => r.status === "Inspected").length;
    const ooo = effectiveRooms.filter((r) => r.status === "OOO").length;
    return { ready, dirty, cleaning, inspected, ooo };
  }, [effectiveRooms]);

  const filtered = useMemo(
    () =>
      statusFilter === "All"
        ? effectiveRooms
        : effectiveRooms.filter((r) => r.status === statusFilter),
    [statusFilter, effectiveRooms],
  );

  const openAssignModalForRooms = (rooms: string[]) => {
    setSelectedRoomNums(rooms);
    setIsAssignOpen(true);
  };

  const handleHeaderAssign = () => {
    const targetRooms =
      filtered.filter((r) => r.status === "Dirty" || r.status === "Cleaning").map((r) => r.num) ||
      [];
    openAssignModalForRooms(targetRooms.slice(0, 8));
  };

  const handleQuickRoomUpdate = (room: HousekeepingRoom) => {
    openAssignModalForRooms([room.num]);
  };

  const toggleRoomSelection = (roomNum: string) => {
    setSelectedRoomNums((prev) =>
      prev.includes(roomNum) ? prev.filter((num) => num !== roomNum) : [...prev, roomNum],
    );
  };

  const handleAssignSave = () => {
    if (!selectedRoomNums.length) {
      toast.error("Select at least one room to assign.");
      return;
    }
    setStaffOverrides((prev) => {
      const next = { ...prev };
      selectedRoomNums.forEach((num) => {
        next[num] = staffName;
      });
      return next;
    });
    toast.success(`${staffName} assigned to ${selectedRoomNums.length} room(s).`);
    setIsAssignOpen(false);
  };

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
            <Button variant="outline" size="sm" onClick={() => setShowFilterPanel((prev) => !prev)}>
              <Filter className="h-3.5 w-3.5" />
              Filter
            </Button>
            <Button size="sm" onClick={handleHeaderAssign}>
              <UserPlus className="h-3.5 w-3.5" />
              Assign staff
            </Button>
          </>
        }
      />

      <div className="responsive-page-x space-y-5 py-4 sm:space-y-6 sm:py-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard label="Clean rooms" value={String(stats.ready)} accent="success" />
          <KpiCard label="Dirty rooms" value={String(stats.dirty)} accent="error" />
          <KpiCard label="Cleaning" value={String(stats.cleaning)} accent="warning" />
          <KpiCard label="Inspection pending" value={String(stats.inspected)} accent="info" />
          <KpiCard label="Out of service" value={String(stats.ooo)} accent="warning" />
        </div>

        <HousekeepingStatus />

        {showFilterPanel ? (
          <div className="rounded-md border border-border bg-surface p-3">
            <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-text-secondary">
              Quick status filter
            </div>
            <div className="flex flex-wrap gap-2">
              {["All", "Ready", "Dirty", "Cleaning", "Inspected", "OOO"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-full border px-3 py-1 text-[12px] transition ${
                    statusFilter === s
                      ? "border-primary bg-primary-tint text-primary"
                      : "border-border text-text-secondary hover:border-primary hover:text-primary"
                  }`}
                >
                  {s}
                </button>
              ))}
              <Button variant="outline" size="sm" onClick={() => setStatusFilter("All")}>
                Reset
              </Button>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <div className="w-full overflow-x-auto sm:w-auto">
            <div className="flex min-w-max rounded-md border border-border bg-surface p-0.5 text-[12px]">
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
                    view === v.id
                      ? "bg-foreground text-background"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
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
        {view === "list" && (
          <HousekeepingListView rooms={filtered} tone={tone} onUpdateRoom={handleQuickRoomUpdate} />
        )}
        {view === "kanban" && <HousekeepingKanban rooms={filtered} tone={tone} />}
      </div>

      {isAssignOpen ? (
        <div className="fixed inset-0 z-40 bg-black/30 p-3 sm:p-8">
          <div className="mx-auto h-full max-w-2xl overflow-auto rounded-lg border border-border bg-surface shadow-e3 sm:h-auto">
            <div className="border-b border-border-subtle px-5 py-4">
              <div className="text-[16px] font-semibold text-text-primary">Assign staff</div>
              <div className="text-[12px] text-text-secondary">
                Select rooms and assign an attendant.
              </div>
            </div>
            <div className="space-y-4 p-5">
              <label className="block">
                <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-text-secondary">
                  Staff member
                </div>
                <select
                  className="h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px]"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                >
                  {["Priya", "Lakshmi", "Anjali", "Sunil", "Rakesh"].map((staff) => (
                    <option key={staff}>{staff}</option>
                  ))}
                </select>
              </label>
              <div>
                <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-text-secondary">
                  Rooms
                </div>
                <div className="grid max-h-52 grid-cols-2 gap-2 overflow-auto rounded-md border border-border p-2 sm:grid-cols-3">
                  {filtered.map((room) => (
                    <label
                      key={room.num}
                      className="flex items-center gap-2 rounded border border-border-subtle px-2 py-1.5 text-[12px]"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRoomNums.includes(room.num)}
                        onChange={() => toggleRoomSelection(room.num)}
                      />
                      <span className="font-mono text-text-primary">{room.num}</span>
                      <span className="text-text-secondary">{room.status}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-border-subtle px-5 py-3">
              <Button variant="outline" size="sm" onClick={() => setIsAssignOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleAssignSave}>
                Save assignment
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
export default HousekeepingFeature;
