import { type OnboardingState } from "@/lib/onboarding-store";

interface PoliciesStepProps {
  state: OnboardingState;
  setState: React.Dispatch<React.SetStateAction<OnboardingState>>;
  disabled: boolean;
}

const inputCls =
  "h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 disabled:opacity-60";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-text-secondary">{label}</label>
      {children}
    </div>
  );
}

export function PoliciesStep({ state, setState, disabled }: PoliciesStepProps) {
  const set = (patch: Partial<OnboardingState["policies"]>) =>
    setState((s) => ({ ...s, policies: { ...s.policies, ...patch } }));
  const p = state.policies;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Field label="Standard check-in time">
        <input
          disabled={disabled}
          type="time"
          className={inputCls}
          value={p.checkIn}
          onChange={(e) => set({ checkIn: e.target.value })}
        />
      </Field>
      <Field label="Standard check-out time">
        <input
          disabled={disabled}
          type="time"
          className={inputCls}
          value={p.checkOut}
          onChange={(e) => set({ checkOut: e.target.value })}
        />
      </Field>
      <Field label="Cancellation policy">
        <textarea
          disabled={disabled}
          className={`${inputCls} h-20 py-2`}
          value={p.cancellation}
          onChange={(e) => set({ cancellation: e.target.value })}
        />
      </Field>
      <Field label="No-show policy">
        <textarea
          disabled={disabled}
          className={`${inputCls} h-20 py-2`}
          value={p.noShow}
          onChange={(e) => set({ noShow: e.target.value })}
        />
      </Field>
      <Field label="Minor / accompanying guest policy">
        <textarea
          disabled={disabled}
          className={`${inputCls} h-20 py-2`}
          value={p.minorPolicy}
          onChange={(e) => set({ minorPolicy: e.target.value })}
        />
      </Field>
      <div className="flex items-end gap-6">
        <label className="flex items-center gap-2 text-[13px] text-text-primary">
          <input
            disabled={disabled}
            type="checkbox"
            checked={p.earlyCheckIn}
            onChange={(e) => set({ earlyCheckIn: e.target.checked })}
          />
          Allow early check-in (subject to availability)
        </label>
        <label className="flex items-center gap-2 text-[13px] text-text-primary">
          <input
            disabled={disabled}
            type="checkbox"
            checked={p.lateCheckOut}
            onChange={(e) => set({ lateCheckOut: e.target.checked })}
          />
          Allow late check-out
        </label>
      </div>
    </div>
  );
}
export default PoliciesStep;
