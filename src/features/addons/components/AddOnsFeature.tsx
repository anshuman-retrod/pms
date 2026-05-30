import { Plus } from "lucide-react";
import { PageHeader, KpiCard, Button, Card, CardHeader } from "@/components/ui/Primitives";
import { addOnProducts } from "@/services/mock/db";

export function AddOnsFeature() {
  return (
    <div>
      <PageHeader eyebrow="Commercial" title="Add-On Services" description="Sellable extras posted to guest folios." actions={<Button size="sm"><Plus className="h-3.5 w-3.5" />Add product</Button>} />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="Attach rate" value="26%" accent="brand" />
          <KpiCard label="Revenue · MTD" value="₹8.4L" accent="success" />
          <KpiCard label="Top SKU" value="Breakfast" accent="info" />
          <KpiCard label="Pending fulfillment" value="5" accent="warning" />
        </div>
        <Card>
          <CardHeader title="Product catalog" />
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-border bg-surface-2/40 text-left">{["Product","Category","Price","Department","Attach rate"].map(h=><th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">{h}</th>)}</tr></thead>
            <tbody>
              {addOnProducts.map((p) => (
                <tr key={p.id} className="border-b border-border-subtle hover:bg-surface-2/50">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{p.category}</td>
                  <td className="px-4 py-3 font-mono">₹{p.price.toLocaleString()}</td>
                  <td className="px-4 py-3">{p.department}</td>
                  <td className="px-4 py-3 font-mono text-[var(--color-success)]">{p.attachRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
export default AddOnsFeature;
