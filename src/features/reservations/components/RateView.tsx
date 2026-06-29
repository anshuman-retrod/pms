import { Card, CardHeader, Button } from "@/components/ui/Primitives";
import { type RateCalendarEntry } from "@/types/pms";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { toast } from "sonner";

interface RateViewProps {
  rateCalendar: RateCalendarEntry[];
}
export function RateView({ rateCalendar }: RateViewProps) {
  const [isBulkUpdateOpen, setIsBulkUpdateOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedMealPlan, setSelectedMealPlan] = useState("EP");
  const [newRate, setNewRate] = useState("");
  const [extraAdultPrice, setExtraAdultPrice] = useState("");
  const [extraChildPrice, setExtraChildPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleBulkUpdate = () => {
    if (!newRate) {
      toast.error("Please enter a new rate.");
      return;
    }
    toast.success(`Rates updated successfully for ${selectedType}.`);
    setIsBulkUpdateOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader
          title="Rate calendar"
          hint="BAR per room type · click to edit"
          action={
            <Button size="sm" variant="outline" onClick={() => setIsBulkUpdateOpen(true)}>
              Bulk update
            </Button>
          }
        />
      <div className="overflow-x-auto">
        <div className="min-w-[900px] p-4">
          <div
            className="grid gap-px bg-border-subtle"
            style={{ gridTemplateColumns: `160px repeat(14, 1fr)` }}
          >
            <div className="bg-surface px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-text-secondary">
              Room type
            </div>
            {Array.from({ length: 14 }, (_, i) => (
              <div
                key={i}
                className="bg-surface px-1 py-2 text-center text-[10px] font-medium text-text-secondary"
              >
                {15 + i}
              </div>
            ))}
            {rateCalendar.map((row) => (
              <div key={row.type} className="contents">
                <div className="bg-surface px-3 py-2 text-[12px] font-medium text-text-primary">
                  {row.type}
                </div>
                {row.days.map((d, i) => {
                  const cls =
                    d.tag === "Event"
                      ? "bg-primary-tint text-primary-pressed"
                      : d.tag === "Weekend"
                        ? "bg-[oklch(0.96_0.06_70)] text-[var(--color-warning)]"
                        : "bg-surface text-text-primary";
                  return (
                    <button
                      key={i}
                      className={`flex flex-col items-center justify-center py-2 text-[10px] font-mono transition hover:opacity-80 ${cls}`}
                    >
                      <span className="font-semibold">₹{(d.rate / 1000).toFixed(1)}k</span>
                      <span className="text-[8px] opacity-60">{d.tag}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      </Card>

      <Sheet open={isBulkUpdateOpen} onOpenChange={setIsBulkUpdateOpen}>
        <SheetContent side="right" className="sm:max-w-md w-full">
          <SheetHeader>
            <SheetTitle>Bulk Update Rates</SheetTitle>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">Room Type</label>
              <select 
                className="col-span-3 h-9 w-full rounded-md border border-border bg-surface px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="All">All Room Types</option>
                {rateCalendar.map(r => (
                  <option key={r.type} value={r.type}>{r.type}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">Meal Plan</label>
              <select 
                className="col-span-3 h-9 w-full rounded-md border border-border bg-surface px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                value={selectedMealPlan}
                onChange={(e) => setSelectedMealPlan(e.target.value)}
              >
                <option value="EP">Room Only (EP)</option>
                <option value="CP">Bed & Breakfast (CP)</option>
                <option value="MAP">Half Board (MAP)</option>
                <option value="AP">Full Board (AP)</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">Start Date</label>
              <input 
                type="date"
                className="col-span-3 h-9 w-full rounded-md border border-border bg-surface px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">End Date</label>
              <input 
                type="date"
                className="col-span-3 h-9 w-full rounded-md border border-border bg-surface px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">New Rate (₹)</label>
              <input 
                type="number"
                placeholder="e.g. 15000"
                className="col-span-3 h-9 w-full rounded-md border border-border bg-surface px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">Extra Adult (₹)</label>
              <input 
                type="number"
                placeholder="e.g. 1500"
                className="col-span-3 h-9 w-full rounded-md border border-border bg-surface px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                value={extraAdultPrice}
                onChange={(e) => setExtraAdultPrice(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">Extra Child (₹)</label>
              <input 
                type="number"
                placeholder="e.g. 800"
                className="col-span-3 h-9 w-full rounded-md border border-border bg-surface px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                value={extraChildPrice}
                onChange={(e) => setExtraChildPrice(e.target.value)}
              />
            </div>
          </div>
          <SheetFooter className="mt-4 border-t pt-4">
            <Button variant="outline" onClick={() => setIsBulkUpdateOpen(false)}>Cancel</Button>
            <Button onClick={handleBulkUpdate}>Update Rates</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
export default RateView;
