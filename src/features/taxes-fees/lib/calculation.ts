import type { FolioTaxBreakdown, FolioTaxLine, TaxComponent, TaxGroup } from "@/types/pms";

function componentAmount(component: TaxComponent, subtotal: number, nights = 1): number {
  if (component.status !== "Active") return 0;
  if (component.calculationBase === "per_night" && component.flatAmount != null) {
    return Math.round(component.flatAmount * nights);
  }
  if (component.calculationBase === "per_guest_night" && component.flatAmount != null) {
    return Math.round(component.flatAmount * nights);
  }
  return Math.round(subtotal * (component.ratePercent / 100));
}

export function calculateFolioTaxes(
  subtotal: number,
  components: TaxComponent[],
  group?: TaxGroup | null,
  nights = 1,
): FolioTaxBreakdown {
  const active = components.filter((c) => c.status === "Active");
  const selected =
    group != null
      ? active.filter((c) => group.componentIds.includes(c.id))
      : active.filter((c) => c.type === "gst" && c.code === "CGST9").length
        ? active.filter((c) => ["CGST9", "SGST9"].includes(c.code))
        : active.filter((c) => c.code === "GST18").slice(0, 1);

  const lines: FolioTaxLine[] = selected.map((component) => ({
    componentCode: component.code,
    componentName: component.name,
    type: component.type,
    ratePercent: component.ratePercent,
    amount: componentAmount(component, subtotal, nights),
  }));

  const totalTax = lines.reduce((sum, line) => sum + line.amount, 0);
  return {
    subtotal,
    lines,
    totalTax,
    grandTotal: subtotal + totalTax,
  };
}

export function resolveDefaultTaxGroup(groups: TaxGroup[]): TaxGroup | undefined {
  return groups.find((g) => g.code === "FOLIO-STD" && g.status === "Active") ?? groups.find((g) => g.status === "Active");
}
