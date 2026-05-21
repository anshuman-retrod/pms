export type Role =
  | "super_admin"
  | "owner"
  | "general_manager"
  | "front_office_manager"
  | "front_desk_agent"
  | "housekeeping_supervisor"
  | "accounts"
  | "revenue_manager";

export type Permission =
  // Dashboard
  | "dashboard.view"
  // Reservations
  | "reservations.view" | "reservations.create" | "reservations.modify" | "reservations.cancel"
  // Front office
  | "frontdesk.view" | "frontdesk.checkin" | "frontdesk.checkout" | "frontdesk.roommove"
  // Housekeeping
  | "housekeeping.view" | "housekeeping.assign" | "housekeeping.status"
  // Guests / CRM
  | "guests.view" | "guests.edit" | "guests.communicate"
  // Billing & payments
  | "billing.view" | "billing.post" | "billing.refund" | "billing.void" | "payments.process"
  // Revenue / OTA
  | "revenue.view" | "revenue.editrates" | "ota.manage"
  // Reports & AI
  | "reports.view" | "reports.export" | "ai.view"
  // Admin
  | "rooms.manage" | "staff.manage" | "users.manage" | "roles.manage"
  | "audit.view" | "property.configure" | "settings.manage" | "onboarding.run";
