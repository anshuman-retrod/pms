import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, CardHeader, StatusBadge, Button } from "@/components/ui-kit/Primitives";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/staff")({
  head: () => ({ meta: [{ title: "Staff Management — Retrod PMS" }] }),
  component: StaffPage,
});

const staff = [
  { name: "Aarav Malhotra", role: "General Manager", dept: "Leadership", shift: "—", status: "Active" },
  { name: "Neha Kapoor", role: "Front Desk Lead", dept: "Front Office", shift: "Morning", status: "On duty" },
  { name: "Priya Reddy", role: "Housekeeping Supervisor", dept: "Housekeeping", shift: "Morning", status: "On duty" },
  { name: "Lakshmi Iyer", role: "Housekeeper", dept: "Housekeeping", shift: "Morning", status: "On duty" },
  { name: "Sunil Rao", role: "Concierge", dept: "Front Office", shift: "Evening", status: "Off" },
  { name: "Anjali Bose", role: "Housekeeper", dept: "Housekeeping", shift: "Evening", status: "Off" },
  { name: "Rahul Singh", role: "Maintenance Lead", dept: "Engineering", shift: "On-call", status: "Active" },
];

function StaffPage() {
  return (
    <div>
      <PageHeader eyebrow="Administration" title="Staff Management" description="Roster, roles, and access permissions." actions={<Button size="sm"><Plus className="h-3.5 w-3.5" />Add staff</Button>} />
      <div className="p-6">
        <Card>
          <CardHeader title="Staff roster" hint={`${staff.length} members`} />
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-surface-2/40 text-left">
                {["Name", "Role", "Department", "Shift", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.name} className="border-b border-border-subtle hover:bg-surface-2/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">{s.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
                      <span className="font-medium text-text-primary">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-primary">{s.role}</td>
                  <td className="px-4 py-3 text-text-secondary">{s.dept}</td>
                  <td className="px-4 py-3 text-text-secondary">{s.shift}</td>
                  <td className="px-4 py-3"><StatusBadge tone={s.status === "On duty" ? "success" : s.status === "Active" ? "info" : "neutral"}>{s.status}</StatusBadge></td>
                  <td className="px-4 py-3 text-right"><a className="text-[12px] font-medium text-primary">Permissions</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
