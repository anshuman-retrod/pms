import { Card, CardHeader } from "@/components/ui/Primitives";
import { type AvailabilityMatrixEntry } from "@/types/pms";

interface AvailabilityViewProps {
  availabilityMatrix: AvailabilityMatrixEntry[];
}

export function AvailabilityView({ availabilityMatrix }: AvailabilityViewProps) {
  return (
    <Card>
      <CardHeader title="Availability calendar" hint="14-day · click a cell to quick-book" />
      <div className="p-3 sm:p-4">
        <div className="space-y-2 md:hidden">
          {availabilityMatrix.map((row) => (
            <div key={row.type} className="rounded-md border border-border-subtle bg-surface p-3">
              <div className="mb-2 text-[12px] font-semibold text-text-primary">{row.type}</div>
              <div className="grid grid-cols-7 gap-1.5">
                {row.days.map((d, i) => {
                  const free = d.total - d.sold;
                  const pct = free / d.total;
                  const cls =
                    free === 0
                      ? "bg-[oklch(0.96_0.06_27)] text-[var(--color-error)]"
                      : pct < 0.2
                        ? "bg-[oklch(0.96_0.06_70)] text-[var(--color-warning)]"
                        : "bg-[oklch(0.96_0.05_152)] text-[var(--color-success)]";
                  return (
                    <button
                      key={i}
                      className={`flex flex-col items-center justify-center rounded py-2 text-[10px] font-mono font-medium ${cls}`}
                    >
                      <span>{15 + i}</span>
                      <span>{free}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="table-scroll-shadow hidden overflow-x-auto md:block">
          <div className="min-w-[900px]">
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
              {availabilityMatrix.map((row) => (
                <div key={row.type} className="contents">
                  <div className="bg-surface px-3 py-2 text-[12px] font-medium text-text-primary">
                    {row.type}
                  </div>
                  {row.days.map((d, i) => {
                    const free = d.total - d.sold;
                    const pct = free / d.total;
                    const cls =
                      free === 0
                        ? "bg-[oklch(0.96_0.06_27)] text-[var(--color-error)]"
                        : pct < 0.2
                          ? "bg-[oklch(0.96_0.06_70)] text-[var(--color-warning)]"
                          : "bg-[oklch(0.96_0.05_152)] text-[var(--color-success)]";
                    return (
                      <button
                        key={i}
                        className={`flex flex-col items-center justify-center py-2 text-[11px] font-mono font-medium transition hover:scale-105 ${cls}`}
                      >
                        <span>{free}</span>
                        <span className="text-[9px] opacity-60">/{d.total}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-text-secondary">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-[oklch(0.96_0.05_152)]" />
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-[oklch(0.96_0.06_70)]" />
            Few left
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-[oklch(0.96_0.06_27)]" />
            Sold out
          </span>
        </div>
      </div>
    </Card>
  );
}
export default AvailabilityView;
