import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/Primitives";
import { RevenueCalendar } from "./RevenueCalendar";

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
  return (
    <div>
      <PageHeader
        eyebrow="Commercial"
        title="Revenue Management"
        description="Calendar-based pricing strategy across room types."
        actions={
          <div className="flex items-center gap-1 rounded-md border border-border bg-surface p-0.5">
            <button className="rounded p-1 text-text-secondary hover:bg-surface-2 transition">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="px-2 text-[12px] font-medium text-text-primary">15 May → 4 Jun</span>
            <button className="rounded p-1 text-text-secondary hover:bg-surface-2 transition">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        }
      />

      <div className="space-y-6 p-6">
        <RevenueCalendar days={days} types={types} baseRate={baseRate} />
      </div>
    </div>
  );
}
export default RevenueFeature;
