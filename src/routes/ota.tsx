import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, CardHeader, KpiCard, StatusBadge, Button } from "@/components/ui-kit/Primitives";
import { otaBreakdown } from "@/lib/mock-data";
import { RefreshCcw } from "lucide-react";

export const Route = createFileRoute("/ota")({
  head: () => ({ meta: [{ title: "OTA & Channels — Retrod PMS" }] }),
  component: OTAPage,
});

const channels = [
  { name: "Booking.com", status: "Connected", live: true, parity: "Aligned", commission: "15%" },
  { name: "Expedia", status: "Connected", live: true, parity: "Aligned", commission: "18%" },
  { name: "Agoda", status: "Connected", live: true, parity: "Drift · -3%", commission: "16%" },
  { name: "Airbnb", status: "Connected", live: false, parity: "Aligned", commission: "13%" },
  { name: "Direct", status: "Native", live: true, parity: "Reference", commission: "0%" },
];

function OTAPage() {
  return (
    <div>
      <PageHeader eyebrow="Commercial" title="OTA & Channel Manager" description="Distribution health across all connected channels." actions={<Button size="sm"><RefreshCcw className="h-3.5 w-3.5" />Sync now</Button>} />

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <KpiCard label="Channel Bookings · MTD" value="352" delta="↑ 24" accent="info" />
          <KpiCard label="Channel Revenue" value="₹46.8 L" accent="brand" />
          <KpiCard label="Avg Commission" value="14.2%" accent="warning" />
          <KpiCard label="Sync Health" value="100%" delta="All channels live" accent="success" />
        </div>

        <Card>
          <CardHeader title="Channel performance" hint="Month to date" />
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-surface-2/40 text-left">
                {["Channel", "Status", "Bookings", "Revenue", "Avg ADR", "Parity", "Commission"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {channels.map((c, i) => {
                const ota = otaBreakdown.find((o) => o.source === c.name);
                return (
                  <tr key={c.name} className="border-b border-border-subtle hover:bg-surface-2/50">
                    <td className="px-4 py-3 font-medium text-text-primary">{c.name}</td>
                    <td className="px-4 py-3"><StatusBadge tone={c.live ? "success" : "neutral"}>{c.live ? "Live" : "Paused"}</StatusBadge></td>
                    <td className="px-4 py-3 font-mono text-text-primary">{ota?.bookings ?? "—"}</td>
                    <td className="px-4 py-3 font-mono text-text-primary">{ota ? `₹${(ota.revenue / 100000).toFixed(1)}L` : "—"}</td>
                    <td className="px-4 py-3 font-mono text-text-secondary">{ota ? `₹${Math.round(ota.revenue / ota.bookings).toLocaleString()}` : "—"}</td>
                    <td className="px-4 py-3"><StatusBadge tone={c.parity.includes("Drift") ? "warning" : c.parity === "Reference" ? "brand" : "success"}>{c.parity}</StatusBadge></td>
                    <td className="px-4 py-3 font-mono text-text-secondary">{c.commission}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
