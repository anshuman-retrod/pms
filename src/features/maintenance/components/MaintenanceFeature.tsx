import { useMemo, useState } from "react";
import { Filter, Plus, Wrench } from "lucide-react";
import { PageHeader, KpiCard, Button, Card, StatusBadge } from "@/components/ui/Primitives";
import { workOrders } from "@/services/mock/db";
import { type WorkOrder, type WorkOrderStatus } from "@/types/pms";
import { cn } from "@/lib/utils";

const columns: WorkOrderStatus[] = ["Reported", "In Progress", "Waiting Parts", "Resolved"];

const priorityTone = (p: WorkOrder["priority"]) =>
  (({ Critical: "error", High: "warning", Normal: "neutral" } as const)[p]);

export function MaintenanceFeature() {
  const [priorityFilter, setPriorityFilter] = useState<string>("All");

  const filtered = useMemo(
    () => (priorityFilter === "All" ? workOrders : workOrders.filter((w) => w.priority === priorityFilter)),
    [priorityFilter],
  );

  const open = workOrders.filter((w) => w.status !== "Resolved").length;
  const critical = workOrders.filter((w) => w.priority === "Critical" && w.status !== "Resolved").length;
  const ooo = 6;

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Maintenance"
        description="Work orders, preventive tasks, and room out-of-order tracking."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="h-3.5 w-3.5" />
              Filters
            </Button>
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" />
              Create work order
            </Button>
          </>
        }
      />

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <KpiCard label="Open work orders" value={String(open)} delta={critical ? `${critical} critical` : undefined} deltaTone="error" accent="warning" />
          <KpiCard label="Critical" value={String(critical)} accent="error" />
          <KpiCard label="Rooms OOO" value={String(ooo)} accent="warning" />
          <KpiCard label="Avg resolution" value="4.2h" accent="info" />
          <KpiCard label="PM due this week" value="3" accent="brand" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-8 rounded-md border border-border bg-surface px-2 text-[12px]"
          >
            {["All", "Critical", "High", "Normal"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 overflow-x-auto lg:grid-cols-4">
          {columns.map((col) => {
            const items = filtered.filter((w) => w.status === col);
            return (
              <div key={col} className="min-w-[240px]">
                <div className="mb-2 flex items-center justify-between px-1">
                  <span className="text-[12px] font-semibold text-text-primary">{col}</span>
                  <span className="rounded-sm bg-surface-2 px-1.5 py-0.5 text-[10px] text-text-secondary">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.length === 0 ? (
                    <Card className="border-dashed p-4 text-center text-[12px] text-text-secondary">No items</Card>
                  ) : (
                    items.map((wo) => <WorkOrderCard key={wo.id} wo={wo} />)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WorkOrderCard({ wo }: { wo: WorkOrder }) {
  return (
    <Card className="p-3 shadow-e1">
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[11px] text-text-secondary">{wo.id}</span>
        <StatusBadge tone={priorityTone(wo.priority)}>{wo.priority}</StatusBadge>
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-text-primary">
        <Wrench className="h-3.5 w-3.5 text-text-secondary" />
        Room {wo.room}
      </div>
      <p className="mt-1 text-[12px] text-text-primary">{wo.title}</p>
      <p className="mt-1 text-[11px] text-text-secondary">{wo.category} · {wo.createdAt}</p>
      <div className={cn("mt-2 border-t border-border-subtle pt-2 text-[11px]", wo.assignee === "—" ? "text-[var(--color-warning)]" : "text-text-secondary")}>
        {wo.assignee === "—" ? "Unassigned" : `Assigned: ${wo.assignee}`}
      </div>
    </Card>
  );
}

export default MaintenanceFeature;
