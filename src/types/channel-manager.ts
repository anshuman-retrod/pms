export const SU_CHANNELS = [
  "Booking.com",
  "Agoda",
  "Expedia",
  "Airbnb",
  "MakeMyTrip",
  "Goibibo",
  "HotelBeds",
  "Trip.com",
] as const;

export type SuChannel = (typeof SU_CHANNELS)[number];

export type ConnectionStatus = "Connected" | "Disconnected" | "Error" | "Syncing";
export type MappingStatus = "Mapped" | "Mismatch" | "Unmapped" | "Pending";
export type SyncStatus = "Success" | "Warning" | "Error" | "In Progress";
export type SyncType = "Inventory" | "Rates" | "Reservations" | "Content" | "Images" | "Restrictions";

export interface SuConnection {
  channel: SuChannel;
  status: ConnectionStatus;
  propertyId: string;
  lastSync: string;
  commission: string;
  bookingsMtd: number;
  revenueMtd: number;
  parity: "Aligned" | "Drift" | "Unknown";
  parityDelta?: string;
}

export interface SuRoomMapping {
  pmsRoomType: string;
  pmsRoomCode: string;
  channels: Record<SuChannel, { otaRoomId: string; otaRoomName: string; status: MappingStatus }>;
}

export interface SuRatePlanMapping {
  pmsRatePlan: string;
  mealPlan: string;
  channels: Record<SuChannel, { otaRatePlanId: string; status: MappingStatus }>;
}

export interface SuInventoryRow {
  roomType: string;
  total: number;
  channels: Record<SuChannel, { allocated: number; sold: number; available: number }>;
}

export interface SuAvailabilityCell {
  date: number;
  roomType: string;
  available: number;
  total: number;
  stopSell: boolean;
}

export interface SuRateCell {
  date: number;
  roomType: string;
  ratePlan: string;
  amount: number;
  channel?: SuChannel;
}

export interface SuReservationSync {
  id: string;
  channel: SuChannel;
  otaRef: string;
  pmsRef: string;
  guest: string;
  status: "Synced" | "Pending" | "Conflict" | "Failed";
  checkIn: string;
  amount: number;
  syncedAt: string;
  error?: string;
}

export interface SuSyncLog {
  id: string;
  channel: SuChannel;
  type: SyncType;
  action: string;
  status: SyncStatus;
  records: number;
  at: string;
  message?: string;
}

export interface SuChannelRevenue {
  channel: SuChannel;
  bookings: number;
  revenue: number;
  adr: number;
  commission: number;
  netRevenue: number;
  share: number;
}

export interface SuPropertyContent {
  field: string;
  pmsValue: string;
  channels: Partial<Record<SuChannel, { value: string; status: SyncStatus | "Synced" }>>;
}

export interface SuRoomContent {
  roomType: string;
  amenities: string[];
  bedType: string;
  maxOccupancy: number;
  syncStatus: SyncStatus | "Synced";
}

export interface SuImageAsset {
  id: string;
  roomType: string;
  label: string;
  url: string;
  channels: Partial<Record<SuChannel, "Synced" | "Pending" | "Error">>;
  primary: boolean;
}

export interface SuRestriction {
  id: string;
  date: number;
  roomType: string;
  channel: SuChannel | "All";
  kind: "Min Stay" | "Max Stay" | "CTA" | "CTD" | "Stop Sell";
  value?: string;
}

export interface SuPropertyChannelSummary {
  propertyId: string;
  propertyName: string;
  city: string;
  channelsLive: number;
  syncHealth: number;
  bookingsMtd: number;
  revenueMtd: number;
  errors: number;
}

export interface SuDashboardMetrics {
  channelsLive: number;
  channelsTotal: number;
  syncHealthPct: number;
  bookingsMtd: number;
  revenueMtd: number;
  pendingSyncs: number;
  parityAlerts: number;
  failedJobs24h: number;
}

export interface SuAnalyticsMetrics {
  channel: SuChannel;
  conversion: number;
  impressions: number;
  bookings: number;
  revenue: number;
  cancellationRate: number;
  avgLeadTime: number;
}
