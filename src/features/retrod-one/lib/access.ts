import { hasPermission } from "@/features/auth/lib/rbac";
import type { TenantEntitlements } from "@/types/auth";
import type { FeatureKey } from "@/types/entitlements";
import { DEFAULT_PLATFORM_APPS } from "@/types/entitlements";
import type { PlatformAppDefinition, PlatformAppKey, PlatformApps, PlatformAppStatus } from "@/types/platform";
import type { Role } from "@/types/rbac";
import { PLATFORM_APPLICATIONS } from "./applications";

const ACTIVE_ACCENTS: Partial<Record<PlatformAppKey, string>> = {
  channelManager: "from-info/15 to-info/5 border-info/25",
  bookingEngine: "from-success/15 to-success/5 border-success/25",
  aiHub: "from-primary/15 to-primary/5 border-primary/20",
};

const COMING_SOON_ACCENT = "from-muted/30 to-surface-2 border-border-subtle";

export function resolvePlatformApps(entitlements: TenantEntitlements): PlatformApps {
  return {
    ...DEFAULT_PLATFORM_APPS,
    ...entitlements.platformApps,
  };
}

export function resolveAppStatus(
  app: PlatformAppDefinition,
  featureEnabled: (feature: FeatureKey) => boolean,
): PlatformAppStatus {
  if (app.feature) {
    return featureEnabled(app.feature) ? "active" : "coming_soon";
  }
  return app.status;
}

export function resolveAppForDisplay(
  app: PlatformAppDefinition,
  featureEnabled: (feature: FeatureKey) => boolean,
): PlatformAppDefinition {
  const status = resolveAppStatus(app, featureEnabled);
  const accentClass =
    status === "active"
      ? (ACTIVE_ACCENTS[app.key] ?? app.accentClass)
      : COMING_SOON_ACCENT;

  return { ...app, status, accentClass };
}

export function canAccessPlatformApp(
  role: Role | undefined,
  platformApps: PlatformApps,
  app: PlatformAppDefinition,
): boolean {
  if (!role) return false;
  if (!platformApps[app.key]) return false;
  if (app.roles?.length && !app.roles.includes(role)) return false;
  if (app.anyPermissions?.length) {
    return app.anyPermissions.some((perm) => hasPermission(role, perm));
  }
  return true;
}

export function getVisiblePlatformApps(
  role: Role | undefined,
  entitlements: TenantEntitlements,
  featureEnabled: (feature: FeatureKey) => boolean,
): PlatformAppDefinition[] {
  const platformApps = resolvePlatformApps(entitlements);
  return PLATFORM_APPLICATIONS.filter((app) => canAccessPlatformApp(role, platformApps, app)).map(
    (app) => resolveAppForDisplay(app, featureEnabled),
  );
}

export function getPlatformApp(key: PlatformAppKey): PlatformAppDefinition | undefined {
  return PLATFORM_APPLICATIONS.find((app) => app.key === key);
}

export function isPosPath(pathname: string): boolean {
  return pathname === "/pos" || pathname.startsWith("/pos/");
}
