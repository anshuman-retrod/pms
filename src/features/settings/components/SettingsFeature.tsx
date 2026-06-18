import { PageHeader, Card, CardHeader, Button } from "@/components/ui/Primitives";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { FeatureKey } from "@/types/entitlements";

const integrations = [
  { name: "Stripe", desc: "Card capture & disbursements", status: "Connected" },
  { name: "Razorpay", desc: "UPI, netbanking, wallets · INR", status: "Connected" },
  { name: "SiteMinder", desc: "Channel management", status: "Connected" },
  { name: "Mailgun", desc: "Transactional emails", status: "Disconnected" },
  { name: "Twilio", desc: "SMS & WhatsApp comms", status: "Connected" },
  { name: "Tally ERP", desc: "Accounting export", status: "Disconnected" },
];

export function SettingsFeature() {
  const {
    user,
    entitlements,
    effectiveFeatures,
    setTenantFeature,
    setPropertyFeatures,
    setEntitlementPlan,
  } = useAuth();
  const activeProperty = user?.property || "The Grand Palace";
  const featureRows: Array<{ key: FeatureKey; label: string; hint: string }> = [
    {
      key: "channelManager",
      label: "Channel Manager",
      hint: "OTA connectivity, mapping, sync, and distribution control.",
    },
    {
      key: "websiteBuilder",
      label: "Website Builder",
      hint: "Website pages, content authoring, and brand publishing.",
    },
    {
      key: "bookingEngine",
      label: "Booking Engine",
      hint: "Direct booking journey and offer management.",
    },
    {
      key: "revenueAi",
      label: "AI Revenue Features",
      hint: "AI demand forecasting and pricing decision support.",
    },
    {
      key: "masterData",
      label: "Master Data",
      hint: "Centralized master catalog and reference-data controls.",
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="System Settings"
        description="Account, security, and integrations."
      />
      <div className="responsive-page-x grid grid-cols-1 gap-5 py-4 sm:py-6 lg:grid-cols-[220px_1fr]">
        <Card>
          <ul className="p-2">
            {[
              "Account",
              "Security",
              "Notifications",
              "Integrations",
              "API & Webhooks",
              "Billing",
            ].map((s, i) => (
              <li key={s}>
                <button
                  className={`w-full rounded-md px-3 py-2 text-left text-[13px] transition ${
                    i === 3
                      ? "bg-primary-tint text-primary-pressed font-medium"
                      : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                  }`}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Integrations" hint="Connect Retrod to your operational stack" />
          <ul className="divide-y divide-border-subtle">
            {integrations.map((it) => (
              <li
                key={it.name}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-5 sm:py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-surface-2 font-display text-[14px] font-semibold text-text-primary">
                    {it.name[0]}
                  </div>
                  <div>
                    <div className="text-[14px] font-medium text-text-primary">{it.name}</div>
                    <div className="text-[12px] text-text-secondary">{it.desc}</div>
                  </div>
                </div>
                <Button variant={it.status === "Connected" ? "outline" : "primary"} size="sm">
                  {it.status === "Connected" ? "Manage" : "Connect"}
                </Button>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="lg:col-start-2">
          <CardHeader
            title="Tenant Feature Entitlements"
            hint="Control module visibility by tenant plan and property override."
          />
          <div className="space-y-4 p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[220px_1fr]">
              <label className="text-[12px] font-medium text-text-secondary">Tenant Plan</label>
              <select
                className="h-9 rounded-md border border-border bg-surface px-3 text-[13px]"
                value={entitlements.plan}
                onChange={(event) =>
                  setEntitlementPlan(event.target.value as "starter" | "growth" | "enterprise")
                }
              >
                <option value="starter">Starter</option>
                <option value="growth">Growth</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            <div className="rounded-md border border-border-subtle bg-surface-2/20 p-3">
              <div className="mb-2 text-[12px] font-semibold text-text-primary">
                Tenant-level features
              </div>
              <div className="space-y-2">
                {featureRows.map((row) => (
                  <label
                    key={`tenant-${row.key}`}
                    className="flex items-center justify-between gap-3 rounded-md border border-border-subtle bg-surface px-3 py-2"
                  >
                    <span>
                      <span className="block text-[13px] font-medium text-text-primary">
                        {row.label}
                      </span>
                      <span className="block text-[11px] text-text-secondary">{row.hint}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={entitlements.features[row.key]}
                      onChange={(event) => setTenantFeature(row.key, event.target.checked)}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-border-subtle bg-surface-2/20 p-3">
              <div className="mb-2 text-[12px] font-semibold text-text-primary">
                Property override: {activeProperty}
              </div>
              <div className="space-y-2">
                {featureRows.map((row) => (
                  <label
                    key={`property-${row.key}`}
                    className="flex items-center justify-between gap-3 rounded-md border border-border-subtle bg-surface px-3 py-2"
                  >
                    <span className="text-[13px] text-text-primary">{row.label}</span>
                    <input
                      type="checkbox"
                      checked={effectiveFeatures[row.key]}
                      onChange={(event) =>
                        setPropertyFeatures(activeProperty, { [row.key]: event.target.checked })
                      }
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
export default SettingsFeature;
