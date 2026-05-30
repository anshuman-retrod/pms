import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader, KpiCard, Button, Card, CardHeader, StatusBadge } from "@/components/ui/Primitives";
import { lostFoundItems } from "@/services/mock/db";

export function LostFoundFeature() {
  const [selected, setSelected] = useState(lostFoundItems[0]);
  const open = lostFoundItems.filter((i) => i.status === "Open" || i.status === "Matched").length;

  return (
    <div>
      <PageHeader eyebrow="Operations" title="Lost & Found" description="Log, match, and release found items." actions={<Button size="sm"><Plus className="h-3.5 w-3.5" />Log item</Button>} />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="Open items" value={String(open)} accent="brand" />
          <KpiCard label="Awaiting claim" value="1" accent="warning" />
          <KpiCard label="Released · MTD" value="12" accent="success" />
          <KpiCard label="Match suggestions" value="1" accent="info" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <Card>
            <CardHeader title="Registry" />
            <table className="w-full text-[13px]">
              <thead><tr className="border-b border-border bg-surface-2/40 text-left">{["ID","Item","Location","Found","Status"].map(h=><th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">{h}</th>)}</tr></thead>
              <tbody>
                {lostFoundItems.map((i) => (
                  <tr key={i.id} onClick={() => setSelected(i)} className={`cursor-pointer border-b border-border-subtle hover:bg-surface-2/50 ${selected.id === i.id ? "bg-primary-tint/30" : ""}`}>
                    <td className="px-4 py-3 font-mono text-[12px]">{i.id}</td>
                    <td className="px-4 py-3 font-medium">{i.description}</td>
                    <td className="px-4 py-3 text-text-secondary">{i.location}</td>
                    <td className="px-4 py-3">{i.foundAt}</td>
                    <td className="px-4 py-3"><StatusBadge tone={i.status === "Open" ? "warning" : i.status === "Matched" ? "info" : "success"}>{i.status}</StatusBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Card>
            <CardHeader title="Match guest" />
            <div className="p-5 text-[13px]">
              <p className="font-medium">{selected.description}</p>
              <p className="mt-2 text-text-secondary">{selected.location} · {selected.foundAt}</p>
              {selected.guestMatch ? (
                <div className="mt-4 rounded-md border border-border-subtle bg-surface-2/40 p-3">
                  <div className="label-uppercase">Suggested match</div>
                  <div className="mt-1 font-medium">{selected.guestMatch}</div>
                  <Button size="sm" className="mt-3 w-full justify-center">Notify guest</Button>
                </div>
              ) : (
                <p className="mt-4 text-[12px] text-text-secondary">No match yet.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default LostFoundFeature;
