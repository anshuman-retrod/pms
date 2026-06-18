import {
  PageHeader,
  Card,
  CardHeader,
  Button,
  StatusBadge,
  KpiCard,
} from "@/components/ui/Primitives";
import { Plus } from "lucide-react";
import { crmLeads } from "@/features/core/data/catalog";

const toneByStage: Record<string, "info" | "warning" | "success" | "neutral"> = {
  New: "info",
  Qualified: "success",
  Proposal: "warning",
  Negotiation: "warning",
};

export function LeadsFeature() {
  return (
    <div>
      <PageHeader
        eyebrow="CRM"
        title="Leads"
        description="Track upcoming opportunities from inquiry to conversion."
        actions={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            Add lead
          </Button>
        }
      />

      <div className="responsive-page-x space-y-5 py-4 sm:space-y-6 sm:py-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiCard label="Open leads" value="24" accent="brand" />
          <KpiCard label="Qualified" value="11" accent="success" />
          <KpiCard label="Proposal sent" value="7" accent="info" />
          <KpiCard label="Won (MTD)" value="5" accent="warning" />
        </div>

        <Card>
          <CardHeader title="Lead pipeline queue" hint="Sales conversion workflow" />
          <div className="table-scroll-shadow overflow-x-auto">
            <table className="w-full min-w-[820px] text-[13px]">
              <thead>
                <tr className="border-b border-border bg-surface-2/40 text-left">
                  {["Lead ID", "Account", "Source", "Stage", "Owner", "Follow-up"].map((h) => (
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
                {crmLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-border-subtle hover:bg-surface-2/40">
                    <td className="px-4 py-3 font-mono text-[12px]">{lead.id}</td>
                    <td className="px-4 py-3 font-medium text-text-primary">{lead.name}</td>
                    <td className="px-4 py-3 text-text-secondary">{lead.source}</td>
                    <td className="px-4 py-3">
                      <StatusBadge tone={toneByStage[lead.stage] ?? "neutral"}>
                        {lead.stage}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{lead.owner}</td>
                    <td className="px-4 py-3 text-text-secondary">{lead.eta}</td>
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

export default LeadsFeature;
