import { type OnboardingState } from "@/lib/onboarding-store";

interface ReviewStepProps {
  state: OnboardingState;
}

export function ReviewStep({ state }: ReviewStepProps) {
  const totalRooms = state.roomTypes.reduce((s, r) => s + r.count, 0);
  const integrations = state.integrations
    .filter((i) => i.enabled)
    .map((i) => i.label)
    .join(", ") || "None";

  return (
    <div className="space-y-5">
      <p className="text-[13px] text-text-secondary">
        Review your configuration. Click <em>Finish setup</em> to commit invites and mark the property as live.
      </p>
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
          {state.staff.slice(0, 3).map((s) => (
            <Line key={s.id} k={s.name || "(unnamed)"} v={s.email || "—"} />
          ))}
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
export default ReviewStep;
