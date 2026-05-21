import { Card, CardHeader, StatusBadge } from "@/components/ui/Primitives";
import { type Reservation } from "@/types/pms";

interface TableViewProps {
  filtered: Reservation[];
  sourceColor: Record<string, string>;
  statusTone: (s: string) => "success" | "warning" | "error" | "info" | "neutral" | "brand" | "dark";
}

export function TableView({ filtered, sourceColor, statusTone }: TableViewProps) {
  return (
    <Card>
      <CardHeader title="All reservations" hint={`${filtered.length} records`} />
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-surface-2/40 text-left">
              {["Reservation", "Guest", "Room", "Check-in", "Check-out", "Source", "Amount", "Balance", "Status", ""].map((h) => (
                <th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-border-subtle hover:bg-surface-2/50">
                <td className="px-4 py-3 font-mono text-[12px] text-text-primary">{r.id}</td>
                <td className="px-4 py-3 font-medium text-text-primary">{r.guest}</td>
                <td className="px-4 py-3 text-text-secondary">
                  {r.room} · <span className="text-text-disabled">{r.type}</span>
                </td>
                <td className="px-4 py-3 text-text-secondary">{r.ci}</td>
                <td className="px-4 py-3 text-text-secondary">{r.co}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-text-secondary">
                    <span
                      className="h-2 w-2 rounded-sm"
                      style={{ background: sourceColor[r.source] || "var(--color-text-disabled)" }}
                    />
                    {r.source}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-text-primary">₹{r.amount.toLocaleString()}</td>
                <td className="px-4 py-3 font-mono">
                  {r.balance ? (
                    <span className="text-[var(--color-error)]">₹{r.balance.toLocaleString()}</span>
                  ) : (
                    <span className="text-text-disabled">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge tone={statusTone(r.status)}>{r.status}</StatusBadge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button className="text-[11px] text-primary hover:underline">Modify</button>
                    <span className="text-text-disabled">·</span>
                    <button className="text-[11px] text-[var(--color-error)] hover:underline">Cancel</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
export default TableView;
