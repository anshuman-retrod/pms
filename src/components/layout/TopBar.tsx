import { Link, useRouterState } from "@tanstack/react-router";
import { Search, Bell, Plus, Calendar } from "lucide-react";

const labels: Record<string, string> = {
  "": "Dashboard",
  "front-desk": "Front Desk",
  reservations: "Reservations",
  "check-in": "Check-In / Out",
  housekeeping: "Housekeeping",
  guests: "Guest Profiles",
  communications: "Communications",
  billing: "Billing & Invoicing",
  payments: "Payments",
  revenue: "Revenue Management",
  ota: "OTA & Channels",
  reports: "Reports & Analytics",
  "ai-insights": "AI Insights",
  rooms: "Rooms & Inventory",
  staff: "Staff Management",
  audit: "Audit Logs",
  property: "Property Configuration",
  settings: "System Settings",
};

const groupOf: Record<string, string> = {
  "front-desk": "Operations", reservations: "Operations", "check-in": "Operations", housekeeping: "Operations",
  guests: "Guests", communications: "Guests",
  billing: "Commercial", payments: "Commercial", revenue: "Commercial", ota: "Commercial",
  reports: "Intelligence", "ai-insights": "Intelligence",
  rooms: "Administration", staff: "Administration", audit: "Administration", property: "Administration", settings: "Administration",
};

export function TopBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const seg = pathname.replace(/^\//, "").split("/")[0];
  const page = labels[seg] ?? "Dashboard";
  const group = groupOf[seg] ?? "Operations";

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-border bg-surface px-6">
      {/* Breadcrumb */}
      <nav className="flex min-w-0 items-center gap-1.5 text-[13px]">
        <span className="text-text-secondary">{group}</span>
        <span className="text-text-disabled">/</span>
        <Link to={`/${seg}` as string} className="truncate font-medium text-text-primary">
          {page}
        </Link>
      </nav>

      {/* Search */}
      <div className="ml-6 hidden flex-1 max-w-xl md:block">
        <div className="group relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-disabled" />
          <input
            type="text"
            placeholder="Search guests, rooms, reservations..."
            className="h-9 w-full rounded-md border border-border bg-surface-2/50 pl-9 pr-16 text-[13px] text-text-primary placeholder:text-text-disabled focus:border-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/15"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-text-secondary">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button className="hidden lg:flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground shadow-e1 transition hover:bg-primary-pressed">
          <Plus className="h-3.5 w-3.5" />
          New Reservation
        </button>

        <div className="hidden xl:flex items-center gap-1.5 rounded-md border border-border bg-surface-2/60 px-2.5 py-1.5 text-[12px] text-text-secondary">
          <Calendar className="h-3.5 w-3.5" />
          Today · Fri, 15 May 2026
        </div>

        <button className="relative rounded-md p-2 text-text-secondary hover:bg-surface-2 hover:text-text-primary">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        <div className="flex items-center gap-2 border-l border-border pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">AM</div>
          <div className="hidden text-left lg:block">
            <div className="text-[12px] font-medium leading-tight text-text-primary">Aarav Malhotra</div>
            <div className="text-[10px] text-text-secondary">GM · Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
