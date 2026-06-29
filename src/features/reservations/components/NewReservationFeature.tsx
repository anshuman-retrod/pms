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
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Card, CardHeader, Button, StatusBadge } from "@/components/ui/Primitives";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  useMealPlansQuery,
  useRatePlansQuery,
  useHotelPackagesQuery,
  useAddOnProductsQuery,
  useOccupancyPricingRulesQuery,
  useAvailabilityCellsQuery,
  useHousekeepingRoomsQuery,
  useSaveGroupBlockMutation,
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
  address: string;
  idType: string;
  idNumber: string;
  idProofFilename?: string;
  idProofPreviewUrl?: string;
  checkIn: string;
  checkOut: string;
  adults: string;
  children: string;
  roomSelections: Array<{
    roomType: string;
    assignedRooms: string[];
    ratePlan: string;
    mealPlan: string;
    occupancyType: "single" | "double" | "triple" | "quad";
  }>;
  selectedPackageId: string;
  addOnSelections: Array<{
    id: string;
    quantity: number;
    scheduledTime?: string;
    isComplimentary: boolean;
  }>;
  dynamicPricingPct: string;
  source: string;
  specialRequests: string[];
  notes: string;
  groupName: string;
  groupCompany: string;
  groupContact: string;
  groupPickupTarget: string;
  groupRooms: string;
  groupCutoffDate: string;
  groupMealPlan: string;
  corporateCompany: string;
  couponCode: string;
  paymentMethod: string;
  paidAmount: string;
  paymentRemark: string;
  includeTax: boolean;
  corporatePoRef: string;
  corporateBilling: string;
  corporateGuestId: string;
  corporateCostCenter: string;
  corporateGst: string;
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
  eventStartDate: string;
  eventEndDate: string;
  eventPax: string;
  eventStart: string;
  eventEnd: string;
  eventOrganizer: string;
  eventContact: string;
  eventOrganizerEmail: string;
  eventOrganizerAddress: string;
  eventSeatingStyle: string;
  eventCateringMenu: string;
  eventAvRequirements: string[];
  eventDecorNotes: string;
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
  address: "",
  idType: "Passport",
  idNumber: "",
  checkIn: "",
  checkOut: "",
  adults: "2",
  children: "0",
  roomSelections: [],
  selectedPackageId: "",
  addOnSelections: [],
  dynamicPricingPct: "0",
  source: "Direct",
  specialRequests: [],
  notes: "",
  groupName: "",
  groupCompany: "",
  groupContact: "",
  groupPickupTarget: "",
  groupRooms: "",
  groupCutoffDate: "",
  groupMealPlan: "Breakfast",
  corporateCompany: "",
  couponCode: "",
  paymentMethod: "",
  paidAmount: "",
  paymentRemark: "",
  includeTax: true,
  corporatePoRef: "",
  corporateBilling: "Direct bill to company (City Ledger)",
  corporateGuestId: "",
  corporateCostCenter: "",
  corporateGst: "",
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
  eventStartDate: "",
  eventEndDate: "",
  eventPax: "",
  eventStart: "",
  eventEnd: "",
  eventOrganizer: "",
  eventContact: "",
  eventOrganizerEmail: "",
  eventOrganizerAddress: "",
  eventSeatingStyle: "",
  eventCateringMenu: "Standard Buffet",
  eventAvRequirements: [],
  eventDecorNotes: "",
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
  if (type === "walkin") return data.roomSelections.reduce((acc, rs) => acc + (roomRates[rs.roomType] ?? 9500) * Math.max(1, rs.assignedRooms.length), 0);
  const nightly = data.roomSelections.reduce((acc, rs) => acc + (roomRates[rs.roomType] ?? 11000) * Math.max(1, rs.assignedRooms.length), 0);
  return nightly * Math.max(1, nights);
}

function calculatePricingBreakdown(input: {
  type: T;
  nights: number;
  roomSelections: Array<{
    roomType: string;
    assignedRooms: string[];
    ratePlan: string;
    mealPlan: string;
    occupancyType: "single" | "double" | "triple" | "quad";
  }>;
  selectedPackageId: string;
  addOnSelections: Array<{
    id: string;
    quantity: number;
    scheduledTime?: string;
    isComplimentary: boolean;
  }>;
  dynamicPricingPct: number;
  adults: number;
  children: number;
  mealPlans: Array<{ id: string; priceAdjustment: number; taxPercent: number }>;
  ratePlans: Array<{ id: string; discountPercent: number }>;
  hotelPackages: Array<{ id: string; basePrice: number }>;
  addOnProducts: Array<{ id: string; price: number }>;
  includeTax: boolean;
  occupancyRules: Array<{
    occupancyType: "single" | "double" | "triple" | "quad";
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
  
  const stayUnits = Math.max(1, input.nights);
  let roomRate = 0;
  let mealPlanCharges = 0;
  let ratePlanDiscountAmount = 0;
  let maxTaxPercent = 12;

  if (input.type === "event") {
    roomRate = 2800 * stayUnits;
  } else {
    input.roomSelections.forEach((rs) => {
      const baseNightly = roomRates[rs.roomType] ?? 11000;
      const count = Math.max(1, rs.assignedRooms.length);
      const occupancyMultiplier = input.occupancyRules.find((rule) => rule.occupancyType === rs.occupancyType)?.multiplier ?? 1;
      const roomBase = Math.round(baseNightly * stayUnits * occupancyMultiplier) * count;
      roomRate += roomBase;

      const mealPlan = input.mealPlans.find((item) => item.id === rs.mealPlan);
      let roomMealCharges = 0;
      if (mealPlan) {
        roomMealCharges = Math.round((mealPlan.priceAdjustment ?? 0) * stayUnits) * count;
        mealPlanCharges += roomMealCharges;
        if (mealPlan.taxPercent > maxTaxPercent) maxTaxPercent = mealPlan.taxPercent;
      }

      const ratePlanDiscountPct = input.ratePlans.find((item) => item.id === rs.ratePlan)?.discountPercent ?? 0;
      ratePlanDiscountAmount += Math.round(((roomBase + roomMealCharges) * ratePlanDiscountPct) / 100);
    });
  }

  const selectedPackage = input.hotelPackages.find((item) => item.id === input.selectedPackageId);
  const packageCharges = Math.round((selectedPackage?.basePrice ?? 0) * stayUnits);

  const addOnCharges = input.addOnSelections.reduce((sum, selection) => {
    if (selection.isComplimentary) return sum;
    const product = input.addOnProducts.find((item) => item.id === selection.id);
    return sum + (product?.price ?? 0) * selection.quantity;
  }, 0);

  const extraAdults = Math.max(0, input.adults - 2);
  const extraChildren = Math.max(0, input.children);
  const extraGuestCharges = extraAdults * 1800 * stayUnits + extraChildren * 900 * stayUnits;

  const subtotalBeforeRatePlan = roomRate + mealPlanCharges + packageCharges + addOnCharges + extraGuestCharges;
  const subtotalAfterRatePlan = subtotalBeforeRatePlan - ratePlanDiscountAmount;
  const dynamicPricingAmount = Math.round((subtotalAfterRatePlan * input.dynamicPricingPct) / 100);

  const taxableBase = subtotalAfterRatePlan + dynamicPricingAmount;
  const taxes = input.includeTax ? Math.round((taxableBase * maxTaxPercent) / 100) : 0;
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
  if (data.roomSelections.length === 0 && type !== "event") errors.roomSelections = "Add at least one room.";

  if (mode === "draft") {
    if (data.checkIn && data.checkOut && nightsBetween(data.checkIn, data.checkOut) < 1) {
      errors.checkOut = "Check-out must be after check-in.";
    }
    return errors;
  }

  // Confirm validation: production-grade rule set.
  if (type !== "event" && data.roomSelections.length > 0) {
    if (data.roomSelections.some(rs => !rs.ratePlan)) errors.roomSelections = "Select a rate plan for all rooms.";
    if (data.roomSelections.some(rs => !rs.mealPlan)) errors.roomSelections = "Select a meal plan for all rooms.";
  }
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
    if (!data.eventStartDate) errors.eventStartDate = "Start date is required.";
    if (!data.eventEndDate) errors.eventEndDate = "End date is required.";
    if (Number(data.eventPax || 0) < 1) errors.eventPax = "Expected pax is required.";
  }
  return errors;
}

export function NewReservationFeature() {
  const navigate = useNavigate();
  const saveGroupBlock = useSaveGroupBlockMutation();
  const { data: mealPlans = [] } = useMealPlansQuery();
  const { data: ratePlans = [] } = useRatePlansQuery();
  const { data: hotelPackages = [] } = useHotelPackagesQuery();
  const { data: addOnProducts = [] } = useAddOnProductsQuery();
  const { data: occupancyRules = [] } = useOccupancyPricingRulesQuery();
  const { data: availabilityCells = [] } = useAvailabilityCellsQuery();
  const { data: housekeepingRooms = [] } = useHousekeepingRoomsQuery();
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
        roomTypeNames: form.roomSelections.map(rs => rs.roomType),
        reservationType: type as ReservationTypeForRates,
        corporateCompany: form.corporateCompany,
      }),
    [ratePlans, form.checkIn, form.checkOut, form.roomSelections, type, form.corporateCompany],
  );

  const bookableRoomTypes = useMemo(
    () => listBookableRoomTypes(availabilityCells, form.checkIn, form.checkOut),
    [availabilityCells, form.checkIn, form.checkOut],
  );

  const availabilityError = useMemo(() => {
    if (form.roomSelections.length === 0 || !form.checkIn || !form.checkOut || type === "event") return null;
    for (const rs of form.roomSelections) {
      const err = availabilityBlockReason(availabilityCells, rs.roomType, form.checkIn, form.checkOut);
      if (err) return err;
    }
    return null;
  }, [availabilityCells, form.roomSelections, form.checkIn, form.checkOut, type]);

  useEffect(() => {
    if (form.ratePlan && !eligibleRatePlans.some((plan) => plan.id === form.ratePlan)) {
      setForm((prev) => ({ ...prev, ratePlan: "" }));
    }
  }, [eligibleRatePlans, form.ratePlan]);

  // useEffect(() => {
  //   setForm((prev) => {
  //     if (prev.roomTypes.length === 0 || !prev.checkIn || !prev.checkOut || type === "event") return prev;
  //     // const block = availabilityBlockReason(...)
  //     return prev;
  //   });
  // }, [form.checkIn, form.checkOut, availabilityCells, type]);

  const total = useMemo(() => estimateTotal(type, form, nights), [type, form, nights]);
  const pricingBreakdown = useMemo(
    () =>
      calculatePricingBreakdown({
        type,
        nights,
        roomSelections: form.roomSelections,
        selectedPackageId: form.selectedPackageId,
        addOnSelections: form.addOnSelections,
        dynamicPricingPct: Number(form.dynamicPricingPct || 0),
        adults: Number(form.adults || 0),
        children: Number(form.children || 0),
        mealPlans: mealPlans.map((m) => ({
          id: m.id,
          priceAdjustment: m.priceAdjustment,
          taxPercent: m.taxPercent,
        })),
        ratePlans: ratePlans.map((r) => ({ id: r.id, discountPercent: r.discountPercent })),
        hotelPackages: hotelPackages.map((p) => ({ id: p.id, basePrice: p.basePrice })),
        addOnProducts: addOnProducts.map((a) => ({ id: a.id, price: a.price })),
        includeTax: form.includeTax,
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
    if (availabilityError) draftErrors.roomSelections = availabilityError;
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
    if (availabilityError) nextErrors.roomSelections = availabilityError;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 650));
      
      if (type === "group") {
        await saveGroupBlock.mutateAsync({
          id: `BLK-${Math.floor(Math.random() * 10000)}`,
          name: form.groupName || "New Group Block",
          dates: `${form.checkIn || ""} to ${form.checkOut || ""}`,
          blocked: Number(form.groupRooms) || 0,
          pickedUp: 0,
          cutOff: form.groupCutoffDate || form.checkIn || "",
          status: "Open"
        });
      }

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
            type={type}
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
            housekeepingRooms={housekeepingRooms}
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
  type,
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
  housekeepingRooms,
}: FormProps & {
  type: string;
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
  housekeepingRooms: Array<{ num: string; type: string; status: string }>;
}) {
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [draftRoomType, setDraftRoomType] = useState("");
  const [draftAssignedRooms, setDraftAssignedRooms] = useState<string[]>([]);
  const [draftRatePlan, setDraftRatePlan] = useState("");
  const [draftMealPlan, setDraftMealPlan] = useState("");
  const [draftOccupancyType, setDraftOccupancyType] = useState<"single" | "double" | "triple" | "quad">("double");

  const handleSaveRoomSelection = () => {
    if (!draftRoomType || !draftRatePlan || !draftMealPlan) return;
    const newSelection = { 
      roomType: draftRoomType, 
      assignedRooms: draftAssignedRooms,
      ratePlan: draftRatePlan,
      mealPlan: draftMealPlan,
      occupancyType: draftOccupancyType,
    };
    setField("roomSelections", [...form.roomSelections, newSelection]);
    setIsAddRoomOpen(false);
    setDraftRoomType("");
    setDraftAssignedRooms([]);
    setDraftRatePlan("");
    setDraftMealPlan("");
    setDraftOccupancyType("double");
  };

  const handleRemoveRoomSelection = (index: number) => {
    const newSelections = [...form.roomSelections];
    newSelections.splice(index, 1);
    setField("roomSelections", newSelections);
  };

  return (
    <>
      {type !== "event" && (
        <Card>
          <CardHeader title="Stay & rate" hint="Stay dates, room, meal plan, rate plan" />
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
          <div className="col-span-1 md:col-span-3">
            <Field label="Room assignments" error={errors.roomSelections}>
              <div className="flex flex-col gap-3">
                {form.roomSelections.length > 0 ? (
                  <div className="grid gap-2">
                    {form.roomSelections.map((selection, i) => (
                      <div key={i} className="flex items-center justify-between border border-border rounded-md p-3 bg-surface">
                        <div>
                          <div className="font-medium text-sm text-text">{selection.roomType}</div>
                          <div className="text-xs text-text-secondary mt-1">
                            {selection.assignedRooms.length > 0
                              ? `Assigned: ${selection.assignedRooms.join(", ")}`
                              : "No specific rooms assigned"}
                          </div>
                          <div className="text-xs text-text-secondary mt-1 flex gap-2">
                            <Badge variant="outline" className="font-normal text-[10px]">{selection.occupancyType}</Badge>
                            <Badge variant="outline" className="font-normal text-[10px]">{ratePlans.find(r => r.id === selection.ratePlan)?.name || selection.ratePlan}</Badge>
                            <Badge variant="outline" className="font-normal text-[10px]">{mealPlans.find(m => m.id === selection.mealPlan)?.code || selection.mealPlan}</Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveRoomSelection(i)}>
                          <X className="w-4 h-4 text-text-secondary" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-text-secondary italic">No rooms added yet.</div>
                )}
                <div>
                  <Button variant="outline" size="sm" onClick={() => setIsAddRoomOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Add Room Assignment
                  </Button>
                </div>
              </div>
            </Field>
          </div>
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
      )}

      {type !== "event" && (
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
            <select
              className={inputCls}
              value={form.nationality}
              onChange={(e) => setField("nationality", e.target.value)}
            >
              <option value="">Select nationality</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
              <option value="India">India</option>
              <option value="Australia">Australia</option>
              <option value="Canada">Canada</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Japan">Japan</option>
              <option value="Other">Other</option>
            </select>
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
          <div className="md:col-span-2">
            <Field label="Address">
              <textarea
                className={`${inputCls} resize-none`}
                placeholder="123 Example Street, City, Country"
                rows={2}
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
              />
            </Field>
          </div>
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
          <Field label="ID proof document">
            <div className="flex flex-col gap-3">
              {form.idProofPreviewUrl && (
                <div className="relative w-full aspect-video rounded-md overflow-hidden border border-border bg-surface-2 group">
                  <img src={form.idProofPreviewUrl} alt="ID Preview" className="w-full h-full object-contain" />
                  <button
                    onClick={() => {
                      setField("idProofFilename", undefined);
                      setField("idProofPreviewUrl", undefined);
                    }}
                    className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              )}
              <div className="w-full">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  id="idProofUpload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setField("idProofFilename", file.name);
                      if (file.type.startsWith("image/")) {
                        setField("idProofPreviewUrl", URL.createObjectURL(file));
                      } else {
                        setField("idProofPreviewUrl", undefined);
                      }
                    }
                  }}
                />
                <label 
                  htmlFor="idProofUpload" 
                  className="cursor-pointer flex items-center justify-center w-full h-[40px] rounded-md border border-dashed border-border bg-surface px-3 text-[13px] hover:border-primary hover:text-primary text-text-secondary transition-colors truncate"
                >
                  {form.idProofFilename ? `Uploaded: ${form.idProofFilename}` : "+ Click to upload ID"}
                </label>
              </div>
            </div>
          </Field>
        </div>
      </Card>
      )}

      <Card>
        <CardHeader
          title="Packages & add-ons"
          hint="Attach package and reservation add-on services"
        />
        <div className="grid grid-cols-1 gap-6 p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
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
              {form.selectedPackageId && (
                <>
                  <Field label="Occasion">
                    <select
                      className={inputCls}
                      value={form.packageOccasion}
                      onChange={(e) => setField("packageOccasion", e.target.value)}
                    >
                      <option value="">Select occasion (optional)</option>
                      <option value="Honeymoon">Honeymoon</option>
                      <option value="Anniversary">Anniversary</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Business">Business</option>
                    </select>
                  </Field>
                  <Field label="Inclusion Notes">
                    <textarea
                      className={`${inputCls} resize-none`}
                      rows={2}
                      placeholder="E.g. Allergic to strawberries..."
                      value={form.packageInclusionNotes}
                      onChange={(e) => setField("packageInclusionNotes", e.target.value)}
                    />
                  </Field>
                </>
              )}
            </div>
            <div className="hidden md:block" />
          </div>

          <Field label="Add-on services">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {addOnProducts.map((addOn) => {
                const selection = form.addOnSelections.find((s) => s.id === addOn.id);
                const isSelected = !!selection;

                return (
                  <div key={addOn.id} className={`rounded-md border p-3 flex flex-col gap-2 transition-colors ${isSelected ? 'border-primary/50 bg-primary/5' : 'border-border-subtle bg-surface-2/40'}`}>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-text-primary'}`}>{addOn.name}</span>
                      <span className="flex items-center gap-2">
                        <span className={`font-mono text-[11px] ${isSelected && selection.isComplimentary ? 'line-through text-text-disabled' : 'text-text-secondary'}`}>
                          ₹{addOn.price.toLocaleString()}
                        </span>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setField("addOnSelections", [...form.addOnSelections, { id: addOn.id, quantity: 1, isComplimentary: false }]);
                            } else {
                              setField("addOnSelections", form.addOnSelections.filter(s => s.id !== addOn.id));
                            }
                          }}
                        />
                      </span>
                    </label>
                    {isSelected && (
                      <div className="flex flex-col gap-2 pt-2 border-t border-border-subtle mt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-text-secondary">Quantity</span>
                          <input 
                            type="number" 
                            min="1" 
                            className={`${inputCls} w-20 h-7 text-xs`}
                            value={selection.quantity}
                            onChange={(e) => {
                              const qty = parseInt(e.target.value) || 1;
                              setField("addOnSelections", form.addOnSelections.map(s => s.id === addOn.id ? { ...s, quantity: qty } : s));
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-text-secondary">Schedule</span>
                          <input 
                            type="time" 
                            className={`${inputCls} w-28 h-7 text-xs`}
                            value={selection.scheduledTime || ""}
                            onChange={(e) => {
                              setField("addOnSelections", form.addOnSelections.map(s => s.id === addOn.id ? { ...s, scheduledTime: e.target.value } : s));
                            }}
                          />
                        </div>
                        <label className="flex items-center gap-2 mt-1">
                          <input 
                            type="checkbox" 
                            checked={selection.isComplimentary}
                            onChange={(e) => {
                              setField("addOnSelections", form.addOnSelections.map(s => s.id === addOn.id ? { ...s, isComplimentary: e.target.checked } : s));
                            }}
                          />
                          <span className="text-[11px] text-text-secondary">Complimentary (₹0)</span>
                        </label>
                      </div>
                    )}
                  </div>
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
            ].map((t) => {
              const isSelected = form.specialRequests?.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => {
                    const current = form.specialRequests || [];
                    if (isSelected) {
                      setField("specialRequests", current.filter((r) => r !== t));
                    } else {
                      setField("specialRequests", [...current, t]);
                    }
                  }}
                  className={`rounded-full border px-3 py-1 text-[11px] transition-colors ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-text-secondary hover:border-primary hover:text-primary"
                  }`}
                >
                  {isSelected ? "✓" : "+"} {t}
                </button>
              );
            })}
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

      <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Room Assignment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Field label="Room type">
              <select
                className={inputCls}
                value={draftRoomType}
                onChange={(e) => {
                  setDraftRoomType(e.target.value);
                  setDraftAssignedRooms([]); // clear rooms when type changes
                }}
              >
                <option value="">Select room type</option>
                {bookableRoomTypes.map((room) => (
                  <option key={room.id} value={room.name}>
                    {room.name}
                    {room.blocked ? ` · blocked` : room.freeMin > 0 ? ` · ${room.freeMin} left` : ""}
                  </option>
                ))}
              </select>
            </Field>

            {draftRoomType && (
              <>
                <Field label="Assign rooms" hint="Select multiple rooms">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 max-h-48 overflow-y-auto p-2 border border-border rounded-md bg-surface">
                    {housekeepingRooms
                      .filter((r) => r.type === draftRoomType && r.status !== "OOO")
                      .map((room) => {
                        const isSelected = draftAssignedRooms.includes(room.num);
                        return (
                          <label key={room.num} className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-colors ${isSelected ? 'bg-primary-tint border-primary text-primary-pressed' : 'border-border hover:bg-surface-2'}`}>
                            <input 
                              type="checkbox" 
                              className="hidden"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setDraftAssignedRooms([...draftAssignedRooms, room.num]);
                                } else {
                                  setDraftAssignedRooms(draftAssignedRooms.filter(n => n !== room.num));
                                }
                              }} 
                            />
                            <div className="flex flex-col">
                              <span className="text-xs font-medium">Room {room.num}</span>
                              <span className="text-[10px] opacity-70">{room.status}</span>
                            </div>
                          </label>
                        );
                      })}
                  </div>
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Occupancy type">
                    <select
                      className={inputCls}
                      value={draftOccupancyType}
                      onChange={(e) => setDraftOccupancyType(e.target.value as any)}
                    >
                      <option value="single">Single</option>
                      <option value="double">Double</option>
                      <option value="triple">Triple</option>
                      <option value="quad">Quad</option>
                    </select>
                  </Field>
                  <Field label="Meal plan">
                    <select
                      className={inputCls}
                      value={draftMealPlan}
                      onChange={(e) => setDraftMealPlan(e.target.value)}
                    >
                      <option value="">Select meal plan</option>
                      {mealPlans
                        .filter((meal) => meal.status === "Active")
                        .map((meal) => (
                          <option key={meal.id} value={meal.id}>
                            {meal.code} · +₹{meal.priceAdjustment.toLocaleString()}
                          </option>
                        ))}
                    </select>
                  </Field>
                </div>
                <Field label="Rate plan">
                  <select
                    className={inputCls}
                    value={draftRatePlan}
                    onChange={(e) => setDraftRatePlan(e.target.value)}
                  >
                    <option value="">Select rate plan</option>
                    {ratePlans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {eligibilityHint(plan)} · {plan.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoomOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveRoomSelection} disabled={!draftRoomType || !draftRatePlan || !draftMealPlan}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
        <Field label="GST Number">
          <input
            className={inputCls}
            placeholder="GST Number"
            value={form.corporateGst}
            onChange={(e) => setField("corporateGst", e.target.value)}
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
        <Field label="Start Date" error={errors.eventStartDate}>
          <input
            className={inputCls}
            type="date"
            value={form.eventStartDate}
            onChange={(e) => setField("eventStartDate", e.target.value)}
          />
        </Field>
        <Field label="Start Time">
          <input
            className={inputCls}
            type="time"
            value={form.eventStart}
            onChange={(e) => setField("eventStart", e.target.value)}
          />
        </Field>
        <Field label="End Date" error={errors.eventEndDate}>
          <input
            className={inputCls}
            type="date"
            value={form.eventEndDate}
            onChange={(e) => setField("eventEndDate", e.target.value)}
          />
        </Field>
        <Field label="End Time">
          <input
            className={inputCls}
            type="time"
            value={form.eventEnd}
            onChange={(e) => setField("eventEnd", e.target.value)}
          />
        </Field>
        <Field label="Organizer name" error={errors.eventOrganizer}>
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
        <Field label="Organizer email">
          <input
            className={inputCls}
            type="email"
            placeholder="ritika@example.com"
            value={form.eventOrganizerEmail}
            onChange={(e) => setField("eventOrganizerEmail", e.target.value)}
          />
        </Field>
        <div className="md:col-span-3">
          <Field label="Organizer billing address">
            <input
              className={inputCls}
              placeholder="123 Corporate Park, Tech City"
              value={form.eventOrganizerAddress}
              onChange={(e) => setField("eventOrganizerAddress", e.target.value)}
            />
          </Field>
        </div>
        
        {/* Logistics Section */}
        <div className="col-span-1 md:col-span-3 mt-4 mb-2">
          <div className="label-uppercase text-text-secondary border-b border-border pb-2">Event Logistics</div>
        </div>
        
        <Field label="Seating arrangement">
          <select
            className={inputCls}
            value={form.eventSeatingStyle}
            onChange={(e) => setField("eventSeatingStyle", e.target.value)}
          >
            <option value="">Select style</option>
            <option value="Banquet">Banquet (Round tables)</option>
            <option value="Theater">Theater (Rows of chairs)</option>
            <option value="Classroom">Classroom (Desks & chairs)</option>
            <option value="U-Shape">U-Shape</option>
            <option value="Reception">Reception (Standing / Cocktail)</option>
          </select>
        </Field>
        <Field label="Catering menu">
          <select
            className={inputCls}
            value={form.eventCateringMenu}
            onChange={(e) => setField("eventCateringMenu", e.target.value)}
          >
            <option value="None">No Catering</option>
            <option value="Standard Buffet">Standard Buffet (Veg + Non-Veg)</option>
            <option value="Premium Buffet">Premium Buffet + Live Counters</option>
            <option value="Plated Service">Plated Service</option>
            <option value="High Tea">High Tea + Snacks</option>
          </select>
        </Field>
        <div className="md:col-span-1" />
        
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="AV & Equipment Requirements">
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                "Projector & Screen",
                "PA System",
                "Wireless Mics (x2)",
                "Stage / Podium",
                "Lighting setup",
                "DJ Console setup"
              ].map(req => {
                const isSelected = form.eventAvRequirements?.includes(req);
                return (
                  <label key={req} className="flex items-center gap-2 text-[12px] text-text-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        const current = form.eventAvRequirements || [];
                        if (e.target.checked) {
                          setField("eventAvRequirements", [...current, req]);
                        } else {
                          setField("eventAvRequirements", current.filter(r => r !== req));
                        }
                      }}
                    />
                    {req}
                  </label>
                );
              })}
            </div>
          </Field>
          
          <Field label="Decor & Setup Notes">
            <textarea
              className={`${inputCls} resize-none`}
              rows={4}
              placeholder="E.g. Flower arrangements needed, specific color themes, or external vendor arrival times."
              value={form.eventDecorNotes}
              onChange={(e) => setField("eventDecorNotes", e.target.value)}
            />
          </Field>
        </div>
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
        title="Pricing review, payment & confirmation"
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
        <div className="rounded-md border border-border bg-surface-2/40 p-4 space-y-4">
          <div>
            <div className="label-uppercase flex items-center justify-between">
              Estimated total
              <label className="flex items-center gap-1.5 text-[10px] normal-case text-text-secondary hover:text-text cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={form.includeTax} 
                  onChange={(e) => setField("includeTax", e.target.checked)} 
                />
                Include tax
              </label>
            </div>
            <div className="mt-1 font-display text-[22px] font-semibold text-text-primary">
              ₹{Math.max(total, pricingBreakdown.total).toLocaleString()}
            </div>
            <div className="text-[10px] text-text-disabled">
              {form.includeTax ? "Inclusive of taxes" : "Exclusive of taxes"}
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-border">
            <Field label="Coupon code">
              <input
                className={inputCls}
                placeholder="e.g. SUMMER20"
                value={form.couponCode}
                onChange={(e) => setField("couponCode", e.target.value)}
              />
            </Field>
            <Field label="Payment method">
              <select
                className={inputCls}
                value={form.paymentMethod}
                onChange={(e) => setField("paymentMethod", e.target.value)}
              >
                <option value="">Select method</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </Field>
            <Field label="Paid amount">
              <input
                className={inputCls}
                type="number"
                placeholder="₹0"
                value={form.paidAmount}
                onChange={(e) => setField("paidAmount", e.target.value)}
              />
            </Field>
            <Field label="Payment remark">
              <input
                className={inputCls}
                placeholder="Transaction ID / Notes"
                value={form.paymentRemark}
                onChange={(e) => setField("paymentRemark", e.target.value)}
              />
            </Field>
          </div>

          <Button className="w-full" size="sm" onClick={onSubmit} disabled={submitting}>
            {submitting ? "Confirming..." : "Confirm reservation"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
export default NewReservationFeature;
