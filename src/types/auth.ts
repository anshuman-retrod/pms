import { Role } from "./rbac";
import type { FeatureFlags, PropertyEntitlements } from "./entitlements";
import type { PlatformApps } from "./platform";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  initials: string;
  active: boolean;
  property: string;
  lastActive?: string;
  properties?: Array<{ id: string; name: string; role: string }>;
  password?: string;
  avatarUrl?: string;
}

export interface TenantEntitlements {
  tenantId: string;
  plan: "starter" | "growth" | "enterprise";
  features: FeatureFlags;
  platformApps?: Partial<PlatformApps>;
  propertyOverrides?: PropertyEntitlements[];
}

export interface AuthSession {
  user: AppUser;
  token: string;
}
