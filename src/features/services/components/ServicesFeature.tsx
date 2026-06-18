import {
  PageHeader,
  Card,
  CardHeader,
  Button,
  StatusBadge,
  KpiCard,
} from "@/components/ui/Primitives";
import { Plus } from "lucide-react";
import { serviceCatalog } from "@/features/core/data/catalog";

const statusTone: Record<string, "success" | "warning" | "neutral"> = {
  Active: "success",
  Seasonal: "warning",
  Draft: "neutral",
};

export function ServicesFeature() {
  return (
    <div>
      <PageHeader
        eyebrow="Commercial"
        title="Services"
        description="Unified service catalog for add-ons, concierge, and transport offerings."
        actions={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            New service
          </Button>
        }
      />

      <div className="responsive-page-x space-y-5 py-4 sm:space-y-6 sm:py-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiCard label="Catalog items" value="37" accent="brand" />
          <KpiCard label="Active" value="29" accent="success" />
          <KpiCard label="Seasonal" value="5" accent="warning" />
          <KpiCard label="Draft" value="3" accent="info" />
        </div>

        <Card>
          <CardHeader title="Service catalog" hint="Cross-domain monetization controls" />
          <div className="table-scroll-shadow overflow-x-auto">
            <table className="w-full min-w-[760px] text-[13px]">
              <thead>
                <tr className="border-b border-border bg-surface-2/40 text-left">
                  {["Service ID", "Category", "Service", "Price", "Status"].map((h) => (
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
                {serviceCatalog.map((service) => (
                  <tr
                    key={service.id}
                    className="border-b border-border-subtle hover:bg-surface-2/40"
                  >
                    <td className="px-4 py-3 font-mono text-[12px]">{service.id}</td>
                    <td className="px-4 py-3 text-text-secondary">{service.category}</td>
                    <td className="px-4 py-3 font-medium text-text-primary">{service.name}</td>
                    <td className="px-4 py-3 font-mono text-text-secondary">{service.price}</td>
                    <td className="px-4 py-3">
                      <StatusBadge tone={statusTone[service.status] ?? "neutral"}>
                        {service.status}
                      </StatusBadge>
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

export default ServicesFeature;
