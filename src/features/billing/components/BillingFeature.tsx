import { useState } from "react";
import {
  Download, Mail, Printer, Plus, Split, ArrowRightLeft, CreditCard,
  Wallet, Banknote, Smartphone, Building2, RotateCcw, FileText,
} from "lucide-react";
import { PageHeader, Button, KpiCard } from "@/components/ui/Primitives";
import { FolioView } from "./FolioView";
import { SplitView } from "./SplitView";
import { TransferView } from "./TransferView";
import { PaymentView } from "./PaymentView";
import { DepositView } from "./DepositView";
import { RefundView } from "./RefundView";
import { ARView } from "./ARView";

const folio = [
  { id: 1, date: "15 May", desc: "Room charge · Premier Suite", cat: "Room", qty: 1, amt: 22000, hsn: "996311" },
  { id: 2, date: "15 May", desc: "Welcome drink · Bar", cat: "F&B", qty: 2, amt: 1200, hsn: "996331" },
  { id: 3, date: "16 May", desc: "Breakfast · Restaurant", cat: "F&B", qty: 2, amt: 2400, hsn: "996331" },
  { id: 4, date: "16 May", desc: "Spa treatment · 60 min", cat: "Spa", qty: 1, amt: 4800, hsn: "999722" },
  { id: 5, date: "16 May", desc: "Room charge · Premier Suite", cat: "Room", qty: 1, amt: 22000, hsn: "996311" },
  { id: 6, date: "17 May", desc: "Laundry service", cat: "Misc", qty: 1, amt: 850, hsn: "999719" },
];

type Tab = "folio" | "split" | "transfer" | "payment" | "deposit" | "refund" | "ar";

function calcTax(sub: number) {
  // GST 18% (tariff > 7500/night) split as CGST 9% + SGST 9%
  const cgst = Math.round(sub * 0.09);
  const sgst = Math.round(sub * 0.09);
  return { cgst, sgst, total: sub + cgst + sgst };
}

export function BillingFeature() {
  const [tab, setTab] = useState<Tab>("folio");

  return (
    <div>
      <PageHeader
        eyebrow="Commercial"
        title="Billing & Invoicing"
        description="Folio management, multi-tender payments, GST tax invoices."
        actions={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            New invoice
          </Button>
        }
      />

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="Outstanding · MTD" value="₹1,84,200" delta="12 invoices" deltaTone="neutral" accent="warning" />
          <KpiCard label="Collected · MTD" value="₹38,42,000" delta="↑ 14% vs LM" accent="success" />
          <KpiCard label="Avg Folio Value" value="₹28,400" accent="info" />
          <KpiCard label="Refunds · MTD" value="₹62,400" accent="error" />
        </div>

        <div className="flex flex-wrap gap-1 rounded-md border border-border bg-surface p-1 w-fit">
          {([
            { id: "folio", label: "Guest folio", icon: FileText },
            { id: "split", label: "Split folio", icon: Split },
            { id: "transfer", label: "Transfer", icon: ArrowRightLeft },
            { id: "payment", label: "Payment · multi-tender", icon: CreditCard },
            { id: "deposit", label: "Advance deposits", icon: Wallet },
            { id: "refund", label: "Refunds", icon: RotateCcw },
            { id: "ar", label: "City Ledger / AR", icon: Building2 },
          ] as { id: Tab; label: string; icon: any }[]).map((t) => {
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
