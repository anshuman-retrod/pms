import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  User,
  Users,
  Building2,
  Gift,
  Footprints,
  CalendarClock,
  CheckCircle2,
  Mail,
  Phone,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Card, CardHeader, Button, StatusBadge } from "@/components/ui/Primitives";
import {
  useMealPlansQuery,
  useRatePlansQuery,
  useHotelPackagesQuery,
  useAddOnProductsQuery,
  useOccupancyPricingRulesQuery,
  useAvailabilityCellsQuery,
} from "@/services/mock/queries";
import {
  eligibilityHint,
  filterEligibleRatePlans,
  type ReservationTypeForRates,
} from "@/features/rate-plans/lib/eligibility";
import {
  availabilityBlockReason,
  listBookableRoomTypes,
} from "@/features/availability/lib/eligibility";
import type { ReservationPricingBreakdown, RatePlan } from "@/types/pms";

const types = [
  { id: "individual", label: "Individual", icon: User, hint: "Single guest or family" },
  { id: "group", label: "Group", icon: Users, hint: "Block of rooms · rooming list" },
  { id: "corporate", label: "Corporate", icon: Building2, hint: "Negotiated rate · direct bill" },
  { id: "package", label: "Package", icon: Gift, hint: "Honeymoon · Spa · B&B" },
  { id: "walkin", label: "Walk-In", icon: Footprints, hint: "On-the-spot, minimum fields" },
  { id: "event", label: "Event / Banquet", icon: CalendarClock, hint: "Venue + catering + AV" },
] as const;

type T = (typeof types)[number]["id"];

type ReservationFormData = {
  fullName: string;
  nationality: string;
  email: string;
  phone: string;
  idType: string;
  idNumber: string;
  checkIn: string;
  checkOut: string;
  adults: string;
  children: string;
  roomType: string;
  ratePlan: string;
  mealPlan: string;
  occupancyType: "single" | "double" | "triple" | "quad";
  selectedPackageId: string;
  addOnIds: string[];
  dynamicPricingPct: string;
  source: string;
  notes: string;
  groupName: string;
  groupCompany: string;
  groupContact: string;
  groupPickupTarget: string;
  groupRooms: string;
  groupCutoffDate: string;
  groupMealPlan: string;
  corporateCompany: string;
  corporatePoRef: string;
  corporateBilling: string;
  corporateGuestId: string;
  corporateCostCenter: string;
  corporateTravelPurpose: string;
  packageName: string;
  packageOccasion: string;
  packageInclusionNotes: string;
  walkinPayment: string;
  walkinIdVerified: boolean;
  walkinVehicleNo: string;
  walkinDeposit: string;
  eventVenue: string;
  eventType: string;
  eventPax: string;
  eventDate: string;
  eventStart: string;
  eventEnd: string;
  eventOrganizer: string;
  eventContact: string;
  eventCateringPlan: string;
  eventAvSetup: boolean;
  sendEmail: boolean;
  sendSms: boolean;
  preAuthCard: boolean;
};

const DRAFT_KEY = "retrod:new-reservation:draft:v1";
const SUBMITTED_KEY = "retrod:new-reservation:last-submitted:v1";

const initialFormData: ReservationFormData = {
  fullName: "",
  nationality: "",
  email: "",
  phone: "",
  idType: "Passport",
  idNumber: "",
  checkIn: "",
  checkOut: "",
  adults: "2",
  children: "0",
  roomType: "",
  ratePlan: "",
  mealPlan: "",
  occupancyType: "double",
  selectedPackageId: "",
  addOnIds: [],
  dynamicPricingPct: "0",
  source: "Direct",
  notes: "",
  groupName: "",
  groupCompany: "",
  groupContact: "",
  groupPickupTarget: "",
  groupRooms: "",
  groupCutoffDate: "",
  groupMealPlan: "Breakfast",
  corporateCompany: "",
  corporatePoRef: "",
  corporateBilling: "Direct bill to company (City Ledger)",
  corporateGuestId: "",
  corporateCostCenter: "",
  corporateTravelPurpose: "",
  packageName: "",
  packageOccasion: "",
  packageInclusionNotes: "",
  walkinPayment: "Cash",
  walkinIdVerified: false,
  walkinVehicleNo: "",
  walkinDeposit: "",
  eventVenue: "",
  eventType: "",
  eventPax: "",
  eventDate: "",
  eventStart: "",
  eventEnd: "",
  eventOrganizer: "",
  eventContact: "",
  eventCateringPlan: "Standard veg + non-veg buffet",
  eventAvSetup: false,
  sendEmail: true,
  sendSms: true,
  preAuthCard: false,
};

function nightsBetween(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  const ci = new Date(checkIn);
  const co = new Date(checkOut);
  if (Number.isNaN(ci.getTime()) || Number.isNaN(co.getTime())) return 0;
  return Math.max(0, Math.round((co.getTime() - ci.getTime()) / (1000 * 60 * 60 * 24)));
}

function estimateTotal(type: T, data: ReservationFormData, nights: number) {
  const roomRates: Record<string, number> = {
    "Deluxe King": 11000,
    "Premier Suite": 22000,
    "Heritage Suite": 35000,
  };
  if (type === "event") return (Number(data.eventPax) || 0) * 2800;
  if (type === "group") return 1480000;
  if (type === "walkin") return roomRates[data.roomType] ?? 9500;
  const nightly = roomRates[data.roomType] ?? 11000;
  return nightly * Math.max(1, nights);
}

function calculatePricingBreakdown(input: {
  type: T;
  nights: number;
  roomType: string;
  mealPlanId: string;
  selectedPackageId: string;
  addOnIds: string[];
  dynamicPricingPct: number;
  adults: number;
  children: number;
  occupancyType: ReservationFormData["occupancyType"];
  ratePlanId: string;
  mealPlans: Array<{ id: string; priceAdjustment: number; taxPercent: number }>;
  ratePlans: Array<{ id: string; discountPercent: number }>;
  hotelPackages: Array<{ id: string; basePrice: number }>;
  addOnProducts: Array<{ id: string; price: number }>;
  occupancyRules: Array<{
    occupancyType: ReservationFormData["occupancyType"];
    multiplier: number;
  }>;
}): ReservationPricingBreakdown {
  const roomRates: Record<string, number> = {
    "Deluxe King": 11000,
    "Premier Suite": 22000,
    "Heritage Suite": 35000,
    "Deluxe Twin": 9800,
    Executive: 12000,
  };
  const baseNightly = input.type === "event" ? 2800 : (roomRates[input.roomType] ?? 11000);
  const stayUnits = Math.max(1, input.nights);
  const occupancyMultiplier =
    input.occupancyRules.find((rule) => rule.occupancyType === input.occupancyType)?.multiplier ??
    1;
  const roomRate = Math.round(baseNightly * stayUnits * occupancyMultiplier);

  const mealPlan = input.mealPlans.find((item) => item.id === input.mealPlanId);
  const mealPlanCharges = Math.round((mealPlan?.priceAdjustment ?? 0) * stayUnits);

  const selectedPackage = input.hotelPackages.find((item) => item.id === input.selectedPackageId);
  const packageCharges = Math.round((selectedPackage?.basePrice ?? 0) * stayUnits);

  const addOnCharges = input.addOnIds.reduce((sum, addOnId) => {
    const product = input.addOnProducts.find((item) => item.id === addOnId);
    return sum + (product?.price ?? 0);
  }, 0);

  const extraAdults = Math.max(0, input.adults - 2);
  const extraChildren = Math.max(0, input.children);
  const extraGuestCharges = extraAdults * 1800 * stayUnits + extraChildren * 900 * stayUnits;

  const subtotalBeforeRatePlan =
    roomRate + mealPlanCharges + packageCharges + addOnCharges + extraGuestCharges;
  const ratePlanDiscountPct =
    input.ratePlans.find((item) => item.id === input.ratePlanId)?.discountPercent ?? 0;
  const ratePlanDiscountAmount = Math.round((subtotalBeforeRatePlan * ratePlanDiscountPct) / 100);

  const subtotalAfterRatePlan = subtotalBeforeRatePlan - ratePlanDiscountAmount;
  const dynamicPricingAmount = Math.round((subtotalAfterRatePlan * input.dynamicPricingPct) / 100);

  const taxableBase = subtotalAfterRatePlan + dynamicPricingAmount;
  const taxes = Math.round((taxableBase * (mealPlan?.taxPercent ?? 12)) / 100);
  const total = taxableBase + taxes;

  return {
    roomRate,
    mealPlanCharges,
    packageCharges,
    addOnCharges,
    taxes,
    extraGuestCharges,
    total,
    lines: [
      { label: "Room rate", amount: roomRate },
      { label: "Meal plan charges", amount: mealPlanCharges },
      { label: "Package charges", amount: packageCharges },
      { label: "Add-on charges", amount: addOnCharges },
      { label: "Extra guest charges", amount: extraGuestCharges },
      { label: "Rate plan discount", amount: -ratePlanDiscountAmount },
      { label: "Dynamic pricing", amount: dynamicPricingAmount },
      { label: "Taxes", amount: taxes },
    ],
  };
}

function validate(
  data: ReservationFormData,
  type: T,
  mode: "draft" | "confirm",
): Record<string, string> {
  const errors: Record<string, string> = {};

  // Draft validation: minimum viable capture.
  if (!data.fullName.trim()) errors.fullName = "Guest name is required.";
  if (!data.phone.trim()) errors.phone = "Phone is required.";
  if (!data.checkIn) errors.checkIn = "Check-in date is required.";
  if (!data.checkOut) errors.checkOut = "Check-out date is required.";
  if (!data.roomType && type !== "event") errors.roomType = "Select a room type.";

  if (mode === "draft") {
    if (data.checkIn && data.checkOut && nightsBetween(data.checkIn, data.checkOut) < 1) {
      errors.checkOut = "Check-out must be after check-in.";
    }
    return errors;
  }

  // Confirm validation: production-grade rule set.
  if (!data.ratePlan && type !== "event") errors.ratePlan = "Select a rate plan.";
  if (!data.mealPlan && type !== "event") errors.mealPlan = "Select a meal plan.";
  if (!data.source.trim()) errors.source = "Booking source is required.";
  if (Number(data.adults || 0) < 1) errors.adults = "At least one adult is required.";
  if (data.checkIn && data.checkOut && nightsBetween(data.checkIn, data.checkOut) < 1) {
    errors.checkOut = "Check-out must be after check-in.";
  }
  if (!data.sendEmail && !data.sendSms) {
    errors.confirmation = "Enable at least one confirmation channel (Email or SMS).";
  }

  if (type === "group" && !data.groupName.trim()) errors.groupName = "Group name is required.";
  if (type === "group" && !data.groupContact.trim()) {
    errors.groupContact = "Group contact is required for confirmation.";
  }
  if (type === "corporate" && !data.corporateCompany.trim()) {
    errors.corporateCompany = "Company is required for corporate booking.";
  }
  if (type === "corporate" && !data.corporateBilling.trim()) {
    errors.corporateBilling = "Billing mode is required for corporate booking.";
  }
  if (
    type === "corporate" &&
    data.corporateBilling.includes("Direct bill") &&
    !data.corporatePoRef.trim()
  ) {
    errors.corporatePoRef = "PO / Reference is required for direct billing.";
  }
  if (type === "package" && !data.packageName) errors.packageName = "Select a package.";
  if (type === "walkin" && !data.walkinPayment.trim()) {
    errors.walkinPayment = "Payment method is required for walk-in reservation.";
  }
  if (type === "event") {
    if (!data.eventVenue) errors.eventVenue = "Venue is required.";
    if (!data.eventType) errors.eventType = "Event type is required.";
    if (!data.eventDate) errors.eventDate = "Event date is required.";
    if (Number(data.eventPax || 0) < 1) errors.eventPax = "Expected pax is required.";
  }
  return errors;
}

export function NewReservationFeature() {
  const navigate = useNavigate();
  const { data: mealPlans = [] } = useMealPlansQuery();
  const { data: ratePlans = [] } = useRatePlansQuery();
  const { data: hotelPackages = [] } = useHotelPackagesQuery();
  const { data: addOnProducts = [] } = useAddOnProductsQuery();
  const { data: occupancyRules = [] } = useOccupancyPricingRulesQuery();
  const { data: availabilityCells = [] } = useAvailabilityCellsQuery();
  const [type, setType] = useState<T>("individual");
  const [form, setForm] = useState<ReservationFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { type: T; form: ReservationFormData };
      if (parsed?.form) {
        setForm({ ...initialFormData, ...parsed.form });
        setType(parsed.type ?? "individual");
      }
    } catch {
      // Ignore malformed draft and continue with clean state.
    }
  }, []);

  const nights = useMemo(
    () => nightsBetween(form.checkIn, form.checkOut),
    [form.checkIn, form.checkOut],
  );

  const eligibleRatePlans = useMemo(
    () =>
      filterEligibleRatePlans(ratePlans, {
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        roomTypeName: form.roomType,
        reservationType: type as ReservationTypeForRates,
        corporateCompany: form.corporateCompany,
      }),
    [ratePlans, form.checkIn, form.checkOut, form.roomType, type, form.corporateCompany],
  );

  const bookableRoomTypes = useMemo(
    () => listBookableRoomTypes(availabilityCells, form.checkIn, form.checkOut),
    [availabilityCells, form.checkIn, form.checkOut],
  );

  const availabilityError = useMemo(() => {
    if (!form.roomType || !form.checkIn || !form.checkOut || type === "event") return null;
    return availabilityBlockReason(availabilityCells, form.roomType, form.checkIn, form.checkOut);
  }, [availabilityCells, form.roomType, form.checkIn, form.checkOut, type]);

  useEffect(() => {
    if (form.ratePlan && !eligibleRatePlans.some((plan) => plan.id === form.ratePlan)) {
      setForm((prev) => ({ ...prev, ratePlan: "" }));
    }
  }, [eligibleRatePlans, form.ratePlan]);

  useEffect(() => {
    setForm((prev) => {
      if (!prev.roomType || !prev.checkIn || !prev.checkOut || type === "event") return prev;
      const block = availabilityBlockReason(
        availabilityCells,
        prev.roomType,
        prev.checkIn,
        prev.checkOut,
      );
      return block ? { ...prev, roomType: "" } : prev;
    });
  }, [form.checkIn, form.checkOut, availabilityCells, type]);

  const total = useMemo(() => estimateTotal(type, form, nights), [type, form, nights]);
  const pricingBreakdown = useMemo(
    () =>
      calculatePricingBreakdown({
        type,
        nights,
        roomType: form.roomType,
        mealPlanId: form.mealPlan,
        selectedPackageId: form.selectedPackageId,
        addOnIds: form.addOnIds,
        dynamicPricingPct: Number(form.dynamicPricingPct || 0),
        adults: Number(form.adults || 0),
        children: Number(form.children || 0),
        occupancyType: form.occupancyType,
        ratePlanId: form.ratePlan,
        mealPlans: mealPlans.map((m) => ({
          id: m.id,
          priceAdjustment: m.priceAdjustment,
          taxPercent: m.taxPercent,
        })),
        ratePlans: ratePlans.map((r) => ({ id: r.id, discountPercent: r.discountPercent })),
        hotelPackages: hotelPackages.map((p) => ({ id: p.id, basePrice: p.basePrice })),
        addOnProducts: addOnProducts.map((a) => ({ id: a.id, price: a.price })),
        occupancyRules: occupancyRules.map((o) => ({
          occupancyType: o.occupancyType,
          multiplier: o.multiplier,
        })),
      }),
    [type, nights, form, mealPlans, ratePlans, hotelPackages, addOnProducts, occupancyRules],
  );

  const setField = <K extends keyof ReservationFormData>(key: K, value: ReservationFormData[K]) => {
    setDirty(true);
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      if (key === "sendEmail" || key === "sendSms") {
        delete next.confirmation;
      }
      return next;
    });
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveDraft = () => {
    const draftErrors = validate(form, type, "draft");
    if (availabilityError) draftErrors.roomType = availabilityError;
    setErrors(draftErrors);
    if (Object.keys(draftErrors).length > 0) {
      toast.error("Please fill minimum required fields before saving draft.");
      return;
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ type, form }));
    toast.success("Draft saved.");
  };

  const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!dirty) return;
    if (window.confirm("Discard unsaved reservation changes?")) return;
    e.preventDefault();
  };

  const handleSubmit = async () => {
    const nextErrors = validate(form, type, "confirm");
    if (availabilityError) nextErrors.roomType = availabilityError;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 650));
      localStorage.setItem(
        SUBMITTED_KEY,
        JSON.stringify({
          createdAt: new Date().toISOString(),
          type,
          form,
        }),
      );
      localStorage.removeItem(DRAFT_KEY);
      setDirty(false);
      toast.success("Reservation created successfully.");
      navigate({ to: "/reservations" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Reservations · New"
        title="New reservation"
        description="Choose a booking type and complete the form. Auto-confirmation sent on submit."
        actions={
          <>
            <Link to="/reservations" onClick={handleBack}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleSaveDraft} disabled={submitting}>
              Save draft
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Confirming..." : "Confirm reservation"}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[260px_1fr]">
        <Card>
          <CardHeader title="Booking type" />
          <ul className="p-2">
            {types.map((t) => {
              const active = type === t.id;
              const Icon = t.icon;
              return (
                <li key={t.id}>
                  <button
                    onClick={() => setType(t.id)}
                    className={`flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition ${
                      active ? "bg-primary-tint text-primary-pressed" : "hover:bg-surface-2"
                    }`}
                  >
                    <Icon
                      className={`mt-0.5 h-4 w-4 ${active ? "text-primary" : "text-text-secondary"}`}
                    />
                    <div>
                      <div className="text-[13px] font-medium">{t.label}</div>
                      <div className="text-[11px] text-text-secondary">{t.hint}</div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>

        <div className="space-y-4">
          {type === "group" && <GroupForm form={form} errors={errors} setField={setField} />}
          {type === "corporate" && (
            <CorporateForm form={form} errors={errors} setField={setField} />
          )}
          {type === "package" && <PackageForm form={form} errors={errors} setField={setField} />}
          {type === "walkin" && <WalkinForm form={form} errors={errors} setField={setField} />}
          {type === "event" && <EventForm form={form} errors={errors} setField={setField} />}
          <GuestStayForm
            form={form}
            errors={errors}
            setField={setField}
            nights={nights}
            mealPlans={mealPlans}
            ratePlans={eligibleRatePlans}
            allRatePlansCount={ratePlans.filter((plan) => plan.status === "Active").length}
            bookableRoomTypes={bookableRoomTypes}
            hotelPackages={hotelPackages}
            addOnProducts={addOnProducts}
          />
          <Summary
            form={form}
            errors={errors}
            setField={setField}
            total={Math.max(total, pricingBreakdown.total)}
            pricingBreakdown={pricingBreakdown}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  hint,
  error,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] font-medium text-text-secondary">{label}</span>
        {hint && <span className="text-[10px] text-text-disabled">{hint}</span>}
      </div>
      {children}
      {error && <div className="mt-1 text-[11px] text-error">{error}</div>}
    </label>
  );
}

const inputCls =
  "h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary placeholder:text-text-disabled focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15";

type FormProps = {
  form: ReservationFormData;
  errors: Record<string, string>;
  setField: <K extends keyof ReservationFormData>(key: K, value: ReservationFormData[K]) => void;
};

function GuestStayForm({
  form,
  errors,
  setField,
  nights,
  mealPlans,
  ratePlans,
  allRatePlansCount,
  bookableRoomTypes,
  hotelPackages,
  addOnProducts,
}: FormProps & {
  nights: number;
  mealPlans: Array<{
    id: string;
    code: string;
    name: string;
    includedMeals: string[];
    priceAdjustment: number;
    status: string;
  }>;
  ratePlans: RatePlan[];
  allRatePlansCount: number;
  bookableRoomTypes: Array<{
    id: string;
    name: string;
    freeMin: number;
    blocked: boolean;
    blockReason?: string;
  }>;
  hotelPackages: Array<{
    id: string;
    name: string;
    description: string;
    basePrice: number;
    status: string;
  }>;
  addOnProducts: Array<{ id: string; name: string; category: string; price: number }>;
}) {
  return (
    <>
      <Card>
        <CardHeader title="Guest details" />
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
          <Field label="Full name" error={errors.fullName}>
            <input
              className={inputCls}
              placeholder="e.g. John Mathews"
              value={form.fullName}
              onChange={(e) => setField("fullName", e.target.value)}
            />
          </Field>
          <Field label="Nationality">
            <input
              className={inputCls}
              placeholder="United Kingdom"
              value={form.nationality}
              onChange={(e) => setField("nationality", e.target.value)}
            />
          </Field>
          <Field label="Email">
            <input
              className={inputCls}
              type="email"
              placeholder="john@email.com"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
            />
          </Field>
          <Field label="Phone" error={errors.phone}>
            <input
              className={inputCls}
              placeholder="+44 7700 900812"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
            />
          </Field>
          <Field label="ID type">
            <select
              className={inputCls}
              value={form.idType}
              onChange={(e) => setField("idType", e.target.value)}
            >
              <option>Passport</option>
              <option>Aadhaar</option>
              <option>Driving Licence</option>
            </select>
          </Field>
          <Field label="ID number">
            <input
              className={inputCls}
              placeholder="UK-PP 893421"
              value={form.idNumber}
              onChange={(e) => setField("idNumber", e.target.value)}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader title="Stay & rate (Step 2-5)" hint="Stay dates, room, meal plan, rate plan" />
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
          <Field label="Check-in" error={errors.checkIn}>
            <input
              className={inputCls}
              type="date"
              value={form.checkIn}
              onChange={(e) => setField("checkIn", e.target.value)}
            />
          </Field>
          <Field label="Check-out" error={errors.checkOut}>
            <input
              className={inputCls}
              type="date"
              value={form.checkOut}
              onChange={(e) => setField("checkOut", e.target.value)}
            />
          </Field>
          <Field label="Nights / Pax" error={errors.adults}>
            <div className="flex gap-2">
              <input className={inputCls} value={`${nights} nights`} readOnly />
              <input
                className={inputCls}
                placeholder="2 adults"
                value={`${form.adults}A / ${form.children}C`}
                readOnly
              />
            </div>
          </Field>
          <Field label="Room type" hint="Live availability" error={errors.roomType}>
            <select
              className={inputCls}
              value={form.roomType}
              onChange={(e) => setField("roomType", e.target.value)}
            >
              <option value="">Select room type</option>
              {bookableRoomTypes.map((room) => (
                <option key={room.id} value={room.name} disabled={room.blocked}>
                  {room.name}
                  {room.blocked ? ` · blocked` : room.freeMin > 0 ? ` · ${room.freeMin} left` : ""}
                </option>
              ))}
            </select>
            {bookableRoomTypes.some((room) => room.blocked) ? (
              <div className="mt-1 text-[11px] text-text-secondary">
                Blocked room types reflect closed, stop sell, or CTA/CTD rules from Availability
                Management.
              </div>
            ) : null}
          </Field>
          <Field label="Rate plan" error={errors.ratePlan}>
            <select
              className={inputCls}
              value={form.ratePlan}
              onChange={(e) => setField("ratePlan", e.target.value)}
            >
              <option value="">Select rate plan</option>
              {ratePlans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {eligibilityHint(plan)} · {plan.name}
                </option>
              ))}
            </select>
            {ratePlans.length === 0 && allRatePlansCount > 0 ? (
              <div className="mt-1 text-[11px] text-text-secondary">
                No plans match dates, room type, or booking type. Adjust stay details or use Rate
                Plans.
              </div>
            ) : null}
          </Field>
          <Field label="Meal plan" error={errors.mealPlan}>
            <select
              className={inputCls}
              value={form.mealPlan}
              onChange={(e) => setField("mealPlan", e.target.value)}
            >
              <option value="">Select meal plan</option>
              {mealPlans
                .filter((meal) => meal.status === "Active")
                .map((meal) => (
                  <option key={meal.id} value={meal.id}>
                    {meal.code} · {meal.name} · +₹{meal.priceAdjustment.toLocaleString()}
                  </option>
                ))}
            </select>
          </Field>
          <Field label="Occupancy type">
            <select
              className={inputCls}
              value={form.occupancyType}
              onChange={(e) =>
                setField("occupancyType", e.target.value as ReservationFormData["occupancyType"])
              }
            >
              <option value="single">Single occupancy</option>
              <option value="double">Double occupancy</option>
              <option value="triple">Triple occupancy</option>
              <option value="quad">Quad occupancy</option>
            </select>
          </Field>
          <Field label="Source" error={errors.source}>
            <select
              className={inputCls}
              value={form.source}
              onChange={(e) => setField("source", e.target.value)}
            >
              <option value="Direct">Direct</option>
              <option value="Booking.com">Booking.com</option>
              <option value="Expedia">Expedia</option>
              <option value="Agoda">Agoda</option>
            </select>
          </Field>
          <Field label="Dynamic pricing adjustment (%)" hint="Revenue rule uplift/discount">
            <input
              className={inputCls}
              type="number"
              min={-40}
              max={80}
              value={form.dynamicPricingPct}
              onChange={(e) => setField("dynamicPricingPct", e.target.value)}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Packages & add-ons (Step 6-7)"
          hint="Attach package and reservation add-on services"
        />
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
          <Field label="Package selection">
            <select
              className={inputCls}
              value={form.selectedPackageId}
              onChange={(e) => setField("selectedPackageId", e.target.value)}
            >
              <option value="">No package</option>
              {hotelPackages
                .filter((pkg) => pkg.status !== "Inactive")
                .map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} · +₹{pkg.basePrice.toLocaleString()} / night
                  </option>
                ))}
            </select>
          </Field>
          <Field label="Add-on services">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {addOnProducts.map((addOn) => {
                const checked = form.addOnIds.includes(addOn.id);
                return (
                  <label
                    key={addOn.id}
                    className="flex items-center justify-between rounded-md border border-border-subtle bg-surface-2/40 px-3 py-2 text-[12px]"
                  >
                    <span className="text-text-primary">{addOn.name}</span>
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-primary">
                        ₹{addOn.price.toLocaleString()}
                      </span>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setField("addOnIds", [...form.addOnIds, addOn.id]);
                          } else {
                            setField(
                              "addOnIds",
                              form.addOnIds.filter((id) => id !== addOn.id),
                            );
                          }
                        }}
                      />
                    </span>
                  </label>
                );
              })}
            </div>
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader title="Special requests & preferences" />
        <div className="space-y-3 p-5">
          <div className="flex flex-wrap gap-2">
            {[
              "High floor",
              "Sea view",
              "Twin beds",
              "Hypoallergenic pillow",
              "Late check-out",
              "Airport pickup",
              "Newspaper · FT",
              "Vegan menu",
            ].map((t) => (
              <button
                key={t}
                className="rounded-full border border-border px-3 py-1 text-[11px] text-text-secondary hover:border-primary hover:text-primary"
              >
                + {t}
              </button>
            ))}
          </div>
          <textarea
            className="w-full rounded-md border border-border bg-surface p-3 text-[13px] focus:border-primary focus:outline-none"
            rows={3}
            placeholder="Free-text notes for the front office team…"
            value={form.notes}
            onChange={(e) => setField("notes", e.target.value)}
          />
        </div>
      </Card>
    </>
  );
}

function GroupForm({ form, errors, setField }: FormProps) {
  return (
    <Card>
      <CardHeader title="Group details" />
      <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
        <Field label="Group name" error={errors.groupName}>
          <input
            className={inputCls}
            placeholder="Tata Steel Annual Offsite"
            value={form.groupName}
            onChange={(e) => setField("groupName", e.target.value)}
          />
        </Field>
        <Field label="Company / event">
          <input
            className={inputCls}
            placeholder="Tata Steel Ltd."
            value={form.groupCompany}
            onChange={(e) => setField("groupCompany", e.target.value)}
          />
        </Field>
        <Field label="Primary contact" error={errors.groupContact}>
          <input
            className={inputCls}
            placeholder="Anil Kumar · +91 98xxxxxx20"
            value={form.groupContact}
            onChange={(e) => setField("groupContact", e.target.value)}
          />
        </Field>
        <Field label="Pickup target">
          <input
            className={inputCls}
            placeholder="40 of 50 rooms"
            value={form.groupPickupTarget}
            onChange={(e) => setField("groupPickupTarget", e.target.value)}
          />
        </Field>
        <Field label="Room block count">
          <input
            className={inputCls}
            type="number"
            min={1}
            placeholder="e.g. 50"
            value={form.groupRooms}
            onChange={(e) => setField("groupRooms", e.target.value)}
          />
        </Field>
        <Field label="Cutoff date">
          <input
            className={inputCls}
            type="date"
            value={form.groupCutoffDate}
            onChange={(e) => setField("groupCutoffDate", e.target.value)}
          />
        </Field>
        <Field label="Meal plan">
          <select
            className={inputCls}
            value={form.groupMealPlan}
            onChange={(e) => setField("groupMealPlan", e.target.value)}
          >
            <option>Breakfast</option>
            <option>MAP (Breakfast + Dinner)</option>
            <option>AP (All meals)</option>
            <option>Room only</option>
          </select>
        </Field>
      </div>
    </Card>
  );
}

function CorporateForm({ form, errors, setField }: FormProps) {
  return (
    <Card>
      <CardHeader title="Corporate account" />
      <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
        <Field label="Company" error={errors.corporateCompany}>
          <input
            className={inputCls}
            placeholder="Infosys Ltd."
            value={form.corporateCompany}
            onChange={(e) => setField("corporateCompany", e.target.value)}
          />
        </Field>
        <Field label="PO / Reference" error={errors.corporatePoRef}>
          <input
            className={inputCls}
            placeholder="PO-2026-04812"
            value={form.corporatePoRef}
            onChange={(e) => setField("corporatePoRef", e.target.value)}
          />
        </Field>
        <Field label="Billing" error={errors.corporateBilling}>
          <select
            className={inputCls}
            value={form.corporateBilling}
            onChange={(e) => setField("corporateBilling", e.target.value)}
          >
            <option>Direct bill to company (City Ledger)</option>
            <option>Guest pays — company reimburses</option>
          </select>
        </Field>
        <Field label="Employee / traveler ID">
          <input
            className={inputCls}
            placeholder="EMP-22491"
            value={form.corporateGuestId}
            onChange={(e) => setField("corporateGuestId", e.target.value)}
          />
        </Field>
        <Field label="Cost center">
          <input
            className={inputCls}
            placeholder="SALES-NORTH"
            value={form.corporateCostCenter}
            onChange={(e) => setField("corporateCostCenter", e.target.value)}
          />
        </Field>
        <Field label="Travel purpose">
          <select
            className={inputCls}
            value={form.corporateTravelPurpose}
            onChange={(e) => setField("corporateTravelPurpose", e.target.value)}
          >
            <option value="">Select purpose</option>
            <option value="Client meeting">Client meeting</option>
            <option value="Training">Training</option>
            <option value="Sales visit">Sales visit</option>
            <option value="Audit">Audit</option>
          </select>
        </Field>
      </div>
    </Card>
  );
}

function PackageForm({ form, errors, setField }: FormProps) {
  return (
    <Card>
      <CardHeader title="Package selection" />
      <div className="grid grid-cols-1 gap-3 p-5 md:grid-cols-3">
        {[
          { name: "Honeymoon Bliss", price: 28000 },
          { name: "Stay & Spa", price: 18500 },
          { name: "Family Escape", price: 22000 },
        ].map((p) => (
          <button
            key={p.name}
            onClick={() => setField("packageName", p.name)}
            className={`rounded-lg border bg-surface p-4 text-left ${
              form.packageName === p.name ? "border-primary" : "border-border hover:border-primary"
            }`}
          >
            <div className="text-[14px] font-semibold text-text-primary">{p.name}</div>
            <div className="font-mono text-[12px] text-primary">
              ₹{p.price.toLocaleString()} / night
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-text-secondary">
              <CheckCircle2 className="h-3 w-3 text-success" />
              Tap to select package
            </div>
          </button>
        ))}
      </div>
      {errors.packageName && (
        <div className="px-5 pb-5 text-[11px] text-error">{errors.packageName}</div>
      )}
      <div className="grid grid-cols-1 gap-4 px-5 pb-5 md:grid-cols-2">
        <Field label="Occasion">
          <select
            className={inputCls}
            value={form.packageOccasion}
            onChange={(e) => setField("packageOccasion", e.target.value)}
          >
            <option value="">Select occasion</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Honeymoon">Honeymoon</option>
            <option value="Birthday">Birthday</option>
            <option value="Family vacation">Family vacation</option>
          </select>
        </Field>
        <Field label="Inclusion notes">
          <input
            className={inputCls}
            placeholder="Cake at 8 PM, spa slot preference..."
            value={form.packageInclusionNotes}
            onChange={(e) => setField("packageInclusionNotes", e.target.value)}
          />
        </Field>
      </div>
    </Card>
  );
}

function WalkinForm({ form, errors, setField }: FormProps) {
  return (
    <Card>
      <CardHeader title="Quick walk-in" hint="Minimum fields · ready in 60 seconds" />
      <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
        <Field label="Payment" error={errors.walkinPayment}>
          <select
            className={inputCls}
            value={form.walkinPayment}
            onChange={(e) => setField("walkinPayment", e.target.value)}
          >
            <option>Cash</option>
            <option>Card</option>
            <option>UPI</option>
          </select>
        </Field>
        <Field label="Vehicle number">
          <input
            className={inputCls}
            placeholder="DL 01 AB 1234"
            value={form.walkinVehicleNo}
            onChange={(e) => setField("walkinVehicleNo", e.target.value)}
          />
        </Field>
        <Field label="Deposit amount (INR)">
          <input
            className={inputCls}
            type="number"
            min={0}
            placeholder="0"
            value={form.walkinDeposit}
            onChange={(e) => setField("walkinDeposit", e.target.value)}
          />
        </Field>
      </div>
      <div className="px-5 pb-5">
        <label className="flex items-center gap-2 text-[12px] text-text-secondary">
          <input
            type="checkbox"
            checked={form.walkinIdVerified}
            onChange={(e) => setField("walkinIdVerified", e.target.checked)}
          />
          ID verified at front desk
        </label>
      </div>
    </Card>
  );
}

function EventForm({ form, errors, setField }: FormProps) {
  return (
    <Card>
      <CardHeader title="Event details" />
      <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
        <Field label="Venue" error={errors.eventVenue}>
          <select
            className={inputCls}
            value={form.eventVenue}
            onChange={(e) => setField("eventVenue", e.target.value)}
          >
            <option value="">Select venue</option>
            <option value="Grand Ballroom">Grand Ballroom · 500 pax</option>
            <option value="Boardroom">Boardroom · 16 pax</option>
            <option value="Garden Lawn">Garden Lawn · 250 pax</option>
          </select>
        </Field>
        <Field label="Event type" error={errors.eventType}>
          <select
            className={inputCls}
            value={form.eventType}
            onChange={(e) => setField("eventType", e.target.value)}
          >
            <option value="">Select event type</option>
            <option value="Wedding">Wedding</option>
            <option value="Corporate conference">Corporate conference</option>
            <option value="Birthday">Birthday</option>
            <option value="Product launch">Product launch</option>
          </select>
        </Field>
        <Field label="Expected pax" error={errors.eventPax}>
          <input
            className={inputCls}
            type="number"
            value={form.eventPax}
            onChange={(e) => setField("eventPax", e.target.value)}
          />
        </Field>
        <Field label="Date" error={errors.eventDate}>
          <input
            className={inputCls}
            type="date"
            value={form.eventDate}
            onChange={(e) => setField("eventDate", e.target.value)}
          />
        </Field>
        <Field label="Start">
          <input
            className={inputCls}
            type="time"
            value={form.eventStart}
            onChange={(e) => setField("eventStart", e.target.value)}
          />
        </Field>
        <Field label="End">
          <input
            className={inputCls}
            type="time"
            value={form.eventEnd}
            onChange={(e) => setField("eventEnd", e.target.value)}
          />
        </Field>
        <Field label="Organizer name">
          <input
            className={inputCls}
            placeholder="Ritika Sharma"
            value={form.eventOrganizer}
            onChange={(e) => setField("eventOrganizer", e.target.value)}
          />
        </Field>
        <Field label="Organizer contact">
          <input
            className={inputCls}
            placeholder="+91 98xxxxxx20"
            value={form.eventContact}
            onChange={(e) => setField("eventContact", e.target.value)}
          />
        </Field>
        <Field label="Catering plan">
          <select
            className={inputCls}
            value={form.eventCateringPlan}
            onChange={(e) => setField("eventCateringPlan", e.target.value)}
          >
            <option>Standard veg + non-veg buffet</option>
            <option>Premium buffet + live counters</option>
            <option>Plated service</option>
            <option>Hi-tea + snacks</option>
          </select>
        </Field>
      </div>
      <div className="px-5 pb-5">
        <label className="flex items-center gap-2 text-[12px] text-text-secondary">
          <input
            type="checkbox"
            checked={form.eventAvSetup}
            onChange={(e) => setField("eventAvSetup", e.target.checked)}
          />
          AV setup required (projector, audio, microphones)
        </label>
      </div>
    </Card>
  );
}

function Summary({
  form,
  errors,
  setField,
  total,
  pricingBreakdown,
  onSubmit,
  submitting,
}: {
  form: ReservationFormData;
  errors: Record<string, string>;
  setField: <K extends keyof ReservationFormData>(key: K, value: ReservationFormData[K]) => void;
  total: number;
  pricingBreakdown: ReservationPricingBreakdown;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const formErrorConfirmation = errors.confirmation;
  return (
    <Card>
      <CardHeader
        title="Pricing review, payment & confirmation (Step 8-10)"
        hint="Auto-send on submit"
      />
      <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-[1fr_240px]">
        <div className="space-y-3 text-[12px]">
          <div className="rounded-md border border-border-subtle bg-surface-2/30 p-3">
            <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-text-secondary">
              Price breakdown
            </div>
            <div className="space-y-1.5 text-[12px]">
              {pricingBreakdown.lines.map((line) => (
                <div
                  key={line.label}
                  className="flex items-center justify-between text-text-secondary"
                >
                  <span>{line.label}</span>
                  <span className="font-mono text-text-primary">
                    {line.amount < 0 ? "-" : ""}₹{Math.abs(line.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.sendEmail}
              onChange={(e) => setField("sendEmail", e.target.checked)}
            />
            <Mail className="h-3.5 w-3.5 text-text-secondary" /> Email confirmation
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.sendSms}
              onChange={(e) => setField("sendSms", e.target.checked)}
            />
            <Phone className="h-3.5 w-3.5 text-text-secondary" /> SMS confirmation
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.preAuthCard}
              onChange={(e) => setField("preAuthCard", e.target.checked)}
            />
            <CreditCard className="h-3.5 w-3.5 text-text-secondary" /> Pre-authorize card on file
          </label>
          {formErrorConfirmation ? (
            <div className="text-[11px] text-error">{formErrorConfirmation}</div>
          ) : null}
        </div>
        <div className="rounded-md border border-border bg-surface-2/40 p-4">
          <div className="label-uppercase">Estimated total</div>
          <div className="mt-1 font-display text-[22px] font-semibold text-text-primary">
            ₹{Math.max(total, pricingBreakdown.total).toLocaleString()}
          </div>
          <div className="text-[10px] text-text-disabled">Inclusive of taxes</div>
          <Button className="mt-3 w-full" size="sm" onClick={onSubmit} disabled={submitting}>
            {submitting ? "Confirming..." : "Confirm reservation"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
export default NewReservationFeature;
