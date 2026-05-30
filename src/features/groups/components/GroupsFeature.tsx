import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Filter } from "lucide-react";
import { PageHeader, KpiCard, Button, Card, CardHeader, StatusBadge } from "@/components/ui/Primitives";
import { groupBlocks } from "@/services/mock/db";
import { type GroupBlock } from "@/types/pms";

export function GroupsFeature() {
  const [selected, setSelected] = useState<GroupBlock>(groupBlocks[0]);
  const active = groupBlocks.filter((b) => b.status === "Open").length;
  const totalBlocked = groupBlocks.reduce((a, b) => a + b.blocked, 0);
  const totalPicked = groupBlocks.reduce((a, b) => a + b.pickedUp, 0);
  const pickupPct = Math.round((totalPicked / totalBlocked) * 100);

  return (
    <div>
      <PageHeader
        eyebrow="Commercial"
        title="Group Bookings"
        description="Blocks, rooming lists, cut-offs, and master billing."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </Button>
            <Link to="/reservations/new">
              <Button size="sm">
                <Plus className="h-3.5 w-3.5" />
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <Card>
            <CardHeader title="Group blocks" hint={`${groupBlocks.length} blocks`} />
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border bg-surface-2/40 text-left">
                  {["Block", "Group", "Dates", "Pickup", "Cut-off", "Status"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groupBlocks.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => setSelected(b)}
                    className={`cursor-pointer border-b border-border-subtle hover:bg-surface-2/50 ${
                      selected.id === b.id ? "bg-primary-tint/30" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-[12px]">{b.id}</td>
                    <td className="px-4 py-3 font-medium text-text-primary">{b.name}</td>
                    <td className="px-4 py-3 text-text-secondary">{b.dates}</td>
                    <td className="px-4 py-3 font-mono">
                      {b.pickedUp}/{b.blocked}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{b.cutOff}</td>
                    <td className="px-4 py-3">
                      <StatusBadge tone={b.status === "Open" ? "info" : "success"}>{b.status}</StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card>
            <CardHeader title={selected.name} hint={selected.id} />
            <div className="space-y-4 p-5 text-[13px]">
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Blocked" value={String(selected.blocked)} />
                <Stat label="Picked up" value={String(selected.pickedUp)} />
                <Stat label="Cut-off" value={selected.cutOff} />
                <Stat label="Status" value={selected.status} />
              </div>
              <div>
                <div className="label-uppercase mb-2">Rooming list</div>
                <p className="text-[12px] text-text-secondary">18 of {selected.blocked} rooms assigned · 4 pending names</p>
                <Button variant="outline" size="sm" className="mt-2 w-full justify-center">
                  Import CSV
                </Button>
              </div>
              <Button className="w-full justify-center">Manage block</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border-subtle bg-surface-2/40 p-2.5">
      <div className="label-uppercase text-[9px]">{label}</div>
      <div className="mt-0.5 font-semibold text-text-primary">{value}</div>
    </div>
  );
}
export default GroupsFeature;
