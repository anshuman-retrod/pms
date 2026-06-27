import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader, Card, Button, StatusBadge } from "@/components/ui/Primitives";
import { CreditCard, Plus, Edit2, Trash2, Check, X, Shield } from "lucide-react";
import { toast } from "sonner";
import { subscriptionApi, type SubscriptionPlan, type Product, type ProductFeature } from "@/services/api/subscription";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/superadmin/subscriptions")({
  head: () => ({ meta: [{ title: "Subscription Plans" }] }),
  component: SuperadminSubscriptionsComponent,
});

const inputCls =
  "h-9 rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15";
const selectCls =
  "h-9 rounded-md border border-border bg-surface px-2 text-[13px] text-text-primary focus:border-primary focus:outline-none";

const formatPrice = (price: number, currency: string) => {
  const symbols: Record<string, string> = {
    USD: "$",
    INR: "₹",
    EUR: "€",
    GBP: "£",
  };
  const sym = symbols[currency.toUpperCase()] || `${currency} `;
  return `${sym}${Number(price).toFixed(2)}`;
};

function SuperadminSubscriptionsComponent() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Draft states
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [planDraft, setPlanDraft] = useState({
    id: "",
    name: "",
    billing_cycle: "MONTHLY",
    price: 0,
    currency: "USD",
    is_active: true,
    product_ids: [] as string[],
    feature_codes: [] as string[],
  });

  const [deletePlanId, setDeletePlanId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pData, prodData, featData] = await Promise.all([
        subscriptionApi.getPlans(),
        subscriptionApi.getProducts(),
        subscriptionApi.getFeatures(),
      ]);
      setPlans(pData);
      setProducts(prodData);
      setFeatures(featData);
    } catch (err: any) {
      toast.error("Failed to load subscription settings: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSavePlan = async () => {
    if (!planDraft.name) {
      toast.error("Please provide a plan name.");
      return;
    }
    try {
      if (planDraft.id) {
        await subscriptionApi.updatePlan(planDraft.id, {
          name: planDraft.name,
          billing_cycle: planDraft.billing_cycle,
          price: Number(planDraft.price),
          currency: planDraft.currency,
          is_active: planDraft.is_active,
          product_ids: planDraft.product_ids,
          feature_codes: planDraft.feature_codes,
        });
        toast.success("Subscription Plan updated.");
      } else {
        await subscriptionApi.createPlan({
          name: planDraft.name,
          billing_cycle: planDraft.billing_cycle,
          price: Number(planDraft.price),
          currency: planDraft.currency,
          is_active: planDraft.is_active,
          product_ids: planDraft.product_ids,
          feature_codes: planDraft.feature_codes,
        });
        toast.success("Subscription Plan created.");
      }
      setPlanModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error("Error saving subscription plan: " + err.message);
    }
  };

  const handleDeletePlan = async () => {
    if (!deletePlanId) return;
    try {
      await subscriptionApi.deletePlan(deletePlanId);
      toast.success("Subscription Plan deleted.");
      setDeletePlanId(null);
      loadData();
    } catch (err: any) {
      toast.error("Error deleting plan: " + err.message);
    }
  };

  const toggleProductInDraft = (prodId: string) => {
    setPlanDraft((d) => {
      const exists = d.product_ids.includes(prodId);
      const nextIds = exists ? d.product_ids.filter((id) => id !== prodId) : [...d.product_ids, prodId];
      
      // Auto-toggle features under this product
      const productFeats = features.filter((f) => f.product === prodId).map((f) => f.code);
      let nextFeatures = [...d.feature_codes];
      if (exists) {
        // remove features of this product
        nextFeatures = nextFeatures.filter((code) => !productFeats.includes(code));
      } else {
        // add all features of this product by default
        nextFeatures = Array.from(new Set([...nextFeatures, ...productFeats]));
      }

      return { ...d, product_ids: nextIds, feature_codes: nextFeatures };
    });
  };

  const toggleFeatureInDraft = (featureCode: string) => {
    setPlanDraft((d) => {
      const exists = d.feature_codes.includes(featureCode);
      const nextFeatures = exists
        ? d.feature_codes.filter((c) => c !== featureCode)
        : [...d.feature_codes, featureCode];
      return { ...d, feature_codes: nextFeatures };
    });
  };

  return (
    <div>
      <PageHeader
        eyebrow="Platform Tiers"
        title="Subscription Management"
        description="Configure pricing plans, limitation thresholds, and active products comparison matrix."
        actions={
          <Button
            size="sm"
            onClick={() => {
              setPlanDraft({
                id: "",
                name: "",
                billing_cycle: "MONTHLY",
                price: 0,
                currency: "USD",
                is_active: true,
                product_ids: [],
                feature_codes: [],
              });
              setPlanModalOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5" /> New Plan
          </Button>
        }
      />

      <div className="responsive-page-x py-6 space-y-6">
        {loading ? (
          <div className="text-center py-12 text-[13px] text-text-secondary">Loading subscription plans...</div>
        ) : (
          <div className="space-y-6">
            {/* Plan Cards Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((p) => (
                <Card key={p.id} className="relative overflow-hidden flex flex-col justify-between h-full border border-border bg-surface">
                  <div className="p-5 border-b border-border bg-surface-2/10">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {p.name} Plan
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            setPlanDraft({
                              id: p.id,
                              name: p.name,
                              billing_cycle: p.billing_cycle,
                              price: p.price,
                              currency: p.currency,
                              is_active: p.is_active,
                              product_ids: p.products.map((x) => x.id),
                              feature_codes: p.feature_codes || [],
                            });
                            setPlanModalOpen(true);
                          }}
                          className="p-1 rounded text-text-secondary hover:bg-surface-2 transition"
                          title="Edit Plan"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletePlanId(p.id)}
                          className="p-1 rounded text-text-secondary hover:bg-error-tint hover:text-error transition"
                          title="Delete Plan"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-[34px] font-bold text-text-primary tracking-tight">
                        {formatPrice(p.price, p.currency)}
                      </span>
                      <span className="ml-1 text-[13px] text-text-secondary">
                        / {p.billing_cycle.toLowerCase()}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 space-y-4">
                    <div>
                      <h4 className="text-[11.5px] font-semibold text-text-secondary uppercase tracking-wider mb-2">
                        Included Products ({p.products.length})
                      </h4>
                      <ul className="space-y-2">
                        {p.products.length > 0 ? (
                          p.products.map((prod) => {
                            const prodFeats = features.filter((f) => f.product === prod.id);
                            const activeFeatsInPlan = prodFeats.filter((f) => (p.feature_codes || []).includes(f.code));
                            
                            return (
                              <li key={prod.id} className="text-[12.5px] text-text-primary">
                                <div className="flex items-center gap-1.5 font-semibold">
                                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                  {prod.name}
                                </div>
                                {activeFeatsInPlan.length > 0 && (
                                  <div className="pl-3.5 text-[11px] text-text-secondary mt-0.5 space-x-1 flex flex-wrap gap-y-1">
                                    {activeFeatsInPlan.map(f => (
                                      <span key={f.id} className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-[9.5px]">
                                        {f.name}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </li>
                            );
                          })
                        ) : (
                          <li className="text-[12px] text-text-disabled">No products linked to this plan.</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="px-5 py-3 border-t border-border-subtle bg-surface-2/20">
                    <StatusBadge tone={p.is_active ? "success" : "neutral"}>
                      {p.is_active ? "Active Plan" : "Inactive Plan"}
                    </StatusBadge>
                  </div>
                </Card>
              ))}
            </div>

            {/* Plan Comparison Matrix */}
            <Card className="overflow-hidden border border-border">
              <div className="border-b border-border bg-surface px-4 py-3">
                <h3 className="text-[14px] font-bold text-text-primary">Plan Comparison Grid</h3>
                <p className="text-[11px] text-text-secondary">Visual comparison of PMS modules enabled per subscription tier</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-center text-[13px]">
                  <thead className="border-b border-border bg-surface-2/40 text-left">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-text-secondary text-[11px] uppercase tracking-wider w-[240px]">
                        PMS Product / Module
                      </th>
                      {plans.map((p) => (
                        <th key={p.id} className="px-4 py-3 font-semibold text-text-primary text-[12px] uppercase tracking-wider text-center">
                          {p.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle bg-surface">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-surface-2/30 text-left">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-text-primary">{prod.name}</div>
                          <div className="text-[11px] text-text-secondary font-mono">({prod.code})</div>
                        </td>
                        {plans.map((p) => {
                          const hasProduct = p.products.some((x) => x.id === prod.id);
                          return (
                            <td key={p.id} className="px-4 py-3 text-center">
                              {hasProduct ? (
                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[oklch(0.62_0.17_150)]/15 text-[oklch(0.62_0.17_150)]">
                                  <Check className="h-4 w-4" />
                                </span>
                              ) : (
                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-error/10 text-error">
                                  <X className="h-4 w-4" />
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        <Card className="p-4 bg-primary-tint border border-primary/20 flex gap-3 rounded-lg">
          <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-[12.5px] text-text-primary">
            <div className="font-semibold text-primary-pressed">Global Tenant Sandboxing Policy</div>
            <p className="mt-1 text-text-secondary leading-relaxed font-normal">
              When tenants sign up or select a tier, the system matches their properties/rooms counts to the
              plan thresholds configured here. Limit changes apply globally to all current and future active
              subscriptions instantly.
            </p>
          </div>
        </Card>
      </div>

      {/* Plan Edit/Create Modal */}
      <AlertDialog open={planModalOpen} onOpenChange={setPlanModalOpen}>
        <AlertDialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>{planDraft.id ? "Edit Subscription Plan" : "Create Subscription Plan"}</AlertDialogTitle>
            <AlertDialogDescription>Specify plan parameters and assign accessible product modules.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3 py-2 flex flex-col">
            <input
              className={inputCls}
              placeholder="Plan Name (e.g. Growth)"
              value={planDraft.name}
              onChange={(e) => setPlanDraft({ ...planDraft, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                className={inputCls}
                placeholder="Price"
                value={planDraft.price}
                onChange={(e) => setPlanDraft({ ...planDraft, price: Number(e.target.value) })}
              />
              <select
                className={selectCls}
                value={planDraft.billing_cycle}
                onChange={(e) => setPlanDraft({ ...planDraft, billing_cycle: e.target.value })}
              >
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                className={selectCls}
                value={planDraft.currency}
                onChange={(e) => setPlanDraft({ ...planDraft, currency: e.target.value })}
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AUD">AUD (A$)</option>
                <option value="CAD">CAD (C$)</option>
              </select>
              <label className="flex items-center gap-2 text-[12.5px] select-none text-text-primary">
                <input
                  type="checkbox"
                  checked={planDraft.is_active}
                  onChange={(e) => setPlanDraft({ ...planDraft, is_active: e.target.checked })}
                />
                Active Plan
              </label>
            </div>

            {/* Linked Products & Features Checklist */}
            <div className="border border-border rounded p-3 bg-surface-2/10 mt-2">
              <div className="text-[11.5px] font-bold text-text-primary mb-2 uppercase tracking-wide">Included Products & Features</div>
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {products.map((p) => {
                  const productChecked = planDraft.product_ids.includes(p.id);
                  const productFeats = features.filter((f) => f.product === p.id);
                  
                  return (
                    <div key={p.id} className="space-y-1">
                      <label className="flex items-center gap-2 text-[12.5px] text-text-primary font-semibold select-none cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productChecked}
                          onChange={() => toggleProductInDraft(p.id)}
                        />
                        <span>{p.name} ({p.code})</span>
                      </label>
                      
                      {/* Render nested features if product is checked */}
                      {productChecked && productFeats.length > 0 && (
                        <div className="pl-6 space-y-1.5 border-l border-border ml-2.5 my-1">
                          {productFeats.map((feat) => {
                            const featChecked = planDraft.feature_codes.includes(feat.code);
                            return (
                              <label key={feat.id} className="flex items-center gap-2 text-[11.5px] text-text-secondary select-none cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={featChecked}
                                  onChange={() => toggleFeatureInDraft(feat.code)}
                                />
                                <span>{feat.name} ({feat.code})</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSavePlan}>Save Plan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deletePlanId} onOpenChange={(open) => !open && setDeletePlanId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this subscription plan. Tenants assigned to this plan might lose system access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePlan} className="bg-destructive text-white hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
export default SuperadminSubscriptionsComponent;
