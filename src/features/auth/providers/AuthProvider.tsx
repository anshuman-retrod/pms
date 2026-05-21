import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { type Permission, type Role } from "@/types/rbac";
import { type AppUser } from "@/types/auth";
import { hasPermission, ROLE_LABEL } from "../lib/rbac";

export interface AuthCtx {
  user: AppUser | null;
  users: AppUser[];
  isAuthenticated: boolean;
  login: (userId: string) => void;
  logout: () => void;
  can: (perm: Permission) => boolean;
  switchRole: (role: Role) => void;
  inviteUser: (u: Omit<AppUser, "id" | "initials" | "active" | "lastActive">) => void;
  updateUser: (id: string, patch: Partial<AppUser>) => void;
  deleteUser: (id: string) => void;
  roleLabel: (r: Role) => string;
}

export const Ctx = createContext<AuthCtx | null>(null);

const SEED_USERS: AppUser[] = [
  { id: "u0", name: "Retrod Admin", email: "admin@retrod.in", role: "super_admin", initials: "RA", active: true, property: "Retrod Global HQ", lastActive: "Just now" },
  { id: "u_prabhat", name: "Prabhat", email: "prabhat@retrod.in", role: "super_admin", initials: "P", active: true, property: "Retrod Global HQ", lastActive: "Just now" },
  { id: "u1", name: "Aarav Malhotra", email: "aarav@grandpalace.in", role: "owner", initials: "AM", active: true, property: "The Grand Palace", lastActive: "Just now" },
  { id: "u2", name: "Vikram Shah", email: "vikram@grandpalace.in", role: "general_manager", initials: "VS", active: true, property: "The Grand Palace", lastActive: "5 min ago" },
  { id: "u3", name: "Neha Kapoor", email: "neha@grandpalace.in", role: "front_office_manager", initials: "NK", active: true, property: "The Grand Palace", lastActive: "12 min ago" },
  { id: "u4", name: "Rohan Verma", email: "rohan@grandpalace.in", role: "front_desk_agent", initials: "RV", active: true, property: "The Grand Palace", lastActive: "2 min ago" },
  { id: "u5", name: "Priya Reddy", email: "priya@grandpalace.in", role: "housekeeping_supervisor", initials: "PR", active: true, property: "The Grand Palace", lastActive: "1 hr ago" },
  { id: "u6", name: "Ananya Bose", email: "ananya@grandpalace.in", role: "accounts", initials: "AB", active: true, property: "The Grand Palace", lastActive: "Yesterday" },
  { id: "u7", name: "Kabir Singh", email: "kabir@grandpalace.in", role: "revenue_manager", initials: "KS", active: true, property: "The Grand Palace", lastActive: "30 min ago" },
];

const LS_USER = "retrod.auth.user";
const LS_USERS = "retrod.auth.users";

function loadUsers(): AppUser[] {
  if (typeof window === "undefined") return SEED_USERS;
  try {
    const raw = localStorage.getItem(LS_USERS);
    if (!raw) return SEED_USERS;
    const parsed = JSON.parse(raw) as AppUser[];
    // Auto-merge new seed users who do not exist in cache
    const merged = [...parsed];
    for (const su of SEED_USERS) {
      if (!merged.some(u => u.id === su.id || u.email.toLowerCase() === su.email.toLowerCase())) {
        merged.push(su);
      }
    }
    return merged;
  } catch { return SEED_USERS; }
}

function persistUsers(users: AppUser[]) {
  if (typeof window !== "undefined") localStorage.setItem(LS_USERS, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AppUser[]>(SEED_USERS);
  const [user, setUser] = useState<AppUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const u = loadUsers();
    setUsers(u);
    try {
      const raw = localStorage.getItem(LS_USER);
      if (raw) {
        const parsed = JSON.parse(raw) as AppUser;
        const fresh = u.find(x => x.id === parsed.id) ?? parsed;
        setUser(fresh);
      }
    } catch { /* noop */ }
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) persistUsers(users); }, [users, hydrated]);
  useEffect(() => {
    if (!hydrated) return;
    if (user) localStorage.setItem(LS_USER, JSON.stringify(user));
    else localStorage.removeItem(LS_USER);
  }, [user, hydrated]);

  const value = useMemo<AuthCtx>(() => ({
    user,
    users,
    isAuthenticated: !!user,
    login: (id: string) => {
      const found = users.find(u => u.id === id);
      if (found) setUser(found);
    },
    logout: () => setUser(null),
    can: (perm) => hasPermission(user?.role, perm),
    switchRole: (role) => {
      if (!user) return;
      const next = { ...user, role };
      setUser(next);
      setUsers(prev => prev.map(u => u.id === user.id ? next : u));
    },
    inviteUser: (u) => {
      const id = `u${Date.now()}`;
      const initials = u.name.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();
      setUsers(prev => [...prev, { ...u, id, initials, active: true, lastActive: "Invited" }]);
    },
    updateUser: (id, patch) => {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...patch } : u));
      if (user?.id === id) setUser(u => u ? { ...u, ...patch } : u);
    },
    deleteUser: (id) => {
      setUsers(prev => prev.filter(u => u.id !== id));
      if (user?.id === id) setUser(null);
    },
    roleLabel: (r) => ROLE_LABEL[r],
  }), [user, users]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
