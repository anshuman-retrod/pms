import { PageHeader, KpiCard, Card, CardHeader, StatusBadge, Button } from "@/components/ui/Primitives";
import { feedbackEntries } from "@/services/mock/db";

export function FeedbackFeature() {
  const open = feedbackEntries.filter((f) => f.status !== "Resolved").length;
  const nps = Math.round(feedbackEntries.reduce((a, f) => a + f.score, 0) / feedbackEntries.length * 10);

  return (
    <div>
      <PageHeader eyebrow="Guests" title="Guest Feedback" description="Surveys, reviews, and complaint recovery." />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="NPS proxy" value={String(nps)} accent="brand" />
          <KpiCard label="Open complaints" value={String(open)} accent="warning" />
          <KpiCard label="Avg resolution" value="4.2h" accent="info" />
          <KpiCard label="Review rating" value="4.6" accent="success" />
        </div>
        <Card>
          <CardHeader title="Feedback inbox" hint={`${feedbackEntries.length} items`} />
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-border bg-surface-2/40 text-left">{["ID","Guest","Channel","Score","Category","Severity","Status",""].map(h=><th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">{h}</th>)}</tr></thead>
            <tbody>
              {feedbackEntries.map((f) => (
                <tr key={f.id} className="border-b border-border-subtle hover:bg-surface-2/50">
                  <td className="px-4 py-3 font-mono text-[12px]">{f.id}</td>
                  <td className="px-4 py-3 font-medium">{f.guest}</td>
                  <td className="px-4 py-3 text-text-secondary">{f.channel}</td>
                  <td className="px-4 py-3 font-mono">{f.score}/10</td>
                  <td className="px-4 py-3">{f.category}</td>
                  <td className="px-4 py-3"><StatusBadge tone={f.severity === "High" ? "error" : f.severity === "Medium" ? "warning" : "neutral"}>{f.severity}</StatusBadge></td>
                  <td className="px-4 py-3"><StatusBadge tone={f.status === "Resolved" ? "success" : "info"}>{f.status}</StatusBadge></td>
                  <td className="px-4 py-3 text-right"><Button size="sm" variant="outline">Respond</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
export default FeedbackFeature;
