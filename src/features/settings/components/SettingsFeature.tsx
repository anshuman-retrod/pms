import { useState } from "react";
import { PageHeader, Card, CardHeader, Button, StatusBadge } from "@/components/ui/Primitives";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { FeatureKey } from "@/types/entitlements";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const integrations = [
  { name: "Stripe", desc: "Card capture & disbursements", status: "Connected" },
  { name: "Razorpay", desc: "UPI, netbanking, wallets · INR", status: "Connected" },
  { name: "SiteMinder", desc: "Channel management", status: "Connected" },
  { name: "Mailgun", desc: "Transactional emails", status: "Disconnected" },
  { name: "Twilio", desc: "SMS & WhatsApp comms", status: "Connected" },
  { name: "Tally ERP", desc: "Accounting export", status: "Disconnected" },
];

const TABS = [
  "Payments & Gateways",
  "Channels & Distribution",
  "Housekeeping & Operations",
  "Integrations",
  "Feature Entitlements",
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
  
  const [activeTab, setActiveTab] = useState(TABS[0]);
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

  // Render different contents based on activeTab
  const renderContent = () => {
    switch(activeTab) {

      case "Payments & Gateways":
        return (
          <Card>
            <CardHeader title="Payments & Gateways" hint="Online payments and deposit rules." />
            <div className="p-4 sm:p-5 grid gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Active Payment Gateway</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option>Razorpay</option>
                    <option>Stripe</option>
                    <option>PayPal</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Required Deposit</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option>Full Payment (100%)</option>
                    <option>First Night</option>
                    <option>No Deposit</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Pre-authorization</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <input type="checkbox" id="preauth" className="h-4 w-4 rounded border-gray-300 text-primary" defaultChecked />
                    <label htmlFor="preauth" className="text-sm text-text-primary">Automatically pre-authorize cards 48 hours before arrival</label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-border-subtle">
                <Button>Save Settings</Button>
              </div>
            </div>
          </Card>
        );

      case "Channels & Distribution":
        return (
          <Card>
            <CardHeader title="Channels & Distribution" hint="Manage OTA connections and inventory sync." />
            <div className="p-4 sm:p-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between border border-border-subtle rounded-md p-4 bg-surface-2/30">
                  <div>
                    <h4 className="font-medium text-[14px]">Hotel Spider (Channel Manager)</h4>
                    <p className="text-[12px] text-text-secondary">Syncs with 400+ OTAs including Booking.com, Expedia</p>
                  </div>
                  <StatusBadge tone="success">Connected & Syncing</StatusBadge>
                </div>
                
                <div className="flex items-center justify-between border border-border-subtle rounded-md p-4 bg-surface-2/30">
                  <div>
                    <h4 className="font-medium text-[14px]">Direct Booking Engine</h4>
                    <p className="text-[12px] text-text-secondary">Website widget integration</p>
                  </div>
                  <StatusBadge tone="success">Active</StatusBadge>
                </div>

                <div className="flex items-center justify-between border border-border-subtle rounded-md p-4 bg-surface-2/30">
                  <div>
                    <h4 className="font-medium text-[14px]">Agoda (Direct API)</h4>
                    <p className="text-[12px] text-text-secondary">Direct mapping bypassing Channel Manager</p>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </div>
            </div>
          </Card>
        );

      case "Housekeeping & Operations":
        return (
          <Card>
            <CardHeader title="Housekeeping & Operations" hint="Rules for cleaning, maintenance, and tasks." />
            <div className="p-4 sm:p-5 grid gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label>Auto-mark Rooms Dirty</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option>On check-out</option>
                    <option>Daily at 12:00 PM</option>
                    <option>Never (Manual only)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Linen Change Frequency</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option>Every 3 Days</option>
                    <option>Daily</option>
                    <option>On Request Only</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Default Task Deadline (Hours)</Label>
                  <Input type="number" defaultValue="2" />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-border-subtle">
                <Button>Save Operations Rules</Button>
              </div>
            </div>
          </Card>
        );

      case "Integrations":
        return (
          <Card>
            <CardHeader title="Third-Party Integrations" hint="Connect Retrod to your operational stack." />
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
        );

      case "Feature Entitlements":
        return (
          <Card>
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
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="System Settings"
        description="Configure your hotel's operations, policies, and integrations."
      />
      <div className="responsive-page-x grid grid-cols-1 gap-5 py-4 sm:py-6 lg:grid-cols-[220px_1fr]">
        <Card className="h-fit">
          <ul className="p-2 space-y-1">
            {TABS.map((tab) => (
              <li key={tab}>
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`w-full rounded-md px-3 py-2 text-left text-[13px] transition ${
                    activeTab === tab
                      ? "bg-primary-tint text-primary-pressed font-medium"
                      : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                  }`}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default SettingsFeature;
