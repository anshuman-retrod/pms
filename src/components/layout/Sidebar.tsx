import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, CalendarRange, ConciergeBell, LogIn, Sparkles,
  Users, MessageSquare, Receipt, CreditCard, TrendingUp, Globe2,
  BarChart3, Brain, BedDouble, UserCog, ScrollText, Building2, Settings,
  Bell, HelpCircle, ChevronDown, ChevronsLeft, ChevronsRight, Star, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { label: string; to: string; icon: React.ComponentType<{ className?: string }> };
type Group = { title: string; items: Item[] };

const groups: Group[] = [
  {
    title: "Operations",
    items: [
      { label: "Dashboard", to: "/", icon: LayoutDashboard },
      { label: "Front Desk", to: "/front-desk", icon: ConciergeBell },
      { label: "Reservations", to: "/reservations", icon: CalendarRange },
      { label: "Check-In / Out", to: "/check-in", icon: LogIn },
      { label: "Housekeeping", to: "/housekeeping", icon: Sparkles },
    ],
  },
  {
    title: "Guests",
    items: [
      { label: "Guest Profiles", to: "/guests", icon: Users },
      { label: "Communications", to: "/communications", icon: MessageSquare },
    ],
  },
  {
    title: "Commercial",
    items: [
      { label: "Billing & Invoicing", to: "/billing", icon: Receipt },
      { label: "Payments", to: "/payments", icon: CreditCard },
      { label: "Revenue Mgmt", to: "/revenue", icon: TrendingUp },
      { label: "OTA & Channels", to: "/ota", icon: Globe2 },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { label: "Reports & Analytics", to: "/reports", icon: BarChart3 },
      { label: "AI Insights", to: "/ai-insights", icon: Brain },
    ],
  },
  {
    title: "Administration",
    items: [
      { label: "Rooms & Inventory", to: "/rooms", icon: BedDouble },
      { label: "Staff Management", to: "/staff", icon: UserCog },
      { label: "Audit Logs", to: "/audit", icon: ScrollText },
      { label: "Property Config", to: "/property", icon: Building2 },
      { label: "System Settings", to: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <aside
      className={cn(
        "sticky top-0 z-30 flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-200",
        collapsed ? "w-[64px]" : "w-[240px]",
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-primary text-primary-foreground font-display text-sm font-semibold">R</div>
            <span className="font-display text-[17px] font-semibold tracking-tight">Retrod</span>
            <span className="label-uppercase ml-1 text-[9px] !text-sidebar-muted">PMS</span>
          </div>
        ) : (
          <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-sm bg-primary text-primary-foreground font-display text-sm font-semibold">R</div>
        )}
      </div>

      {/* Property switcher */}
      {!collapsed && (
        <button className="mx-3 mt-3 flex items-center justify-between rounded-md border border-sidebar-border bg-sidebar-hover/40 px-3 py-2 text-left transition hover:bg-sidebar-hover">
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium text-sidebar-foreground">The Grand Palace</div>
            <div className="flex items-center gap-1 text-[11px] text-sidebar-muted">
              <span>New Delhi</span>
              <span className="opacity-50">·</span>
              <span className="flex items-center gap-0.5">
                <Star className="h-2.5 w-2.5 fill-[var(--color-gold)] text-[var(--color-gold)]" />
                5
              </span>
              <span className="opacity-50">·</span>
              <span>4 properties</span>
            </div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-sidebar-muted" />
        </button>
      )}

      {/* Nav */}
      <nav className="scrollbar-thin mt-4 flex-1 overflow-y-auto px-2 pb-4">
        {groups.map((group) => (
          <div key={group.title} className="mb-4">
            {!collapsed && (
              <div className="px-3 pb-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-sidebar-muted">
                {group.title}
              </div>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.to);
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-normal text-sidebar-foreground/85 transition-colors",
                        "hover:bg-sidebar-hover hover:text-sidebar-foreground",
                        active && "bg-sidebar-hover text-sidebar-foreground font-medium",
                        collapsed && "justify-center px-0",
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r bg-primary" />
                      )}
                      <item.icon className="h-[18px] w-[18px] shrink-0 stroke-[1.5]" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-sidebar-border p-2">
        <button className={cn("flex w-full items-center gap-3 rounded-md px-3 py-2 text-[13px] text-sidebar-foreground/85 hover:bg-sidebar-hover", collapsed && "justify-center px-0")}>
          <Bell className="h-[18px] w-[18px] stroke-[1.5]" />
          {!collapsed && (<><span>Notifications</span><span className="ml-auto rounded-sm bg-primary px-1.5 py-px text-[10px] font-medium text-primary-foreground">7</span></>)}
        </button>
        <button className={cn("flex w-full items-center gap-3 rounded-md px-3 py-2 text-[13px] text-sidebar-foreground/85 hover:bg-sidebar-hover", collapsed && "justify-center px-0")}>
          <HelpCircle className="h-[18px] w-[18px] stroke-[1.5]" />
          {!collapsed && <span>Help Center</span>}
        </button>

        {!collapsed ? (
          <div className="mt-2 flex items-center gap-2 rounded-md border border-sidebar-border bg-sidebar-hover/40 p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[12px] font-semibold text-primary-foreground">AM</div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px] font-medium">Aarav Malhotra</div>
              <div className="truncate text-[10px] text-sidebar-muted">General Manager</div>
            </div>
            <button className="rounded p-1 text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground" aria-label="Logout">
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="mt-2 flex justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[12px] font-semibold text-primary-foreground">AM</div>
          </div>
        )}

        <button
          onClick={onToggle}
          className={cn("mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2 text-[12px] text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground", collapsed && "justify-center px-0")}
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <><ChevronsLeft className="h-4 w-4" /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
