import { useMemo, useState } from "react";
import { Plus, Calculator } from "lucide-react";
import { toast } from "sonner";
import {
  PageHeader,
  KpiCard,
  Button,
  Card,
  CardHeader,
  StatusBadge,
} from "@/components/ui/Primitives";
import { GuardedRoute } from "@/features/auth/components/GuardedRoute";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { TaxComponentEditorDrawer } from "@/features/taxes-fees/components/TaxComponentEditorDrawer";
import {
  CALCULATION_BASE_LABEL,
  TAX_COMPONENT_TYPE_LABEL,
} from "@/features/taxes-fees/lib/constants";
import {
  calculateFolioTaxes,
  resolveDefaultTaxGroup,
} from "@/features/taxes-fees/lib/calculation";
import {
  useSaveTaxComponentsMutation,
  useSaveTaxGroupsMutation,
  useTaxAssignmentsQuery,
  useTaxComponentsQuery,
  useTaxGroupsQuery,
} from "@/services/mock/queries";
import type { TaxComponent, TaxGroup } from "@/types/pms";

type Tab = "components" | "groups" | "preview";

export function TaxesFeesFeature() {
  const { can, logAuditEvent } = useAuth();
  const canManage = can("settings.manage");
  const { data: components = [] } = useTaxComponentsQuery();
  const { data: groups = [] } = useTaxGroupsQuery();
  const { data: assignments = [] } = useTaxAssignmentsQuery();
  const saveComponentsMutation = useSaveTaxComponentsMutation();
  const saveGroupsMutation = useSaveTaxGroupsMutation();

  const [tab, setTab] = useState<Tab>("components");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [editorComponent, setEditorComponent] = useState<TaxComponent | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [previewSubtotal, setPreviewSubtotal] = useState("52400");
  const [previewNights, setPreviewNights] = useState("2");

  const defaultGroup = useMemo(() => resolveDefaultTaxGroup(groups), [groups]);
  const previewBreakdown = useMemo(() => {
    const sub = Number(previewSubtotal) || 0;
    const nights = Number(previewNights) || 1;
    return calculateFolioTaxes(sub, components, defaultGroup, nights);
  }, [components, defaultGroup, previewNights, previewSubtotal]);

  const kpis = useMemo(() => {
    const activeComponents = components.filter((c) => c.status === "Active").length;
    const byType = {
      gst: components.filter((c) => c.type === "gst").length,
      city: components.filter((c) => c.type === "city_tax").length,
      service: components.filter((c) => c.type === "service_charge").length,
      tourism: components.filter((c) => c.type === "tourism_tax").length,
    };
    return { activeComponents, byType, groups: groups.filter((g) => g.status === "Active").length };
  }, [components, groups]);

  const filteredComponents = useMemo(() => {
    if (typeFilter === "All") return components;
    return components.filter((c) => c.type === typeFilter);
  }, [components, typeFilter]);

  const openCreate = () => {
    setEditorComponent(null);
    setDrawerOpen(true);
  };

  const openEdit = (component: TaxComponent) => {
    setEditorComponent(component);
    setDrawerOpen(true);
  };

  const handleSaveComponent = (updated: TaxComponent) => {
    const exists = components.some((c) => c.id === updated.id);
    const next = exists
      ? components.map((c) => (c.id === updated.id ? updated : c))
      : [...components, updated];
    saveComponentsMutation.mutate(next);
    logAuditEvent(
      exists ? "Tax component updated" : "Tax component created",
      updated.code,
      `${updated.name} · ${TAX_COMPONENT_TYPE_LABEL[updated.type]} ${updated.ratePercent}%`,
    );
    toast.success(exists ? "Tax component updated" : "Tax component created");
  };

  const toggleGroupStatus = (group: TaxGroup) => {
    const next = groups.map((g) =>
      g.id === group.id ? { ...g, status: g.status === "Active" ? ("Inactive" as const) : ("Active" as const) } : g,
    );
    saveGroupsMutation.mutate(next);
    toast.success(`Tax group ${group.code} ${group.status === "Active" ? "deactivated" : "activated"}`);
  };

  return (
    <GuardedRoute
      permission="billing.view"
      title="Taxes & Fees access required"
      description="You need billing view permission to manage tax components and groups."
    >
      <div>
        <PageHeader
          eyebrow="Commercial"
          title="Taxes & Fees"
          description="Canonical GST, city tax, service charge, and tourism tax rules for folios, rates, and packages."
          actions={
            canManage ? (
              <Button size="sm" onClick={openCreate}>
                <Plus className="h-3.5 w-3.5" />
                Add component
              </Button>
            ) : undefined
          }
        />

        <div className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
            <KpiCard label="Active components" value={String(kpis.activeComponents)} accent="brand" />
            <KpiCard label="GST profiles" value={String(kpis.byType.gst)} accent="info" />
            <KpiCard label="City / Tourism" value={String(kpis.byType.city + kpis.byType.tourism)} accent="warning" />
            <KpiCard label="Service charge" value={String(kpis.byType.service)} accent="success" />
            <KpiCard label="Tax groups" value={String(kpis.groups)} accent="info" />
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                ["components", "Tax components"],
                ["groups", "Tax groups"],
                ["preview", "Preview calculator"],
              ] as Array<[Tab, string]>
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`rounded-md border px-3 py-1.5 text-[12px] transition ${
                  tab === id
                    ? "border-primary bg-primary-tint/40 text-primary"
                    : "border-border-subtle bg-surface text-text-secondary hover:bg-surface-2/70"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "components" ? (
            <Card>
              <CardHeader title="Tax components" hint="GST · City Tax · Service Charge · Tourism Tax" />
              <div className="flex flex-wrap gap-2 border-b border-border px-5 pb-4">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="h-8 rounded-md border border-border bg-surface px-2 text-[12px]"
                >
                  <option value="All">All types</option>
                  {Object.entries(TAX_COMPONENT_TYPE_LABEL).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-[13px]">
                  <thead>
                    <tr className="border-b border-border bg-surface-2/40 text-left">
                      {["Code", "Name", "Type", "Rate", "Base", "Inclusive", "Status", ""].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComponents.map((component) => (
                      <tr key={component.id} className="border-b border-border-subtle hover:bg-surface-2/50">
                        <td className="px-4 py-3 font-mono text-[12px]">{component.code}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-text-primary">{component.name}</div>
                          {component.description ? (
                            <div className="text-[11px] text-text-secondary">{component.description}</div>
                          ) : null}
                        </td>
                        <td className="px-4 py-3">{TAX_COMPONENT_TYPE_LABEL[component.type]}</td>
                        <td className="px-4 py-3 font-mono">
                          {component.flatAmount != null && component.calculationBase === "per_night"
                            ? `₹${component.flatAmount}/night`
                            : `${component.ratePercent}%`}
                        </td>
                        <td className="px-4 py-3 text-[12px] text-text-secondary">
                          {CALCULATION_BASE_LABEL[component.calculationBase]}
                        </td>
                        <td className="px-4 py-3">{component.inclusive ? "Yes" : "No"}</td>
                        <td className="px-4 py-3">
                          <StatusBadge tone={component.status === "Active" ? "success" : "neutral"}>
                            {component.status}
                          </StatusBadge>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(component)}>
                            {canManage ? "Edit" : "View"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : null}

          {tab === "groups" ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {groups.map((group) => {
                const memberNames = group.componentIds
                  .map((id) => components.find((c) => c.id === id)?.code)
                  .filter(Boolean)
                  .join(" · ");
                const linked = assignments.filter((a) => a.taxGroupId === group.id);
                return (
                  <Card key={group.id} className="border-border-subtle">
                    <CardHeader title={group.name} hint={group.code} />
                    <div className="space-y-3 p-4 sm:p-5">
                      <p className="text-[12px] text-text-secondary">{group.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {group.componentIds.map((id) => {
                          const c = components.find((item) => item.id === id);
                          if (!c) return null;
                          return (
                            <StatusBadge key={id} tone="info">
                              {c.code}
                            </StatusBadge>
                          );
                        })}
                      </div>
                      <div className="text-[11px] text-text-secondary">
                        Components: {memberNames || "—"}
                      </div>
                      <div className="text-[11px] text-text-secondary">
                        Assignments: {linked.map((a) => a.targetLabel).join(", ") || "None"}
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge tone={group.status === "Active" ? "success" : "neutral"}>
                          {group.status}
                        </StatusBadge>
                        {canManage ? (
                          <Button variant="outline" size="sm" onClick={() => toggleGroupStatus(group)}>
                            {group.status === "Active" ? "Deactivate" : "Activate"}
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : null}

          {tab === "preview" ? (
            <Card>
              <CardHeader
                title="Folio tax preview"
                hint={`Using group ${defaultGroup?.code ?? "—"} · shared billing engine`}
              />
              <div className="grid grid-cols-1 gap-6 p-4 sm:p-5 lg:grid-cols-2">
                <div className="space-y-3">
                  <label className="block space-y-1">
                    <span className="text-[12px] font-medium text-text-secondary">Folio subtotal (₹)</span>
                    <input
                      className="h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px]"
                      value={previewSubtotal}
                      onChange={(e) => setPreviewSubtotal(e.target.value)}
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[12px] font-medium text-text-secondary">Nights</span>
                    <input
                      className="h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px]"
                      value={previewNights}
                      onChange={(e) => setPreviewNights(e.target.value)}
                    />
                  </label>
                  <Button variant="outline" size="sm">
                    <Calculator className="h-3.5 w-3.5" />
                    Recalculate
                  </Button>
                </div>
                <div className="rounded-lg border border-border-subtle bg-surface-2/30 p-4">
                  <div className="space-y-2 text-[13px]">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Subtotal</span>
                      <span className="font-mono">₹{previewBreakdown.subtotal.toLocaleString()}</span>
                    </div>
                    {previewBreakdown.lines.map((line) => (
                      <div key={line.componentCode} className="flex justify-between">
                        <span className="text-text-secondary">
                          {line.componentName} ({line.ratePercent}%)
                        </span>
                        <span className="font-mono">₹{line.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t border-border-subtle pt-2 flex justify-between font-medium">
                      <span>Grand total</span>
                      <span className="font-mono text-primary">
                        ₹{previewBreakdown.grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ) : null}
        </div>

        <TaxComponentEditorDrawer
          open={drawerOpen}
          component={editorComponent}
          onClose={() => setDrawerOpen(false)}
          onSave={handleSaveComponent}
          readOnly={!canManage}
        />
      </div>
    </GuardedRoute>
  );
}
