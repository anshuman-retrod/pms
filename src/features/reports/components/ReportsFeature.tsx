import { useState } from "react";
import { Download, FileSpreadsheet, FileText, Printer } from "lucide-react";
import { PageHeader, KpiCard, Button } from "@/components/ui/Primitives";
import {
  useRevenueTrendQuery,
  useOtaBreakdownQuery,
  useMealPlansQuery,
  useRatePlansQuery,
  useHotelPackagesQuery,
  useAddOnProductsQuery,
} from "@/services/mock/queries";
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
  const { data: revenueTrend = [] } = useRevenueTrendQuery();
  const { data: otaBreakdown = [] } = useOtaBreakdownQuery();
  const { data: mealPlans = [] } = useMealPlansQuery();
  const { data: ratePlans = [] } = useRatePlansQuery();
  const { data: hotelPackages = [] } = useHotelPackagesQuery();
  const { data: addOnProducts = [] } = useAddOnProductsQuery();

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

      <div className="responsive-page-x grid grid-cols-1 gap-5 py-4 sm:py-6 lg:grid-cols-[220px_1fr]">
        {/* Left categories navigation sidebar */}
        <ReportsSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="space-y-5 sm:space-y-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-surface p-4 shadow-e1">
              <div className="label-uppercase mb-2">Plan Revenue Snapshot</div>
              <div className="space-y-2 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Reservations by meal plan</span>
                  <span className="font-mono text-text-primary">{mealPlans.length} configured</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Revenue by rate plan</span>
                  <span className="font-mono text-text-primary">{ratePlans.length} configured</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Package revenue tracking</span>
                  <span className="font-mono text-text-primary">
                    {hotelPackages.length} templates
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Add-on revenue tracking</span>
                  <span className="font-mono text-text-primary">
                    {addOnProducts.length} services
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4 shadow-e1">
              <div className="label-uppercase mb-2">Channel Mapping Readiness</div>
              <p className="text-[12px] text-text-secondary">
                Room type + meal plan + rate plan combinations are now represented in reservation
                model and can be mapped to OTA products in Channel Manager mapping flows.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ReportsFeature;
