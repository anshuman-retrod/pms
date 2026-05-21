import { type OnboardingState } from "@/lib/onboarding-store";

interface ProfileStepProps {
  state: OnboardingState;
  setState: React.Dispatch<React.SetStateAction<OnboardingState>>;
  disabled: boolean;
}

const inputCls =
  "h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 disabled:opacity-60";
const selectCls = inputCls;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-text-secondary">{label}</label>
      {children}
    </div>
  );
}

export function ProfileStep({ state, setState, disabled }: ProfileStepProps) {
  const p = state.profile;
  const set = (patch: Partial<OnboardingState["profile"]>) =>
    setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Field label="Legal property name">
        <input
          disabled={disabled}
          className={inputCls}
          value={p.name}
          onChange={(e) => set({ name: e.target.value })}
          placeholder="The Grand Palace"
        />
      </Field>
      <Field label="Brand / chain">
        <input
          disabled={disabled}
          className={inputCls}
          value={p.brand}
          onChange={(e) => set({ brand: e.target.value })}
          placeholder="Grand Palace Hotels"
        />
      </Field>
      <Field label="Street address">
        <input
          disabled={disabled}
          className={inputCls}
          value={p.address}
          onChange={(e) => set({ address: e.target.value })}
        />
      </Field>
      <Field label="City">
        <input
          disabled={disabled}
          className={inputCls}
          value={p.city}
          onChange={(e) => set({ city: e.target.value })}
        />
      </Field>
      <Field label="Country">
        <input
          disabled={disabled}
          className={inputCls}
          value={p.country}
          onChange={(e) => set({ country: e.target.value })}
        />
      </Field>
      <Field label="Timezone">
        <select
          disabled={disabled}
          className={selectCls}
          value={p.timezone}
          onChange={(e) => set({ timezone: e.target.value })}
        >
          {["Asia/Kolkata", "Asia/Dubai", "Asia/Singapore", "Europe/London", "America/New_York"].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </Field>
      <Field label="Currency">
        <select
          disabled={disabled}
          className={selectCls}
          value={p.currency}
          onChange={(e) => set({ currency: e.target.value })}
        >
          {["INR", "USD", "EUR", "GBP", "AED"].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </Field>
      <Field label="Star rating">
        <select
          disabled={disabled}
          className={selectCls}
          value={p.starRating}
          onChange={(e) => set({ starRating: Number(e.target.value) })}
        >
          {[3, 4, 5].map((t) => (
            <option key={t} value={t}>
              {t} ★
            </option>
          ))}
        </select>
      </Field>
      <Field label="GSTIN">
        <input
          disabled={disabled}
          className={inputCls}
          value={p.gstin}
          onChange={(e) => set({ gstin: e.target.value })}
          placeholder="07AAACR1234A1Z5"
        />
      </Field>
    </div>
  );
}
export default ProfileStep;
