import {
  Reservation,
  HousekeepingRoom,
  RevenueTrendEntry,
  OTABreakdownEntry,
  RoomStatusDonutEntry,
  ActivityFeedEntry,
  OccupancyByTypeEntry,
  RevenueKPIEntry,
  DashboardAlertEntry,
  Forecast7DEntry,
  AvailabilityMatrixEntry,
  RateCalendarEntry,
  Restriction,
  GuestProfile,
  WaitlistEntry,
  GroupBlock,
  WorkOrder,
  OpsTask,
  GuestServiceRequest,
  OtaMapping,
  OtaSyncLog,
  PricingRule,
  CorporateAccount,
  OnlineCheckIn,
  CommThread,
  LoyaltyMember,
  RegistrationCard,
  LostFoundItem,
  FeedbackEntry,
  BookingPromo,
  PackageProduct,
  AddOnProduct,
  ConciergeRequest,
  TransportTrip,
  ActivitySlot,
  PortfolioProperty,
} from "@/types/pms";

export const ROOM_TYPES = ["Deluxe King", "Deluxe Twin", "Premier Suite", "Executive", "Heritage Suite"] as const;
export const OTAS = ["Booking.com", "Expedia", "Direct", "Agoda", "Airbnb"] as const;

export const reservations: Reservation[] = [
  { id: "RES-2041", guest: "John Mathews", room: "204", type: "Deluxe King", ci: "15 May", co: "18 May", nights: 3, amount: 36000, status: "Confirmed", source: "Booking.com", balance: 0 },
  { id: "RES-2042", guest: "Priya Sharma", room: "312", type: "Premier Suite", ci: "15 May", co: "17 May", nights: 2, amount: 48000, status: "Checked-In", source: "Direct", balance: 0 },
  { id: "RES-2043", guest: "Hiroshi Tanaka", room: "108", type: "Executive", ci: "15 May", co: "20 May", nights: 5, amount: 72000, status: "Pending", source: "Expedia", balance: 14400 },
  { id: "RES-2044", guest: "Elena Rodriguez", room: "401", type: "Heritage Suite", ci: "16 May", co: "19 May", nights: 3, amount: 105000, status: "Confirmed", source: "Direct", balance: 0 },
  { id: "RES-2045", guest: "Marcus Weber", room: "215", type: "Deluxe Twin", ci: "14 May", co: "15 May", nights: 1, amount: 9800, status: "Checked-Out", source: "Agoda", balance: 0 },
  { id: "RES-2046", guest: "Aisha Khan", room: "302", type: "Premier Suite", ci: "15 May", co: "16 May", nights: 1, amount: 22000, status: "No-Show", source: "Booking.com", balance: 22000 },
  { id: "RES-2047", guest: "Ravi Iyer", room: "118", type: "Deluxe King", ci: "15 May", co: "18 May", nights: 3, amount: 33000, status: "Cancelled", source: "Airbnb", balance: 0 },
  { id: "RES-2048", guest: "Sophie Laurent", room: "405", type: "Heritage Suite", ci: "16 May", co: "21 May", nights: 5, amount: 175000, status: "Confirmed", source: "Direct", balance: 0 },
];

export const arrivalsToday: Reservation[] = reservations.filter(r => r.ci === "15 May" && (r.status === "Confirmed" || r.status === "Pending"));
export const departuresToday: Reservation[] = reservations.filter(r => r.co === "15 May");

export const housekeepingRooms: HousekeepingRoom[] = [
  { num: "101", type: "Deluxe King", status: "Ready", staff: "Priya" },
  { num: "102", type: "Deluxe King", status: "Cleaning", staff: "Lakshmi" },
  { num: "103", type: "Deluxe Twin", status: "Dirty", staff: "—" },
  { num: "104", type: "Deluxe Twin", status: "Ready", staff: "Anjali" },
  { num: "105", type: "Executive", status: "OOO", staff: "Maintenance" },
  { num: "106", type: "Executive", status: "Inspected", staff: "Priya" },
  { num: "201", type: "Deluxe King", status: "Ready", staff: "Sunil" },
  { num: "202", type: "Deluxe King", status: "Cleaning", staff: "Lakshmi" },
  { num: "203", type: "Deluxe Twin", status: "Dirty", staff: "—" },
  { num: "204", type: "Premier Suite", status: "Ready", staff: "Anjali" },
  { num: "205", type: "Premier Suite", status: "Dirty", staff: "—" },
  { num: "206", type: "Executive", status: "Ready", staff: "Sunil" },
  { num: "301", type: "Premier Suite", status: "Inspected", staff: "Priya" },
  { num: "302", type: "Premier Suite", status: "Cleaning", staff: "Lakshmi" },
  { num: "303", type: "Heritage Suite", status: "Ready", staff: "Anjali" },
  { num: "304", type: "Heritage Suite", status: "Dirty", staff: "—" },
  { num: "401", type: "Heritage Suite", status: "Ready", staff: "Sunil" },
  { num: "402", type: "Heritage Suite", status: "Inspected", staff: "Priya" },
];

export const revenueTrend: RevenueTrendEntry[] = Array.from({ length: 30 }, (_, i) => {
  const base = 380000 + Math.sin(i / 3) * 60000 + i * 4200 + (i % 7 === 5 ? 80000 : 0);
  const occ = 62 + Math.sin(i / 4) * 12 + (i % 7 === 5 ? 15 : 0);
  return {
    day: `${i + 1}`,
    revenue: Math.round(base),
    occupancy: Math.round(Math.min(98, Math.max(40, occ))),
  };
});

export const otaBreakdown: OTABreakdownEntry[] = [
  { source: "Booking.com", bookings: 142, revenue: 1820000 },
  { source: "Direct", bookings: 96, revenue: 1450000 },
  { source: "Expedia", bookings: 58, revenue: 720000 },
  { source: "Agoda", bookings: 34, revenue: 410000 },
  { source: "Airbnb", bookings: 22, revenue: 280000 },
];

export const roomStatusDonut: RoomStatusDonutEntry[] = [
  { name: "Occupied", value: 84, color: "var(--color-info)" },
  { name: "Vacant", value: 18, color: "var(--color-success)" },
  { name: "Dirty", value: 12, color: "var(--color-warning)" },
  { name: "Out of Order", value: 6, color: "var(--color-text-secondary)" },
];

export const activityFeed: ActivityFeedEntry[] = [
  { time: "11:42", text: "Reservation #RES-2048 confirmed for Sophie Laurent · Heritage Suite", tone: "success" },
  { time: "11:18", text: "Payment of ₹48,000 received · INV-3104 · Priya Sharma", tone: "info" },
  { time: "10:55", text: "Room 215 marked Inspected by Priya", tone: "neutral" },
  { time: "10:32", text: "Check-in completed · Marcus Weber · Room 215", tone: "info" },
  { time: "09:48", text: "OTA rate updated · Booking.com · Deluxe King +₹600", tone: "warning" },
];

export const occupancyByType: OccupancyByTypeEntry[] = [
  { type: "Deluxe King", total: 36, occupied: 31 },
  { type: "Deluxe Twin", total: 28, occupied: 22 },
  { type: "Premier Suite", total: 24, occupied: 19 },
  { type: "Executive", total: 20, occupied: 8 },
  { type: "Heritage Suite", total: 12, occupied: 4 },
];

export const revenueKpis: RevenueKPIEntry[] = [
  { label: "Rooms", today: 1842000, budget: 1700000, sty: 1610000 },
  { label: "Food & Beverage", today: 624000, budget: 700000, sty: 580000 },
  { label: "Spa & Wellness", today: 198000, budget: 150000, sty: 142000 },
  { label: "Misc", today: 84000, budget: 80000, sty: 78000 },
];

export const dashboardAlerts: DashboardAlertEntry[] = [
  { id: "A1", tone: "brand", title: "VIP arrival in 1h 42m", body: "Sophie Laurent · Heritage Suite 405 · Amenity setup pending", at: "13:18" },
  { id: "A2", tone: "warning", title: "Overdue checkout · Room 312", body: "Priya Sharma · ₹4,800 balance · 38 min over checkout time", at: "11:38" },
  { id: "A3", tone: "error", title: "Critical work order open 5h 12m", body: "Room 207 · HVAC failure · Engineering: Suresh", at: "08:46" },
  { id: "A4", tone: "warning", title: "Linen below par", body: "Bath towels 22% below par · auto PR raised to vendor", at: "07:55" },
  { id: "A5", tone: "info", title: "OTA rate parity drift", body: "Agoda showing -3% vs hotel website on Deluxe King", at: "07:12" },
];

export const forecast7d: Forecast7DEntry[] = Array.from({ length: 7 }, (_, i) => {
  const labels = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
  const occ = [86, 91, 72, 68, 74, 82, 88][i];
  const adr = [13200, 14400, 11800, 11400, 12100, 12900, 13600][i];
  return { day: labels[i], date: 16 + i, occ, adr, revenue: Math.round((occ / 100) * 120 * adr) };
});

export const availabilityMatrix: AvailabilityMatrixEntry[] = (() => {
  const types = ["Deluxe King", "Deluxe Twin", "Premier Suite", "Executive", "Heritage Suite"];
  return types.map((t, ti) => ({
    type: t,
    days: Array.from({ length: 14 }, (_, di) => {
      const seed = (ti * 7 + di * 3) % 11;
      const total = [36, 28, 24, 20, 12][ti];
      const sold = Math.min(total, Math.round(total * (0.55 + seed / 22)));
      return { date: 15 + di, sold, total };
    }),
  }));
})();

export const rateCalendar: RateCalendarEntry[] = (() => {
  const types = ["Deluxe King", "Premier Suite", "Heritage Suite"];
  const base = [11000, 22000, 35000];
  return types.map((t, ti) => ({
    type: t,
    days: Array.from({ length: 14 }, (_, di) => {
      const isWknd = (di + 5) % 7 === 0 || (di + 6) % 7 === 0;
      const isEvent = di === 6 || di === 7;
      const factor = isEvent ? 1.32 : isWknd ? 1.18 : 1;
      return { date: 15 + di, rate: Math.round(base[ti] * factor), tag: isEvent ? "Event" : isWknd ? "Weekend" : "BAR" };
    }),
  }));
})();

export const restrictions: Restriction[] = [
  { date: 16, type: "Heritage Suite", kind: "Min 2N" },
  { date: 18, type: "All", kind: "CTA" },
  { date: 21, type: "Premier Suite", kind: "Stop Sell" },
  { date: 22, type: "All", kind: "CTD" },
  { date: 24, type: "Deluxe King", kind: "Min 3N" },
];

export const guests: GuestProfile[] = [
  {
    name: "Sophie Laurent",
    country: "France",
    visits: 4,
    ltv: 412000,
    tier: "Platinum",
    email: "s.laurent@email.fr",
    phone: "+33 6 12 34 56 78",
    nps: 72,
    tags: ["VIP", "Spa"],
    stays: [
      { id: "ST-901", room: "405", ci: "16 May 2026", co: "21 May 2026", amount: 175000 },
      { id: "ST-744", room: "401", ci: "12 Jan 2026", co: "15 Jan 2026", amount: 98000 },
    ],
    notes: [{ at: "14 May 11:20", author: "FO", text: "Prefers rose amenity set. Late checkout approved." }],
  },
  {
    name: "John Mathews",
    country: "UK",
    visits: 2,
    ltv: 96000,
    tier: "Gold",
    email: "j.mathews@email.co.uk",
    nps: 58,
    stays: [{ id: "ST-902", room: "204", ci: "15 May 2026", co: "18 May 2026", amount: 36000 }],
    notes: [],
  },
  {
    name: "Hiroshi Tanaka",
    country: "Japan",
    visits: 6,
    ltv: 580000,
    tier: "Platinum",
    nps: 81,
    tags: ["Corporate"],
    stays: [{ id: "ST-903", room: "108", ci: "15 May 2026", co: "20 May 2026", amount: 72000 }],
    notes: [{ at: "10 May 09:00", author: "Sales", text: "Negotiated corporate rate RES corp-882." }],
  },
  {
    name: "Elena Rodriguez",
    country: "Spain",
    visits: 1,
    ltv: 105000,
    tier: "Silver",
    nps: 64,
    stays: [{ id: "ST-904", room: "401", ci: "16 May 2026", co: "19 May 2026", amount: 105000 }],
    notes: [],
  },
  {
    name: "Priya Sharma",
    country: "India",
    visits: 9,
    ltv: 720000,
    tier: "Platinum",
    nps: 88,
    tags: ["VIP", "F&B"],
    stays: [{ id: "ST-905", room: "312", ci: "15 May 2026", co: "17 May 2026", amount: 48000 }],
    notes: [{ at: "01 May 14:30", author: "GM", text: "Birthday stay — coordinate with pastry." }],
  },
  {
    name: "Marcus Weber",
    country: "Germany",
    visits: 3,
    ltv: 142000,
    tier: "Gold",
    nps: 70,
    stays: [{ id: "ST-906", room: "215", ci: "14 May 2026", co: "15 May 2026", amount: 9800 }],
    notes: [],
  },
];

export const waitlist: WaitlistEntry[] = [
  { id: "WL-101", guest: "Anita Desai", dates: "16–18 May", roomType: "Premier Suite", priority: "High", requestedAt: "14 May 18:22" },
  { id: "WL-102", guest: "Tom Bradley", dates: "17–19 May", roomType: "Deluxe King", priority: "Normal", requestedAt: "15 May 08:05" },
  { id: "WL-103", guest: "Yuki Sato", dates: "20–22 May", roomType: "Heritage Suite", priority: "High", requestedAt: "15 May 09:41" },
];

export const groupBlocks: GroupBlock[] = [
  { id: "BLK-44", name: "Tech Summit 2026", dates: "18–22 May", blocked: 24, pickedUp: 18, cutOff: "12 May", status: "Open" },
  { id: "BLK-45", name: "Wedding — Mehta", dates: "24–26 May", blocked: 12, pickedUp: 12, cutOff: "10 May", status: "Closed" },
  { id: "BLK-46", name: "Airline Crew Block", dates: "15–30 May", blocked: 8, pickedUp: 3, cutOff: "20 May", status: "Open" },
];

export const workOrders: WorkOrder[] = [
  { id: "WO-441", room: "207", category: "HVAC", priority: "Critical", status: "In Progress", assignee: "Suresh", title: "AC not cooling", createdAt: "15 May 06:30" },
  { id: "WO-442", room: "105", category: "Plumbing", priority: "High", status: "Reported", assignee: "—", title: "Leaking shower", createdAt: "15 May 10:15" },
  { id: "WO-443", room: "303", category: "Electrical", priority: "Normal", status: "Waiting Parts", assignee: "Ravi", title: "Bathroom light fixture", createdAt: "14 May 16:00" },
  { id: "WO-444", room: "118", category: "Furniture", priority: "Normal", status: "Resolved", assignee: "Suresh", title: "Desk chair replacement", createdAt: "13 May 11:00" },
  { id: "WO-445", room: "402", category: "HVAC", priority: "High", status: "Reported", assignee: "—", title: "Thermostat unresponsive", createdAt: "15 May 11:50" },
];

export const opsTasks: OpsTask[] = [
  { id: "TSK-88", title: "VIP amenity setup — 405", department: "FO", assignee: "Neha", due: "15 May 14:00", priority: "High", status: "In Progress" },
  { id: "TSK-89", title: "Review Agoda parity drift", department: "Revenue", assignee: "Arjun", due: "15 May 17:00", priority: "Normal", status: "Open" },
  { id: "TSK-90", title: "Linen vendor follow-up", department: "HK", assignee: "Priya", due: "16 May 09:00", priority: "Normal", status: "Open" },
];

export const guestServiceRequests: GuestServiceRequest[] = [
  { id: "GR-201", room: "312", guest: "Priya Sharma", type: "Extra towels", status: "In Progress", sla: "12 min left" },
  { id: "GR-202", room: "204", guest: "John Mathews", type: "Late checkout", status: "Assigned", sla: "45 min left" },
  { id: "GR-203", room: "108", guest: "Hiroshi Tanaka", type: "Airport transfer", status: "New", sla: "2h SLA" },
];

export const otaMappings: OtaMapping[] = [
  { roomType: "Deluxe King", bookingCom: "Mapped", expedia: "Mapped", agoda: "Mismatch", direct: "Reference" },
  { roomType: "Deluxe Twin", bookingCom: "Mapped", expedia: "Mapped", agoda: "Mapped", direct: "Reference" },
  { roomType: "Premier Suite", bookingCom: "Mapped", expedia: "Mismatch", agoda: "Mapped", direct: "Reference" },
  { roomType: "Executive", bookingCom: "Mapped", expedia: "Mapped", agoda: "Mapped", direct: "Reference" },
  { roomType: "Heritage Suite", bookingCom: "Unmapped", expedia: "Mapped", agoda: "Mapped", direct: "Reference" },
];

export const otaSyncLogs: OtaSyncLog[] = [
  { id: "SYNC-901", channel: "Booking.com", action: "Rates push · 14 days", status: "Success", at: "15 May 11:42" },
  { id: "SYNC-902", channel: "Agoda", action: "Availability pull", status: "Warning", at: "15 May 11:38" },
  { id: "SYNC-903", channel: "Expedia", action: "Restrictions sync", status: "Success", at: "15 May 11:15" },
  { id: "SYNC-904", channel: "Airbnb", action: "Full sync", status: "Error", at: "15 May 10:55" },
];

export const pricingRules: PricingRule[] = [
  { id: "RULE-1", name: "Weekend occupancy uplift", trigger: "Occ > 85% · Fri–Sun", adjustment: "+12% max", status: "Active", lastRun: "15 May 06:00" },
  { id: "RULE-2", name: "Last-room premium", trigger: "Avail < 5%", adjustment: "+18% cap", status: "Active", lastRun: "15 May 06:00" },
  { id: "RULE-3", name: "Low demand discount", trigger: "Occ < 55%", adjustment: "-8% floor", status: "Paused", lastRun: "12 May 06:00" },
];

export const corporateAccounts: CorporateAccount[] = [
  { id: "CORP-101", company: "Infosys Ltd", rateCode: "INF-CORP-24", roomNightsMtd: 48, revenueMtd: 624000, openInvoices: 1, contact: "R. Menon" },
  { id: "CORP-102", company: "Tata Consultancy", rateCode: "TCS-NEG-25", roomNightsMtd: 32, revenueMtd: 416000, openInvoices: 0, contact: "A. Pillai" },
  { id: "CORP-103", company: "Deloitte India", rateCode: "DLT-STD", roomNightsMtd: 18, revenueMtd: 234000, openInvoices: 2, contact: "S. Khanna" },
];

export const onlineCheckIns: OnlineCheckIn[] = [
  { resId: "RES-2044", guest: "Elena Rodriguez", roomType: "Heritage Suite", eta: "16 May 15:00", status: "Pending review", idVerified: true, paymentStatus: "Paid" },
  { resId: "RES-2048", guest: "Sophie Laurent", roomType: "Heritage Suite", eta: "16 May 14:30", status: "Approved", idVerified: true, paymentStatus: "Paid" },
  { resId: "RES-2043", guest: "Hiroshi Tanaka", roomType: "Executive", eta: "15 May 18:00", status: "Needs info", idVerified: false, paymentStatus: "Deposit due" },
];

export const commThreads: CommThread[] = [
  { id: "TH-1", name: "Sophie Laurent", last: "Looking forward to my arrival on the 16th.", time: "10:42", unread: 0, channel: "Email", resId: "RES-2048", stayStatus: "Arriving" },
  { id: "TH-2", name: "John Mathews", last: "Could I get a late checkout please?", time: "09:18", unread: 1, channel: "WhatsApp", resId: "RES-2041", stayStatus: "Checked-In" },
  { id: "TH-3", name: "Hiroshi Tanaka", last: "Confirming spa booking for tomorrow.", time: "Yesterday", unread: 0, channel: "Email", resId: "RES-2043", stayStatus: "Pending" },
  { id: "TH-4", name: "Elena Rodriguez", last: "Will arrive around 21:00.", time: "Yesterday", unread: 2, channel: "SMS", resId: "RES-2044", stayStatus: "Arriving" },
];

export const loyaltyMembers: LoyaltyMember[] = [
  { id: "LM-001", name: "Sophie Laurent", tier: "Platinum", points: 12400, lifetimePoints: 48200, lastActivity: "14 May" },
  { id: "LM-002", name: "Priya Sharma", tier: "Platinum", points: 18600, lifetimePoints: 62400, lastActivity: "15 May" },
  { id: "LM-003", name: "John Mathews", tier: "Gold", points: 3200, lifetimePoints: 9800, lastActivity: "10 May" },
  { id: "LM-004", name: "Marcus Weber", tier: "Gold", points: 4100, lifetimePoints: 11200, lastActivity: "14 May" },
];

export const registrationCards: RegistrationCard[] = [
  { id: "REG-801", resId: "RES-2042", guest: "Priya Sharma", signedAt: "15 May 11:20", status: "Signed", template: "Standard v3" },
  { id: "REG-802", resId: "RES-2044", guest: "Elena Rodriguez", status: "Pending", template: "Standard v3" },
  { id: "REG-803", resId: "RES-2041", guest: "John Mathews", signedAt: "15 May 09:05", status: "Signed", template: "Standard v3" },
  { id: "REG-804", resId: "RES-2046", guest: "Aisha Khan", status: "Exception", template: "Standard v3" },
];

export const lostFoundItems: LostFoundItem[] = [
  { id: "LF-301", description: "Gold bracelet", location: "Spa locker", foundAt: "14 May", status: "Matched", guestMatch: "Sophie Laurent" },
  { id: "LF-302", description: "iPhone charger", location: "Room 204", foundAt: "15 May", status: "Open" },
  { id: "LF-303", description: "Passport cover", location: "Lobby", foundAt: "13 May", status: "Released" },
];

export const feedbackEntries: FeedbackEntry[] = [
  { id: "FB-501", guest: "Marcus Weber", channel: "In-stay survey", score: 9, category: "Housekeeping", status: "Resolved", severity: "Low" },
  { id: "FB-502", guest: "John Mathews", channel: "WhatsApp", score: 6, category: "F&B", status: "In Progress", severity: "Medium" },
  { id: "FB-503", guest: "Anonymous", channel: "Google", score: 4, category: "Front desk", status: "Open", severity: "High" },
];

export const bookingPromos: BookingPromo[] = [
  { id: "PROMO-1", code: "DIRECT15", discount: "15% off BAR", validity: "May 2026", bookings: 42, status: "Active" },
  { id: "PROMO-2", code: "WEEKENDSPA", discount: "Spa credit ₹2,000", validity: "May–Jun 2026", bookings: 18, status: "Active" },
  { id: "PROMO-3", code: "SUMMER24", discount: "10% early bird", validity: "Apr 2026", bookings: 96, status: "Expired" },
];

export const packageProducts: PackageProduct[] = [
  { id: "PKG-1", name: "Honeymoon Escape", price: 85000, inclusions: "Suite · Dinner · Spa", bookingsMtd: 12, status: "Active" },
  { id: "PKG-2", name: "Wellness Retreat", price: 42000, inclusions: "Deluxe · Yoga · Breakfast", bookingsMtd: 8, status: "Active" },
  { id: "PKG-3", name: "Family Fun", price: 38000, inclusions: "Twin · Kids club · Lunch", bookingsMtd: 5, status: "Draft" },
];

export const addOnProducts: AddOnProduct[] = [
  { id: "AO-1", name: "Breakfast buffet", category: "F&B", price: 1800, department: "Restaurant", attachRate: "34%" },
  { id: "AO-2", name: "Airport transfer", category: "Transport", price: 3500, department: "Concierge", attachRate: "22%" },
  { id: "AO-3", name: "Late checkout", category: "Room", price: 6000, department: "Front Office", attachRate: "18%" },
  { id: "AO-4", name: "Spa 60 min", category: "Spa", price: 4500, department: "Spa", attachRate: "28%" },
];

export const conciergeRequests: ConciergeRequest[] = [
  { id: "CON-1", guest: "Sophie Laurent", room: "405", type: "Restaurant · Indian Accent", status: "Confirmed", datetime: "16 May 20:00" },
  { id: "CON-2", guest: "Hiroshi Tanaka", room: "108", type: "Theatre tickets", status: "New", datetime: "17 May 19:30" },
  { id: "CON-3", guest: "John Mathews", room: "204", type: "Flower arrangement", status: "Completed", datetime: "15 May 14:00" },
];

export const transportTrips: TransportTrip[] = [
  { id: "TR-1", guest: "Elena Rodriguez", pickup: "16 May 14:00", flight: "AI 131", driver: "Rajesh", status: "Scheduled" },
  { id: "TR-2", guest: "Sophie Laurent", pickup: "16 May 13:30", flight: "AF 218", driver: "Vikram", status: "Scheduled" },
  { id: "TR-3", guest: "Marcus Weber", pickup: "15 May 10:00", driver: "Rajesh", status: "Completed" },
];

export const activitySlots: ActivitySlot[] = [
  { id: "ACT-1", name: "Old Delhi heritage walk", date: "16 May 09:00", capacity: 12, booked: 8, price: 4500 },
  { id: "ACT-2", name: "Cooking class", date: "17 May 11:00", capacity: 8, booked: 8, price: 6200 },
  { id: "ACT-3", name: "Sunset yoga", date: "16 May 18:00", capacity: 15, booked: 6, price: 2800 },
];

export const portfolioProperties: PortfolioProperty[] = [
  { id: "PROP-1", name: "The Grand Palace", city: "New Delhi", occupancy: 78, revenue: 14200000, revpar: 9267, alerts: 2, stars: 5 },
  { id: "PROP-2", name: "Retrod Marina", city: "Goa", occupancy: 82, revenue: 9800000, revpar: 8420, alerts: 0, stars: 5 },
  { id: "PROP-3", name: "Himalayan Retreat", city: "Shimla", occupancy: 64, revenue: 4200000, revpar: 5180, alerts: 1, stars: 4 },
  { id: "PROP-4", name: "City Lights", city: "Mumbai", occupancy: 71, revenue: 8600000, revpar: 7840, alerts: 3, stars: 4 },
];
