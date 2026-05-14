import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, CardHeader, Button, StatusBadge } from "@/components/ui-kit/Primitives";
import { ArrowRight } from "lucide-react";
import { arrivalsToday, departuresToday } from "@/lib/mock-data";

export const Route = createFileRoute("/check-in")({
  head: () => ({ meta: [{ title: "Check-In / Out — Retrod PMS" }] }),
  component: CheckInPage,
});

function CheckInPage() {
  return (
    <div>
      <PageHeader eyebrow="Operations" title="Check-In / Check-Out" description="A guided, step-by-step flow for arrivals and departures." />

      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Today's arrivals" hint={`${arrivalsToday.length} guests`} />
          <ul className="divide-y divide-border-subtle">
            {arrivalsToday.map((r) => (
              <li key={r.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-surface-2/50">
                <div>
                  <div className="text-[14px] font-medium text-text-primary">{r.guest}</div>
                  <div className="text-[11px] text-text-secondary">{r.id} · Room {r.room} · {r.type}</div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge tone={r.status === "Confirmed" ? "success" : "warning"}>{r.status}</StatusBadge>
                  <Button size="sm">Check in <ArrowRight className="h-3.5 w-3.5" /></Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Today's departures" hint={`${departuresToday.length} guests`} />
          <ul className="divide-y divide-border-subtle">
            {departuresToday.concat(departuresToday).slice(0, 6).map((r, i) => (
              <li key={i} className="flex items-center justify-between px-5 py-3.5 hover:bg-surface-2/50">
                <div>
                  <div className="text-[14px] font-medium text-text-primary">{r.guest}</div>
                  <div className="text-[11px] text-text-secondary">Room {r.room} · Checkout 11:00</div>
                </div>
                <div className="flex items-center gap-2">
                  {r.balance ? <StatusBadge tone="warning">₹{r.balance.toLocaleString()} due</StatusBadge> : <StatusBadge tone="success">Settled</StatusBadge>}
                  <Button variant="outline" size="sm">Settle & checkout</Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
