import { PageHeader, Card, CardHeader, Button } from "@/components/ui/Primitives";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { FeatureKey } from "@/types/entitlements";
import { useState, useEffect } from "react";
import { authApi } from "@/services/auth-api";
import { toast } from "sonner";

const integrations = [
  { name: "Stripe", desc: "Card capture & disbursements", status: "Connected" },
  { name: "Razorpay", desc: "UPI, netbanking, wallets · INR", status: "Connected" },
  { name: "SiteMinder", desc: "Channel management", status: "Connected" },
  { name: "Mailgun", desc: "Transactional emails", status: "Disconnected" },
  { name: "Twilio", desc: "SMS & WhatsApp comms", status: "Connected" },
  { name: "Tally ERP", desc: "Accounting export", status: "Disconnected" },
];

export function SettingsFeature() {
  const { user, entitlements, effectiveFeatures, setTenantFeature, setPropertyFeatures, setEntitlementPlan } =
    useAuth();
  const activeProperty = user?.property || "The Grand Palace";

  const [activeTab, setActiveTab] = useState<string>("Integrations");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmNewPwd, setConfirmNewPwd] = useState("");
  const [loading, setLoading] = useState(false);

  // Session state
  const [sessionList, setSessionList] = useState<any[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  const loadSessions = async () => {
    setSessionsLoading(true);
    try {
      const data = await authApi.getSessions();
      setSessionList(data);
    } catch (err: any) {
      toast.error("Failed to load active sessions: " + err.message);
    } finally {
      setSessionsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "Security") {
      loadSessions();
    }
  }, [activeTab]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPwd || !confirmNewPwd) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPwd !== confirmNewPwd) {
      toast.error("New passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await authApi.changePassword({
        old_password: currentPassword,
        new_password: newPwd,
      });
      toast.success("Password changed successfully.");
      setCurrentPassword("");
      setNewPwd("");
      setConfirmNewPwd("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeSession = async (sessId: string) => {
    try {
      await authApi.revokeSession(sessId);
      toast.success("Session revoked successfully.");
      loadSessions();
    } catch (err: any) {
      toast.error("Failed to revoke session: " + err.message);
    }
  };

  const handleLogoutAll = async () => {
    try {
      await authApi.logoutAllSessions();
      toast.success("Logged out of all sessions successfully.");
      loadSessions();
    } catch (err: any) {
      toast.error("Failed to logout all sessions: " + err.message);
    }
  };

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
            ].map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => setActiveTab(s)}
                  className={`w-full rounded-md px-3 py-2 text-left text-[13px] transition ${
                    activeTab === s
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

        {activeTab === "Integrations" && (
          <div className="space-y-5">
            <Card>
              <CardHeader title="Integrations" hint="Connect Retrod to your operational stack" />
              <ul className="divide-y divide-border-subtle">
                {integrations.map((it) => (
                  <li key={it.name} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-5 sm:py-4">
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
                  <div className="mb-2 text-[12px] font-semibold text-text-primary">Tenant-level features</div>
                  <div className="space-y-2">
                    {featureRows.map((row) => (
                      <label
                        key={`tenant-${row.key}`}
                        className="flex items-center justify-between gap-3 rounded-md border border-border-subtle bg-surface px-3 py-2"
                      >
                        <span>
                          <span className="block text-[13px] font-medium text-text-primary">{row.label}</span>
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
        )}

        {activeTab === "Security" && (
          <div className="space-y-5">
            <Card>
              <CardHeader title="Change Password" hint="Ensure a strong password to protect your administrator privileges." />
              <form onSubmit={handleChangePassword} className="space-y-4 p-4 sm:p-5 max-w-md">
                <div className="flex flex-col gap-3">
                  <input
                    type="password"
                    required
                    placeholder="Current Password"
                    className="h-9 rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary focus:border-primary focus:outline-none"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    required
                    placeholder="New Password"
                    className="h-9 rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary focus:border-primary focus:outline-none"
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                  />
                  <input
                    type="password"
                    required
                    placeholder="Confirm New Password"
                    className="h-9 rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary focus:border-primary focus:outline-none"
                    value={confirmNewPwd}
                    onChange={(e) => setConfirmNewPwd(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </Card>

            <Card>
              <div className="flex items-center justify-between border-b border-border p-4 sm:px-5">
                <div>
                  <h3 className="text-[14px] font-bold text-text-primary">Active Sessions</h3>
                  <p className="text-[12px] text-text-secondary">Track or terminate logins on other browsers and devices.</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogoutAll}
                  className="border-error hover:bg-error-tint hover:text-error text-error text-[12.5px]"
                >
                  Logout All Sessions
                </Button>
              </div>
              {sessionsLoading ? (
                <div className="p-6 text-center text-[12.5px] text-text-secondary">Loading active sessions...</div>
              ) : sessionList.length === 0 ? (
                <div className="p-6 text-center text-[12.5px] text-text-secondary">No active sessions tracked.</div>
              ) : (
                <ul className="divide-y divide-border-subtle">
                  {sessionList.map((sess: any) => (
                    <li key={sess.id} className="flex items-center justify-between p-4 sm:px-5 hover:bg-sidebar-hover/10 transition-colors">
                      <div>
                        <div className="text-[13.5px] font-semibold text-text-primary">
                          {sess.device.split(" ").slice(0, 3).join(" ") || "Unknown Browser"}
                        </div>
                        <div className="text-[11.5px] text-text-secondary mt-0.5">
                          IP Address: <span className="font-mono">{sess.ip}</span> · Started: {new Date(sess.started_at).toLocaleString()}
                        </div>
                      </div>
                      {sess.is_active ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-error text-error hover:bg-error-tint"
                          onClick={() => handleRevokeSession(sess.id)}
                        >
                          Revoke
                        </Button>
                      ) : (
                        <span className="text-[11px] bg-neutral-light px-2.5 py-0.5 rounded text-text-muted">Revoked</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        )}

        {(activeTab !== "Integrations" && activeTab !== "Security") && (
          <Card className="p-6 text-center text-text-secondary text-[13.5px]">
            The {activeTab} panel configuration is managed globally by the system host.
          </Card>
        )}
      </div>
    </div>
  );
}
export default SettingsFeature;
