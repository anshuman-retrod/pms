import { useState } from "react";
import { Plus } from "lucide-react";
import {
  PageHeader,
  KpiCard,
  Button,
  Card,
  CardHeader,
  StatusBadge,
} from "@/components/ui/Primitives";
import { useCorporateAccountsQuery } from "@/services/mock/queries";
import { CorporateDetail } from "./CorporateDetail";

export function CorporateFeature() {
  const { data: corporateAccounts = [] } = useCorporateAccountsQuery();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (selectedId) {
    const selected = corporateAccounts.find((a) => a.id === selectedId);
    if (selected) {
      return <CorporateDetail account={selected} onBack={() => setSelectedId(null)} />;
    }
  }

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
            <Plus className="h-3.5 w-3.5 mr-1" />
            New account
          </Button>
        }
      />

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard
            label="Active accounts"
            value={String(corporateAccounts.length)}
            accent="brand"
          />
          <KpiCard label="Room nights · MTD" value={String(nightsMtd)} accent="info" />
          <KpiCard
            label="Revenue · MTD"
            value={`₹${(revenueMtd / 100000).toFixed(1)}L`}
            accent="success"
          />
          <KpiCard label="Open invoices" value="3" accent="warning" />
        </div>

        <Card>
          <CardHeader title="Corporate accounts directory" hint={`${corporateAccounts.length} accounts`} />
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border bg-surface-2/40 text-left">
                  {["Account", "Company", "Rate code", "Nights (MTD)", "Revenue (MTD)", "Invoices", "Balance"].map((h) => (
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
                {corporateAccounts.map((a) => (
                  <tr
                    key={a.id}
                    onClick={() => setSelectedId(a.id)}
                    className="cursor-pointer border-b border-border-subtle hover:bg-surface-2/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-[12px]">
                      <span className="hover:text-primary hover:underline">{a.id}</span>
                    </td>
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
                    <td className="px-4 py-3 font-mono">
                      {a.currentBalance && a.currentBalance > 0 ? (
                        <span className="text-[var(--color-error)] font-medium">₹{a.currentBalance.toLocaleString()}</span>
                      ) : (
                        <span className="text-text-disabled">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default CorporateFeature;
