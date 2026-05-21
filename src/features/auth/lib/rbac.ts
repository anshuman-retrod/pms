import { Role, Permission } from "@/types/rbac";

export const ALL_PERMISSIONS: Permission[] = [
  "dashboard.view",
  "reservations.view","reservations.create","reservations.modify","reservations.cancel",
  "frontdesk.view","frontdesk.checkin","frontdesk.checkout","frontdesk.roommove",
  "housekeeping.view","housekeeping.assign","housekeeping.status",
  "guests.view","guests.edit","guests.communicate",
  "billing.view","billing.post","billing.refund","billing.void","payments.process",
  "revenue.view","revenue.editrates","ota.manage",
  "reports.view","reports.export","ai.view",
  "rooms.manage","staff.manage","users.manage","roles.manage",
  "audit.view","property.configure","settings.manage","onboarding.run",
];

export const ROLE_LABEL: Record<Role, string> = {
  super_admin: "Retrod Super Admin",
  owner: "Owner",
  general_manager: "General Manager",
  front_office_manager: "Front Office Manager",
  front_desk_agent: "Front Desk Agent",
  housekeeping_supervisor: "Housekeeping Supervisor",
  accounts: "Accounts & Finance",
  revenue_manager: "Revenue Manager",
};

export const ROLE_DESCRIPTION: Record<Role, string> = {
  super_admin: "Retrod system-level super administration & configuration controls.",
  owner: "Full multi-property access. Onboarding, billing, all data.",
  general_manager: "Full property access. All operations & reports.",
  front_office_manager: "Reservations, check-in/out, folios, room moves.",
  front_desk_agent: "Day-to-day front desk operations.",
  housekeeping_supervisor: "Room status, HK assignments, lost & found.",
  accounts: "Folios, payments, refunds, AR, financial reports.",
  revenue_manager: "Rates, restrictions, OTA, forecasts.",
};

const allOf = (...keys: Permission[]) => keys;

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: [...ALL_PERMISSIONS],
  owner: [...ALL_PERMISSIONS],
  general_manager: [...ALL_PERMISSIONS],
  front_office_manager: allOf(
    "dashboard.view",
    "reservations.view","reservations.create","reservations.modify","reservations.cancel",
    "frontdesk.view","frontdesk.checkin","frontdesk.checkout","frontdesk.roommove",
    "guests.view","guests.edit","guests.communicate",
    "housekeeping.view",
    "billing.view","billing.post",
    "reports.view",
  ),
  front_desk_agent: allOf(
    "dashboard.view",
    "reservations.view","reservations.create",
    "frontdesk.view","frontdesk.checkin","frontdesk.checkout",
    "guests.view","guests.communicate",
    "housekeeping.view",
    "billing.view","payments.process",
  ),
  housekeeping_supervisor: allOf(
    "dashboard.view",
    "housekeeping.view","housekeeping.assign","housekeeping.status",
    "rooms.manage",
    "staff.manage",
  ),
  accounts: allOf(
    "dashboard.view",
    "billing.view","billing.post","billing.refund","billing.void","payments.process",
    "reports.view","reports.export",
    "audit.view",
  ),
  revenue_manager: allOf(
    "dashboard.view",
    "revenue.view","revenue.editrates","ota.manage",
    "reservations.view",
    "reports.view","reports.export","ai.view",
  ),
};

export function hasPermission(role: Role | undefined, perm: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(perm) ?? false;
}
