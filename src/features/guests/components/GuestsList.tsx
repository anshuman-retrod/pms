import { Search } from "lucide-react";
import { Card, CardHeader, StatusBadge } from "@/components/ui/Primitives";
import { type Guest } from "@/types/pms";

interface GuestsListProps {
  guests: Guest[];
  onSelectGuest: (g: Guest) => void;
}

export function GuestsList({ guests, onSelectGuest }: GuestsListProps) {
  return (
    <Card>
      <CardHeader
        title="All guests"
        hint="3,142 profiles"
        action={
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-disabled" />
            <input
              className="h-8 w-full rounded-md border border-border pl-8 pr-2 text-[12px] focus:border-primary focus:outline-none"
              placeholder="Search…"
            />
          </div>
        }
      />
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-surface-2/40 text-left">
              {["Guest", "Country", "Visits", "Lifetime Value", "Tier", ""].map((h) => (
                <th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {guests.map((g) => (
              <tr key={g.name} className="border-b border-border-subtle hover:bg-surface-2/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
                      {g.name
                        .split(" ")
                        .map((s) => s[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <span className="font-medium text-text-primary">{g.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary">{g.country}</td>
                <td className="px-4 py-3 font-mono text-text-primary">{g.visits}</td>
                <td className="px-4 py-3 font-mono text-text-primary">₹{g.ltv.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <StatusBadge tone={g.tier === "Platinum" ? "brand" : g.tier === "Gold" ? "warning" : "neutral"}>
                    {g.tier}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onSelectGuest(g)}
                    className="text-[12px] font-medium text-primary hover:underline"
                  >
                    View
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
export default GuestsList;
