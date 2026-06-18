import { Plus, UtensilsCrossed } from "lucide-react";
import { PageHeader, Button, Card, CardHeader, KpiCard, StatusBadge } from "@/components/ui/Primitives";

const orders = [
  { id: "ORD-441", table: "T-12", items: "2× Butter Chicken, Naan", amount: 4860, status: "Served" },
  { id: "ORD-440", table: "T-08", items: "Continental Breakfast × 2", amount: 1640, status: "Preparing" },
  { id: "ORD-439", table: "Room 312", items: "Room service · Club sandwich", amount: 980, status: "Delivered" },
  { id: "ORD-438", table: "T-04", items: "Chef's tasting menu × 2", amount: 7200, status: "Served" },
];

export function PosOrdersFeature() {
  return (
    <div>
      <PageHeader
        eyebrow="Outlet · Main Restaurant"
        title="Live Orders"
        description="Floor service, room charges, and kitchen dispatch."
        actions={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            New order
          </Button>
        }
      />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="Open tables" value="8" accent="brand" />
          <KpiCard label="Orders · today" value="64" accent="info" />
          <KpiCard label="Kitchen queue" value="5" accent="warning" />
          <KpiCard label="Revenue · today" value="₹1.8L" accent="success" />
        </div>

        <Card>
          <CardHeader
            title="Order queue"
            hint="Synced with KOT · mock data"
            action={
              <div className="flex items-center gap-2 text-[12px] text-text-secondary">
                <UtensilsCrossed className="h-4 w-4" />
                Dinner service
              </div>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-[13px]">
              <thead>
                <tr className="border-b border-border bg-surface-2/40 text-left">
                  {["Order", "Table / Room", "Items", "Amount", "Status"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border-subtle hover:bg-surface-2/40">
                    <td className="px-4 py-3 font-mono text-[12px]">{order.id}</td>
                    <td className="px-4 py-3">{order.table}</td>
                    <td className="px-4 py-3 text-text-secondary">{order.items}</td>
                    <td className="px-4 py-3 font-mono">₹{order.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <StatusBadge tone={order.status === "Preparing" ? "warning" : "success"}>
                        {order.status}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
