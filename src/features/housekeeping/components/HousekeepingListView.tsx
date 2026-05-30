import { Card, CardHeader, StatusBadge } from "@/components/ui/Primitives";
import { type HousekeepingRoom } from "@/types/pms";

export function HousekeepingListView({
  rooms,
  tone,
}: {
  rooms: HousekeepingRoom[];
  tone: (s: string) => "success" | "warning" | "error" | "info" | "neutral" | "brand" | "dark";
}) {
  return (
    <Card>
      <CardHeader title="Room list" hint={`${rooms.length} rooms`} />
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-surface-2/40 text-left">
              {["Room", "Type", "Status", "Assigned", ""].map((h) => (
                <th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rooms.map((r) => (
              <tr key={r.num} className="border-b border-border-subtle hover:bg-surface-2/50">
                <td className="px-4 py-3 font-mono font-semibold text-text-primary">{r.num}</td>
                <td className="px-4 py-3 text-text-secondary">{r.type}</td>
                <td className="px-4 py-3">
                  <StatusBadge tone={tone(r.status)}>{r.status}</StatusBadge>
                </td>
                <td className="px-4 py-3 text-text-primary">{r.staff}</td>
                <td className="px-4 py-3 text-right">
                  <button type="button" className="text-[12px] font-medium text-primary hover:underline">
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
