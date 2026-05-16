import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader, Card, CardHeader, Button, StatusBadge } from "@/components/ui-kit/Primitives";
import { DEFAULT_ONBOARDING, loadOnboarding, saveOnboarding, type OnboardingState, type RoomType, type StaffInvite } from "@/lib/onboarding-store";
import { ROLE_LABEL, type Role } from "@/lib/rbac";
import { useAuth } from "@/lib/auth";
import {
  Building2, BedDouble, Receipt, Users as UsersIcon, Plug, ScrollText, CheckCircle2,
  ArrowLeft, ArrowRight, Plus, Trash2, Check,
} from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Property Onboarding — Retrod PMS" }] }),
  component: OnboardingPage,
});

const STEPS = [
  { key: "profile",       label: "Property Profile",     icon: Building2,    desc: "Identity, address, tax ID" },
  { key: "rooms",         label: "Room Types & Inventory", icon: BedDouble,  desc: "Categories & inventory" },
  { key: "rates",         label: "Rates & Taxes",        icon: Receipt,      desc: "Plans, GST, service charge" },
  { key: "staff",         label: "Staff & Invites",      icon: UsersIcon,    desc: "Roles, invitations" },
  { key: "integrations",  label: "Integrations",         icon: Plug,         desc: "Payments, channels, comms" },
  { key: "policies",      label: "Policies",             icon: ScrollText,   desc: "Check-in, cancellation" },
  { key: "review",        label: "Review & Finish",      icon: CheckCircle2, desc: "Confirm and go live" },
] as const;

function OnboardingPage() {
  const nav = useNavigate();
  const { can, inviteUser } = useAuth();
  const [state, setState] = useState<OnboardingState>(DEFAULT_ONBOARDING);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setState(loadOnboarding()); setHydrated(true); }, []);
  useEffect(() => { if (hydrated) saveOnboarding(state); }, [state, hydrated]);

  const step = state.step;
  const setStep = (n: number) => setState(s => ({ ...s, step: Math.max(0, Math.min(STEPS.length - 1, n)) }));

  const canRun = can("onboarding.run");

  const finish = () => {
    // push staff invites into the user system
    state.staff.forEach(s => {
      const role = (s.role as Role);
      inviteUser({ name: s.name, email: s.email, role, property: state.profile.name || "The Grand Palace" });
    });
    setState(s => ({ ...s, completed: true }));
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
            <Button variant="outline" size="sm" onClick={() => setState(DEFAULT_ONBOARDING)}>Reset</Button>
          </div>
        }
      />

      {!canRun && (
        <div className="m-6 rounded-md border border-border bg-[oklch(0.96_0.06_70)]/30 p-4 text-[12px] text-text-secondary">
          Your role can view onboarding but not modify it. Contact an Owner or General Manager.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[260px_1fr]">
        {/* Stepper */}
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
                      <div className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${
                        done ? "bg-[var(--color-success)] text-white"
                          : active ? "bg-primary text-primary-foreground"
                          : "bg-surface-2 text-text-secondary"
                      }`}>
                        {done ? <Check className="h-3 w-3" /> : idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className={`flex items-center gap-1.5 text-[13px] font-medium ${active ? "text-primary-pressed" : "text-text-primary"}`}>
                          <Icon className="h-3.5 w-3.5" />{s.label}
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

        {/* Step content */}
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
                <ArrowLeft className="h-3.5 w-3.5" />Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button size="sm" onClick={() => setStep(step + 1)}>
                  Save & continue<ArrowRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button size="sm" onClick={finish} disabled={!canRun}>
                  <CheckCircle2 className="h-3.5 w-3.5" />Finish setup
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---------- Sub-steps ---------- */

type StepProps = { state: OnboardingState; setState: React.Dispatch<React.SetStateAction<OnboardingState>>; disabled: boolean };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-text-secondary">{label}</label>
      {children}
    </div>
  );
}
const inputCls = "h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 disabled:opacity-60";
const selectCls = inputCls;

function ProfileStep({ state, setState, disabled }: StepProps) {
  const p = state.profile;
  const set = (patch: Partial<OnboardingState["profile"]>) => setState(s => ({ ...s, profile: { ...s.profile, ...patch } }));
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Field label="Legal property name"><input disabled={disabled} className={inputCls} value={p.name} onChange={(e) => set({ name: e.target.value })} placeholder="The Grand Palace" /></Field>
      <Field label="Brand / chain"><input disabled={disabled} className={inputCls} value={p.brand} onChange={(e) => set({ brand: e.target.value })} placeholder="Grand Palace Hotels" /></Field>
      <Field label="Street address"><input disabled={disabled} className={inputCls} value={p.address} onChange={(e) => set({ address: e.target.value })} /></Field>
      <Field label="City"><input disabled={disabled} className={inputCls} value={p.city} onChange={(e) => set({ city: e.target.value })} /></Field>
      <Field label="Country"><input disabled={disabled} className={inputCls} value={p.country} onChange={(e) => set({ country: e.target.value })} /></Field>
      <Field label="Timezone">
        <select disabled={disabled} className={selectCls} value={p.timezone} onChange={(e) => set({ timezone: e.target.value })}>
          {["Asia/Kolkata","Asia/Dubai","Asia/Singapore","Europe/London","America/New_York"].map(t => <option key={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Currency">
        <select disabled={disabled} className={selectCls} value={p.currency} onChange={(e) => set({ currency: e.target.value })}>
          {["INR","USD","EUR","GBP","AED"].map(t => <option key={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Star rating">
        <select disabled={disabled} className={selectCls} value={p.starRating} onChange={(e) => set({ starRating: Number(e.target.value) })}>
          {[3,4,5].map(t => <option key={t} value={t}>{t} ★</option>)}
        </select>
      </Field>
      <Field label="GSTIN"><input disabled={disabled} className={inputCls} value={p.gstin} onChange={(e) => set({ gstin: e.target.value })} placeholder="07AAACR1234A1Z5" /></Field>
    </div>
  );
}

function RoomsStep({ state, setState, disabled }: StepProps) {
  const set = (rt: RoomType[]) => setState(s => ({ ...s, roomTypes: rt }));
  const update = (id: string, patch: Partial<RoomType>) => set(state.roomTypes.map(r => r.id === id ? { ...r, ...patch } : r));
  const remove = (id: string) => set(state.roomTypes.filter(r => r.id !== id));
  const add = () => set([...state.roomTypes, { id: `rt${Date.now()}`, name: "New Room Type", count: 10, baseRate: 5000, amenities: "" }]);
  const total = state.roomTypes.reduce((s, r) => s + r.count, 0);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-[13px] text-text-secondary">Total inventory: <span className="font-semibold text-text-primary">{total} rooms</span></div>
        <Button size="sm" variant="outline" onClick={add} disabled={disabled}><Plus className="h-3.5 w-3.5" />Add room type</Button>
      </div>
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-[13px]">
          <thead className="bg-surface-2/40">
            <tr>{["Name","Count","Base rate","Amenities",""].map(h => <th key={h} className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-text-secondary">{h}</th>)}</tr>
          </thead>
          <tbody>
            {state.roomTypes.map(r => (
              <tr key={r.id} className="border-t border-border-subtle">
                <td className="px-3 py-2"><input disabled={disabled} className={inputCls} value={r.name} onChange={(e) => update(r.id, { name: e.target.value })} /></td>
                <td className="px-3 py-2 w-24"><input disabled={disabled} type="number" className={inputCls} value={r.count} onChange={(e) => update(r.id, { count: Number(e.target.value) })} /></td>
                <td className="px-3 py-2 w-32"><input disabled={disabled} type="number" className={inputCls} value={r.baseRate} onChange={(e) => update(r.id, { baseRate: Number(e.target.value) })} /></td>
                <td className="px-3 py-2"><input disabled={disabled} className={inputCls} value={r.amenities} onChange={(e) => update(r.id, { amenities: e.target.value })} /></td>
                <td className="px-3 py-2 w-10">
                  <button disabled={disabled} onClick={() => remove(r.id)} className="rounded p-1.5 text-text-secondary hover:bg-[oklch(0.96_0.06_27)] hover:text-[var(--color-error)] disabled:opacity-30">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RatesStep({ state, setState, disabled }: StepProps) {
  const setTax = (patch: Partial<OnboardingState["rates"]["tax"]>) =>
    setState(s => ({ ...s, rates: { ...s.rates, tax: { ...s.rates.tax, ...patch } } }));
  return (
    <div className="space-y-6">
      <div>
        <div className="label-uppercase mb-2">Rate plans</div>
        <div className="space-y-2">
          {state.rates.plans.map(p => (
            <div key={p.id} className="flex items-center justify-between rounded-md border border-border bg-surface-2/30 px-3 py-2">
              <div>
                <div className="text-[13px] font-medium text-text-primary">{p.name}</div>
                <div className="text-[11px] text-text-secondary">{p.type} · Adjustment {p.adjustment}</div>
              </div>
              <StatusBadge tone="brand">Active</StatusBadge>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="label-uppercase mb-2">GST tax structure (India)</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label="CGST %"><input disabled={disabled} type="number" className={inputCls} value={state.rates.tax.cgst} onChange={(e) => setTax({ cgst: Number(e.target.value) })} /></Field>
          <Field label="SGST %"><input disabled={disabled} type="number" className={inputCls} value={state.rates.tax.sgst} onChange={(e) => setTax({ sgst: Number(e.target.value) })} /></Field>
          <Field label="IGST %"><input disabled={disabled} type="number" className={inputCls} value={state.rates.tax.igst} onChange={(e) => setTax({ igst: Number(e.target.value) })} /></Field>
          <Field label="Service charge %"><input disabled={disabled} type="number" className={inputCls} value={state.rates.tax.serviceCharge} onChange={(e) => setTax({ serviceCharge: Number(e.target.value) })} /></Field>
          <Field label="Lower slab applies under (₹)"><input disabled={disabled} type="number" className={inputCls} value={state.rates.tax.lowerSlabUnder} onChange={(e) => setTax({ lowerSlabUnder: Number(e.target.value) })} /></Field>
          <Field label="Lower slab GST %"><input disabled={disabled} type="number" className={inputCls} value={state.rates.tax.lowerSlabRate} onChange={(e) => setTax({ lowerSlabRate: Number(e.target.value) })} /></Field>
        </div>
      </div>
    </div>
  );
}

const STAFF_ROLES: Role[] = ["general_manager","front_office_manager","front_desk_agent","housekeeping_supervisor","accounts","revenue_manager"];

function StaffStep({ state, setState, disabled }: StepProps) {
  const set = (s: StaffInvite[]) => setState(prev => ({ ...prev, staff: s }));
  const add = () => set([...state.staff, { id: `s${Date.now()}`, name: "", email: "", role: "front_desk_agent" }]);
  const update = (id: string, patch: Partial<StaffInvite>) => set(state.staff.map(s => s.id === id ? { ...s, ...patch } : s));
  const remove = (id: string) => set(state.staff.filter(s => s.id !== id));
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-[13px] text-text-secondary">Invite key staff. They'll appear in <strong>Users & Access</strong> after finishing.</div>
        <Button size="sm" variant="outline" onClick={add} disabled={disabled}><Plus className="h-3.5 w-3.5" />Add invite</Button>
      </div>
      {state.staff.length === 0 ? (
        <div className="rounded-md border border-dashed border-border bg-surface-2/30 p-6 text-center text-[12px] text-text-secondary">No invites yet. Click <em>Add invite</em> to start.</div>
      ) : (
        <div className="space-y-2">
          {state.staff.map(s => (
            <div key={s.id} className="grid grid-cols-1 gap-2 rounded-md border border-border bg-surface p-3 md:grid-cols-[1fr_1.2fr_1fr_auto]">
              <input disabled={disabled} className={inputCls} placeholder="Full name" value={s.name} onChange={(e) => update(s.id, { name: e.target.value })} />
              <input disabled={disabled} className={inputCls} placeholder="Email" value={s.email} onChange={(e) => update(s.id, { email: e.target.value })} />
              <select disabled={disabled} className={selectCls} value={s.role} onChange={(e) => update(s.id, { role: e.target.value })}>
                {STAFF_ROLES.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
              </select>
              <button disabled={disabled} onClick={() => remove(s.id)} className="rounded p-1.5 text-text-secondary hover:bg-[oklch(0.96_0.06_27)] hover:text-[var(--color-error)] disabled:opacity-30 self-center">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function IntegrationsStep({ state, setState, disabled }: StepProps) {
  const toggle = (key: string) => setState(s => ({
    ...s, integrations: s.integrations.map(i => i.key === key ? { ...i, enabled: !i.enabled } : i),
  }));
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {state.integrations.map(i => (
        <div key={i.key} className="flex items-center justify-between rounded-md border border-border bg-surface p-4">
          <div>
            <div className="text-[13px] font-medium text-text-primary">{i.label}</div>
            <div className="text-[11px] text-text-secondary">{i.enabled ? "Connected (mock)" : "Not connected"}</div>
          </div>
          <button
            disabled={disabled}
            onClick={() => toggle(i.key)}
            className={`relative h-5 w-9 rounded-full transition ${i.enabled ? "bg-primary" : "bg-surface-2 border border-border"} disabled:opacity-60`}
          >
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition ${i.enabled ? "left-[18px]" : "left-0.5"}`} />
          </button>
        </div>
      ))}
    </div>
  );
}

function PoliciesStep({ state, setState, disabled }: StepProps) {
  const set = (patch: Partial<OnboardingState["policies"]>) => setState(s => ({ ...s, policies: { ...s.policies, ...patch } }));
  const p = state.policies;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Field label="Standard check-in time"><input disabled={disabled} type="time" className={inputCls} value={p.checkIn} onChange={(e) => set({ checkIn: e.target.value })} /></Field>
      <Field label="Standard check-out time"><input disabled={disabled} type="time" className={inputCls} value={p.checkOut} onChange={(e) => set({ checkOut: e.target.value })} /></Field>
      <Field label="Cancellation policy">
        <textarea disabled={disabled} className={`${inputCls} h-20 py-2`} value={p.cancellation} onChange={(e) => set({ cancellation: e.target.value })} />
      </Field>
      <Field label="No-show policy">
        <textarea disabled={disabled} className={`${inputCls} h-20 py-2`} value={p.noShow} onChange={(e) => set({ noShow: e.target.value })} />
      </Field>
      <Field label="Minor / accompanying guest policy">
        <textarea disabled={disabled} className={`${inputCls} h-20 py-2`} value={p.minorPolicy} onChange={(e) => set({ minorPolicy: e.target.value })} />
      </Field>
      <div className="flex items-end gap-6">
        <label className="flex items-center gap-2 text-[13px] text-text-primary">
          <input disabled={disabled} type="checkbox" checked={p.earlyCheckIn} onChange={(e) => set({ earlyCheckIn: e.target.checked })} />
          Allow early check-in (subject to availability)
        </label>
        <label className="flex items-center gap-2 text-[13px] text-text-primary">
          <input disabled={disabled} type="checkbox" checked={p.lateCheckOut} onChange={(e) => set({ lateCheckOut: e.target.checked })} />
          Allow late check-out
        </label>
      </div>
    </div>
  );
}

function ReviewStep({ state }: { state: OnboardingState }) {
  const totalRooms = state.roomTypes.reduce((s, r) => s + r.count, 0);
  const integrations = state.integrations.filter(i => i.enabled).map(i => i.label).join(", ") || "None";
  return (
    <div className="space-y-5">
      <p className="text-[13px] text-text-secondary">Review your configuration. Click <em>Finish setup</em> to commit invites and mark the property as live.</p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Summary title="Property">
          <Line k="Name" v={state.profile.name || "—"} />
          <Line k="Location" v={`${state.profile.city || "—"}, ${state.profile.country}`} />
          <Line k="Currency · TZ" v={`${state.profile.currency} · ${state.profile.timezone}`} />
          <Line k="GSTIN" v={state.profile.gstin || "—"} />
          <Line k="Rating" v={`${state.profile.starRating} ★`} />
        </Summary>
        <Summary title="Inventory">
          <Line k="Room types" v={String(state.roomTypes.length)} />
          <Line k="Total rooms" v={String(totalRooms)} />
        </Summary>
        <Summary title="Rates & Tax">
          <Line k="Rate plans" v={String(state.rates.plans.length)} />
          <Line k="GST" v={`CGST ${state.rates.tax.cgst}% · SGST ${state.rates.tax.sgst}% · IGST ${state.rates.tax.igst}%`} />
        </Summary>
        <Summary title="Staff invites">
          <Line k="Total" v={String(state.staff.length)} />
          {state.staff.slice(0, 3).map(s => <Line key={s.id} k={s.name || "(unnamed)"} v={s.email || "—"} />)}
        </Summary>
        <Summary title="Integrations">
          <div className="text-[12px] text-text-secondary">{integrations}</div>
        </Summary>
        <Summary title="Policies">
          <Line k="Check-in / out" v={`${state.policies.checkIn} / ${state.policies.checkOut}`} />
          <Line k="ID required" v={state.policies.idRequired.join(", ")} />
        </Summary>
      </div>
    </div>
  );
}

function Summary({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-surface-2/30 p-4">
      <div className="label-uppercase mb-2">{title}</div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 text-[12px]">
      <span className="text-text-secondary">{k}</span>
      <span className="truncate text-right font-medium text-text-primary">{v}</span>
    </div>
  );
}
