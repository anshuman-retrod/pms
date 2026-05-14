import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, CardHeader, StatusBadge, Button } from "@/components/ui-kit/Primitives";
import { guests } from "@/lib/mock-data";
import { Plus, Search } from "lucide-react";

export const Route = createFileRoute("/guests")({
  head: () => ({ meta: [{ title: "Guest Profiles — Retrod PMS" }] }),
  component: GuestsPage,
});

function GuestsPage() {
  return (
    <div>
      <PageHeader eyebrow="Guests" title="Guest Profiles" description="A CRM-grade view of every guest who has stayed with us." actions={<Button size="sm"><Plus className="h-3.5 w-3.5" />Add guest</Button>} />
      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader title="All guests" hint="3,142 profiles" action={
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-disabled" />
              <input className="h-8 w-full rounded-md border border-border pl-8 pr-2 text-[12px] focus:border-primary focus:outline-none" placeholder="Search…" />
            </div>
          } />
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-surface-2/40 text-left">
                {["Guest", "Country", "Visits", "Lifetime Value", "Tier", ""].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {guests.map((g) => (
                <tr key={g.name} className="border-b border-border-subtle hover:bg-surface-2/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">{g.name.split(" ").map(s=>s[0]).slice(0,2).join("")}</div>
                      <span className="font-medium text-text-primary">{g.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{g.country}</td>
                  <td className="px-4 py-3 font-mono text-text-primary">{g.visits}</td>
                  <td className="px-4 py-3 font-mono text-text-primary">₹{g.ltv.toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge tone={g.tier === "Platinum" ? "brand" : g.tier === "Gold" ? "warning" : "neutral"}>{g.tier}</StatusBadge></td>
                  <td className="px-4 py-3 text-right"><a className="text-[12px] font-medium text-primary">View</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <CardHeader title="Sophie Laurent" hint="Platinum · 4 stays" />
          <div className="space-y-4 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-[18px] font-semibold text-primary-foreground">SL</div>
              <div>
                <div className="font-display text-[18px] font-semibold text-text-primary">Sophie Laurent</div>
                <div className="text-[12px] text-text-secondary">France · Returning guest</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[12px]">
              <Stat label="Lifetime spend" value="₹4,12,000" />
              <Stat label="Avg ADR" value="₹35,000" />
              <Stat label="Avg stay" value="3.2 nights" />
              <Stat label="Last stay" value="Mar 2026" />
            </div>
            <div>
              <div className="label-uppercase mb-2">Preferences</div>
              <div className="flex flex-wrap gap-1.5">
                {["High floor", "Pillow menu", "Late checkout", "Spa add-on"].map((p) => (
                  <span key={p} className="rounded-sm border border-border bg-surface-2 px-2 py-0.5 text-[11px] text-text-secondary">{p}</span>
                ))}
              </div>
            </div>
            <Button className="w-full justify-center">Open full profile</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border-subtle bg-surface-2/40 p-2.5">
      <div className="label-uppercase text-[9px]">{label}</div>
      <div className="mt-0.5 text-[14px] font-semibold text-text-primary">{value}</div>
    </div>
  );
}
