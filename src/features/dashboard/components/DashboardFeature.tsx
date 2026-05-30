import { Filter, Download, Sparkles, ArrowUpRight } from "lucide-react";
import { PageHeader, KpiCard, Button } from "@/components/ui/Primitives";
import { occupancyByType } from "@/services/mock/db";
import { LiveOccupancy } from "./LiveOccupancy";
import { RevenueKpis } from "./RevenueKpis";
import { ArrivalsDepartures } from "./ArrivalsDepartures";
import { AlertNotifications } from "./AlertNotifications";
import { HousekeepingOverview } from "./HousekeepingOverview";
import { RevenueForecast } from "./RevenueForecast";
import { RevenueOccupancyTrend } from "./RevenueOccupancyTrend";
import { ActivityFeed } from "./ActivityFeed";
import { OpsSummaryRow } from "./OpsSummaryRow";

const tooltipStyle = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12,
  boxShadow: "var(--shadow-e2)",
};

const fmtINR = (n: number) =>
  n >= 10000000
    ? `₹${(n / 10000000).toFixed(2)} Cr`
    : n >= 100000
      ? `₹${(n / 100000).toFixed(2)} L`
      : n >= 1000
        ? `₹${(n / 1000).toFixed(1)}k`
        : `₹${n}`;

export function DashboardFeature() {
  const totalRooms = occupancyByType.reduce((a, b) => a + b.total, 0);
  const occupied = occupancyByType.reduce((a, b) => a + b.occupied, 0);
  const occPct = Math.round((occupied / totalRooms) * 1000) / 10;

  return (
    <div>
      <PageHeader
        eyebrow="Friday · 15 May 2026 · Live"
        title="Good morning, Aarav"
        description="Real-time command center for The Grand Palace, New Delhi."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="h-3.5 w-3.5" /> Today
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
          </>
        }
      />

      <div className="space-y-6 p-6">
        {/* === Row 1: Live Occupancy Gauge + Revenue KPI cards === */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
          <LiveOccupancy occPct={occPct} occupied={occupied} totalRooms={totalRooms} />
          <RevenueKpis fmtINR={fmtINR} />
        </div>

        {/* === KPI strip === */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="ADR Today" value="₹12,400" delta="↑ ₹800 vs LW" accent="brand" />
          <KpiCard label="RevPAR · MTD" value="₹10,440" delta="↑ 5.4% vs LM" accent="success" />
          <KpiCard label="In-House Guests" value="84" delta="6 VIPs" deltaTone="neutral" accent="info" />
          <KpiCard label="Open Work Orders" value="11" delta="2 critical" deltaTone="error" accent="warning" />
        </div>

        {/* === Row 2: Arrivals/Departures + Alerts === */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ArrivalsDepartures />
          <AlertNotifications />
        </div>

        {/* === Ops command center (P0) === */}
        <OpsSummaryRow />

        {/* === Row 3: HK Status overview + Forecast === */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <HousekeepingOverview />
          <RevenueForecast fmtINR={fmtINR} tooltipStyle={tooltipStyle} />
        </div>

        {/* === Row 4: Trend + Activity === */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <RevenueOccupancyTrend tooltipStyle={tooltipStyle} />
          <div className="space-y-4">
            <ActivityFeed />
            <div className="rounded-lg border border-primary/20 bg-primary-tint/40 p-4">
              <div className="mb-2 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-primary-pressed">
                <Sparkles className="h-3 w-3" /> Retrod AI
              </div>
              <p className="text-[13px] leading-snug text-text-primary">
                Weekend forecast hits <strong>91% occupancy</strong>. Consider 12–18% rate uplift on Deluxe rooms.
              </p>
              <button className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:text-primary-pressed">
                Apply suggestion <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DashboardFeature;
