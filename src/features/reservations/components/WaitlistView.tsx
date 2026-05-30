import { Card, CardHeader, StatusBadge, Button } from "@/components/ui/Primitives";
import { type WaitlistEntry } from "@/types/pms";

export function WaitlistView({ entries }: { entries: WaitlistEntry[] }) {
  if (entries.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-[14px] font-medium text-text-primary">No waitlist entries</p>
        <p className="mt-1 max-w-sm text-[13px] text-text-secondary">
          Guests waiting for availability will appear here.
        </p>
        <Button size="sm" className="mt-4">
          Add to waitlist
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Waitlist" hint={`${entries.length} guests waiting`} />
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-surface-2/40 text-left">
              {["ID", "Guest", "Dates", "Room type", "Priority", "Requested", ""].map((h) => (
                <th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-b border-border-subtle hover:bg-surface-2/50">
                <td className="px-4 py-3 font-mono text-[12px]">{e.id}</td>
                <td className="px-4 py-3 font-medium text-text-primary">{e.guest}</td>
                <td className="px-4 py-3 text-text-secondary">{e.dates}</td>
                <td className="px-4 py-3 text-text-secondary">{e.roomType}</td>
                <td className="px-4 py-3">
                  <StatusBadge tone={e.priority === "High" ? "warning" : "neutral"}>{e.priority}</StatusBadge>
                </td>
                <td className="px-4 py-3 text-text-secondary">{e.requestedAt}</td>
                <td className="px-4 py-3 text-right">
                  <button type="button" className="text-[12px] font-medium text-primary hover:underline">
                    Convert
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
