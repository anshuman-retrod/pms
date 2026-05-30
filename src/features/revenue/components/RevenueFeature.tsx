import { useState } from "react";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { PageHeader, KpiCard, Button } from "@/components/ui/Primitives";
import { RevenueCalendar } from "./RevenueCalendar";
import { forecast7d, occupancyByType } from "@/services/mock/db";

const days = Array.from({ length: 21 }, (_, i) => i + 15);
const types = ["Heritage", "Premier", "Executive", "Deluxe K", "Deluxe T"];
const baseRate: Record<string, number> = {
  Heritage: 35000,
  Premier: 22000,
  Executive: 14400,
  "Deluxe K": 12000,
  "Deluxe T": 9800,
};

export function RevenueFeature() {
  const [roomFilter, setRoomFilter] = useState<string>("All");

  const totalRooms = occupancyByType.reduce((a, b) => a + b.total, 0);
  const occupied = occupancyByType.reduce((a, b) => a + b.occupied, 0);
  const occPct = Math.round((occupied / totalRooms) * 1000) / 10;
  const pickup7d = forecast7d[6]?.occ ?? 0;
  const revpar = "₹10,440";
  const adr = "₹12,400";

  const filteredTypes =
    roomFilter === "All"
      ? types
      : roomFilter === "Deluxe"
        ? types.filter((t) => t.startsWith("Deluxe"))
        : types.filter((t) => t.startsWith(roomFilter));

  return (
    <div>
      <PageHeader
        eyebrow="Commercial"
        title="Revenue Management"
        description="Calendar-based pricing strategy across room types."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-3.5 w-3.5" />
              Bulk edit
            </Button>
            <div className="flex items-center gap-1 rounded-md border border-border bg-surface p-0.5">
              <button type="button" className="rounded p-1 text-text-secondary hover:bg-surface-2 transition">
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <span className="px-2 text-[12px] font-medium text-text-primary">15 May → 4 Jun</span>
              <button type="button" className="rounded p-1 text-text-secondary hover:bg-surface-2 transition">
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        }
      />

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <KpiCard label="RevPAR · MTD" value={revpar} delta="↑ 5.4% vs LM" accent="brand" />
          <KpiCard label="ADR today" value={adr} delta="↑ ₹800 vs LW" accent="success" />
          <KpiCard label="Occupancy forecast" value={`${occPct}%`} accent="info" />
          <KpiCard label="Pickup (7d)" value={`${pickup7d}%`} accent="warning" />
          <KpiCard label="Compression index" value="1.12" accent="success" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="h-8 rounded-md border border-border bg-surface px-2 text-[12px]"
          >
            {["All", "Heritage", "Premier", "Executive", "Deluxe"].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>

        <RevenueCalendar days={days} types={filteredTypes} baseRate={baseRate} />
      </div>
    </div>
  );
}
export default RevenueFeature;
