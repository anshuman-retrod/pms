import { Link } from "@tanstack/react-router";
import { Star, ArrowUpRight } from "lucide-react";
import { PageHeader, KpiCard, Card, CardHeader, StatusBadge } from "@/components/ui/Primitives";
import { portfolioProperties } from "@/services/mock/db";

const fmtCr = (n: number) => (n >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr` : `₹${(n / 100000).toFixed(1)} L`);

export function MultiPropertyFeature() {
  const avgOcc = Math.round(portfolioProperties.reduce((a, p) => a + p.occupancy, 0) / portfolioProperties.length);
  const totalRev = portfolioProperties.reduce((a, p) => a + p.revenue, 0);
  const totalAlerts = portfolioProperties.reduce((a, p) => a + p.alerts, 0);

  return (
    <div>
      <PageHeader eyebrow="Intelligence" title="Multi-Property Dashboard" description="Portfolio command center across all Retrod properties." />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="Portfolio occupancy" value={`${avgOcc}%`} accent="brand" />
          <KpiCard label="Portfolio revenue" value={fmtCr(totalRev)} accent="info" />
          <KpiCard label="Properties" value={String(portfolioProperties.length)} accent="success" />
          <KpiCard label="Critical alerts" value={String(totalAlerts)} deltaTone="error" accent="error" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {portfolioProperties.map((p) => (
            <Card key={p.id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-[18px] font-semibold text-text-primary">{p.name}</h3>
                  <p className="text-[12px] text-text-secondary">{p.city}</p>
                </div>
                <div className="flex items-center gap-0.5 text-[12px] text-[var(--color-gold)]">
                  <Star className="h-3 w-3 fill-current" /> {p.stars}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-[12px]">
                <div><div className="label-uppercase text-[9px]">Occ</div><div className="font-semibold">{p.occupancy}%</div></div>
                <div><div className="label-uppercase text-[9px]">RevPAR</div><div className="font-semibold">₹{p.revpar.toLocaleString()}</div></div>
                <div><div className="label-uppercase text-[9px]">Alerts</div><div className="font-semibold">{p.alerts}</div></div>
              </div>
              <div className="mt-3 font-mono text-[13px] text-text-primary">{fmtCr(p.revenue)}</div>
              {p.alerts > 0 && <div className="mt-2"><StatusBadge tone="warning">{p.alerts} alert{p.alerts > 1 ? "s" : ""}</StatusBadge></div>}
              <Link to="/" className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:text-primary-pressed">
                Drill into property <ArrowUpRight className="h-3 w-3" />
              </Link>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader title="Comparison table" />
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-border bg-surface-2/40 text-left">{["Property","City","Occ %","Revenue","RevPAR","Alerts"].map(h=><th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">{h}</th>)}</tr></thead>
            <tbody>
              {portfolioProperties.map((p) => (
                <tr key={p.id} className="border-b border-border-subtle hover:bg-surface-2/50">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{p.city}</td>
                  <td className="px-4 py-3 font-mono">{p.occupancy}%</td>
                  <td className="px-4 py-3 font-mono">{fmtCr(p.revenue)}</td>
                  <td className="px-4 py-3 font-mono">₹{p.revpar.toLocaleString()}</td>
                  <td className="px-4 py-3">{p.alerts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
export default MultiPropertyFeature;
