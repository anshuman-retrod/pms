import { Card, CardHeader } from "@/components/ui/Primitives";
import { Link } from "@tanstack/react-router";

interface Bar {
  id: string;
  room: string;
  start: number;
  span: number;
  label: string;
  source: string;
}

interface Room {
  num: string;
  type: string;
}

interface TimelineViewProps {
  days: string[];
  rooms: Room[];
  bars: Bar[];
  sourceColor: Record<string, string>;
}

export function TimelineView({ days, rooms, bars, sourceColor }: TimelineViewProps) {
  return (
    <Card>
      <CardHeader title="14-day timeline" hint={`${days[0]} → ${days[days.length - 1]} 2026`} />
      <div className="p-3 sm:p-4">
        <div className="space-y-2 md:hidden">
          {rooms.map((r) => {
            const rowBars = bars.filter((b) => b.room === r.num);
            return (
              <div key={r.num} className="rounded-md border border-border-subtle bg-surface p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-medium text-text-primary">Room {r.num}</div>
                    <div className="text-[11px] text-text-secondary">{r.type}</div>
                  </div>
                  <span className="text-[10px] text-text-secondary">{rowBars.length} stay(s)</span>
                </div>
                <div className="space-y-1.5">
                  {rowBars.length ? (
                    rowBars.map((b, i) => (
                      <Link
                        key={`${r.num}-${i}`}
                        to={"/reservations/" + b.id}
                        className="block rounded px-2 py-1.5 text-[11px] font-medium text-white transition-opacity hover:opacity-90"
                        style={{ background: sourceColor[b.source] }}
                      >
                        <div className="truncate">{b.label}</div>
                        <div className="text-[10px] opacity-80">
                          {days[Math.max(0, b.start)]} to {days[Math.min(days.length - 1, b.start + b.span - 1)]}{" "}
                          · {b.source}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-[11px] text-text-disabled">
                      No reservations in this range
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="table-scroll-shadow hidden overflow-x-auto md:block">
          <div className="min-w-[900px]">
            <div
              className="grid border-b border-border-subtle bg-surface-2/50"
              style={{ gridTemplateColumns: `200px repeat(${days.length}, 1fr)` }}
            >
              <div className="label-uppercase px-4 py-2.5">Room</div>
              {days.map((d) => (
                <div key={d} className="border-l border-border-subtle px-3 py-2.5 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-text-disabled">
                    {d.split(" ")[1]}
                  </div>
                  <div className="text-[12px] font-semibold text-text-primary">
                    {d.split(" ")[0]}
                  </div>
                </div>
              ))}
            </div>
            {rooms.map((r) => {
              const rowBars = bars.filter((b) => b.room === r.num);
              return (
                <div
                  key={r.num}
                  className="relative grid border-b border-border-subtle hover:bg-surface-2/40"
                  style={{ gridTemplateColumns: `200px repeat(${days.length}, 1fr)` }}
                >
                  <div className="px-4 py-3">
                    <div className="text-[13px] font-medium text-text-primary">Room {r.num}</div>
                    <div className="text-[11px] text-text-secondary">{r.type}</div>
                  </div>
                  {days.map((_, i) => (
                    <div key={i} className="border-l border-border-subtle" />
                  ))}
                  {rowBars.map((b, i) => (
                      <Link
                        key={i}
                        to={"/reservations/" + b.id}
                        className="absolute z-10 top-1/2 flex h-8 -translate-y-1/2 items-center gap-2 truncate rounded-md px-2 text-[11px] text-white shadow-sm transition-opacity hover:opacity-90"
                        style={{
                          left: `calc(200px + (100% - 200px) * ${b.start / days.length})`,
                          width: `calc((100% - 200px) * ${b.span / days.length} - 4px)`,
                          background: sourceColor[b.source],
                        }}
                      >
                        <span className="truncate text-[11px] font-medium leading-tight">{b.label}</span>
                        <span className="truncate text-[10px] leading-tight opacity-80">{b.source}</span>
                      </Link>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
export default TimelineView;
