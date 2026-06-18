import { ROOM_TYPE_OPTIONS } from "@/features/rate-plans/lib/constants";
import type { RatePlan } from "@/types/pms";

export type ReservationTypeForRates =
  | "individual"
  | "group"
  | "corporate"
  | "package"
  | "walkin"
  | "event";

export type RatePlanEligibilityInput = {
  checkIn?: string;
  checkOut?: string;
  roomTypeName?: string;
  reservationType: ReservationTypeForRates;
  corporateCompany?: string;
};

function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  const diff = end.getTime() - start.getTime();
  return diff > 0 ? Math.round(diff / 86_400_000) : 0;
}

function stayWithinEffectiveDates(plan: RatePlan, checkIn: string): boolean {
  if (!plan.effectiveFrom && !plan.effectiveTo) return true;
  if (!checkIn) return true;
  const from = plan.effectiveFrom ?? "1900-01-01";
  const to = plan.effectiveTo ?? "2099-12-31";
  return checkIn >= from && checkIn <= to;
}

function matchesCorporateAccount(plan: RatePlan, company: string): boolean {
  if (!plan.corporateAccountIds?.length) return true;
  const normalized = company.trim().toLowerCase();
  if (!normalized) return true;

  return plan.corporateAccountIds.some((accountId) => {
    const id = accountId.toLowerCase();
    if (id.includes("tcs") && (normalized.includes("tata") || normalized.includes("tcs"))) return true;
    if (id.includes("infosys") && normalized.includes("infosys")) return true;
    if (id.includes("corp") && normalized.includes(id.replace("corp-", ""))) return true;
    return normalized.includes(id.replace(/-/g, " "));
  });
}

export function isRatePlanEligible(plan: RatePlan, input: RatePlanEligibilityInput): boolean {
  if (plan.status !== "Active") return false;

  const nights = nightsBetween(input.checkIn ?? "", input.checkOut ?? "");
  if (nights > 0) {
    if (nights < plan.minLos || nights > plan.maxLos) return false;
  }

  if (input.checkIn && !stayWithinEffectiveDates(plan, input.checkIn)) return false;

  if (plan.category === "corporate" && input.reservationType !== "corporate") return false;
  if (input.reservationType === "corporate" && plan.category !== "corporate") return false;
  if (plan.category === "package" && input.reservationType !== "package") return false;
  if (input.reservationType === "package" && plan.category !== "package") return false;

  if (input.reservationType === "corporate" && plan.category === "corporate") {
    if (!matchesCorporateAccount(plan, input.corporateCompany ?? "")) return false;
  }

  if (input.roomTypeName && plan.roomTypeIds.length > 0) {
    const room = ROOM_TYPE_OPTIONS.find((item) => item.name === input.roomTypeName);
    if (room && !plan.roomTypeIds.includes(room.id)) return false;
  }

  return true;
}

export function filterEligibleRatePlans(
  plans: RatePlan[],
  input: RatePlanEligibilityInput,
): RatePlan[] {
  return plans.filter((plan) => isRatePlanEligible(plan, input));
}

export function eligibilityHint(plan: RatePlan): string {
  const parts = [plan.externalRatePlanCode];
  if (plan.discountPercent > 0) parts.push(`-${plan.discountPercent}%`);
  if (plan.minLos > 1) parts.push(`min ${plan.minLos}N`);
  if (plan.effectiveFrom && plan.effectiveTo) parts.push(`${plan.effectiveFrom}–${plan.effectiveTo}`);
  return parts.join(" · ");
}
