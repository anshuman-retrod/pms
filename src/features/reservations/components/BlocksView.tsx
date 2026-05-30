import { Card, CardHeader, StatusBadge } from "@/components/ui/Primitives";
import { type GroupBlock } from "@/types/pms";

export function BlocksView({ blocks }: { blocks: GroupBlock[] }) {
  return (
    <Card>
      <CardHeader title="Group blocks & allotments" hint={`${blocks.length} active blocks`} />
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-surface-2/40 text-left">
              {["Block", "Group", "Dates", "Blocked", "Pickup", "Cut-off", "Status", ""].map((h) => (
                <th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {blocks.map((b) => {
              const pickupPct = Math.round((b.pickedUp / b.blocked) * 100);
              return (
                <tr key={b.id} className="border-b border-border-subtle hover:bg-surface-2/50">
                  <td className="px-4 py-3 font-mono text-[12px]">{b.id}</td>
                  <td className="px-4 py-3 font-medium text-text-primary">{b.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{b.dates}</td>
                  <td className="px-4 py-3 font-mono">{b.blocked}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-text-primary">{b.pickedUp}</span>
                    <span className="ml-1 text-[11px] text-text-secondary">({pickupPct}%)</span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{b.cutOff}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      tone={b.status === "Open" ? "info" : b.status === "Closed" ? "success" : "neutral"}
                    >
                      {b.status}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" className="text-[12px] font-medium text-primary hover:underline">
                      Manage
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
