import { PageHeader, Card, CardHeader, KpiCard, StatusBadge } from "@/components/ui/Primitives";

const stock = [
  { sku: "INV-001", name: "Basmati Rice (25kg)", onHand: 4, par: 6, status: "Low" },
  { sku: "INV-014", name: "Butter (500g)", onHand: 18, par: 12, status: "OK" },
  { sku: "INV-022", name: "Fresh cream", onHand: 2, par: 8, status: "Critical" },
];

export function PosInventoryFeature() {
  return (
    <div>
      <PageHeader
        eyebrow="Inventory"
        title="Stock & consumables"
        description="Par levels, depletion, and vendor reorder triggers."
      />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <KpiCard label="SKUs tracked" value="148" accent="brand" />
          <KpiCard label="Below par" value="9" accent="warning" />
          <KpiCard label="Auto PRs · week" value="3" accent="info" />
        </div>
        <Card>
          <CardHeader title="Kitchen store" hint="Main restaurant" />
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-surface-2/40 text-left">
                {["SKU", "Item", "On hand", "Par", "Status"].map((h) => (
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
              {stock.map((s) => (
                <tr key={s.sku} className="border-b border-border-subtle hover:bg-surface-2/40">
                  <td className="px-4 py-3 font-mono text-[12px]">{s.sku}</td>
                  <td className="px-4 py-3">{s.name}</td>
                  <td className="px-4 py-3 font-mono">{s.onHand}</td>
                  <td className="px-4 py-3 font-mono text-text-secondary">{s.par}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      tone={
                        s.status === "OK" ? "success" : s.status === "Low" ? "warning" : "error"
                      }
                    >
                      {s.status}
                    </StatusBadge>
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
