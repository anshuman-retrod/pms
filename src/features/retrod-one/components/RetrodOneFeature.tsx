import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Pin, Rocket, Star } from "lucide-react";
import { Button, Card, KpiCard } from "@/components/ui/Primitives";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { hasPermission } from "@/features/auth/lib/rbac";
import type { Permission } from "@/types/rbac";
import { ApplicationCard } from "./ApplicationCard";
import { RetrodOneHeader } from "./RetrodOneHeader";
import { PLATFORM_APPLICATIONS } from "../lib/applications";
import { loadPlatformFavorites, toggleFavoritePin } from "../lib/favorites-store";
import {
  DEFAULT_FAVORITES,
  PLATFORM_STATS,
  QUICK_ACTIONS,
} from "../lib/platform-data";
import type { PlatformFavorite, PlatformQuickAction } from "@/types/platform";
import { cn } from "@/lib/utils";
import { subscriptionApi } from "@/services/api/subscription";
import { auditApi, type AuditLog } from "@/services/api/audit";
import { tenantApi, type DashboardStats } from "@/services/api/tenant";
import { resolvePlatformApps } from "../lib/access";

function formatRelativeTime(isoString: string): string {
  try {
    const now = new Date();
    const past = new Date(isoString);
    const diffMs = now.getTime() - past.getTime();
    if (isNaN(diffMs) || diffMs < 0) return "Just now";

    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffSecs < 60) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHrs < 24) return `${diffHrs} hr ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  } catch {
    return "Just now";
  }
}

function getAuditDisplay(log: AuditLog) {
  let tone = "brand";
  const action = log.action_type?.toUpperCase() || "";
  if (action === "LOGIN" || action === "LOGOUT" || action === "ACCESS") {
    tone = "info";
  } else if (action === "CREATED" || action.includes("CREATE") || action.includes("ADD") || action.includes("CHECKIN")) {
    tone = "success";
  } else if (action === "DELETED" || action.includes("DELETE") || action.includes("REMOVE")) {
    tone = "warning";
  } else if (action === "UPDATED" || action.includes("UPDATE") || action.includes("EDIT")) {
    tone = "brand";
  }

  let title = "";
  if (log.action_type && log.target_entity) {
    const entity = log.target_entity.charAt(0).toUpperCase() + log.target_entity.slice(1).replace(/_/g, " ");
    if (action === "CREATED") {
      title = `${entity} Created`;
    } else if (action === "UPDATED") {
      title = `${entity} Updated`;
    } else if (action === "DELETED") {
      title = `${entity} Deleted`;
    } else {
      const actionWord = log.action_type
        .split("_")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
      title = `${entity} ${actionWord}`;
    }
  } else {
    title = log.action_type || "Activity Logged";
  }

  const formattedRole = log.actor_role_code
    ? log.actor_role_code.replace(/_/g, " ").toUpperCase()
    : "USER";
  const detail = `By ${log.actor_name || "Unknown"} (${formattedRole}) ${
    log.target_id ? `· ID: ${log.target_id.slice(0, 8)}` : ""
  }`;

  return { tone, title, detail };
}

function filterQuickActions(
  actions: PlatformQuickAction[],
  can: (perm: Permission) => boolean,
  role: ReturnType<typeof useAuth>["user"],
  entitlements: any,
): PlatformQuickAction[] {
  const platformApps = resolvePlatformApps(entitlements);

  return actions.filter((action) => {
    // Map action to its respective application key
    let appKey: keyof typeof platformApps = "pms";
    if (action.id === "qa-pos") {
      appKey = "pos";
    } else if (action.id === "qa-lead") {
      appKey = "crm";
    } else if (action.id === "qa-rep") {
      appKey = "reports";
    }

    // Hide quick actions for applications the property hasn't subscribed to
    if (!platformApps[appKey]) return false;

    if (action.id === "qa-pos") {
      return role?.role
        ? ["super_admin", "owner", "general_manager", "accounts"].includes(role.role)
        : false;
    }
    if (!action.anyPermissions?.length) return true;
    return action.anyPermissions.some((perm) => can(perm));
  });
}

const activityTone: Record<string, string> = {
  brand: "bg-primary",
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
};

export function RetrodOneFeature() {
  const { user, entitlements, featureEnabled, can } = useAuth();
  const [favorites, setFavorites] = useState<PlatformFavorite[]>(() => loadPlatformFavorites());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [productFeatures, setProductFeatures] = useState<any[]>([]);
  const [subscribedProducts, setSubscribedProducts] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        const [allProdsRes, tenantProdsRes, logsRes, featuresRes, statsRes] = await Promise.allSettled([
          subscriptionApi.getProducts(),
          subscriptionApi.getTenantProducts(),
          auditApi.getAuditLogs(),
          subscriptionApi.getFeatures(),
          tenantApi.getDashboardStats()
        ]);
        
        if (!active) return;

        if (allProdsRes.status === "fulfilled") {
          setAllProducts(allProdsRes.value || []);
        }

        if (tenantProdsRes.status === "fulfilled") {
          setSubscribedProducts(tenantProdsRes.value || []);
        }
        
        if (logsRes.status === "fulfilled") {
          setAuditLogs(logsRes.value || []);
        }

        if (featuresRes.status === "fulfilled") {
          setProductFeatures(featuresRes.value || []);
        }

        if (statsRes.status === "fulfilled") {
          setDashboardStats(statsRes.value || null);
        }
      } catch (err) {
        console.error("Error loading platform data:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, []);

  const visibleApps = useMemo(() => {
    const isSuperAdmin = user?.role === "super_admin";
    
    const productList = isSuperAdmin ? allProducts : subscribedProducts;
    const allowedCodes = productList.map((c: any) => (c.code || c.product_code || c.product?.code || "").toLowerCase()).filter(Boolean);
    
    const keyToProductCodeMap: Record<string, string[]> = {
      pms: ["pms"],
      pos: ["pos"],
      crm: ["crm"],
      analytics: ["analytics"],
      reports: ["reports"],
      channelManager: ["channel_manager", "channelmanager", "channel manager"],
      bookingEngine: ["booking_engine", "bookingengine"],
      aiHub: ["ai_hub", "aihub", "revenue_management"],
    };

    return PLATFORM_APPLICATIONS.filter(app => {
      if (app.key === "superadmin") {
        return isSuperAdmin;
      }
      const productCodes = keyToProductCodeMap[app.key] || [app.key.toLowerCase()];
      return productCodes.some(code => allowedCodes.includes(code));
    }).map(app => {
      if (app.key === "superadmin") return app;

      const productCodes = keyToProductCodeMap[app.key] || [app.key.toLowerCase()];
      const backendProduct = allProducts.find((p: any) => p.code && productCodes.includes(p.code.toLowerCase()));
      
      if (backendProduct) {
        const backendFeatures = productFeatures.filter((f: any) => f.product === backendProduct.id).map((f: any) => f.name);
        return {
          ...app,
          title: backendProduct.name,
          description: backendProduct.description || app.description,
          features: backendFeatures.length > 0 ? backendFeatures : app.features,
          status: "active",
        };
      }
      return app;
    });
  }, [user?.role, allProducts, subscribedProducts, productFeatures]);

  const quickActions = useMemo(
    () => filterQuickActions(QUICK_ACTIONS, can, user, entitlements),
    [can, user, entitlements],
  );

  const firstName = user?.name?.split(" ")[0] ?? "there";

  const handlePin = (item: PlatformFavorite) => {
    setFavorites(toggleFavoritePin(favorites, item));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <RetrodOneHeader />

      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
        {/* Welcome hero */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-e2 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-info/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="label-uppercase text-primary">Retrod One Platform</p>
              <h1 className="mt-2 font-display text-[28px] font-semibold leading-tight text-text-primary sm:text-[34px]">
                Welcome back, {firstName}
              </h1>
              <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-text-secondary sm:text-[15px]">
                Manage your hospitality business from one unified platform.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link to="/">
                  <Button size="sm">
                    <Rocket className="h-3.5 w-3.5" />
                    Launch PMS
                  </Button>
                </Link>
                <Link to={user?.role === "super_admin" ? "/superadmin/settings" : "/settings"}>
                  <Button variant="outline" size="sm">
                    Platform settings
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 lg:max-w-3xl">
              <KpiCard
                label="Properties"
                value={dashboardStats?.properties !== undefined ? String(dashboardStats.properties) : String(user && user.properties && user.properties.length > 0 ? user.properties.length : PLATFORM_STATS.properties)}
                accent="brand"
              />
              <KpiCard
                label="Active Users"
                value={dashboardStats?.active_users !== undefined ? String(dashboardStats.active_users) : String(PLATFORM_STATS.activeUsers)}
                accent="info"
              />
              <KpiCard
                label="Occupancy Today"
                value={dashboardStats?.occupancy_today || PLATFORM_STATS.occupancyToday}
                accent="success"
              />
              <KpiCard
                label="Revenue Today"
                value={dashboardStats?.revenue_today || PLATFORM_STATS.revenueToday}
                accent="warning"
              />
            </div>
          </div>
        </section>

        {/* Applications */}
        <section className="mt-10" aria-labelledby="apps-heading">
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="apps-heading" className="font-display text-[22px] font-semibold text-text-primary">
                Applications
              </h2>
              <p className="mt-1 text-[13px] text-text-secondary">
                Access your hospitality tools and services
              </p>
            </div>
            <p className="text-[12px] text-text-secondary">
              Showing {visibleApps.length} app{visibleApps.length === 1 ? "" : "s"} for your role
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((n) => (
                <Card key={n} className="animate-pulse p-6">
                  <div className="h-6 w-1/2 rounded bg-border-subtle"></div>
                  <div className="mt-3 h-4 w-5/6 rounded bg-border-subtle"></div>
                  <div className="mt-2 h-4 w-4/6 rounded bg-border-subtle"></div>
                  <div className="mt-5 h-8 w-1/3 rounded bg-border-subtle"></div>
                </Card>
              ))}
            </div>
          ) : visibleApps.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-[14px] text-text-secondary">
                No applications are enabled for your account. Contact your administrator.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {visibleApps.map((app) => (
                <ApplicationCard key={app.key} app={app} />
              ))}
            </div>
          )}
        </section>

        {/* Quick actions */}
        <section className="mt-10" aria-labelledby="quick-actions-heading">
          <h2
            id="quick-actions-heading"
            className="font-display text-[20px] font-semibold text-text-primary"
          >
            Quick Actions
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.id}
                  to={action.route}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-surface px-3 py-4 text-center shadow-e1 transition hover:border-primary/30 hover:shadow-e2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 text-primary transition group-hover:bg-primary-tint">
                    <Icon className="h-4 w-4" aria-hidden />
                  </div>
                  <span className="text-[12px] font-medium leading-snug text-text-primary">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent activity */}
          <section className="lg:col-span-2" aria-labelledby="activity-heading">
            <Card className="overflow-hidden">
              <div className="border-b border-border-subtle px-5 py-4">
                <h2 id="activity-heading" className="font-display text-[18px] font-semibold text-text-primary">
                  Recent Activity
                </h2>
              </div>
              <ul className="divide-y divide-border-subtle">
                {loading ? (
                  [1, 2, 3, 4, 5].map((n) => (
                    <li key={n} className="flex gap-4 px-5 py-4 animate-pulse">
                      <div className="h-2.5 w-2.5 rounded-full bg-border-subtle mt-1 shrink-0"></div>
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="h-4 w-1/4 rounded bg-border-subtle"></div>
                        <div className="h-3 w-1/2 rounded bg-border-subtle"></div>
                      </div>
                    </li>
                  ))
                ) : auditLogs.length === 0 ? (
                  <li className="px-5 py-8 text-center text-[13px] text-text-secondary">
                    No recent activity found.
                  </li>
                ) : (
                  auditLogs.slice(0, 5).map((item) => {
                    const { tone, title, detail } = getAuditDisplay(item);
                    return (
                      <li key={item.id} className="flex gap-4 px-5 py-4">
                        <div className="relative mt-1 flex flex-col items-center">
                          <span
                            className={cn(
                              "h-2.5 w-2.5 rounded-full",
                              activityTone[tone] ?? "bg-border",
                            )}
                          />
                          <span className="mt-1 h-full w-px bg-border-subtle" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] font-semibold text-text-primary">{title}</div>
                          <div className="mt-0.5 text-[12px] text-text-secondary">{detail}</div>
                        </div>
                        <time className="shrink-0 text-[11px] text-text-disabled">
                          {formatRelativeTime(item.timestamp)}
                        </time>
                      </li>
                    );
                  })
                )}
              </ul>
            </Card>
          </section>

          {/* Favorites */}
          <section aria-labelledby="favorites-heading">
            <Card className="h-full">
              <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
                <div>
                  <h2 id="favorites-heading" className="font-display text-[18px] font-semibold text-text-primary">
                    Favorites
                  </h2>
                  <p className="text-[11px] text-text-secondary">Pin modules you use most</p>
                </div>
                <Star className="h-4 w-4 text-gold" aria-hidden />
              </div>
              <ul className="space-y-2 p-4">
                {DEFAULT_FAVORITES.map((item) => {
                  const pinned = favorites.some((f) => f.id === item.id);
                  return (
                    <li
                      key={item.id}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-3 py-2.5 transition",
                        pinned
                          ? "border-primary/25 bg-primary-tint/20"
                          : "border-border-subtle bg-surface hover:bg-surface-2",
                      )}
                    >
                      <Link
                        to={item.route}
                        className="flex min-w-0 flex-1 items-center gap-2 text-[13px] font-medium text-text-primary"
                      >
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-primary" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handlePin(item)}
                        className={cn(
                          "rounded-md p-1.5 transition",
                          pinned
                            ? "bg-primary text-primary-foreground"
                            : "text-text-secondary hover:bg-surface-2 hover:text-text-primary",
                        )}
                        aria-label={pinned ? `Unpin ${item.label}` : `Pin ${item.label}`}
                      >
                        <Pin className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
