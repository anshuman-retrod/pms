import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, CardHeader } from "@/components/ui-kit/Primitives";

export const Route = createFileRoute("/audit")({
  head: () => ({ meta: [{ title: "Audit Logs — Retrod PMS" }] }),
  component: AuditPage,
});

const logs = [
  { ts: "15 May 2026 · 11:42:18", user: "Aarav Malhotra", role: "GM", action: "Confirmed reservation RES-2048", ip: "10.4.2.18" },
  { ts: "15 May 2026 · 11:18:02", user: "Front Desk · Neha", role: "Front Desk", action: "Captured payment ₹48,000 · INV-3104", ip: "10.4.2.31" },
  { ts: "15 May 2026 · 10:55:44", user: "Priya · Housekeeping", role: "HK", action: "Marked Room 215 as Inspected", ip: "10.4.2.74" },
  { ts: "15 May 2026 · 10:32:09", user: "Front Desk · Neha", role: "Front Desk", action: "Checked-in Marcus Weber · Room 215", ip: "10.4.2.31" },
  { ts: "15 May 2026 · 09:48:22", user: "System", role: "Channel Mgr", action: "Updated rate: Booking.com · Deluxe King +₹600", ip: "system" },
  { ts: "15 May 2026 · 09:12:00", user: "Aarav Malhotra", role: "GM", action: "Updated user permissions for staff#42", ip: "10.4.2.18" },
];

function AuditPage() {
  return (
    <div>
      <PageHeader eyebrow="Administration" title="Audit Logs" description="Every consequential action, recorded with timestamp and actor." />
      <div className="p-6">
        <Card>
          <CardHeader title="Recent activity" hint="Last 24 hours" />
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-surface-2/40 text-left">
                {["Timestamp", "User", "Role", "Action", "IP"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((l, i) => (
                <tr key={i} className="border-b border-border-subtle hover:bg-surface-2/50">
                  <td className="px-4 py-3 font-mono text-[12px] text-text-secondary">{l.ts}</td>
                  <td className="px-4 py-3 font-medium text-text-primary">{l.user}</td>
                  <td className="px-4 py-3 text-text-secondary">{l.role}</td>
                  <td className="px-4 py-3 text-text-primary">{l.action}</td>
                  <td className="px-4 py-3 font-mono text-[12px] text-text-disabled">{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
