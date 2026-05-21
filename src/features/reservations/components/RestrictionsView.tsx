import { Lock, Ban, AlertOctagon, Plus } from "lucide-react";
import { Card, CardHeader, Button } from "@/components/ui/Primitives";
import { type Restriction } from "@/types/pms";

interface RestrictionsViewProps {
  restrictions: Restriction[];
}

export function RestrictionsView({ restrictions }: RestrictionsViewProps) {
  return (
    <Card>
      <CardHeader
        title="Restriction calendar"
        hint="Min Stay · CTA · CTD · Stop Sell"
        action={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            Add restriction
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
        <div>
          <div className="label-uppercase mb-2">Active restrictions</div>
          <ul className="divide-y divide-border-subtle rounded-md border border-border">
            {restrictions.map((r, i) => {
              const Icon = r.kind.includes("Stop")
                ? Lock
                : r.kind.includes("CTA") || r.kind.includes("CTD")
                  ? Ban
                  : AlertOctagon;
              const tone = r.kind.includes("Stop")
                ? "error"
                : r.kind.includes("CTA") || r.kind.includes("CTD")
                  ? "warning"
                  : "info";
              return (
                <li key={i} className="flex items-center gap-3 px-4 py-3">
                  <Icon
                    className={`h-4 w-4 ${
                      tone === "error"
                        ? "text-[var(--color-error)]"
                        : tone === "warning"
                          ? "text-[var(--color-warning)]"
                          : "text-[var(--color-info)]"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="text-[13px] font-medium text-text-primary">
                      {r.kind} · {r.type}
                    </div>
                    <div className="text-[11px] text-text-secondary">{r.date} May 2026</div>
                  </div>
                  <button className="text-[11px] text-text-disabled hover:text-[var(--color-error)]">
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <div className="label-uppercase mb-2">Calendar overview</div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 14 }, (_, i) => {
              const day = 15 + i;
              const r = restrictions.find((x) => x.date === day);
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-md border p-1.5 text-[10px] ${
                    r
                      ? "border-[var(--color-warning)] bg-[oklch(0.97_0.05_70)]"
                      : "border-border bg-surface"
                  }`}
                >
                  <div className="font-mono font-semibold text-text-primary">{day}</div>
                  {r && <div className="mt-0.5 truncate font-medium text-[var(--color-warning)]">{r.kind}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
export default RestrictionsView;
