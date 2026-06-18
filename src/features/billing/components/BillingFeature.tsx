import { useMemo, useState } from "react";
import {
  Download,
  Mail,
  Printer,
  Plus,
  Split,
  ArrowRightLeft,
  CreditCard,
  Wallet,
  Banknote,
  Smartphone,
  Building2,
  RotateCcw,
  FileText,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { PageHeader, Button, KpiCard } from "@/components/ui/Primitives";
import { FolioView } from "./FolioView";
import { SplitView } from "./SplitView";
import { TransferView } from "./TransferView";
import { PaymentView } from "./PaymentView";
import { DepositView } from "./DepositView";
import { RefundView } from "./RefundView";
import { ARView } from "./ARView";
import { calculateFolioTaxes, resolveDefaultTaxGroup } from "@/features/taxes-fees/lib/calculation";
import { useTaxComponentsQuery, useTaxGroupsQuery } from "@/services/mock/queries";

const folio = [
  {
    id: 1,
    date: "15 May",
    desc: "Room charge · Premier Suite",
    cat: "Room",
    qty: 1,
    amt: 22000,
    hsn: "996311",
  },
  {
    id: 2,
    date: "15 May",
    desc: "Welcome drink · Bar",
    cat: "F&B",
    qty: 2,
    amt: 1200,
    hsn: "996331",
  },
  {
    id: 3,
    date: "16 May",
    desc: "Breakfast · Restaurant",
    cat: "F&B",
    qty: 2,
    amt: 2400,
    hsn: "996331",
  },
  {
    id: 4,
    date: "16 May",
    desc: "Spa treatment · 60 min",
    cat: "Spa",
    qty: 1,
    amt: 4800,
    hsn: "999722",
  },
  {
    id: 5,
    date: "16 May",
    desc: "Room charge · Premier Suite",
    cat: "Room",
    qty: 1,
    amt: 22000,
    hsn: "996311",
  },
  { id: 6, date: "17 May", desc: "Laundry service", cat: "Misc", qty: 1, amt: 850, hsn: "999719" },
];

type Tab = "folio" | "split" | "transfer" | "payment" | "deposit" | "refund" | "ar";
type TabDef = { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> };

export function BillingFeature() {
  const [tab, setTab] = useState<Tab>("folio");
  const { data: taxComponents = [] } = useTaxComponentsQuery();
  const { data: taxGroups = [] } = useTaxGroupsQuery();
  const defaultTaxGroup = useMemo(() => resolveDefaultTaxGroup(taxGroups), [taxGroups]);

  const calcTax = (sub: number) => {
    const breakdown = calculateFolioTaxes(sub, taxComponents, defaultTaxGroup, 2);
    const cgstLine = breakdown.lines.find((line) => line.componentCode === "CGST9");
    const sgstLine = breakdown.lines.find((line) => line.componentCode === "SGST9");
    const gstLine = breakdown.lines.find((line) => line.type === "gst");
    const cgst = cgstLine?.amount ?? gstLine?.amount ?? Math.round(sub * 0.09);
    const sgst = sgstLine?.amount ?? 0;
    return { cgst, sgst, total: breakdown.grandTotal };
  };

  return (
    <div>
      <PageHeader
        eyebrow="Commercial"
        title="Billing & Invoicing"
        description="Folio management, multi-tender payments, GST tax invoices."
        actions={
          <>
            <Link
              to="/taxes-fees"
              className="inline-flex h-8 items-center rounded-md border border-border bg-surface px-3 text-[12px] font-medium text-primary hover:bg-surface-2"
            >
              Taxes & Fees
            </Link>
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" />
              New invoice
            </Button>
          </>
        }
      />

      <div className="responsive-page-x space-y-5 py-4 sm:space-y-6 sm:py-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Outstanding · MTD"
            value="₹1,84,200"
            delta="12 invoices"
            deltaTone="neutral"
            accent="warning"
          />
          <KpiCard
            label="Collected · MTD"
            value="₹38,42,000"
            delta="↑ 14% vs LM"
            accent="success"
          />
          <KpiCard label="Avg Folio Value" value="₹28,400" accent="info" />
          <KpiCard label="Refunds · MTD" value="₹62,400" accent="error" />
        </div>

        <div className="w-full overflow-x-auto">
          <div className="flex min-w-max gap-1 rounded-md border border-border bg-surface p-1">
            {(
              [
                { id: "folio", label: "Guest folio", icon: FileText },
                { id: "split", label: "Split folio", icon: Split },
                { id: "transfer", label: "Transfer", icon: ArrowRightLeft },
                { id: "payment", label: "Payment · multi-tender", icon: CreditCard },
                { id: "deposit", label: "Advance deposits", icon: Wallet },
                { id: "refund", label: "Refunds", icon: RotateCcw },
                { id: "ar", label: "City Ledger / AR", icon: Building2 },
              ] as TabDef[]
            ).map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-[12px] font-medium transition ${
                    tab === t.id
                      ? "bg-foreground text-background"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {tab === "folio" && <FolioView folio={folio} calcTax={calcTax} />}
        {tab === "split" && <SplitView folio={folio} />}
        {tab === "transfer" && <TransferView folio={folio} />}
        {tab === "payment" && <PaymentView />}
        {tab === "deposit" && <DepositView />}
        {tab === "refund" && <RefundView />}
        {tab === "ar" && <ARView />}
      </div>
    </div>
  );
}
export default BillingFeature;
