import type { PlatformApps } from "@/types/platform";

export type FeatureKey =
  | "channelManager"
  | "websiteBuilder"
  | "bookingEngine"
  | "revenueAi"
  | "masterData";

export type FeatureFlags = Record<FeatureKey, boolean>;

export const DEFAULT_PLATFORM_APPS: PlatformApps = {
  pms: true,
  pos: true,
  crm: true,
  analytics: true,
  reports: true,
  channelManager: true,
  bookingEngine: true,
  aiHub: true,
  superadmin: true,
};

export interface PropertyEntitlements {
  property: string;
  features: Partial<FeatureFlags>;
  platformApps?: Partial<PlatformApps>;
}
