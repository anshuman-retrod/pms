import { Filter, UserPlus } from "lucide-react";
import { PageHeader, Button } from "@/components/ui/Primitives";
import { housekeepingRooms } from "@/services/mock/db";
import { HousekeepingStatus } from "./HousekeepingStatus";
import { RoomCardGrid } from "./RoomCardGrid";

const tone = (s: string) =>
  (({ Ready: "success", Cleaning: "warning", Dirty: "error", OOO: "neutral", Inspected: "info" }[s] as any) || "neutral");

const cardBg = (s: string) =>
  (({
    Ready: "border-l-[var(--color-success)] bg-[oklch(0.985_0.025_152)]",
    Cleaning: "border-l-[var(--color-warning)] bg-[oklch(0.985_0.03_70)]",
    Dirty: "border-l-[var(--color-error)] bg-[oklch(0.985_0.03_27)]",
    OOO: "border-l-text-disabled bg-surface-2",
    Inspected: "border-l-[var(--color-info)] bg-[oklch(0.985_0.025_263)]",
  }[s] as any) || "border-l-border bg-surface");

export function HousekeepingFeature() {
  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Housekeeping"
        description="Floor-level room status across The Grand Palace."
        actions={
          <>
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
        {/* Top strip */}
        <HousekeepingStatus />

        {/* Room board grids */}
        <RoomCardGrid housekeepingRooms={housekeepingRooms} tone={tone} cardBg={cardBg} />
      </div>
    </div>
  );
}
export default HousekeepingFeature;
