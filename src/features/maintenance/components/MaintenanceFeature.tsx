import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Filter, Plus, Wrench } from "lucide-react";
import { PageHeader, KpiCard, Button, Card, StatusBadge } from "@/components/ui/Primitives";
import { useWorkOrdersQuery, useSaveWorkOrderMutation, useUpdateWorkOrderStatusMutation } from "@/services/mock/queries";
import { type WorkOrder, type WorkOrderStatus } from "@/types/pms";
import { cn } from "@/lib/utils";

const columns: WorkOrderStatus[] = ["Reported", "In Progress", "Waiting Parts", "Resolved"];

const priorityTone = (p: WorkOrder["priority"]) =>
  (({ Critical: "error", High: "warning", Normal: "neutral" }) as const)[p];

export function MaintenanceFeature() {
  const { data: workOrders = [] } = useWorkOrdersQuery();
  const saveMutation = useSaveWorkOrderMutation();

  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  
  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newWoRoom, setNewWoRoom] = useState("");
  const [newWoCategory, setNewWoCategory] = useState("HVAC");
  const [newWoTitle, setNewWoTitle] = useState("");
  const [newWoAssignee, setNewWoAssignee] = useState("—");
  const [newWoPriority, setNewWoPriority] = useState<"Normal" | "High" | "Critical">("Normal");

  const handleCreate = () => {
    if (!newWoRoom || !newWoTitle) {
      toast.error("Please fill in room and title.");
      return;
    }
    const newWo: WorkOrder = {
      id: `WO-${Math.floor(Math.random() * 1000) + 2000}`,
      room: newWoRoom,
      category: newWoCategory,
      title: newWoTitle,
      priority: newWoPriority,
      status: "Reported",
      assignee: newWoAssignee,
      createdAt: "Just now",
    };
    saveMutation.mutate(newWo);
    toast.success("Work order created successfully.");
    setIsCreateOpen(false);
    setNewWoRoom("");
    setNewWoTitle("");
    setNewWoCategory("HVAC");
    setNewWoAssignee("—");
    setNewWoPriority("Normal");
  };

  const filtered = useMemo(
    () =>
      priorityFilter === "All"
        ? workOrders
        : workOrders.filter((w) => w.priority === priorityFilter),
    [priorityFilter],
  );

  const open = workOrders.filter((w) => w.status !== "Resolved").length;
  const critical = workOrders.filter(
    (w) => w.priority === "Critical" && w.status !== "Resolved",
  ).length;
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
            <Button size="sm" onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
              Create work order
            </Button>
          </>
        }
      />

      <div className="responsive-page-x space-y-5 py-4 sm:space-y-6 sm:py-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <KpiCard
            label="Open work orders"
            value={String(open)}
            delta={critical ? `${critical} critical` : undefined}
            deltaTone="error"
            accent="warning"
          />
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {columns.map((col) => {
            const items = filtered.filter((w) => w.status === col);
            return (
              <div key={col}>
                <div className="mb-2 flex items-center justify-between px-1">
                  <span className="text-[12px] font-semibold text-text-primary">{col}</span>
                  <span className="rounded-sm bg-surface-2 px-1.5 py-0.5 text-[10px] text-text-secondary">
                    {items.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {items.length === 0 ? (
                    <Card className="border-dashed p-4 text-center text-[12px] text-text-secondary">
                      No items
                    </Card>
                  ) : (
                    items.map((wo) => <WorkOrderCard key={wo.id} wo={wo} />)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isCreateOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity" 
            onClick={() => setIsCreateOpen(false)} 
          />
          <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-hidden border-l border-border bg-surface shadow-e3 animate-in slide-in-from-right duration-200">
            <div className="shrink-0 border-b border-border-subtle px-5 py-4">
              <div className="text-[16px] font-semibold text-text-primary">Create work order</div>
              <div className="text-[12px] text-text-secondary">
                Report a maintenance issue or request repairs.
              </div>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              <label className="block">
                <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-text-secondary">
                  Room / Location *
                </div>
                <input
                  type="text"
                  placeholder="e.g. 101 or Lobby"
                  className="h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px]"
                  value={newWoRoom}
                  onChange={(e) => setNewWoRoom(e.target.value)}
                />
              </label>
              
              <label className="block">
                <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-text-secondary">
                  Category
                </div>
                <select
                  className="h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px]"
                  value={newWoCategory}
                  onChange={(e) => setNewWoCategory(e.target.value)}
                >
                  <option value="HVAC">HVAC</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Furniture">Furniture</option>
                  <option value="General">General</option>
                </select>
              </label>

              <label className="block">
                <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-text-secondary">
                  Title / Description *
                </div>
                <input
                  type="text"
                  placeholder="Brief description of the issue"
                  className="h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px]"
                  value={newWoTitle}
                  onChange={(e) => setNewWoTitle(e.target.value)}
                />
              </label>

              <label className="block">
                <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-text-secondary">
                  Assign To
                </div>
                <select
                  className="h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px]"
                  value={newWoAssignee}
                  onChange={(e) => setNewWoAssignee(e.target.value)}
                >
                  <option value="—">Unassigned</option>
                  <option value="Marcus T.">Marcus T.</option>
                  <option value="Sarah J.">Sarah J.</option>
                  <option value="David L.">David L.</option>
                </select>
              </label>

              <label className="block">
                <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-text-secondary">
                  Priority
                </div>
                <select
                  className="h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px]"
                  value={newWoPriority}
                  onChange={(e) => setNewWoPriority(e.target.value as "Normal" | "High" | "Critical")}
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </label>
            </div>
            <div className="shrink-0 flex justify-end gap-2 border-t border-border-subtle bg-surface-2/50 px-5 py-4">
              <Button variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleCreate}>
                Create order
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function WorkOrderCard({ wo }: { wo: WorkOrder }) {
  const updateStatusMutation = useUpdateWorkOrderStatusMutation();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateStatusMutation.mutate({ id: wo.id, status: e.target.value });
    toast.success("Work order status updated.");
  };

  return (
    <Card className="p-3 shadow-e1">
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[11px] text-text-secondary">{wo.id}</span>
        <div className="flex items-center gap-2">
          <StatusBadge tone={priorityTone(wo.priority)}>{wo.priority}</StatusBadge>
          <select
            value={wo.status}
            onChange={handleStatusChange}
            className="h-6 rounded border border-border-subtle bg-surface-2 px-1 text-[11px] font-medium text-text-primary outline-none"
          >
            {columns.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-text-primary">
        <Wrench className="h-3.5 w-3.5 text-text-secondary" />
        Room {wo.room}
      </div>
      <p className="mt-1 text-[12px] text-text-primary">{wo.title}</p>
      <p className="mt-1 text-[11px] text-text-secondary">
        {wo.category} · {wo.createdAt}
      </p>
      <div
        className={cn(
          "mt-2 border-t border-border-subtle pt-2 text-[11px]",
          wo.assignee === "—" ? "text-[var(--color-warning)]" : "text-text-secondary",
        )}
      >
        {wo.assignee === "—" ? "Unassigned" : `Assigned: ${wo.assignee}`}
      </div>
    </Card>
  );
}

export default MaintenanceFeature;
