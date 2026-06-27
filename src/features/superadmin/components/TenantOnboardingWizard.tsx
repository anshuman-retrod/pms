import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Building2, CreditCard, CheckCircle2, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Card, CardHeader, Button } from "@/components/ui/Primitives";
import { tenantApi, type Tenant } from "@/services/api/tenant";
import { subscriptionApi, type SubscriptionPlan } from "@/services/api/subscription";
import { referenceApi, type Country, type Currency, type Timezone } from "@/services/api/reference";

const STEPS = [
  { key: "details", label: "Tenant Details", icon: Building2, desc: "Basic info and admin setup" },
  { key: "subscription", label: "Subscription", icon: CreditCard, desc: "Choose a plan" },
] as const;

export function TenantOnboardingWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [createdTenant, setCreatedTenant] = useState<Tenant | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  
  // Reference Data States
  const [countries, setCountries] = useState<Country[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [timezones, setTimezones] = useState<Timezone[]>([]);
  const [isLoadingRef, setIsLoadingRef] = useState(true);
  
  // Form State
  const [tenantForm, setTenantForm] = useState({
    name: "",
    subdomain: "",
    custom_domain: "",
    country: "US",
    currency: "USD",
    timezone: "UTC",
    admin_email: "",
    admin_password: "",
  });
  
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const data = await subscriptionApi.getPlans();
        setPlans(data);
        if (data.length > 0) setSelectedPlanId(data[0].id);
      } catch (error) {
        console.error("Failed to load plans", error);
      }
    }
    
    async function fetchReferenceData() {
      try {
        const [fetchedCountries, fetchedCurrencies, fetchedTimezones] = await Promise.all([
          referenceApi.getCountries(true),
          referenceApi.getCurrencies(true),
          referenceApi.getTimezones(true),
        ]);
        setCountries(fetchedCountries);
        setCurrencies(fetchedCurrencies);
        setTimezones(fetchedTimezones);
        
        // Update form default values if we fetched successfully
        setTenantForm(prev => ({
          ...prev,
          country: fetchedCountries.length > 0 ? fetchedCountries[0].code : prev.country,
          currency: fetchedCurrencies.length > 0 ? fetchedCurrencies[0].code : prev.currency,
          timezone: fetchedTimezones.length > 0 ? fetchedTimezones[0].code : prev.timezone,
        }));
      } catch (error) {
        console.error("Failed to load reference data", error);
        toast.error("Failed to load reference options from database.");
      } finally {
        setIsLoadingRef(false);
      }
    }

    fetchPlans();
    fetchReferenceData();
  }, []);

  const handleNext = async () => {
    if (step === 0) {
      if (!tenantForm.name || !tenantForm.subdomain || !tenantForm.admin_email || !tenantForm.country || !tenantForm.currency || !tenantForm.timezone) {
        toast.error("Please fill all required fields");
        return;
      }
      setIsSubmitting(true);
      try {
        const tenant = await tenantApi.createTenant(tenantForm);
        setCreatedTenant(tenant);
        toast.success("Tenant created successfully");
        setStep(1);
      } catch (error: any) {
        toast.error(error.message || "Failed to create tenant");
      } finally {
        setIsSubmitting(false);
      }
    } else if (step === 1) {
      if (!createdTenant) return;
      setIsSubmitting(true);
      try {
        await subscriptionApi.assignSubscription({
          tenant: createdTenant.id,
          plan_id: selectedPlanId,
          billing_cycle: billingCycle,
        });
        toast.success("Subscription assigned!");
        navigate({ to: "/superadmin/tenants" });
      } catch (error: any) {
        toast.error(error.message || "Failed to assign subscription");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Onboard New Tenant</h1>
        <p className="text-sm text-muted-foreground">Setup a new tenant and assign a subscription plan.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <ol className="p-2">
              {STEPS.map((s, idx) => {
                const Icon = s.icon;
                const active = idx === step;
                const done = idx < step;
                return (
                  <li key={s.key}>
                    <div
                      className={`flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition ${
                        active ? "bg-primary-tint" : "opacity-70"
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold transition ${
                          done
                            ? "bg-[var(--color-success)] text-white"
                            : active
                              ? "bg-primary text-primary-foreground"
                              : "bg-surface-2 text-text-secondary"
                        }`}
                      >
                        {done ? <Check className="h-3 w-3" /> : idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div
                          className={`flex items-center gap-1.5 text-[13px] font-medium transition ${
                            active ? "text-primary-pressed" : "text-text-primary"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {s.label}
                        </div>
                        <div className="text-[11px] text-text-secondary">{s.desc}</div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>
        </aside>

        <div>
          <Card>
            <CardHeader title={STEPS[step].label} hint={STEPS[step].desc} />
            <div className="p-6">
              {step === 0 && (
                <div className="space-y-4 max-w-lg">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-text-primary">Tenant Name *</label>
                    <input 
                      className="h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="e.g. Grand Palace Hotel" 
                      value={tenantForm.name} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTenantForm({...tenantForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-text-primary">Subdomain *</label>
                    <input 
                      className="h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="e.g. grandpalace (lowercase, no spaces)" 
                      value={tenantForm.subdomain} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTenantForm({...tenantForm, subdomain: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-text-primary">Custom Domain URL</label>
                    <input 
                      className="h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="e.g. grandpalace.retrod.com" 
                      value={tenantForm.custom_domain} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTenantForm({...tenantForm, custom_domain: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-text-primary">Country *</label>
                      <select 
                        className="h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        value={tenantForm.country} 
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTenantForm({...tenantForm, country: e.target.value})}
                        disabled={isLoadingRef}
                      >
                        {isLoadingRef ? (
                          <option value="">Loading countries...</option>
                        ) : (
                          countries.map(c => (
                            <option key={c.code} value={c.code}>
                              {c.name}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-text-primary">Currency *</label>
                      <select 
                        className="h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        value={tenantForm.currency} 
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTenantForm({...tenantForm, currency: e.target.value})}
                        disabled={isLoadingRef}
                      >
                        {isLoadingRef ? (
                          <option value="">Loading currencies...</option>
                        ) : (
                          currencies.map(curr => (
                            <option key={curr.code} value={curr.code}>
                              {curr.code} {curr.symbol ? `(${curr.symbol})` : ""}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-text-primary">Timezone *</label>
                      <select 
                        className="h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        value={tenantForm.timezone} 
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTenantForm({...tenantForm, timezone: e.target.value})}
                        disabled={isLoadingRef}
                      >
                        {isLoadingRef ? (
                          <option value="">Loading timezones...</option>
                        ) : (
                          timezones.map(tz => (
                            <option key={tz.code} value={tz.code}>
                              {tz.name}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <h3 className="mb-4 text-sm font-semibold text-text-primary">Initial Admin Account</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-text-primary">Admin Email *</label>
                        <input 
                          className="h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          type="email"
                          placeholder="admin@grandpalace.com" 
                          value={tenantForm.admin_email} 
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTenantForm({...tenantForm, admin_email: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-text-primary">Temporary Password</label>
                        <input 
                          className="h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          type="password"
                          placeholder="Leave blank to auto-generate" 
                          value={tenantForm.admin_password} 
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTenantForm({...tenantForm, admin_password: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-primary">Billing Cycle</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="billingCycle" 
                          checked={billingCycle === "monthly"} 
                          onChange={() => setBillingCycle("monthly")}
                        />
                        <span className="text-sm">Monthly</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="billingCycle" 
                          checked={billingCycle === "annual"} 
                          onChange={() => setBillingCycle("annual")}
                        />
                        <span className="text-sm">Annual (Save 20%)</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plans
                      .filter(plan => plan.billing_cycle.toUpperCase() === (billingCycle === "monthly" ? "MONTHLY" : "YEARLY"))
                      .map(plan => (
                        <div 
                          key={plan.id}
                          onClick={() => setSelectedPlanId(plan.id)}
                        className={`cursor-pointer rounded-xl border p-4 transition-all ${
                          selectedPlanId === plan.id 
                            ? "border-primary bg-primary-tint/20 ring-1 ring-primary" 
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                        <div className="mt-2 text-2xl font-display text-foreground font-semibold">
                          {plan.currency === "INR" ? "₹" : plan.currency === "EUR" ? "€" : plan.currency === "GBP" ? "£" : "$"}
                          {plan.price}
                          <span className="text-sm font-normal text-muted-foreground">/{plan.billing_cycle.toLowerCase()}</span>
                        </div>
                        <div className="mt-1 text-[11px] text-primary font-semibold uppercase tracking-wider">
                          Currency: {plan.currency}
                        </div>
                        {plan.products && plan.products.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border/60">
                            <span className="text-[11px] font-bold text-text-secondary block mb-1">Included Modules:</span>
                            <div className="flex flex-wrap gap-1">
                              {plan.products.map(p => (
                                <span key={p.id} className="inline-block bg-surface-2 text-text-primary text-[10px] px-2 py-0.5 rounded border border-border">
                                  {p.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {plans.length === 0 && (
                      <div className="col-span-3 p-4 text-center text-sm text-muted-foreground border rounded-xl border-dashed">
                        No subscription plans found.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between border-t border-border-subtle px-6 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep(step - 1)}
                disabled={step === 0 || isSubmitting}
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-2" />
                Back
              </Button>
              
              <Button size="sm" onClick={handleNext} disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : step === STEPS.length - 1 ? "Finish & Assign" : "Save & Continue"}
                {!isSubmitting && step < STEPS.length - 1 && <ArrowRight className="h-3.5 w-3.5 ml-2" />}
                {!isSubmitting && step === STEPS.length - 1 && <CheckCircle2 className="h-3.5 w-3.5 ml-2" />}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
