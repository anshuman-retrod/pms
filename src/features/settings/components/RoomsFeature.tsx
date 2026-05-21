import { Plus } from "lucide-react";
import { PageHeader, Card, CardHeader, KpiCard, StatusBadge, Button } from "@/components/ui/Primitives";

const types = [
  { name: "Heritage Suite", count: 6, base: 35000, occ: 92 },
  { name: "Premier Suite", count: 14, base: 22000, occ: 84 },
  { name: "Executive", count: 24, base: 14400, occ: 78 },
  { name: "Deluxe King", count: 38, base: 12000, occ: 71 },
  { name: "Deluxe Twin", count: 38, base: 9800, occ: 64 },
];

export function RoomsFeature() {
  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Rooms & Inventory"
        description="Room type configuration, base rates, and live availability."
        actions={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            Add room type
          </Button>
        }
      />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <KpiCard label="Total Rooms" value="120" accent="info" />
          <KpiCard label="Room Types" value="5" accent="brand" />
          <KpiCard label="Avg Occupancy" value="78.4%" accent="success" />
          <KpiCard label="OOO" value="6" accent="warning" />
        </div>

        <Card>
          <CardHeader title="Room types" />
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-surface-2/40 text-left">
                {["Type", "Inventory", "Base rate", "Occupancy · MTD", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {types.map((t) => (
                <tr key={t.name} className="border-b border-border-subtle hover:bg-surface-2/50">
                  <td className="px-4 py-3 font-medium text-text-primary">{t.name}</td>
                  <td className="px-4 py-3 font-mono text-text-primary">{t.count} rooms</td>
                  <td className="px-4 py-3 font-mono text-text-primary">₹{t.base.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-32 overflow-hidden rounded-full bg-surface-2">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${t.occ}%` }} />
                      </div>
                      <span className="font-mono text-[12px] text-text-secondary">{t.occ}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge tone="success">Selling</StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a className="text-[12px] font-medium text-primary hover:underline cursor-pointer">Configure</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
export default RoomsFeature;
