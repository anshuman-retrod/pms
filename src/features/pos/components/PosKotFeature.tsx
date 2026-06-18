import { PageHeader, Card, KpiCard, StatusBadge } from "@/components/ui/Primitives";

const tickets = [
  { id: "KOT-881", station: "Tandoor", items: "Butter Chicken ×2", elapsed: "4 min", status: "Preparing" },
  { id: "KOT-880", station: "Cold", items: "Caesar Salad ×1", elapsed: "1 min", status: "Queued" },
  { id: "KOT-879", station: "Pastry", items: "Chocolate mousse ×2", elapsed: "8 min", status: "Ready" },
];

export function PosKotFeature() {
  return (
    <div>
      <PageHeader
        eyebrow="Kitchen Operations"
        title="Kitchen Order Tickets"
        description="Station routing, prep times, and bump bar workflow."
      />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <KpiCard label="Queued" value="3" accent="warning" />
          <KpiCard label="Preparing" value="5" accent="info" />
          <KpiCard label="Ready to pass" value="2" accent="success" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {tickets.map((t) => (
            <Card key={t.id} className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-mono text-[11px] text-text-secondary">{t.id}</div>
                  <h3 className="mt-1 text-[15px] font-semibold text-text-primary">{t.station}</h3>
                  <p className="text-[11px] text-text-secondary">{t.elapsed} elapsed</p>
                </div>
                <StatusBadge tone={t.status === "Ready" ? "success" : t.status === "Preparing" ? "info" : "warning"}>
                  {t.status}
                </StatusBadge>
              </div>
              <p className="mt-4 text-[13px] text-text-primary">{t.items}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
