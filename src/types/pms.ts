export interface Reservation {
  id: string;
  guest: string;
  room: string;
  type: string;
  ci: string;
  co: string;
  nights: number;
  amount: number;
  status: "Confirmed" | "Checked-In" | "Checked-Out" | "Pending" | "No-Show" | "Cancelled";
  source: string;
  balance: number;
}

export interface HousekeepingRoom {
  num: string;
  type: string;
  status: "Ready" | "Cleaning" | "Dirty" | "OOO" | "Inspected";
  staff: string;
}

export interface RevenueTrendEntry {
  day: string;
  revenue: number;
  occupancy: number;
}

export interface OTABreakdownEntry {
  source: string;
  bookings: number;
  revenue: number;
}

export interface RoomStatusDonutEntry {
  name: string;
  value: number;
  color: string;
}

export interface ActivityFeedEntry {
  time: string;
  text: string;
  tone: "success" | "info" | "neutral" | "warning" | "error";
}

export interface OccupancyByTypeEntry {
  type: string;
  total: number;
  occupied: number;
}

export interface RevenueKPIEntry {
  label: string;
  today: number;
  budget: number;
  sty: number;
}

export interface DashboardAlertEntry {
  id: string;
  tone: "brand" | "warning" | "error" | "info" | "neutral";
  title: string;
  body: string;
  at: string;
}

export interface Forecast7DEntry {
  day: string;
  date: number;
  occ: number;
  adr: number;
  revenue: number;
}

export interface AvailabilityMatrixDay {
  date: number;
  sold: number;
  total: number;
}

export interface AvailabilityMatrixEntry {
  type: string;
  days: AvailabilityMatrixDay[];
}

export interface RateCalendarDay {
  date: number;
  rate: number;
  tag: "Event" | "Weekend" | "BAR";
}

export interface RateCalendarEntry {
  type: string;
  days: RateCalendarDay[];
}

export interface Restriction {
  date: number;
  type: string;
  kind: string;
}

export interface GuestProfile {
  name: string;
  country: string;
  visits: number;
  ltv: number;
  tier: "Platinum" | "Gold" | "Silver" | "Bronze" | "Standard";
}

export type Guest = GuestProfile;

