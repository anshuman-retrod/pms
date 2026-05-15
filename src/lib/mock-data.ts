// Centralized mock data for the entire PMS prototype.
export const ROOM_TYPES = ["Deluxe King", "Deluxe Twin", "Premier Suite", "Executive", "Heritage Suite"] as const;
export const OTAS = ["Booking.com", "Expedia", "Direct", "Agoda", "Airbnb"] as const;

export const reservations = [
  { id: "RES-2041", guest: "John Mathews", room: "204", type: "Deluxe King", ci: "15 May", co: "18 May", nights: 3, amount: 36000, status: "Confirmed", source: "Booking.com", balance: 0 },
  { id: "RES-2042", guest: "Priya Sharma", room: "312", type: "Premier Suite", ci: "15 May", co: "17 May", nights: 2, amount: 48000, status: "Checked-In", source: "Direct", balance: 0 },
  { id: "RES-2043", guest: "Hiroshi Tanaka", room: "108", type: "Executive", ci: "15 May", co: "20 May", nights: 5, amount: 72000, status: "Pending", source: "Expedia", balance: 14400 },
  { id: "RES-2044", guest: "Elena Rodriguez", room: "401", type: "Heritage Suite", ci: "16 May", co: "19 May", nights: 3, amount: 105000, status: "Confirmed", source: "Direct", balance: 0 },
  { id: "RES-2045", guest: "Marcus Weber", room: "215", type: "Deluxe Twin", ci: "14 May", co: "15 May", nights: 1, amount: 9800, status: "Checked-Out", source: "Agoda", balance: 0 },
  { id: "RES-2046", guest: "Aisha Khan", room: "302", type: "Premier Suite", ci: "15 May", co: "16 May", nights: 1, amount: 22000, status: "No-Show", source: "Booking.com", balance: 22000 },
  { id: "RES-2047", guest: "Ravi Iyer", room: "118", type: "Deluxe King", ci: "15 May", co: "18 May", nights: 3, amount: 33000, status: "Cancelled", source: "Airbnb", balance: 0 },
  { id: "RES-2048", guest: "Sophie Laurent", room: "405", type: "Heritage Suite", ci: "16 May", co: "21 May", nights: 5, amount: 175000, status: "Confirmed", source: "Direct", balance: 0 },
];

export const arrivalsToday = reservations.filter(r => r.ci === "15 May" && (r.status === "Confirmed" || r.status === "Pending"));
export const departuresToday = reservations.filter(r => r.co === "15 May");

export const housekeepingRooms = [
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

export const revenueTrend = Array.from({ length: 30 }, (_, i) => {
  const base = 380000 + Math.sin(i / 3) * 60000 + i * 4200 + (i % 7 === 5 ? 80000 : 0);
  const occ = 62 + Math.sin(i / 4) * 12 + (i % 7 === 5 ? 15 : 0);
  return {
    day: `${i + 1}`,
    revenue: Math.round(base),
    occupancy: Math.round(Math.min(98, Math.max(40, occ))),
  };
});

export const otaBreakdown = [
  { source: "Booking.com", bookings: 142, revenue: 1820000 },
  { source: "Direct", bookings: 96, revenue: 1450000 },
  { source: "Expedia", bookings: 58, revenue: 720000 },
  { source: "Agoda", bookings: 34, revenue: 410000 },
  { source: "Airbnb", bookings: 22, revenue: 280000 },
];

export const roomStatusDonut = [
  { name: "Occupied", value: 84, color: "var(--color-info)" },
  { name: "Vacant", value: 18, color: "var(--color-success)" },
  { name: "Dirty", value: 12, color: "var(--color-warning)" },
  { name: "Out of Order", value: 6, color: "var(--color-text-secondary)" },
];

export const activityFeed = [
  { time: "11:42", text: "Reservation #RES-2048 confirmed for Sophie Laurent · Heritage Suite", tone: "success" as const },
  { time: "11:18", text: "Payment of ₹48,000 received · INV-3104 · Priya Sharma", tone: "info" as const },
  { time: "10:55", text: "Room 215 marked Inspected by Priya", tone: "neutral" as const },
  { time: "10:32", text: "Check-in completed · Marcus Weber · Room 215", tone: "info" as const },
  { time: "09:48", text: "OTA rate updated · Booking.com · Deluxe King +₹600", tone: "warning" as const },
];

// ---- Dashboard additions ----
export const occupancyByType = [
  { type: "Deluxe King", total: 36, occupied: 31 },
  { type: "Deluxe Twin", total: 28, occupied: 22 },
  { type: "Premier Suite", total: 24, occupied: 19 },
  { type: "Executive", total: 20, occupied: 8 },
  { type: "Heritage Suite", total: 12, occupied: 4 },
];

export const revenueKpis = [
  { label: "Rooms", today: 1842000, budget: 1700000, sty: 1610000 },
  { label: "Food & Beverage", today: 624000, budget: 700000, sty: 580000 },
  { label: "Spa & Wellness", today: 198000, budget: 150000, sty: 142000 },
  { label: "Misc", today: 84000, budget: 80000, sty: 78000 },
];

export const dashboardAlerts = [
  { id: "A1", tone: "brand" as const, title: "VIP arrival in 1h 42m", body: "Sophie Laurent · Heritage Suite 405 · Amenity setup pending", at: "13:18" },
  { id: "A2", tone: "warning" as const, title: "Overdue checkout · Room 312", body: "Priya Sharma · ₹4,800 balance · 38 min over checkout time", at: "11:38" },
  { id: "A3", tone: "error" as const, title: "Critical work order open 5h 12m", body: "Room 207 · HVAC failure · Engineering: Suresh", at: "08:46" },
  { id: "A4", tone: "warning" as const, title: "Linen below par", body: "Bath towels 22% below par · auto PR raised to vendor", at: "07:55" },
  { id: "A5", tone: "info" as const, title: "OTA rate parity drift", body: "Agoda showing -3% vs hotel website on Deluxe King", at: "07:12" },
];

export const forecast7d = Array.from({ length: 7 }, (_, i) => {
  const labels = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
  const occ = [86, 91, 72, 68, 74, 82, 88][i];
  const adr = [13200, 14400, 11800, 11400, 12100, 12900, 13600][i];
  return { day: labels[i], date: 16 + i, occ, adr, revenue: Math.round((occ / 100) * 120 * adr) };
});

// ---- Reservations: calendars ----
export const availabilityMatrix = (() => {
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

export const rateCalendar = (() => {
  const types = ["Deluxe King", "Premier Suite", "Heritage Suite"];
  const base = [11000, 22000, 35000];
  return types.map((t, ti) => ({
    type: t,
    days: Array.from({ length: 14 }, (_, di) => {
      const isWknd = (di + 5) % 7 === 0 || (di + 6) % 7 === 0;
      const isEvent = di === 6 || di === 7;
      const factor = isEvent ? 1.32 : isWknd ? 1.18 : 1;
      return { date: 15 + di, rate: Math.round(base[ti] * factor), tag: isEvent ? "Event" : isWknd ? "Weekend" : "BAR" as const };
    }),
  }));
})();

export const restrictions = [
  { date: 16, type: "Heritage Suite", kind: "Min 2N" },
  { date: 18, type: "All", kind: "CTA" },
  { date: 21, type: "Premier Suite", kind: "Stop Sell" },
  { date: 22, type: "All", kind: "CTD" },
  { date: 24, type: "Deluxe King", kind: "Min 3N" },
];

export const guests = [
  { name: "Sophie Laurent", country: "France", visits: 4, ltv: 412000, tier: "Platinum" },
  { name: "John Mathews", country: "UK", visits: 2, ltv: 96000, tier: "Gold" },
  { name: "Hiroshi Tanaka", country: "Japan", visits: 6, ltv: 580000, tier: "Platinum" },
  { name: "Elena Rodriguez", country: "Spain", visits: 1, ltv: 105000, tier: "Silver" },
  { name: "Priya Sharma", country: "India", visits: 9, ltv: 720000, tier: "Platinum" },
  { name: "Marcus Weber", country: "Germany", visits: 3, ltv: 142000, tier: "Gold" },
];
