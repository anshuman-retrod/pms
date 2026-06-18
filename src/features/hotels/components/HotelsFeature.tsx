import {
  PageHeader,
  Card,
  CardHeader,
  Button,
  StatusBadge,
  KpiCard,
} from "@/components/ui/Primitives";
import { Plus } from "lucide-react";
import { hotelRegistry } from "@/features/core/data/catalog";

const statusTone: Record<string, "success" | "info" | "warning"> = {
  Live: "success",
  Onboarding: "info",
  Pilot: "warning",
};

export function HotelsFeature() {
  return (
    <div>
      <PageHeader
        eyebrow="Portfolio"
        title="Hotels"
        description="Manage multi-property portfolio setup and rollout health."
        actions={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            Add hotel
          </Button>
        }
      />

      <div className="responsive-page-x space-y-5 py-4 sm:space-y-6 sm:py-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiCard label="Properties" value="4" accent="brand" />
          <KpiCard label="Live" value="2" accent="success" />
          <KpiCard label="Onboarding" value="1" accent="info" />
          <KpiCard label="Total rooms" value="552" accent="warning" />
        </div>

        <Card>
          <CardHeader title="Property registry" hint="Portfolio-level visibility" />
          <div className="table-scroll-shadow overflow-x-auto">
            <table className="w-full min-w-[780px] text-[13px]">
              <thead>
                <tr className="border-b border-border bg-surface-2/40 text-left">
                  {["Hotel ID", "Hotel", "City", "Tier", "Status", "Rooms"].map((h) => (
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
                {hotelRegistry.map((hotel) => (
                  <tr
                    key={hotel.id}
                    className="border-b border-border-subtle hover:bg-surface-2/40"
                  >
                    <td className="px-4 py-3 font-mono text-[12px]">{hotel.id}</td>
                    <td className="px-4 py-3 font-medium text-text-primary">{hotel.name}</td>
                    <td className="px-4 py-3 text-text-secondary">{hotel.city}</td>
                    <td className="px-4 py-3 text-text-secondary">{hotel.tier}</td>
                    <td className="px-4 py-3">
                      <StatusBadge tone={statusTone[hotel.status] ?? "info"}>
                        {hotel.status}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-3 font-mono text-text-secondary">{hotel.rooms}</td>
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

export default HotelsFeature;
