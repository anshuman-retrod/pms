import { PageHeader, Card, KpiCard, StatusBadge, Button } from "@/components/ui/Primitives";
import { Clock, ChefHat, Check, User, Hash } from "lucide-react";

const tickets = [
  {
    id: "KOT-881",
    station: "Main Kitchen",
    table: "T-12",
    captain: "Rahul S.",
    type: "Dine-in",
    items: [
      { name: "Butter Chicken", qty: 2, notes: "Less spicy" },
      { name: "Garlic Naan", qty: 4, notes: "" }
    ],
    elapsed: "14 min",
    status: "Preparing",
  },
  { 
    id: "KOT-880", 
    station: "Pantry", 
    table: "Takeaway",
    captain: "Neha G.",
    type: "Takeaway",
    items: [
      { name: "Caesar Salad", qty: 1, notes: "Dressing on side" },
      { name: "Cold Coffee", qty: 2, notes: "No sugar" }
    ],
    elapsed: "3 min", 
    status: "Queued" 
  },
  {
    id: "KOT-879",
    station: "Dessert",
    table: "T-04",
    captain: "Amit K.",
    type: "Dine-in",
    items: [
      { name: "Chocolate Mousse", qty: 2, notes: "" }
    ],
    elapsed: "18 min",
    status: "Ready",
  },
];

export function PosKotFeature() {
  return (
    <div>
      <PageHeader
        eyebrow="Kitchen Operations"
        title="Kitchen Order Tickets"
        description="Station routing, prep times, and bump bar workflow."
      />
      <div className="space-y-6 p-6 h-[calc(100vh-10rem)] flex flex-col">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 shrink-0">
          <KpiCard label="Queued" value="8" accent="warning" />
          <KpiCard label="Preparing" value="12" accent="info" />
          <KpiCard label="Ready to pass" value="5" accent="success" />
          <KpiCard label="Avg Prep Time" value="14m" accent="brand" />
        </div>
        
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-4 h-full min-w-max items-start">
            {tickets.map((t) => (
              <Card key={t.id} className="w-[300px] flex flex-col shrink-0 max-h-full">
                <div className="p-4 border-b border-border bg-surface-2/30">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-mono text-[13px] font-bold text-text-primary">{t.id}</div>
                    <StatusBadge
                      tone={
                        t.status === "Ready" ? "success" : t.status === "Preparing" ? "brand" : "warning"
                      }
                    >
                      {t.status}
                    </StatusBadge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[12px] text-text-secondary mt-3">
                    <div className="flex items-center gap-1.5">
                      <Hash className="h-3 w-3" />
                      <span className="font-medium text-text-primary">{t.table}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="h-3 w-3" />
                      <span>{t.captain}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      <span className={t.elapsed.includes("18") || t.elapsed.includes("14") ? "text-error font-medium" : ""}>{t.elapsed}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ChefHat className="h-3 w-3" />
                      <span>{t.station}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {t.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="font-mono font-bold text-[14px] bg-surface-2 h-6 w-6 flex items-center justify-center rounded">
                        {item.qty}
                      </div>
                      <div className="flex-1">
                        <div className="text-[13px] font-medium text-text-primary">{item.name}</div>
                        {item.notes && (
                          <div className="text-[11px] text-error mt-0.5 font-medium flex items-center gap-1">
                            <span className="w-1 h-1 bg-error rounded-full block" /> {item.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 border-t border-border bg-surface-2/30 grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="col-span-1">Print</Button>
                  {t.status === "Queued" && (
                    <Button variant="primary" size="sm" className="col-span-1">Start Prep</Button>
                  )}
                  {t.status === "Preparing" && (
                    <Button variant="primary" size="sm" className="col-span-1">Mark Ready</Button>
                  )}
                  {t.status === "Ready" && (
                    <Button variant="outline" size="sm" className="col-span-1 border-success text-success hover:bg-success/10">
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Served
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
