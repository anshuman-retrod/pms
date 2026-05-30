import { Link, useRouterState } from "@tanstack/react-router";
import { Card, CardHeader } from "@/components/ui/Primitives";

export const CHANNEL_MANAGER_NAV = [
  { label: "Dashboard", to: "/channel-manager" },
  { label: "OTA Connections", to: "/channel-manager/connections" },
  { label: "Room Mapping", to: "/channel-manager/room-mapping" },
  { label: "Rate Plan Mapping", to: "/channel-manager/rate-plans" },
  { label: "Inventory", to: "/channel-manager/inventory" },
  { label: "Availability Calendar", to: "/channel-manager/availability" },
  { label: "Rate Calendar", to: "/channel-manager/rates" },
  { label: "Reservation Sync", to: "/channel-manager/reservations" },
  { label: "Sync Logs", to: "/channel-manager/sync-logs" },
  { label: "OTA Revenue", to: "/channel-manager/revenue" },
  { label: "Property Content", to: "/channel-manager/property-content" },
  { label: "Room Content", to: "/channel-manager/room-content" },
  { label: "Image Management", to: "/channel-manager/images" },
  { label: "Restrictions", to: "/channel-manager/restrictions" },
  { label: "Multi-Property", to: "/channel-manager/multi-property" },
  { label: "Performance Analytics", to: "/channel-manager/analytics" },
] as const;

export function ChannelManagerSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Card className="sticky top-20 h-fit max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin">
      <CardHeader title="Channel Manager" hint="SU API connected" />
      <ul className="p-2">
        {CHANNEL_MANAGER_NAV.map((item) => {
          const active = pathname === item.to || (item.to !== "/channel-manager" && pathname.startsWith(item.to));
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`block rounded-md px-3 py-2 text-[12px] transition ${
                  active
                    ? "bg-primary-tint font-medium text-primary-pressed"
                    : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
