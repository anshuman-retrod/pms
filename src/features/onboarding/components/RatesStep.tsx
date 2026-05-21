import { StatusBadge } from "@/components/ui/Primitives";
import { type OnboardingState } from "@/lib/onboarding-store";

interface RatesStepProps {
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

export function RatesStep({ state, setState, disabled }: RatesStepProps) {
  const setTax = (patch: Partial<OnboardingState["rates"]["tax"]>) =>
    setState((s) => ({ ...s, rates: { ...s.rates, tax: { ...s.rates.tax, ...patch } } }));

  return (
    <div className="space-y-6">
      <div>
        <div className="label-uppercase mb-2">Rate plans</div>
        <div className="space-y-2">
          {state.rates.plans.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-md border border-border bg-surface-2/30 px-3 py-2"
            >
              <div>
                <div className="text-[13px] font-medium text-text-primary">{p.name}</div>
                <div className="text-[11px] text-text-secondary">
                  {p.type} · Adjustment {p.adjustment}
                </div>
              </div>
              <StatusBadge tone="brand">Active</StatusBadge>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="label-uppercase mb-2">GST tax structure (India)</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label="CGST %">
            <input
              disabled={disabled}
              type="number"
              className={inputCls}
              value={state.rates.tax.cgst}
              onChange={(e) => setTax({ cgst: Number(e.target.value) })}
            />
          </Field>
          <Field label="SGST %">
            <input
              disabled={disabled}
              type="number"
              className={inputCls}
              value={state.rates.tax.sgst}
              onChange={(e) => setTax({ sgst: Number(e.target.value) })}
            />
          </Field>
          <Field label="IGST %">
            <input
              disabled={disabled}
              type="number"
              className={inputCls}
              value={state.rates.tax.igst}
              onChange={(e) => setTax({ igst: Number(e.target.value) })}
            />
          </Field>
          <Field label="Service charge %">
            <input
              disabled={disabled}
              type="number"
              className={inputCls}
              value={state.rates.tax.serviceCharge}
              onChange={(e) => setTax({ serviceCharge: Number(e.target.value) })}
            />
          </Field>
          <Field label="Lower slab applies under (₹)">
            <input
              disabled={disabled}
              type="number"
              className={inputCls}
              value={state.rates.tax.lowerSlabUnder}
              onChange={(e) => setTax({ lowerSlabUnder: Number(e.target.value) })}
            />
          </Field>
          <Field label="Lower slab GST %">
            <input
              disabled={disabled}
              type="number"
              className={inputCls}
              value={state.rates.tax.lowerSlabRate}
              onChange={(e) => setTax({ lowerSlabRate: Number(e.target.value) })}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
export default RatesStep;
