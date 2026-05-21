import { Card, CardHeader } from "@/components/ui/Primitives";

interface Bar {
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
      <CardHeader title="7-day timeline" hint="14 May → 20 May 2026" />
      <div className="overflow-x-auto">
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
                <div className="text-[12px] font-semibold text-text-primary">{d.split(" ")[0]}</div>
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
                  <div
                    key={i}
                    className="absolute top-3 h-9 rounded-md px-2.5 py-1.5 text-[11px] font-medium text-white shadow-e1"
                    style={{
                      left: `calc(200px + (100% - 200px) * ${b.start / days.length})`,
                      width: `calc((100% - 200px) * ${b.span / days.length} - 4px)`,
                      background: sourceColor[b.source],
                    }}
                  >
                    <div className="truncate">{b.label}</div>
                    <div className="truncate text-[10px] opacity-80">{b.source}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
export default TimelineView;
