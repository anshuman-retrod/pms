import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader, KpiCard, Button, Card, CardHeader, StatusBadge } from "@/components/ui/Primitives";
import { corporateAccounts } from "@/services/mock/db";
import { type CorporateAccount } from "@/types/pms";

export function CorporateFeature() {
  const [selected, setSelected] = useState<CorporateAccount>(corporateAccounts[0]);
  const revenueMtd = corporateAccounts.reduce((a, c) => a + c.revenueMtd, 0);
  const nightsMtd = corporateAccounts.reduce((a, c) => a + c.roomNightsMtd, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Commercial"
        title="Corporate Accounts"
        description="Negotiated rates, direct billing, and B2B reservation management."
        actions={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            New account
          </Button>
        }
      />

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="Active accounts" value={String(corporateAccounts.length)} accent="brand" />
          <KpiCard label="Room nights · MTD" value={String(nightsMtd)} accent="info" />
          <KpiCard label="Revenue · MTD" value={`₹${(revenueMtd / 100000).toFixed(1)}L`} accent="success" />
          <KpiCard label="Open invoices" value="3" accent="warning" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
          <Card>
            <CardHeader title="Corporate accounts" />
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border bg-surface-2/40 text-left">
                  {["Account", "Company", "Rate code", "Nights", "Revenue", "Invoices"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {corporateAccounts.map((a) => (
                  <tr
                    key={a.id}
                    onClick={() => setSelected(a)}
                    className={`cursor-pointer border-b border-border-subtle hover:bg-surface-2/50 ${
                      selected.id === a.id ? "bg-primary-tint/30" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-[12px]">{a.id}</td>
                    <td className="px-4 py-3 font-medium text-text-primary">{a.company}</td>
                    <td className="px-4 py-3 font-mono text-text-secondary">{a.rateCode}</td>
                    <td className="px-4 py-3 font-mono">{a.roomNightsMtd}</td>
                    <td className="px-4 py-3 font-mono">₹{(a.revenueMtd / 1000).toFixed(0)}k</td>
                    <td className="px-4 py-3">
                      {a.openInvoices > 0 ? (
                        <StatusBadge tone="warning">{a.openInvoices} open</StatusBadge>
                      ) : (
                        <StatusBadge tone="success">Clear</StatusBadge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card>
            <CardHeader title={selected.company} hint={selected.rateCode} />
            <div className="space-y-4 p-5 text-[13px]">
              <div>
                <div className="label-uppercase">Primary contact</div>
                <div className="mt-1 font-medium text-text-primary">{selected.contact}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Room nights" value={String(selected.roomNightsMtd)} />
                <Stat label="Revenue MTD" value={`₹${selected.revenueMtd.toLocaleString()}`} />
              </div>
              <Button className="w-full justify-center">New corporate reservation</Button>
              <Button variant="outline" className="w-full justify-center">
                Generate statement
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border-subtle bg-surface-2/40 p-2.5">
      <div className="label-uppercase text-[9px]">{label}</div>
      <div className="mt-0.5 font-semibold text-text-primary">{value}</div>
    </div>
  );
}
export default CorporateFeature;
