import { PageHeader, Card, CardHeader, KpiCard, StatusBadge } from "@/components/ui/Primitives";

const bills = [
  {
    id: "POS-INV-2201",
    table: "T-12",
    amount: 4860,
    method: "Room charge · 312",
    status: "Settled",
  },
  { id: "POS-INV-2200", table: "T-08", amount: 1640, method: "UPI", status: "Pending" },
  { id: "POS-INV-2199", table: "Walk-in", amount: 2200, method: "Cash", status: "Settled" },
];

export function PosBillingFeature() {
  return (
    <div>
      <PageHeader
        eyebrow="Outlet Billing"
        title="Checks & settlements"
        description="Split bills, room posting, and tender reconciliation."
      />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <KpiCard label="Open checks" value="4" accent="warning" />
          <KpiCard label="Settled · today" value="₹1.6L" accent="success" />
          <KpiCard label="Room charges" value="12" accent="info" />
        </div>
        <Card>
          <CardHeader title="Recent settlements" />
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-surface-2/40 text-left">
                {["Bill", "Table", "Amount", "Tender", "Status"].map((h) => (
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
              {bills.map((b) => (
                <tr key={b.id} className="border-b border-border-subtle hover:bg-surface-2/40">
                  <td className="px-4 py-3 font-mono text-[12px]">{b.id}</td>
                  <td className="px-4 py-3">{b.table}</td>
                  <td className="px-4 py-3 font-mono">₹{b.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-text-secondary">{b.method}</td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={b.status === "Settled" ? "success" : "warning"}>
                      {b.status}
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
