import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { type Permission, type Role } from "@/types/rbac";
import { type AppUser, type TenantEntitlements } from "@/types/auth";
import type { FeatureFlags, FeatureKey } from "@/types/entitlements";
import { DEFAULT_PLATFORM_APPS } from "@/types/entitlements";
import { hasPermission, ROLE_LABEL } from "../lib/rbac";

export interface AuthCtx {
  user: AppUser | null;
  users: AppUser[];
  auditEvents: AuthAuditEvent[];
  entitlements: TenantEntitlements;
  featureEnabled: (feature: FeatureKey) => boolean;
  effectiveFeatures: FeatureFlags;
  setTenantFeature: (feature: FeatureKey, enabled: boolean) => void;
  setPropertyFeatures: (property: string, features: Partial<FeatureFlags>) => void;
  setEntitlementPlan: (plan: TenantEntitlements["plan"]) => void;
  isAuthenticated: boolean;
  login: (userId: string) => void;
  logout: () => void;
  can: (perm: Permission) => boolean;
  switchRole: (role: Role) => void;
  inviteUser: (u: Omit<AppUser, "id" | "initials" | "active" | "lastActive">) => void;
  updateUser: (id: string, patch: Partial<AppUser>) => void;
  deleteUser: (id: string) => void;
  roleLabel: (r: Role) => string;
  logAuditEvent: (action: string, target?: string, detail?: string) => void;
}

export const Ctx = createContext<AuthCtx | null>(null);

export interface AuthAuditEvent {
  id: string;
  ts: string;
  actor: string;
  actorRole: string;
  action: string;
  target?: string;
  detail?: string;
}

const SEED_USERS: AppUser[] = [
  {
    id: "u0",
    name: "Retrod Admin",
    email: "admin@retrod.in",
    role: "super_admin",
    initials: "RA",
    active: true,
    property: "Retrod Global HQ",
    lastActive: "Just now",
  },
  {
    id: "u_prabhat",
    name: "Prabhat",
    email: "prabhat@retrod.in",
    role: "super_admin",
    initials: "P",
    active: true,
    property: "Retrod Global HQ",
    lastActive: "Just now",
  },
  {
    id: "u1",
    name: "Aarav Malhotra",
    email: "aarav@grandpalace.in",
    role: "owner",
    initials: "AM",
    active: true,
    property: "The Grand Palace",
    lastActive: "Just now",
  },
  {
    id: "u2",
    name: "Vikram Shah",
    email: "vikram@grandpalace.in",
    role: "general_manager",
    initials: "VS",
    active: true,
    property: "The Grand Palace",
    lastActive: "5 min ago",
  },
  {
    id: "u3",
    name: "Neha Kapoor",
    email: "neha@grandpalace.in",
    role: "front_office_manager",
    initials: "NK",
    active: true,
    property: "The Grand Palace",
    lastActive: "12 min ago",
  },
  {
    id: "u4",
    name: "Rohan Verma",
    email: "rohan@grandpalace.in",
    role: "front_desk_agent",
    initials: "RV",
    active: true,
    property: "The Grand Palace",
    lastActive: "2 min ago",
  },
  {
    id: "u5",
    name: "Priya Reddy",
    email: "priya@grandpalace.in",
    role: "housekeeping_supervisor",
    initials: "PR",
    active: true,
    property: "The Grand Palace",
    lastActive: "1 hr ago",
  },
  {
    id: "u6",
    name: "Ananya Bose",
    email: "ananya@grandpalace.in",
    role: "accounts",
    initials: "AB",
    active: true,
    property: "The Grand Palace",
    lastActive: "Yesterday",
  },
  {
    id: "u7",
    name: "Kabir Singh",
    email: "kabir@grandpalace.in",
    role: "revenue_manager",
    initials: "KS",
    active: true,
    property: "The Grand Palace",
    lastActive: "30 min ago",
  },
];

const LS_USER = "retrod.auth.user";
const LS_USERS = "retrod.auth.users";
const LS_ENTITLEMENTS = "retrod.auth.entitlements";
const LS_AUDIT_EVENTS = "retrod.auth.audit-events";

const DEFAULT_ENTITLEMENTS: TenantEntitlements = {
  tenantId: "retrod-demo-tenant",
  plan: "growth",
  features: {
    channelManager: true,
    websiteBuilder: true,
    bookingEngine: true,
    revenueAi: true,
    masterData: true,
  },
  platformApps: { ...DEFAULT_PLATFORM_APPS },
  propertyOverrides: [
    {
      property: "The Grand Palace",
      features: {
        channelManager: true,
        websiteBuilder: true,
        bookingEngine: true,
        revenueAi: true,
        masterData: true,
      },
    },
  ],
};

function loadUsers(): AppUser[] {
  if (typeof window === "undefined") return SEED_USERS;
  try {
    const raw = localStorage.getItem(LS_USERS);
    if (!raw) return SEED_USERS;
    const parsed = JSON.parse(raw) as AppUser[];
    // Auto-merge new seed users who do not exist in cache
    const merged = [...parsed];
    for (const su of SEED_USERS) {
      if (!merged.some((u) => u.id === su.id || u.email.toLowerCase() === su.email.toLowerCase())) {
        merged.push(su);
      }
    }
    return merged;
  } catch {
    return SEED_USERS;
  }
}

function persistUsers(users: AppUser[]) {
  if (typeof window !== "undefined") localStorage.setItem(LS_USERS, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AppUser[]>(SEED_USERS);
  const [user, setUser] = useState<AppUser | null>(null);
  const [auditEvents, setAuditEvents] = useState<AuthAuditEvent[]>([]);
  const [entitlements, setEntitlements] = useState<TenantEntitlements>(DEFAULT_ENTITLEMENTS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const u = loadUsers();
    const e = loadEntitlements();
    const a = loadAuditEvents();
    setUsers(u);
    setEntitlements(e);
    setAuditEvents(a);
    try {
      const raw = localStorage.getItem(LS_USER);
      if (raw) {
        const parsed = JSON.parse(raw) as AppUser;
        const fresh = u.find((x) => x.id === parsed.id) ?? parsed;
        setUser(fresh);
      }
    } catch {
      /* noop */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) persistUsers(users);
  }, [users, hydrated]);
  useEffect(() => {
    if (hydrated) persistEntitlements(entitlements);
  }, [entitlements, hydrated]);
  useEffect(() => {
    if (hydrated) persistAuditEvents(auditEvents);
  }, [auditEvents, hydrated]);
  useEffect(() => {
    if (!hydrated) return;
    if (user) localStorage.setItem(LS_USER, JSON.stringify(user));
    else localStorage.removeItem(LS_USER);
  }, [user, hydrated]);

  const addAuditEvent = (
    action: string,
    target?: string,
    detail?: string,
    actorOverride?: { name: string; role: Role | "system" },
  ) => {
    const actor = actorOverride?.name ?? user?.name ?? "System";
    const actorRole =
      actorOverride?.role === "system"
        ? "System"
        : actorOverride?.role
          ? ROLE_LABEL[actorOverride.role]
          : user
            ? ROLE_LABEL[user.role]
            : "System";
    setAuditEvents((prev) => [
      {
        id: `ae-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        ts: formatAuditTimestamp(new Date()),
        actor,
        actorRole,
        action,
        target,
        detail,
      },
      ...prev,
    ]);
  };

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      users,
      auditEvents,
      entitlements,
      effectiveFeatures: resolveEffectiveFeatures(entitlements, user?.property),
      featureEnabled: (feature) => resolveEffectiveFeatures(entitlements, user?.property)[feature],
      setTenantFeature: (feature, enabled) => {
        setEntitlements((prev) => {
          if (prev.features[feature] === enabled) return prev;
          addAuditEvent(
            "Tenant feature updated",
            feature,
            `${feature} set to ${enabled ? "enabled" : "disabled"} at tenant level.`,
          );
          return { ...prev, features: { ...prev.features, [feature]: enabled } };
        });
      },
      setPropertyFeatures: (property, features) => {
        setEntitlements((prev) => {
          const overrides = prev.propertyOverrides ?? [];
          const idx = overrides.findIndex((entry) => entry.property === property);
          if (idx === -1) {
            addAuditEvent(
              "Property feature override added",
              property,
              `Applied override: ${Object.keys(features).join(", ") || "none"}.`,
            );
            return { ...prev, propertyOverrides: [...overrides, { property, features }] };
          }
          const existing = overrides[idx];
          const nextFeatures = { ...existing.features, ...features };
          const unchanged = Object.entries(features).every(
            ([key, value]) => existing.features[key as FeatureKey] === value,
          );
          if (unchanged) return prev;
          addAuditEvent(
            "Property feature override updated",
            property,
            `Updated override: ${Object.keys(features).join(", ")}.`,
          );
          const nextOverrides = [...overrides];
          nextOverrides[idx] = { ...existing, features: nextFeatures };
          return { ...prev, propertyOverrides: nextOverrides };
        });
      },
      setEntitlementPlan: (plan) => {
        if (entitlements.plan !== plan) {
          addAuditEvent(
            "Tenant plan changed",
            "Tenant",
            `Plan switched from ${entitlements.plan} to ${plan}.`,
          );
        }
        setEntitlements((prev) => (prev.plan === plan ? prev : { ...prev, plan }));
      },
      isAuthenticated: !!user,
      login: (id: string) => {
        const found = users.find((u) => u.id === id);
        if (found) {
          setUser(found);
          addAuditEvent("User logged in", found.email, `Session started for ${found.name}.`, {
            name: found.name,
            role: found.role,
          });
        }
      },
      logout: () => {
        if (user) {
          addAuditEvent("User logged out", user.email, `Session ended for ${user.name}.`);
        }
        setUser(null);
      },
      can: (perm) => hasPermission(user?.role, perm),
      switchRole: (role) => {
        if (!user) return;
        const previousRole = user.role;
        const next = { ...user, role };
        setUser(next);
        setUsers((prev) => prev.map((u) => (u.id === user.id ? next : u)));
        addAuditEvent(
          "Role switched",
          user.email,
          `Role changed from ${ROLE_LABEL[previousRole]} to ${ROLE_LABEL[role]}.`,
        );
      },
      inviteUser: (u) => {
        const id = `u${Date.now()}`;
        const initials = u.name
          .split(" ")
          .map((s) => s[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();
        const invited = { ...u, id, initials, active: true, lastActive: "Invited" };
        setUsers((prev) => [...prev, invited]);
        addAuditEvent(
          "User invited",
          invited.email,
          `${invited.name} invited as ${ROLE_LABEL[invited.role]} for ${invited.property}.`,
        );
      },
      updateUser: (id, patch) => {
        const target = users.find((u) => u.id === id);
        const previousRole = target?.role;
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
        if (user?.id === id) setUser((u) => (u ? { ...u, ...patch } : u));
        if (target && Object.keys(patch).length > 0) {
          const fields = Object.entries(patch)
            .map(([k, v]) => `${k}: ${String(v)}`)
            .join(", ");
          const roleDetail =
            previousRole && patch.role && patch.role !== previousRole
              ? ` | role ${ROLE_LABEL[previousRole]} -> ${ROLE_LABEL[patch.role]}`
              : "";
          addAuditEvent("User updated", target.email, `${fields}${roleDetail}`);
        }
      },
      deleteUser: (id) => {
        const target = users.find((u) => u.id === id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
        if (user?.id === id) setUser(null);
        if (target) {
          addAuditEvent(
            "User removed",
            target.email,
            `${target.name} (${ROLE_LABEL[target.role]}) removed from access list.`,
          );
        }
      },
      roleLabel: (r) => ROLE_LABEL[r],
      logAuditEvent: (action, target, detail) => addAuditEvent(action, target, detail),
    }),
    [auditEvents, entitlements, user, users],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

function loadEntitlements(): TenantEntitlements {
  if (typeof window === "undefined") return DEFAULT_ENTITLEMENTS;
  try {
    const raw = localStorage.getItem(LS_ENTITLEMENTS);
    if (!raw) return DEFAULT_ENTITLEMENTS;
    const parsed = JSON.parse(raw) as Partial<TenantEntitlements>;
    return {
      ...DEFAULT_ENTITLEMENTS,
      ...parsed,
      features: { ...DEFAULT_ENTITLEMENTS.features, ...(parsed.features ?? {}) },
      platformApps: { ...DEFAULT_PLATFORM_APPS, ...(parsed.platformApps ?? {}) },
      propertyOverrides: parsed.propertyOverrides ?? DEFAULT_ENTITLEMENTS.propertyOverrides,
    };
  } catch {
    return DEFAULT_ENTITLEMENTS;
  }
}

function persistEntitlements(entitlements: TenantEntitlements) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LS_ENTITLEMENTS, JSON.stringify(entitlements));
  }
}

function loadAuditEvents(): AuthAuditEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_AUDIT_EVENTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AuthAuditEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistAuditEvents(events: AuthAuditEvent[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LS_AUDIT_EVENTS, JSON.stringify(events.slice(0, 300)));
  }
}

function resolveEffectiveFeatures(
  entitlements: TenantEntitlements,
  property?: string,
): FeatureFlags {
  const base = { ...entitlements.features };
  if (!property) return base;
  const override = entitlements.propertyOverrides?.find((p) => p.property === property);
  if (!override) return base;
  return { ...base, ...override.features };
}

function formatAuditTimestamp(date: Date) {
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
