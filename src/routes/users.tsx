import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Card, CardHeader, StatusBadge, Button } from "@/components/ui-kit/Primitives";
import { useAuth, type AppUser } from "@/lib/auth";
import { ROLE_LABEL, type Role } from "@/lib/rbac";
import { Plus, Mail, ShieldOff, ShieldCheck, Trash2 } from "lucide-react";

export const Route = createFileRoute("/users")({
  head: () => ({ meta: [{ title: "Users & Access — Retrod PMS" }] }),
  component: UsersPage,
});

const ROLE_OPTIONS: Role[] = [
  "owner","general_manager","front_office_manager","front_desk_agent",
  "housekeeping_supervisor","accounts","revenue_manager",
];

function UsersPage() {
  const { users, inviteUser, updateUser, deleteUser, can, user: currentUser } = useAuth();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [draft, setDraft] = useState({ name: "", email: "", role: "front_desk_agent" as Role, property: "The Grand Palace" });

  const canManage = can("users.manage");

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Users & Access"
        description="Invite users, assign roles, and govern who can do what across your property."
        actions={canManage ? (
          <Button size="sm" onClick={() => setInviteOpen(v => !v)}>
            <Plus className="h-3.5 w-3.5" />Invite user
          </Button>
        ) : null}
      />

      <div className="space-y-6 p-6">
        {inviteOpen && canManage && (
          <Card>
            <CardHeader title="Invite a new user" hint="They'll receive credentials on first sign-in (mock)" />
            <div className="grid grid-cols-1 gap-3 p-5 md:grid-cols-4">
              <input className="h-9 rounded-md border border-border bg-surface px-3 text-[13px]" placeholder="Full name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              <input className="h-9 rounded-md border border-border bg-surface px-3 text-[13px]" placeholder="Email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
              <select className="h-9 rounded-md border border-border bg-surface px-2 text-[13px]" value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value as Role })}>
                {ROLE_OPTIONS.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
              </select>
              <Button
                size="sm"
                onClick={() => {
                  if (!draft.name || !draft.email) return;
                  inviteUser(draft);
                  setDraft({ name: "", email: "", role: "front_desk_agent", property: "The Grand Palace" });
                  setInviteOpen(false);
                }}
              ><Mail className="h-3.5 w-3.5" />Send invite</Button>
            </div>
          </Card>
        )}

        <Card>
          <CardHeader title="All users" hint={`${users.length} accounts`} />
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-surface-2/40 text-left">
                {["User","Role","Property","Status","Last active",""].map(h => (
                  <th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u: AppUser) => (
                <tr key={u.id} className="border-b border-border-subtle hover:bg-surface-2/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">{u.initials}</div>
                      <div>
                        <div className="font-medium text-text-primary">{u.name}{currentUser?.id === u.id && <span className="ml-2 text-[10px] text-primary">you</span>}</div>
                        <div className="text-[11px] text-text-secondary">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {canManage ? (
                      <select
                        className="h-7 rounded-md border border-border bg-surface px-2 text-[12px]"
                        value={u.role}
                        onChange={(e) => updateUser(u.id, { role: e.target.value as Role })}
                      >
                        {ROLE_OPTIONS.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                      </select>
                    ) : <span className="text-text-primary">{ROLE_LABEL[u.role]}</span>}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{u.property}</td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={u.active ? "success" : "neutral"}>{u.active ? "Active" : "Disabled"}</StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{u.lastActive ?? "—"}</td>
                  <td className="px-4 py-3">
                    {canManage && (
                      <div className="flex justify-end gap-1">
                        <button
                          className="rounded p-1.5 text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                          title={u.active ? "Disable" : "Enable"}
                          onClick={() => updateUser(u.id, { active: !u.active })}
                        >
                          {u.active ? <ShieldOff className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          className="rounded p-1.5 text-text-secondary hover:bg-[oklch(0.96_0.06_27)] hover:text-[var(--color-error)] disabled:opacity-30"
                          title="Remove"
                          disabled={currentUser?.id === u.id}
                          onClick={() => deleteUser(u.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
