import { useMemo, useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Mail, ShieldOff, ShieldCheck, Trash2, Key } from "lucide-react";
import { PageHeader, Card, CardHeader, StatusBadge, Button } from "@/components/ui/Primitives";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ALL_PERMISSIONS, ROLE_DESCRIPTION, ROLE_LABEL, ROLE_PERMISSIONS } from "@/features/auth/lib/rbac";
import { ROLE_OPTIONS } from "@/features/auth/lib/role-options";
import { type AppUser } from "@/types/auth";
import { type Role } from "@/types/rbac";
import { toast } from "sonner";

const inputCls =
  "h-9 rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15";
const selectCls =
  "h-9 rounded-md border border-border bg-surface px-2 text-[13px] text-text-primary focus:border-primary focus:outline-none";

export function UsersFeature() {
  const { users, inviteUser, updateUser, deleteUser, can, user: currentUser } = useAuth();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    type: "toggle-active" | "delete";
    user: AppUser;
    nextActive?: boolean;
  } | null>(null);
  const [draft, setDraft] = useState({
    name: "",
    email: "",
    role: "front_desk_agent" as Role,
    property: "",
    password: "",
  });
  const [passwordEditUser, setPasswordEditUser] = useState<AppUser | null>(null);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (currentUser?.properties && currentUser.properties.length > 0) {
      setDraft((d) => ({
        ...d,
        property: d.property || currentUser.properties[0].name,
      }));
    }
  }, [currentUser]);

  const filteredUsersList = useMemo(() => {
    if (!currentUser) return [];
    const currentDomain = currentUser.email.split("@")[1]?.toLowerCase();
    return users.filter((u) => u.email.split("@")[1]?.toLowerCase() === currentDomain);
  }, [users, currentUser]);

  const canManage = can("users.manage");
  const draftRoleDescription = useMemo(() => ROLE_DESCRIPTION[draft.role], [draft.role]);

  const openStatusConfirm = (u: AppUser) => {
    setConfirmDialog({ type: "toggle-active", user: u, nextActive: !u.active });
  };

  const openDeleteConfirm = (u: AppUser) => {
    setConfirmDialog({ type: "delete", user: u });
  };

  const runConfirmedAction = () => {
    if (!confirmDialog) return;
    if (confirmDialog.type === "toggle-active") {
      updateUser(confirmDialog.user.id, { active: !!confirmDialog.nextActive });
      toast.success(
        confirmDialog.nextActive
          ? `${confirmDialog.user.name} has been enabled.`
          : `${confirmDialog.user.name} has been disabled.`,
      );
    } else {
      deleteUser(confirmDialog.user.id);
      toast.success(`${confirmDialog.user.name} has been removed from users.`);
    }
    setConfirmDialog(null);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Users & Access"
        description="Invite users, assign roles, and govern who can do what across your property."
        actions={
          canManage ? (
            <Button size="sm" onClick={() => setInviteOpen((v) => !v)}>
              <Plus className="h-3.5 w-3.5" />
              Invite user
            </Button>
          ) : null
        }
      />

      <div className="responsive-page-x space-y-5 py-4 sm:space-y-6 sm:py-6">
        {!canManage ? (
          <Card>
            <div className="rounded-lg border border-warning/40 bg-warning-tint p-4 text-[12px] text-text-primary sm:p-5">
              <div className="font-medium text-warning">Read-only access</div>
              <div className="mt-1 text-[12px] text-text-secondary">
                You can review users and roles, but your current role cannot invite, disable, or delete users.
                Contact an administrator with <span className="font-medium text-text-primary">users.manage</span>{" "}
                permission for account changes.
              </div>
            </div>
          </Card>
        ) : null}

        {inviteOpen && canManage && (
          <Card>
            <CardHeader
              title="Invite a new user"
              hint="They'll receive credentials on first sign-in (mock)."
              action={
                <Link
                  to="/roles"
                  className="text-[12px] font-medium text-primary transition hover:text-primary-pressed hover:underline"
                >
                  View role permissions
                </Link>
              }
            />
            <div className="grid grid-cols-1 gap-3 p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-5">
              <input
                className={inputCls}
                placeholder="Full name"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
              <input
                className={inputCls}
                placeholder="Email"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              />
              <input
                type="password"
                className={inputCls}
                placeholder="Password (optional)"
                value={draft.password}
                onChange={(e) => setDraft({ ...draft, password: e.target.value })}
              />
              <select
                className={selectCls}
                value={draft.role}
                onChange={(e) => setDraft({ ...draft, role: e.target.value as Role })}
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABEL[r]}
                  </option>
                ))}
              </select>
              <select
                className={selectCls}
                value={draft.property}
                onChange={(e) => setDraft({ ...draft, property: e.target.value })}
              >
                {currentUser?.properties && currentUser.properties.length > 0 ? (
                  currentUser.properties.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))
                ) : (
                  <option value="The Grand Palace">The Grand Palace</option>
                )}
              </select>
              <div className="rounded-md border border-border-subtle bg-surface-2/30 px-3 py-2 text-[11px] text-text-secondary md:col-span-2 xl:col-span-1">
                <div className="font-medium text-text-primary">{ROLE_LABEL[draft.role]}</div>
                <div className="mt-1">{draftRoleDescription}</div>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  if (!draft.name || !draft.email) {
                    toast.error("Please enter name and email before sending invite.");
                    return;
                  }
                  const finalProperty = draft.property || currentUser?.properties?.[0]?.name || "";
                  inviteUser({ ...draft, property: finalProperty });
                  toast.success(`Invite sent to ${draft.name} as ${ROLE_LABEL[draft.role]} for ${finalProperty}.`);
                  setDraft({
                    name: "",
                    email: "",
                    role: "front_desk_agent",
                    property: currentUser?.properties?.[0]?.name || "",
                    password: "",
                  });
                  setInviteOpen(false);
                }}
              >
                <Mail className="h-3.5 w-3.5" />
                Send invite
              </Button>
            </div>
          </Card>
        )}

        <Card>
          <CardHeader title="All users" hint={`${filteredUsersList.length} accounts`} />
          <div className="space-y-2 p-3 md:hidden">
            {filteredUsersList.map((u: AppUser) => (
              <div key={u.id} className="rounded-md border border-border-subtle bg-surface p-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
                      {u.initials}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-text-primary">{u.name}</div>
                      <div className="text-[11px] text-text-secondary">{u.email}</div>
                    </div>
                  </div>
                  <StatusBadge tone={u.active ? "success" : "neutral"}>
                    {u.active ? "Active" : "Disabled"}
                  </StatusBadge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <div className="text-text-disabled">Role</div>
                    <div className="text-text-primary">{ROLE_LABEL[u.role]}</div>
                    <a
                      href={`/roles?role=${u.role}`}
                      className="mt-1 inline-block text-[11px] font-medium text-primary hover:text-primary-pressed hover:underline"
                    >
                      View role permissions
                    </a>
                  </div>
                  <div>
                    <div className="text-text-disabled">Property</div>
                    <div className="text-text-secondary">{u.property}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-text-disabled">Last active</div>
                    <div className="text-text-secondary">{u.lastActive ?? "—"}</div>
                  </div>
                  <div className="col-span-2 rounded-md border border-border-subtle bg-surface-2/30 px-2 py-1.5">
                    <div className="text-[10px] uppercase tracking-wide text-text-disabled">
                      Effective access summary
                    </div>
                    <div className="text-[11px] text-text-secondary">
                      {ROLE_PERMISSIONS[u.role].length} of {ALL_PERMISSIONS.length} permissions via{" "}
                      {ROLE_LABEL[u.role]}.
                    </div>
                  </div>
                  {canManage && (
                    <div className="col-span-2 flex items-center justify-end gap-2 pt-1">
                      <button
                        className="rounded p-1.5 text-text-secondary transition hover:bg-surface-2 hover:text-text-primary"
                        title="Set password"
                        onClick={() => {
                          setPasswordEditUser(u);
                          setNewPassword(u.password || "");
                        }}
                      >
                        <Key className="h-3.5 w-3.5" />
                      </button>
                      <button
                        className="rounded p-1.5 text-text-secondary transition hover:bg-surface-2 hover:text-text-primary"
                        title={u.active ? "Disable" : "Enable"}
                        onClick={() => openStatusConfirm(u)}
                      >
                        {u.active ? (
                          <ShieldOff className="h-3.5 w-3.5" />
                        ) : (
                          <ShieldCheck className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        className="rounded p-1.5 text-text-secondary transition hover:bg-error-tint hover:text-error disabled:opacity-30"
                        title="Remove"
                        disabled={currentUser?.id === u.id}
                        onClick={() => openDeleteConfirm(u)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-surface-2/40 text-left">
                {["User", "Role", "Property", "Status", "Last active", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsersList.map((u: AppUser) => (
                <tr key={u.id} className="border-b border-border-subtle hover:bg-surface-2/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
                        {u.initials}
                      </div>
                      <div>
                        <div className="font-medium text-text-primary">
                          {u.name}
                          {currentUser?.id === u.id && (
                            <span className="ml-2 text-[10px] text-primary">you</span>
                          )}
                        </div>
                        <div className="text-[11px] text-text-secondary">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {canManage ? (
                      <div>
                        <select
                          className="h-7 rounded-md border border-border bg-surface px-2 text-[12px] text-text-primary focus:border-primary focus:outline-none"
                          value={u.role}
                          onChange={(e) => {
                            const nextRole = e.target.value as Role;
                            updateUser(u.id, { role: nextRole });
                            toast.success(
                              `${u.name}'s role updated to ${ROLE_LABEL[nextRole]}.`,
                            );
                          }}
                        >
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r} value={r}>
                              {ROLE_LABEL[r]}
                            </option>
                          ))}
                        </select>
                        <div className="mt-1 text-[10px] text-text-secondary">{ROLE_DESCRIPTION[u.role]}</div>
                        <div className="mt-1 text-[10px] text-text-disabled">
                          {ROLE_PERMISSIONS[u.role].length}/{ALL_PERMISSIONS.length} permissions
                        </div>
                        <a
                          href={`/roles?role=${u.role}`}
                          className="mt-1 inline-block text-[11px] font-medium text-primary hover:text-primary-pressed hover:underline"
                        >
                          View role permissions
                        </a>
                      </div>
                    ) : (
                      <div>
                        <span className="text-text-primary">{ROLE_LABEL[u.role]}</span>
                        <div className="mt-1 text-[10px] text-text-secondary">{ROLE_DESCRIPTION[u.role]}</div>
                        <div className="mt-1 text-[10px] text-text-disabled">
                          {ROLE_PERMISSIONS[u.role].length}/{ALL_PERMISSIONS.length} permissions
                        </div>
                        <a
                          href={`/roles?role=${u.role}`}
                          className="mt-1 inline-block text-[11px] font-medium text-primary hover:text-primary-pressed hover:underline"
                        >
                          View role permissions
                        </a>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{u.property}</td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={u.active ? "success" : "neutral"}>
                      {u.active ? "Active" : "Disabled"}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{u.lastActive ?? "—"}</td>
                  <td className="px-4 py-3">
                    {canManage && (
                      <div className="flex justify-end gap-1">
                        <button
                          className="rounded p-1.5 text-text-secondary hover:bg-surface-2 hover:text-text-primary transition"
                          title="Set password"
                          onClick={() => {
                            setPasswordEditUser(u);
                            setNewPassword(u.password || "");
                          }}
                        >
                          <Key className="h-3.5 w-3.5" />
                        </button>
                        <button
                          className="rounded p-1.5 text-text-secondary hover:bg-surface-2 hover:text-text-primary transition"
                          title={u.active ? "Disable" : "Enable"}
                          onClick={() => openStatusConfirm(u)}
                        >
                          {u.active ? (
                            <ShieldOff className="h-3.5 w-3.5" />
                          ) : (
                            <ShieldCheck className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          className="rounded p-1.5 text-text-secondary hover:bg-error-tint hover:text-error disabled:opacity-30 transition"
                          title="Remove"
                          disabled={currentUser?.id === u.id}
                          onClick={() => openDeleteConfirm(u)}
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
          </div>
        </Card>
      </div>
      <AlertDialog open={!!confirmDialog} onOpenChange={(open) => !open && setConfirmDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog?.type === "delete" ? "Remove user?" : "Change user status?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog?.type === "delete"
                ? `This will remove ${confirmDialog.user.name} from the property access list.`
                : `This will ${
                    confirmDialog?.nextActive ? "enable" : "disable"
                  } ${confirmDialog?.user.name}'s account access.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={runConfirmedAction}>
              {confirmDialog?.type === "delete" ? "Remove user" : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={!!passwordEditUser} onOpenChange={(open) => !open && setPasswordEditUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Set password for {passwordEditUser?.name}</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a password to assign to this user. They can use this password to sign in immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-3">
            <input
              type="password"
              className="h-10 w-full rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (passwordEditUser) {
                  updateUser(passwordEditUser.id, { password: newPassword });
                  toast.success(`Password updated for ${passwordEditUser.name}.`);
                  setPasswordEditUser(null);
                  setNewPassword("");
                }
              }}
            >
              Save password
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
export default UsersFeature;
