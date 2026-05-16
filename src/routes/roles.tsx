import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, CardHeader } from "@/components/ui-kit/Primitives";
import { ALL_PERMISSIONS, ROLE_DESCRIPTION, ROLE_LABEL, ROLE_PERMISSIONS, type Permission, type Role } from "@/lib/rbac";
import { Check } from "lucide-react";

export const Route = createFileRoute("/roles")({
  head: () => ({ meta: [{ title: "Roles & Privileges — Retrod PMS" }] }),
  component: RolesPage,
});

const ROLES: Role[] = [
  "owner","general_manager","front_office_manager","front_desk_agent",
  "housekeeping_supervisor","accounts","revenue_manager",
];

const GROUPS: Record<string, Permission[]> = {
  "Dashboard": ["dashboard.view"],
  "Reservations": ["reservations.view","reservations.create","reservations.modify","reservations.cancel"],
  "Front Office": ["frontdesk.view","frontdesk.checkin","frontdesk.checkout","frontdesk.roommove"],
  "Housekeeping": ["housekeeping.view","housekeeping.assign","housekeeping.status"],
  "Guests / CRM": ["guests.view","guests.edit","guests.communicate"],
  "Billing & Payments": ["billing.view","billing.post","billing.refund","billing.void","payments.process"],
  "Revenue / OTA": ["revenue.view","revenue.editrates","ota.manage"],
  "Reports & AI": ["reports.view","reports.export","ai.view"],
  "Administration": ["rooms.manage","staff.manage","users.manage","roles.manage","audit.view","property.configure","settings.manage","onboarding.run"],
};

const PRETTY: Record<Permission, string> = Object.fromEntries(
  ALL_PERMISSIONS.map(p => [p, p.replace(/\./g, " · ").replace(/_/g, " ")])
) as Record<Permission, string>;

function RolesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Roles & Privileges"
        description="Permission matrix governing what each role can see and do across the platform."
      />

      <div className="space-y-6 p-6">
        {/* Role summary cards */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {ROLES.map(r => (
            <div key={r} className="rounded-lg border border-border bg-surface p-4 shadow-e1">
              <div className="label-uppercase">{ROLE_LABEL[r]}</div>
              <div className="mt-1 text-[12px] leading-relaxed text-text-secondary">{ROLE_DESCRIPTION[r]}</div>
              <div className="mt-3 text-[11px] text-text-secondary">
                <span className="font-medium text-text-primary">{ROLE_PERMISSIONS[r].length}</span> / {ALL_PERMISSIONS.length} permissions
              </div>
            </div>
          ))}
        </div>

        {/* Permission matrix */}
        <Card>
          <CardHeader title="Permission matrix" hint="Read-only · derived from system role definitions" />
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-border bg-surface-2/40">
                  <th className="sticky left-0 z-10 bg-surface-2/40 px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-text-secondary">Capability</th>
                  {ROLES.map(r => (
                    <th key={r} className="px-2 py-2.5 text-center text-[10px] font-medium uppercase tracking-wider text-text-secondary">
                      <div className="leading-tight">{ROLE_LABEL[r].split(" ")[0]}</div>
                      <div className="text-text-disabled">{ROLE_LABEL[r].split(" ").slice(1).join(" ")}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(GROUPS).flatMap(([group, perms]) => [
                  <tr key={`group-${group}`} className="bg-surface-2/30">
                    <td colSpan={ROLES.length + 1} className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">{group}</td>
                  </tr>,
                  ...perms.map(p => (
                    <tr key={p} className="border-b border-border-subtle hover:bg-surface-2/30">
                      <td className="sticky left-0 z-10 bg-surface px-4 py-2 capitalize text-text-primary">{PRETTY[p]}</td>
                      {ROLES.map(r => (
                        <td key={r} className="px-2 py-2 text-center">
                          {ROLE_PERMISSIONS[r].includes(p)
                            ? <Check className="mx-auto h-3.5 w-3.5 text-[var(--color-success)]" />
                            : <span className="text-text-disabled">—</span>}
                        </td>
                      ))}
                    </tr>
                  )),
                ])}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
