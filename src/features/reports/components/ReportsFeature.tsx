import { useState } from "react";
import { Download, FileSpreadsheet, FileText, Printer } from "lucide-react";
import { PageHeader, KpiCard, Button } from "@/components/ui/Primitives";
import { revenueTrend, otaBreakdown } from "@/services/mock/db";
import { ReportsSidebar } from "./ReportsSidebar";
import { RevenueTrendChart } from "./RevenueTrendChart";
import { OtaRevenueChart } from "./OtaRevenueChart";
import { OccupancyProgress } from "./OccupancyProgress";

const categories = [
  "Occupancy",
  "Revenue",
  "ADR & RevPAR",
  "Arrival / Departure",
  "Housekeeping",
  "OTA Performance",
  "Tax (GST)",
  "Staff Activity",
];

const tooltipStyle = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12,
};

export function ReportsFeature() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Revenue");

  return (
    <div>
      <PageHeader
        eyebrow="Intelligence"
        title="Reports & Analytics"
        actions={
          <>
            <Button variant="outline" size="sm">
              <FileText className="h-3.5 w-3.5" />
              PDF
            </Button>
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              Excel
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-3.5 w-3.5" />
              Print
            </Button>
            <Button size="sm">
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[220px_1fr]">
        {/* Left categories navigation sidebar */}
        <ReportsSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <KpiCard label="Total Revenue" value="₹1.42 Cr" delta="↑ 12.4% YoY" accent="brand" />
            <KpiCard label="Occupancy" value="78.4%" delta="↑ 2.1 pts" accent="info" />
            <KpiCard label="ADR" value="₹11,820" delta="↑ ₹420" accent="success" />
            <KpiCard label="RevPAR" value="₹9,267" delta="↑ ₹680" accent="success" />
          </div>

          {/* Core revenue trends area chart */}
          <RevenueTrendChart revenueTrend={revenueTrend} tooltipStyle={tooltipStyle} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* OTA bookings distributions */}
            <OtaRevenueChart otaBreakdown={otaBreakdown} tooltipStyle={tooltipStyle} />

            {/* Room occupancy ratios */}
            <OccupancyProgress />
          </div>
        </div>
      </div>
    </div>
  );
}
export default ReportsFeature;
