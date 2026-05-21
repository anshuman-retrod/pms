import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Building2, BedDouble, Receipt, Users as UsersIcon, Plug, ScrollText, CheckCircle2,
  ArrowLeft, ArrowRight, Check,
} from "lucide-react";
import { PageHeader, Card, CardHeader, Button, StatusBadge } from "@/components/ui/Primitives";
import {
  DEFAULT_ONBOARDING, loadOnboarding, saveOnboarding, type OnboardingState,
} from "@/lib/onboarding-store";
import { type Role } from "@/types/rbac";
import { useAuth } from "@/features/auth/hooks/useAuth";

import { ProfileStep } from "./ProfileStep";
import { RoomsStep } from "./RoomsStep";
import { RatesStep } from "./RatesStep";
import { StaffStep } from "./StaffStep";
import { IntegrationsStep } from "./IntegrationsStep";
import { PoliciesStep } from "./PoliciesStep";
import { ReviewStep } from "./ReviewStep";

const STEPS = [
  { key: "profile", label: "Property Profile", icon: Building2, desc: "Identity, address, tax ID" },
  { key: "rooms", label: "Room Types & Inventory", icon: BedDouble, desc: "Categories & inventory" },
  { key: "rates", label: "Rates & Taxes", icon: Receipt, desc: "Plans, GST, service charge" },
  { key: "staff", label: "Staff & Invites", icon: UsersIcon, desc: "Roles, invitations" },
  { key: "integrations", label: "Integrations", icon: Plug, desc: "Payments, channels, comms" },
  { key: "policies", label: "Policies", icon: ScrollText, desc: "Check-in, cancellation" },
  { key: "review", label: "Review & Finish", icon: CheckCircle2, desc: "Confirm and go live" },
] as const;

export function OnboardingFeature() {
  const nav = useNavigate();
  const { can, inviteUser } = useAuth();
  const [state, setState] = useState<OnboardingState>(DEFAULT_ONBOARDING);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadOnboarding());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveOnboarding(state);
    }
  }, [state, hydrated]);

  const step = state.step;
  const setStep = (n: number) =>
    setState((s) => ({ ...s, step: Math.max(0, Math.min(STEPS.length - 1, n)) }));

  const canRun = can("onboarding.run");

  const finish = () => {
    state.staff.forEach((s) => {
      inviteUser({
        name: s.name,
        email: s.email,
        role: s.role as Role,
        property: state.profile.name || "The Grand Palace",
      });
    });
    setState((s) => ({ ...s, completed: true }));
    nav({ to: "/" });
  };

  return (
    <div>
      <PageHeader
        eyebrow="Setup"
        title="Property Onboarding"
        description="Configure the property end-to-end before going live. Progress saves automatically."
        actions={
          <div className="flex items-center gap-2">
            {state.completed && <StatusBadge tone="success">Setup complete</StatusBadge>}
            <Button variant="outline" size="sm" onClick={() => setState(DEFAULT_ONBOARDING)}>
              Reset
            </Button>
          </div>
        }
      />

      {!canRun && (
        <div className="m-6 rounded-md border border-border bg-[oklch(0.96_0.06_70)]/30 p-4 text-[12px] text-text-secondary">
          Your role can view onboarding but not modify it. Contact an Owner or General Manager.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[260px_1fr]">
        {/* Stepper progress left-bar */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <ol className="p-2">
              {STEPS.map((s, idx) => {
                const Icon = s.icon;
                const active = idx === step;
                const done = idx < step;
                return (
                  <li key={s.key}>
                    <button
                      onClick={() => setStep(idx)}
                      className={`flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition ${
                        active ? "bg-primary-tint" : "hover:bg-surface-2"
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold transition ${
                          done
                            ? "bg-[var(--color-success)] text-white"
                            : active
                              ? "bg-primary text-primary-foreground"
                              : "bg-surface-2 text-text-secondary"
                        }`}
                      >
                        {done ? <Check className="h-3 w-3" /> : idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div
                          className={`flex items-center gap-1.5 text-[13px] font-medium transition ${
                            active ? "text-primary-pressed" : "text-text-primary"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {s.label}
                        </div>
                        <div className="text-[11px] text-text-secondary">{s.desc}</div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </Card>
          <div className="mt-3 px-2 text-[11px] text-text-secondary">
            Step {step + 1} of {STEPS.length}
          </div>
        </aside>

        {/* Step configuration layouts */}
        <div>
          <Card>
            <CardHeader title={STEPS[step].label} hint={STEPS[step].desc} />
            <div className="p-6">
              {step === 0 && <ProfileStep state={state} setState={setState} disabled={!canRun} />}
              {step === 1 && <RoomsStep state={state} setState={setState} disabled={!canRun} />}
              {step === 2 && <RatesStep state={state} setState={setState} disabled={!canRun} />}
              {step === 3 && <StaffStep state={state} setState={setState} disabled={!canRun} />}
              {step === 4 && <IntegrationsStep state={state} setState={setState} disabled={!canRun} />}
              {step === 5 && <PoliciesStep state={state} setState={setState} disabled={!canRun} />}
              {step === 6 && <ReviewStep state={state} />}
            </div>
            <div className="flex items-center justify-between border-t border-border-subtle px-6 py-4">
              <Button variant="outline" size="sm" onClick={() => setStep(step - 1)} disabled={step === 0}>
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button size="sm" onClick={() => setStep(step + 1)}>
                  Save & continue
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button size="sm" onClick={finish} disabled={!canRun}>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Finish setup
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default OnboardingFeature;
