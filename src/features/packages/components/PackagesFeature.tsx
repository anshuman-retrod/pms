import { Plus } from "lucide-react";
import { PageHeader, KpiCard, Button, Card, CardHeader, StatusBadge } from "@/components/ui/Primitives";
import { packageProducts } from "@/services/mock/db";

export function PackagesFeature() {
  const revenue = packageProducts.reduce((a, p) => a + p.price * p.bookingsMtd, 0);

  return (
    <div>
      <PageHeader eyebrow="Commercial" title="Package Management" description="Bundled rates across room, F&B, and experiences." actions={<Button size="sm"><Plus className="h-3.5 w-3.5" />Create package</Button>} />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="Active packages" value={String(packageProducts.filter((p) => p.status === "Active").length)} accent="brand" />
          <KpiCard label="Bookings · MTD" value="25" accent="info" />
          <KpiCard label="Package revenue" value={`₹${(revenue / 100000).toFixed(1)}L`} accent="success" />
          <KpiCard label="Avg uplift vs BAR" value="+14%" accent="success" />
        </div>
        <Card>
          <CardHeader title="Package catalog" />
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-border bg-surface-2/40 text-left">{["Package","Price","Inclusions","Bookings","Status",""].map(h=><th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">{h}</th>)}</tr></thead>
            <tbody>
              {packageProducts.map((p) => (
                <tr key={p.id} className="border-b border-border-subtle hover:bg-surface-2/50">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 font-mono">₹{p.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-text-secondary">{p.inclusions}</td>
                  <td className="px-4 py-3 font-mono">{p.bookingsMtd}</td>
                  <td className="px-4 py-3"><StatusBadge tone={p.status === "Active" ? "success" : "neutral"}>{p.status}</StatusBadge></td>
                  <td className="px-4 py-3 text-right"><button type="button" className="text-[12px] font-medium text-primary">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
export default PackagesFeature;
