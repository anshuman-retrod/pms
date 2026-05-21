import { Card } from "@/components/ui/Primitives";

export function HousekeepingStatus() {
  return (
    <Card>
      <div className="grid grid-cols-2 divide-x divide-border-subtle md:grid-cols-5">
        {[
          { l: "Total Rooms", v: "120", c: "text-text-primary" },
          { l: "Ready", v: "84", c: "text-[var(--color-success)]" },
          { l: "Cleaning", v: "12", c: "text-[var(--color-warning)]" },
          { l: "Dirty", v: "18", c: "text-[var(--color-error)]" },
          { l: "Out of Order", v: "6", c: "text-text-secondary" },
        ].map((s) => (
          <div key={s.l} className="px-5 py-4">
            <div className="label-uppercase">{s.l}</div>
            <div className={`mt-1 text-[22px] font-semibold ${s.c}`}>{s.v}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
export default HousekeepingStatus;
