import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader, KpiCard, Button, Card, CardHeader, StatusBadge } from "@/components/ui/Primitives";
import { bookingPromos } from "@/services/mock/db";

export function BookingEngineFeature() {
  const [tab, setTab] = useState<"promos" | "settings">("promos");
  const active = bookingPromos.filter((p) => p.status === "Active").length;

  return (
    <div>
      <PageHeader eyebrow="Commercial" title="Booking Engine" description="Direct booking widget, promotions, and conversion analytics." actions={<Button size="sm"><Plus className="h-3.5 w-3.5" />New promo</Button>} />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="Direct bookings" value="96" accent="brand" />
          <KpiCard label="Conversion rate" value="3.8%" accent="success" />
          <KpiCard label="Active promos" value={String(active)} accent="info" />
          <KpiCard label="Abandoned carts" value="14" accent="warning" />
        </div>
        <div className="flex rounded-md border border-border bg-surface p-0.5 text-[12px] w-fit">
          {(["promos", "settings"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} className={`rounded px-3 py-1 capitalize ${tab === t ? "bg-foreground text-background" : "text-text-secondary"}`}>{t}</button>
          ))}
        </div>
        {tab === "promos" ? (
          <Card>
            <CardHeader title="Promotions" />
            <table className="w-full text-[13px]">
              <thead><tr className="border-b border-border bg-surface-2/40 text-left">{["Code","Discount","Validity","Bookings","Status",""].map(h=><th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">{h}</th>)}</tr></thead>
              <tbody>
                {bookingPromos.map((p) => (
                  <tr key={p.id} className="border-b border-border-subtle hover:bg-surface-2/50">
                    <td className="px-4 py-3 font-mono font-medium">{p.code}</td>
                    <td className="px-4 py-3">{p.discount}</td>
                    <td className="px-4 py-3 text-text-secondary">{p.validity}</td>
                    <td className="px-4 py-3 font-mono">{p.bookings}</td>
                    <td className="px-4 py-3"><StatusBadge tone={p.status === "Active" ? "success" : "neutral"}>{p.status}</StatusBadge></td>
                    <td className="px-4 py-3 text-right"><button type="button" className="text-[12px] font-medium text-primary">Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ) : (
          <Card className="p-5 text-[13px]">
            <p className="font-medium">Engine settings</p>
            <p className="mt-1 text-text-secondary">Widget embed code, branding, and payment gateway configuration.</p>
            <Button variant="outline" size="sm" className="mt-4">Preview engine</Button>
          </Card>
        )}
      </div>
    </div>
  );
}
export default BookingEngineFeature;
