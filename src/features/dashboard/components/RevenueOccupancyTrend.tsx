import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardHeader } from "@/components/ui/Primitives";
import { revenueTrend } from "@/services/mock/db";

interface RevenueOccupancyTrendProps {
  tooltipStyle: React.CSSProperties;
}

export function RevenueOccupancyTrend({ tooltipStyle }: RevenueOccupancyTrendProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader
        title="Revenue & Occupancy"
        hint="Last 30 days"
        action={
          <div className="flex items-center gap-3 text-[11px] text-text-secondary">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Revenue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[var(--color-info)]" />
              Occupancy
            </span>
          </div>
        }
      />
      <div className="px-3 pb-4 pt-2">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={revenueTrend} margin={{ left: 8, right: 16, top: 8, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-border-subtle)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" stroke="var(--color-text-disabled)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              yAxisId="r"
              stroke="var(--color-text-disabled)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <YAxis
              yAxisId="o"
              orientation="right"
              stroke="var(--color-text-disabled)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Line yAxisId="r" type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
            <Line yAxisId="o" type="monotone" dataKey="occupancy" stroke="var(--color-info)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
