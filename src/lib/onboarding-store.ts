// Persistent onboarding wizard state (frontend-only, localStorage)

export type RoomType = { id: string; name: string; count: number; baseRate: number; amenities: string };
export type RatePlan = { id: string; name: string; type: "BAR" | "Package" | "Corporate" | "OTA"; adjustment: string };
export type StaffInvite = { id: string; name: string; email: string; role: string };
export type IntegrationFlag = { key: string; label: string; enabled: boolean; account?: string };

export type OnboardingState = {
  step: number;
  completed: boolean;
  profile: {
    name: string; brand: string; address: string; city: string; country: string;
    timezone: string; currency: string; starRating: number; gstin: string; logoDataUrl?: string;
  };
  roomTypes: RoomType[];
  rates: {
    plans: RatePlan[];
    tax: { cgst: number; sgst: number; igst: number; serviceCharge: number; lowerSlabUnder: number; lowerSlabRate: number };
  };
  staff: StaffInvite[];
  integrations: IntegrationFlag[];
  policies: {
    checkIn: string; checkOut: string;
    earlyCheckIn: boolean; lateCheckOut: boolean;
    cancellation: string; noShow: string; idRequired: string[];
    minorPolicy: string;
  };
};

const LS = "retrod.onboarding";

export const DEFAULT_ONBOARDING: OnboardingState = {
  step: 0,
  completed: false,
  profile: {
    name: "", brand: "", address: "", city: "", country: "India",
    timezone: "Asia/Kolkata", currency: "INR", starRating: 5, gstin: "",
  },
  roomTypes: [
    { id: "rt1", name: "Deluxe King", count: 40, baseRate: 8500, amenities: "King bed, City view, Mini-bar" },
    { id: "rt2", name: "Premier Suite", count: 12, baseRate: 18500, amenities: "Living room, Bath tub, Lounge access" },
  ],
  rates: {
    plans: [
      { id: "rp1", name: "BAR (Best Available Rate)", type: "BAR", adjustment: "0%" },
      { id: "rp2", name: "Corporate Net Rate", type: "Corporate", adjustment: "-12%" },
      { id: "rp3", name: "Bed & Breakfast Package", type: "Package", adjustment: "+₹950" },
    ],
    tax: { cgst: 9, sgst: 9, igst: 18, serviceCharge: 0, lowerSlabUnder: 7500, lowerSlabRate: 12 },
  },
  staff: [],
  integrations: [
    { key: "razorpay", label: "Razorpay (UPI / Card / Netbanking)", enabled: true, account: "" },
    { key: "stripe", label: "Stripe (International cards)", enabled: false },
    { key: "siteminder", label: "SiteMinder (Channel Manager)", enabled: true },
    { key: "twilio", label: "Twilio (SMS / WhatsApp)", enabled: true },
    { key: "mailgun", label: "Mailgun (Transactional email)", enabled: false },
    { key: "tally", label: "Tally ERP (Accounting export)", enabled: false },
  ],
  policies: {
    checkIn: "14:00", checkOut: "12:00",
    earlyCheckIn: true, lateCheckOut: true,
    cancellation: "Free until 48h before arrival. 1 night charge thereafter.",
    noShow: "1 night room + tax charged to card on file.",
    idRequired: ["Passport", "Govt ID (Indian nationals)"],
    minorPolicy: "Guests under 18 must be accompanied by parent / legal guardian.",
  },
};

export function loadOnboarding(): OnboardingState {
  if (typeof window === "undefined") return DEFAULT_ONBOARDING;
  try {
    const raw = localStorage.getItem(LS);
    if (!raw) return DEFAULT_ONBOARDING;
    return { ...DEFAULT_ONBOARDING, ...JSON.parse(raw) };
  } catch { return DEFAULT_ONBOARDING; }
}

export function saveOnboarding(state: OnboardingState) {
  if (typeof window !== "undefined") localStorage.setItem(LS, JSON.stringify(state));
}

export function clearOnboarding() {
  if (typeof window !== "undefined") localStorage.removeItem(LS);
}
