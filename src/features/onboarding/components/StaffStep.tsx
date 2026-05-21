import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Primitives";
import { type Role } from "@/types/rbac";
import { ROLE_LABEL } from "@/features/auth/lib/rbac";
import { type OnboardingState, type StaffInvite } from "@/lib/onboarding-store";

interface StaffStepProps {
  state: OnboardingState;
  setState: React.Dispatch<React.SetStateAction<OnboardingState>>;
  disabled: boolean;
}

const inputCls =
  "h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 disabled:opacity-60";
const selectCls = inputCls;

const STAFF_ROLES: Role[] = [
  "super_admin",
  "general_manager",
  "front_office_manager",
  "front_desk_agent",
  "housekeeping_supervisor",
  "accounts",
  "revenue_manager",
];

export function StaffStep({ state, setState, disabled }: StaffStepProps) {
  const set = (s: StaffInvite[]) => setState((prev) => ({ ...prev, staff: s }));
  const add = () => set([...state.staff, { id: `s${Date.now()}`, name: "", email: "", role: "front_desk_agent" }]);
  const update = (id: string, patch: Partial<StaffInvite>) =>
    set(state.staff.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const remove = (id: string) => set(state.staff.filter((s) => s.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-[13px] text-text-secondary">
          Invite key staff. They'll appear in <strong>Users & Access</strong> after finishing.
        </div>
        <Button size="sm" variant="outline" onClick={add} disabled={disabled}>
          <Plus className="h-3.5 w-3.5" />
          Add invite
        </Button>
      </div>
      {state.staff.length === 0 ? (
        <div className="rounded-md border border-dashed border-border bg-surface-2/30 p-6 text-center text-[12px] text-text-secondary">
          No invites yet. Click <em>Add invite</em> to start.
        </div>
      ) : (
        <div className="space-y-2">
          {state.staff.map((s) => (
            <div
              key={s.id}
              className="grid grid-cols-1 gap-2 rounded-md border border-border bg-surface p-3 md:grid-cols-[1fr_1.2fr_1fr_auto]"
            >
              <input
                disabled={disabled}
                className={inputCls}
                placeholder="Full name"
                value={s.name}
                onChange={(e) => update(s.id, { name: e.target.value })}
              />
              <input
                disabled={disabled}
                className={inputCls}
                placeholder="Email"
                value={s.email}
                onChange={(e) => update(s.id, { email: e.target.value })}
              />
              <select
                disabled={disabled}
                className={selectCls}
                value={s.role}
                onChange={(e) => update(s.id, { role: e.target.value as Role })}
              >
                {STAFF_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABEL[r]}
                  </option>
                ))}
              </select>
              <button
                disabled={disabled}
                onClick={() => remove(s.id)}
                className="rounded p-1.5 text-text-secondary hover:bg-[oklch(0.96_0.06_27)] hover:text-[var(--color-error)] disabled:opacity-30 self-center transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default StaffStep;
