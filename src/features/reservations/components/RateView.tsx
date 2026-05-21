import { Card, CardHeader, Button } from "@/components/ui/Primitives";
import { type RateCalendarEntry } from "@/types/pms";

interface RateViewProps {
  rateCalendar: RateCalendarEntry[];
}

export function RateView({ rateCalendar }: RateViewProps) {
  return (
    <Card>
      <CardHeader
        title="Rate calendar"
        hint="BAR per room type · click to edit"
        action={
          <Button size="sm" variant="outline">
            Bulk update
          </Button>
        }
      />
      <div className="overflow-x-auto">
        <div className="min-w-[900px] p-4">
          <div className="grid gap-px bg-border-subtle" style={{ gridTemplateColumns: `160px repeat(14, 1fr)` }}>
            <div className="bg-surface px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-text-secondary">
              Room type
            </div>
            {Array.from({ length: 14 }, (_, i) => (
              <div key={i} className="bg-surface px-1 py-2 text-center text-[10px] font-medium text-text-secondary">
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
  );
}
export default RateView;
