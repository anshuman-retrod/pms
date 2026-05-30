import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader, KpiCard, Button, Card, CardHeader, StatusBadge } from "@/components/ui/Primitives";
import { opsTasks } from "@/services/mock/db";

type View = "list" | "board";

export function TasksFeature() {
  const [view, setView] = useState<View>("board");
  const open = opsTasks.filter((t) => t.status !== "Done");

  return (
    <div>
      <PageHeader eyebrow="Operations" title="Task Management" description="Cross-department tasks and follow-ups." actions={<Button size="sm"><Plus className="h-3.5 w-3.5" />Create task</Button>} />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="Open tasks" value={String(open.length)} accent="brand" />
          <KpiCard label="Due today" value="2" accent="warning" />
          <KpiCard label="Overdue" value="0" accent="success" />
          <KpiCard label="Completed (7d)" value="34" accent="info" />
        </div>
        <div className="flex rounded-md border border-border bg-surface p-0.5 text-[12px] w-fit">
          {(["board", "list"] as const).map((v) => (
            <button key={v} type="button" onClick={() => setView(v)} className={`rounded px-3 py-1 capitalize ${view === v ? "bg-foreground text-background" : "text-text-secondary"}`}>{v}</button>
          ))}
        </div>
        {view === "board" ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {(["Open", "In Progress", "Done"] as const).map((col) => (
              <div key={col}>
                <div className="mb-2 text-[12px] font-semibold">{col}</div>
                <div className="space-y-2">
                  {opsTasks.filter((t) => t.status === col).map((t) => (
                    <Card key={t.id} className="p-3">
                      <div className="font-medium text-[13px]">{t.title}</div>
                      <div className="mt-1 text-[11px] text-text-secondary">{t.department} · {t.assignee}</div>
                      <StatusBadge tone={t.priority === "High" ? "warning" : "neutral"}>{t.priority}</StatusBadge>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader title="All tasks" />
            <table className="w-full text-[13px]">
              <thead><tr className="border-b border-border bg-surface-2/40 text-left">{["Task","Dept","Assignee","Due","Status"].map(h=><th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">{h}</th>)}</tr></thead>
              <tbody>
                {opsTasks.map((t) => (
                  <tr key={t.id} className="border-b border-border-subtle hover:bg-surface-2/50">
                    <td className="px-4 py-3 font-medium">{t.title}</td>
                    <td className="px-4 py-3">{t.department}</td>
                    <td className="px-4 py-3">{t.assignee}</td>
                    <td className="px-4 py-3">{t.due}</td>
                    <td className="px-4 py-3"><StatusBadge tone={t.status === "Done" ? "success" : "info"}>{t.status}</StatusBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  );
}
export default TasksFeature;
