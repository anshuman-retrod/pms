import { PageHeader, Card, CardHeader, KpiCard, StatusBadge } from "@/components/ui/Primitives";

const txns = [
  { id: "TXN-90412", guest: "Priya Sharma", method: "Visa **4421", amount: 51920, status: "Captured", time: "Today · 12:42" },
  { id: "TXN-90411", guest: "John Mathews", method: "Mastercard **8810", amount: 36000, status: "Captured", time: "Today · 09:18" },
  { id: "TXN-90410", guest: "H. Tanaka", method: "Amex **3322", amount: 14400, status: "Pending", time: "Today · 08:55" },
  { id: "TXN-90409", guest: "Marcus Weber", method: "Cash · INR", amount: 9800, status: "Captured", time: "Yesterday · 22:14" },
  { id: "TXN-90408", guest: "A. Khan", method: "Visa **2210", amount: 22000, status: "Refunded", time: "Yesterday · 14:02" },
  { id: "TXN-90407", guest: "E. Rodriguez", method: "Bank transfer", amount: 105000, status: "Captured", time: "14 May · 11:32" },
];

const tone = (s: string) =>
  ({ Captured: "success", Pending: "warning", Refunded: "error", Failed: "error" }[s] as any) || "neutral";

export function PaymentsFeature() {
  return (
    <div>
      <PageHeader eyebrow="Commercial" title="Payments" description="Every transaction across the property in one ledger." />

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <KpiCard label="Captured · Today" value="₹4,82,000" delta="↑ 8.2% vs avg" accent="success" />
          <KpiCard label="Pending" value="₹62,400" accent="warning" />
          <KpiCard label="Refunded · MTD" value="₹84,200" accent="error" />
          <KpiCard label="Avg Ticket" value="₹26,140" accent="brand" />
        </div>

        <Card>
          <CardHeader title="Transactions" hint="Most recent first" />
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-surface-2/40 text-left">
                {["Transaction", "Guest", "Method", "Amount", "Status", "When"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {txns.map((t) => (
                <tr key={t.id} className="border-b border-border-subtle hover:bg-surface-2/50">
                  <td className="px-4 py-3 font-mono text-[12px] text-text-primary">{t.id}</td>
                  <td className="px-4 py-3 font-medium text-text-primary">{t.guest}</td>
                  <td className="px-4 py-3 text-text-secondary">{t.method}</td>
                  <td className="px-4 py-3 font-mono text-text-primary">₹{t.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={tone(t.status)}>{t.status}</StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{t.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
export default PaymentsFeature;
