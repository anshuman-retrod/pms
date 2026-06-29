import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Filter } from "lucide-react";
import {
  PageHeader,
  KpiCard,
  Button,
  Card,
  CardHeader,
  StatusBadge,
} from "@/components/ui/Primitives";
import { useGroupBlocksQuery } from "@/services/mock/queries";
import { type GroupBlock } from "@/types/pms";
import { GroupDetail } from "./GroupDetail";

export function GroupsFeature() {
  const { data: groupBlocks = [] } = useGroupBlocksQuery();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (selectedId) {
    const selected = groupBlocks.find((b) => b.id === selectedId);
    if (selected) {
      return <GroupDetail group={selected} onBack={() => setSelectedId(null)} />;
    }
  }

  const active = groupBlocks.filter((b) => ["Definite", "Actualized", "Tentative", "Open"].includes(b.status)).length;
  const totalBlocked = groupBlocks.reduce((a, b) => a + b.blocked, 0);
  const totalPicked = groupBlocks.reduce((a, b) => a + b.pickedUp, 0);
  const pickupPct = totalBlocked > 0 ? Math.round((totalPicked / totalBlocked) * 100) : 0;

  return (
    <div>
      <PageHeader
        eyebrow="Commercial"
        title="Group Bookings"
        description="Blocks, rooming lists, cut-offs, and master billing."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="h-3.5 w-3.5 mr-1.5" />
              Filter
            </Button>
            <Link to="/reservations/new">
              <Button size="sm">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                New group block
              </Button>
            </Link>
          </>
        }
      />

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="Active groups" value={String(active)} accent="brand" />
          <KpiCard label="Rooms blocked" value={String(totalBlocked)} accent="info" />
          <KpiCard label="Pickup %" value={`${pickupPct}%`} accent="success" />
          <KpiCard label="Cut-offs this week" value="2" accent="warning" />
        </div>

        <Card>
          <CardHeader title="Group blocks" hint={`${groupBlocks.length} blocks`} />
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border bg-surface-2/40 text-left">
                  {["Block", "Group", "Dates", "Cut-off", "Manager", "Pickup", "Status"].map((h) => (
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
                {groupBlocks.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => setSelectedId(b.id)}
                    className="cursor-pointer border-b border-border-subtle hover:bg-surface-2/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-[12px]">
                      <span className="hover:text-primary hover:underline">{b.id}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-text-primary">
                      {b.name}
                      {b.groupCode && <span className="block text-[11px] text-text-secondary font-normal mt-0.5">{b.groupCode}</span>}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{b.dates}</td>
                    <td className="px-4 py-3 text-text-secondary">
                      <span className={b.cutOffType === "FixedDate" ? "text-[var(--color-error)]" : ""}>
                        {b.cutOff}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{b.salesManager || "—"}</td>
                    <td className="px-4 py-3 font-mono">
                      <span className="text-text-primary">{b.pickedUp}</span>
                      <span className="text-text-disabled"> / {b.blocked}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge 
                        tone={b.status === "Definite" || b.status === "Actualized" ? "success" : b.status === "Tentative" ? "warning" : "info"}
                      >
                        {b.status}
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

export default GroupsFeature;
