import { type OnboardingState } from "@/lib/onboarding-store";

interface IntegrationsStepProps {
  state: OnboardingState;
  setState: React.Dispatch<React.SetStateAction<OnboardingState>>;
  disabled: boolean;
}

export function IntegrationsStep({ state, setState, disabled }: IntegrationsStepProps) {
  const toggle = (key: string) =>
    setState((s) => ({
      ...s,
      integrations: s.integrations.map((i) => (i.key === key ? { ...i, enabled: !i.enabled } : i)),
    }));

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {state.integrations.map((i) => (
        <div key={i.key} className="flex items-center justify-between rounded-md border border-border bg-surface p-4">
          <div>
            <div className="text-[13px] font-medium text-text-primary">{i.label}</div>
            <div className="text-[11px] text-text-secondary">{i.enabled ? "Connected (mock)" : "Not connected"}</div>
          </div>
          <button
            disabled={disabled}
            onClick={() => toggle(i.key)}
            className={`relative h-5 w-9 rounded-full transition ${
              i.enabled ? "bg-primary" : "bg-surface-2 border border-border"
            } disabled:opacity-60`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition ${
                i.enabled ? "left-[18px]" : "left-0.5"
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );
}
export default IntegrationsStep;
