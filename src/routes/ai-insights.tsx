import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, CardHeader, Button } from "@/components/ui-kit/Primitives";
import { Sparkles, TrendingUp, AlertTriangle, ArrowUpRight, Send } from "lucide-react";

export const Route = createFileRoute("/ai-insights")({
  head: () => ({ meta: [{ title: "AI Insights — Retrod PMS" }] }),
  component: AIPage,
});

const insights = [
  { icon: TrendingUp, title: "Pricing opportunity · This weekend", body: "Forecast indicates 91% occupancy. A 12–18% rate uplift on Deluxe rooms is supported by competitor parity.", action: "Apply uplift" },
  { icon: AlertTriangle, title: "No-show risk · 3 reservations", body: "RES-2046, RES-2073, RES-2089 match historical no-show signals. Suggest sending pre-arrival confirmation now.", action: "Send confirmations" },
  { icon: Sparkles, title: "Loyalty cue · Sophie Laurent", body: "Returning Platinum guest arriving 16 May. Suggest upgrade to Heritage Suite (1 vacancy) and welcome amenity.", action: "Apply upgrade" },
];

const heat = Array.from({ length: 30 }, (_, i) => Math.round(40 + Math.sin(i / 3) * 30 + (i % 7 === 5 ? 20 : 0)));

function AIPage() {
  return (
    <div>
      <PageHeader eyebrow="Intelligence" title="AI Insights" description="Calm, analytical guidance — surfaced when it matters." />

      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Insight cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {insights.map((i) => (
              <Card key={i.title} className="flex flex-col">
                <div className="flex items-center gap-2 border-b border-border-subtle px-5 py-3 text-[10px] font-medium uppercase tracking-[0.08em] text-primary-pressed">
                  <i.icon className="h-3.5 w-3.5" />
                  Retrod AI
                </div>
                <div className="flex-1 p-5">
                  <h4 className="text-[14px] font-semibold text-text-primary">{i.title}</h4>
                  <p className="mt-1.5 text-[12px] leading-snug text-text-secondary">{i.body}</p>
                </div>
                <div className="border-t border-border-subtle px-5 py-3">
                  <button className="inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:text-primary-pressed">
                    {i.action} <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* Smart pricing */}
          <Card>
            <CardHeader title="Smart pricing recommendations" hint="Next 7 days" />
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border bg-surface-2/40 text-left">
                  {["Room type", "Current rate", "Suggested", "Δ", "Demand", ""].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { t: "Heritage Suite", c: 35000, s: 42000, d: "Very high" },
                  { t: "Premier Suite", c: 22000, s: 25800, d: "High" },
                  { t: "Executive", c: 14400, s: 15200, d: "Moderate" },
                  { t: "Deluxe King", c: 12000, s: 13800, d: "High" },
                  { t: "Deluxe Twin", c: 9800, s: 10200, d: "Moderate" },
                ].map((r) => {
                  const delta = Math.round(((r.s - r.c) / r.c) * 100);
                  return (
                    <tr key={r.t} className="border-b border-border-subtle">
                      <td className="px-4 py-3 font-medium text-text-primary">{r.t}</td>
                      <td className="px-4 py-3 font-mono text-text-secondary">₹{r.c.toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono text-text-primary">₹{r.s.toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono text-[var(--color-success)]">+{delta}%</td>
                      <td className="px-4 py-3 text-text-secondary">{r.d}</td>
                      <td className="px-4 py-3 text-right"><Button variant="outline" size="sm">Apply</Button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>

          {/* Demand calendar */}
          <Card>
            <CardHeader title="Demand calendar" hint="Next 30 days" />
            <div className="p-5">
              <div className="grid grid-cols-10 gap-1.5">
                {heat.map((v, i) => {
                  const intensity = v / 100;
                  return (
                    <div
                      key={i}
                      className="aspect-square rounded-sm"
                      title={`Day ${i + 1} · ${v}% demand`}
                      style={{ background: `color-mix(in oklch, var(--color-primary) ${intensity * 100}%, var(--color-surface-2))` }}
                    />
                  );
                })}
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-text-secondary">
                <span>Low</span>
                <div className="flex gap-1">
                  {[10, 30, 50, 70, 90].map((v) => (
                    <div key={v} className="h-3 w-6 rounded-sm" style={{ background: `color-mix(in oklch, var(--color-primary) ${v}%, var(--color-surface-2))` }} />
                  ))}
                </div>
                <span>High</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Assistant */}
        <Card className="flex h-fit flex-col">
          <CardHeader title="Assistant" hint="⌘J to summon" />
          <div className="flex-1 space-y-3 p-5">
            <Msg from="ai" text="Good morning, Aarav. I noticed weekend demand is climbing. Want a pricing summary?" />
            <Msg from="me" text="Yes, and include competitor parity for Deluxe rooms." />
            <Msg from="ai" text="Across 4 comp-set hotels, your Deluxe King is priced 11% below the median. A ₹1,800 uplift maintains parity while preserving conversion." />
          </div>
          <div className="border-t border-border-subtle p-3">
            <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 focus-within:border-primary">
              <input className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-text-disabled" placeholder="Ask anything about your property…" />
              <button className="rounded-md bg-primary p-1.5 text-primary-foreground hover:bg-primary-pressed"><Send className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Msg({ from, text }: { from: "ai" | "me"; text: string }) {
  return (
    <div className={`max-w-[90%] rounded-md px-3 py-2 text-[12px] leading-snug ${from === "ai" ? "bg-surface-2 text-text-primary" : "ml-auto bg-primary text-primary-foreground"}`}>
      {from === "ai" && <div className="mb-0.5 text-[9px] font-medium uppercase tracking-wider text-primary-pressed">Retrod AI</div>}
      {text}
    </div>
  );
}
