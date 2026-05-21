import { PageHeader, Card, CardHeader, Button } from "@/components/ui/Primitives";

const integrations = [
  { name: "Stripe", desc: "Card capture & disbursements", status: "Connected" },
  { name: "Razorpay", desc: "UPI, netbanking, wallets · INR", status: "Connected" },
  { name: "SiteMinder", desc: "Channel management", status: "Connected" },
  { name: "Mailgun", desc: "Transactional emails", status: "Disconnected" },
  { name: "Twilio", desc: "SMS & WhatsApp comms", status: "Connected" },
  { name: "Tally ERP", desc: "Accounting export", status: "Disconnected" },
];

export function SettingsFeature() {
  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="System Settings"
        description="Account, security, and integrations."
      />
      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[220px_1fr]">
        <Card>
          <ul className="p-2">
            {["Account", "Security", "Notifications", "Integrations", "API & Webhooks", "Billing"].map((s, i) => (
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
              <li key={it.name} className="flex items-center justify-between px-5 py-4">
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
      </div>
    </div>
  );
}
export default SettingsFeature;
