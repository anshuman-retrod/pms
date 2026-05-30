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
  email?: string;
  phone?: string;
  nps?: number;
  tags?: string[];
  notes?: { at: string; author: string; text: string }[];
  stays?: { id: string; room: string; ci: string; co: string; amount: number }[];
}

export type Guest = GuestProfile;

export interface WaitlistEntry {
  id: string;
  guest: string;
  dates: string;
  roomType: string;
  priority: "High" | "Normal";
  requestedAt: string;
}

export interface GroupBlock {
  id: string;
  name: string;
  dates: string;
  blocked: number;
  pickedUp: number;
  cutOff: string;
  status: "Open" | "Closed" | "Released";
}

export type WorkOrderStatus = "Reported" | "In Progress" | "Waiting Parts" | "Resolved";

export interface WorkOrder {
  id: string;
  room: string;
  category: string;
  priority: "Critical" | "High" | "Normal";
  status: WorkOrderStatus;
  assignee: string;
  title: string;
  createdAt: string;
}

export interface OpsTask {
  id: string;
  title: string;
  department: string;
  assignee: string;
  due: string;
  priority: "High" | "Normal";
  status: "Open" | "In Progress" | "Done";
}

export interface GuestServiceRequest {
  id: string;
  room: string;
  guest: string;
  type: string;
  status: "New" | "Assigned" | "In Progress" | "Done";
  sla: string;
}

export interface OtaMapping {
  roomType: string;
  bookingCom: "Mapped" | "Mismatch" | "Unmapped";
  expedia: "Mapped" | "Mismatch" | "Unmapped";
  agoda: "Mapped" | "Mismatch" | "Unmapped";
  direct: "Reference";
}

export interface OtaSyncLog {
  id: string;
  channel: string;
  action: string;
  status: "Success" | "Warning" | "Error";
  at: string;
}

export interface PricingRule {
  id: string;
  name: string;
  trigger: string;
  adjustment: string;
  status: "Active" | "Paused";
  lastRun: string;
}

export interface CorporateAccount {
  id: string;
  company: string;
  rateCode: string;
  roomNightsMtd: number;
  revenueMtd: number;
  openInvoices: number;
  contact: string;
}

export interface OnlineCheckIn {
  resId: string;
  guest: string;
  roomType: string;
  eta: string;
  status: "Pending review" | "Approved" | "Needs info";
  idVerified: boolean;
  paymentStatus: "Paid" | "Deposit due" | "Pending";
}

export interface CommThread {
  id: string;
  name: string;
  last: string;
  time: string;
  unread: number;
  channel: "Email" | "WhatsApp" | "SMS";
  resId: string;
  stayStatus: string;
}

export type InsightCategory = "All" | "Pricing" | "Operations" | "Guest" | "Risk";

export interface LoyaltyMember {
  id: string;
  name: string;
  tier: "Platinum" | "Gold" | "Silver" | "Bronze";
  points: number;
  lifetimePoints: number;
  lastActivity: string;
}

export interface RegistrationCard {
  id: string;
  resId: string;
  guest: string;
  signedAt?: string;
  status: "Signed" | "Pending" | "Exception";
  template: string;
}

export interface LostFoundItem {
  id: string;
  description: string;
  location: string;
  foundAt: string;
  status: "Open" | "Matched" | "Released" | "Disposed";
  guestMatch?: string;
}

export interface FeedbackEntry {
  id: string;
  guest: string;
  channel: string;
  score: number;
  category: string;
  status: "Open" | "In Progress" | "Resolved";
  severity: "Low" | "Medium" | "High";
}

export interface BookingPromo {
  id: string;
  code: string;
  discount: string;
  validity: string;
  bookings: number;
  status: "Active" | "Expired";
}

export interface PackageProduct {
  id: string;
  name: string;
  price: number;
  inclusions: string;
  bookingsMtd: number;
  status: "Active" | "Draft";
}

export interface AddOnProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  department: string;
  attachRate: string;
}

export interface ConciergeRequest {
  id: string;
  guest: string;
  room: string;
  type: string;
  status: "New" | "Confirmed" | "Completed" | "Cancelled";
  datetime: string;
}

export interface TransportTrip {
  id: string;
  guest: string;
  pickup: string;
  flight?: string;
  driver: string;
  status: "Scheduled" | "En route" | "Completed" | "Delayed";
}

export interface ActivitySlot {
  id: string;
  name: string;
  date: string;
  capacity: number;
  booked: number;
  price: number;
}

export interface PortfolioProperty {
  id: string;
  name: string;
  city: string;
  occupancy: number;
  revenue: number;
  revpar: number;
  alerts: number;
  stars: number;
}
