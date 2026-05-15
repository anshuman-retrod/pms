import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Download, Mail, Printer, Plus, Split, ArrowRightLeft, CreditCard,
  Wallet, Banknote, Smartphone, Building2, RotateCcw, FileText,
} from "lucide-react";
import { PageHeader, Card, CardHeader, StatusBadge, Button, KpiCard } from "@/components/ui-kit/Primitives";

export const Route = createFileRoute("/billing")({
  head: () => ({ meta: [{ title: "Billing & Invoicing — Retrod PMS" }] }),
  component: BillingPage,
});

const folio = [
  { id: 1, date: "15 May", desc: "Room charge · Premier Suite", cat: "Room", qty: 1, amt: 22000, hsn: "996311" },
  { id: 2, date: "15 May", desc: "Welcome drink · Bar", cat: "F&B", qty: 2, amt: 1200, hsn: "996331" },
  { id: 3, date: "16 May", desc: "Breakfast · Restaurant", cat: "F&B", qty: 2, amt: 2400, hsn: "996331" },
  { id: 4, date: "16 May", desc: "Spa treatment · 60 min", cat: "Spa", qty: 1, amt: 4800, hsn: "999722" },
  { id: 5, date: "16 May", desc: "Room charge · Premier Suite", cat: "Room", qty: 1, amt: 22000, hsn: "996311" },
  { id: 6, date: "17 May", desc: "Laundry service", cat: "Misc", qty: 1, amt: 850, hsn: "999719" },
];

type Tab = "folio" | "split" | "transfer" | "payment" | "deposit" | "refund" | "ar";

function BillingPage() {
  const [tab, setTab] = useState<Tab>("folio");

  return (
    <div>
      <PageHeader eyebrow="Commercial" title="Billing & Invoicing"
        description="Folio management, multi-tender payments, GST tax invoices."
        actions={<Button size="sm"><Plus className="h-3.5 w-3.5" />New invoice</Button>} />

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
          ] as { id: Tab; label: string; icon: any }[]).map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-[12px] font-medium ${tab === t.id ? "bg-foreground text-background" : "text-text-secondary hover:text-text-primary"}`}>
                <Icon className="h-3.5 w-3.5" />{t.label}
              </button>
            );
          })}
        </div>

        {tab === "folio" && <FolioView />}
        {tab === "split" && <SplitView />}
        {tab === "transfer" && <TransferView />}
        {tab === "payment" && <PaymentView />}
        {tab === "deposit" && <DepositView />}
        {tab === "refund" && <RefundView />}
        {tab === "ar" && <ARView />}
      </div>
    </div>
  );
}

function calcTax(sub: number) {
  // GST 18% (tariff > 7500/night) split as CGST 9% + SGST 9%
  const cgst = Math.round(sub * 0.09);
  const sgst = Math.round(sub * 0.09);
  return { cgst, sgst, total: sub + cgst + sgst };
}

function FolioView() {
  const sub = folio.reduce((a, b) => a + b.amt, 0);
  const { cgst, sgst, total } = calcTax(sub);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      <Card>
        {/* Invoice header */}
        <div className="border-b border-border px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-display text-[22px] font-semibold text-text-primary">The Grand Palace</div>
              <div className="text-[12px] text-text-secondary">Connaught Place, New Delhi 110001</div>
              <div className="text-[11px] text-text-disabled">GSTIN 07AABCT1234M1Z5 · PAN AABCT1234M · State 07-Delhi</div>
            </div>
            <div className="text-right">
              <div className="label-uppercase">Tax Invoice</div>
              <div className="font-mono text-[14px] font-semibold text-text-primary">INV-3104</div>
              <div className="text-[11px] text-text-secondary">Issued 17 May 2026</div>
              <StatusBadge tone="success">GST · Original</StatusBadge>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6 text-[12px]">
            <div>
              <div className="label-uppercase mb-1">Billed to</div>
              <div className="font-medium text-text-primary">Priya Sharma</div>
              <div className="text-text-secondary">14 Marine Drive, Mumbai 400020 · Maharashtra</div>
              <div className="text-text-secondary">priya.sharma@email.com · +91 98201 23456</div>
            </div>
            <div>
              <div className="label-uppercase mb-1">Stay</div>
              <div className="text-text-primary">15 May → 17 May 2026 · 2 nights</div>
              <div className="text-text-secondary">Reservation RES-2042 · Room 312 · Premier Suite</div>
              <div className="text-text-secondary">Place of supply · 27-Maharashtra (IGST applicable)</div>
            </div>
          </div>
        </div>

        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-surface-2/40 text-left">
              {["Date", "Description", "HSN/SAC", "Qty", "Amount"].map(h => (
                <th key={h} className="px-6 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {folio.map(f => (
              <tr key={f.id} className="border-b border-border-subtle">
                <td className="px-6 py-2.5 text-text-secondary">{f.date}</td>
                <td className="px-6 py-2.5 text-text-primary">{f.desc} <span className="text-text-disabled">· {f.cat}</span></td>
                <td className="px-6 py-2.5 font-mono text-text-secondary">{f.hsn}</td>
                <td className="px-6 py-2.5 font-mono text-text-secondary">{f.qty}</td>
                <td className="px-6 py-2.5 text-right font-mono text-text-primary">₹{f.amt.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t border-border-subtle px-6 py-4">
          <div className="ml-auto w-72 space-y-1.5 text-[13px]">
            <Row label="Subtotal" value={`₹${sub.toLocaleString()}`} />
            <Row label="CGST · 9%" value={`₹${cgst.toLocaleString()}`} />
            <Row label="SGST · 9%" value={`₹${sgst.toLocaleString()}`} />
            <div className="my-2 border-t border-border" />
            <Row label="Total due" value={`₹${total.toLocaleString()}`} bold />
            <Row label="Paid" value={`-₹${total.toLocaleString()}`} muted />
            <Row label="Balance" value="₹0" bold tone="success" />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border bg-surface-2/40 px-6 py-3">
          <StatusBadge tone="success">Settled · 17 May 12:42 · Visa **4421</StatusBadge>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"><Printer className="h-3.5 w-3.5" />Print</Button>
            <Button variant="outline" size="sm"><Mail className="h-3.5 w-3.5" />Email guest</Button>
            <Button size="sm"><Download className="h-3.5 w-3.5" />Download PDF</Button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Payment timeline" />
        <ol className="space-y-4 p-5">
          {[
            { t: "17 May · 12:42", text: "Settled in full · Visa **4421 · ₹37,326", tone: "success" },
            { t: "16 May · 19:14", text: "Spa treatment charged · ₹4,800", tone: "info" },
            { t: "15 May · 14:08", text: "Pre-authorization · ₹22,000", tone: "neutral" },
            { t: "12 May · 09:30", text: "Booking confirmed · Direct", tone: "neutral" },
          ].map((e, i) => (
            <li key={i} className="relative pl-6">
              <span className="absolute left-1 top-1.5 h-2 w-2 rounded-full bg-primary" />
              <span className="absolute left-[7px] top-4 bottom-[-18px] w-px bg-border-subtle" />
              <div className="text-[11px] text-text-disabled">{e.t}</div>
              <div className="text-[13px] text-text-primary">{e.text}</div>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

function SplitView() {
  return (
    <Card>
      <CardHeader title="Split folio" hint="Select charges to split into a second folio" />
      <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-2">
        <div>
          <div className="label-uppercase mb-2">Folio A · Guest pays</div>
          <ul className="rounded-md border border-border divide-y divide-border-subtle">
            {folio.filter(f => f.cat !== "Room").map(f => (
              <li key={f.id} className="flex items-center justify-between px-4 py-2.5 text-[13px]">
                <span className="text-text-primary">{f.desc}</span>
                <span className="font-mono text-text-secondary">₹{f.amt.toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 text-right text-[12px] text-text-secondary">Subtotal: <span className="font-mono text-text-primary">₹9,250</span></div>
        </div>
        <div>
          <div className="label-uppercase mb-2">Folio B · Direct bill to Infosys Ltd.</div>
          <ul className="rounded-md border border-primary/30 bg-primary-tint/20 divide-y divide-border-subtle">
            {folio.filter(f => f.cat === "Room").map(f => (
              <li key={f.id} className="flex items-center justify-between px-4 py-2.5 text-[13px]">
                <span className="text-text-primary">{f.desc}</span>
                <span className="font-mono text-text-primary">₹{f.amt.toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 text-right text-[12px] text-text-secondary">Subtotal: <span className="font-mono text-text-primary">₹44,000</span></div>
        </div>
      </div>
      <div className="border-t border-border-subtle bg-surface-2/40 p-4 text-right">
        <Button size="sm">Apply split</Button>
      </div>
    </Card>
  );
}

function TransferView() {
  return (
    <Card>
      <CardHeader title="Transfer charges" hint="Move charges between folios or to a master account" />
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-[1fr_60px_1fr]">
        <div>
          <div className="label-uppercase mb-2">From folio</div>
          <select className="h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px]"><option>Room 312 · Priya Sharma</option></select>
          <ul className="mt-3 rounded-md border border-border divide-y divide-border-subtle">
            {folio.slice(2, 5).map(f => (
              <li key={f.id} className="flex items-center gap-2 px-3 py-2 text-[12px]">
                <input type="checkbox" defaultChecked={f.cat === "F&B"} />
                <span className="flex-1 text-text-primary">{f.desc}</span>
                <span className="font-mono text-text-secondary">₹{f.amt.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-center"><ArrowRightLeft className="h-6 w-6 text-text-disabled" /></div>
        <div>
          <div className="label-uppercase mb-2">To</div>
          <select className="h-9 w-full rounded-md border border-primary bg-surface px-3 text-[13px]">
            <option>Master · Tata Steel Group GRP-014</option>
            <option>Room 401 · Elena Rodriguez</option>
            <option>City Ledger · Infosys Ltd.</option>
          </select>
          <label className="mt-3 block">
            <div className="label-uppercase mb-1">Authorization (Manager)</div>
            <input className="h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px]" placeholder="Manager PIN" />
          </label>
          <Button className="mt-4 w-full" size="sm">Transfer charges</Button>
        </div>
      </div>
    </Card>
  );
}

function PaymentView() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader title="Multi-tender payment" hint="Split across cash · card · UPI · city ledger" />
        <div className="space-y-3 p-5">
          {[
            { icon: Banknote, name: "Cash", val: "₹2,000", ref: "Cashier · Sunil" },
            { icon: CreditCard, name: "Card · Visa **4421", val: "₹15,326", ref: "APRV-882910" },
            { icon: Smartphone, name: "UPI · GPay", val: "₹20,000", ref: "UPI/2026/77361" },
          ].map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="flex items-center gap-3 rounded-md border border-border bg-surface px-4 py-3">
                <Icon className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-text-primary">{p.name}</div>
                  <div className="font-mono text-[11px] text-text-disabled">{p.ref}</div>
                </div>
                <span className="font-mono text-[14px] font-semibold text-text-primary">{p.val}</span>
                <button className="text-[11px] text-[var(--color-error)] hover:underline">Remove</button>
              </div>
            );
          })}
          <Button variant="outline" size="sm">+ Add tender</Button>
        </div>
        <div className="border-t border-border bg-surface-2/40 p-5 text-right">
          <div className="text-[12px] text-text-secondary">Total tendered <span className="ml-2 font-mono text-[18px] font-semibold text-text-primary">₹37,326</span></div>
          <Button className="mt-2" size="sm">Post payment</Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Tender mix · MTD" />
        <ul className="space-y-3 p-5 text-[12px]">
          {[
            { n: "Card", pct: 58 },
            { n: "UPI", pct: 22 },
            { n: "Cash", pct: 11 },
            { n: "City Ledger", pct: 7 },
            { n: "Voucher", pct: 2 },
          ].map(t => (
            <li key={t.n}>
              <div className="flex justify-between">
                <span className="text-text-secondary">{t.n}</span>
                <span className="font-mono text-text-primary">{t.pct}%</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div className="h-full bg-primary" style={{ width: `${t.pct}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function DepositView() {
  return (
    <Card>
      <CardHeader title="Advance deposits" action={<Button size="sm">+ Collect deposit</Button>} />
      <table className="w-full text-[13px]">
        <thead className="bg-surface-2/40 text-left">
          <tr>{["Reservation", "Guest", "Collected", "Applied", "Outstanding", "Status"].map(h => <th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">{h}</th>)}</tr>
        </thead>
        <tbody>
          {[
            { id: "RES-2048", g: "Sophie Laurent", c: 50000, a: 0, o: 50000, s: "Held" },
            { id: "RES-2044", g: "Elena Rodriguez", c: 25000, a: 25000, o: 0, s: "Applied" },
            { id: "RES-2046", g: "Aisha Khan", c: 12000, a: 0, o: 0, s: "Forfeited (no-show)" },
          ].map((r, i) => (
            <tr key={i} className="border-t border-border-subtle">
              <td className="px-4 py-3 font-mono text-text-primary">{r.id}</td>
              <td className="px-4 py-3 font-medium text-text-primary">{r.g}</td>
              <td className="px-4 py-3 font-mono">₹{r.c.toLocaleString()}</td>
              <td className="px-4 py-3 font-mono text-text-secondary">₹{r.a.toLocaleString()}</td>
              <td className="px-4 py-3 font-mono">{r.o ? <span className="text-[var(--color-warning)]">₹{r.o.toLocaleString()}</span> : "—"}</td>
              <td className="px-4 py-3"><StatusBadge tone={r.s === "Applied" ? "success" : r.s === "Held" ? "info" : "error"}>{r.s}</StatusBadge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function RefundView() {
  return (
    <Card>
      <CardHeader title="Refunds · dual approval workflow" hint="Above ₹10,000 requires Finance Manager" />
      <ul className="divide-y divide-border-subtle">
        {[
          { g: "Hiroshi Tanaka", inv: "INV-3082", amt: 4800, type: "Card reversal · Visa **8821", s: "Pending GM", tone: "warning" },
          { g: "Marcus Weber", inv: "INV-3079", amt: 2200, type: "Cash refund", s: "Approved", tone: "success" },
          { g: "Aisha Khan", inv: "INV-3061", amt: 12000, type: "Credit note", s: "Pending Finance", tone: "warning" },
        ].map((r, i) => (
          <li key={i} className="flex items-center gap-3 px-5 py-3.5">
            <RotateCcw className="h-4 w-4 text-[var(--color-error)]" />
            <div className="flex-1">
              <div className="text-[13px] font-medium text-text-primary">{r.g} · {r.inv}</div>
              <div className="text-[11px] text-text-secondary">{r.type}</div>
            </div>
            <span className="font-mono text-[13px] text-text-primary">₹{r.amt.toLocaleString()}</span>
            <StatusBadge tone={r.tone as any}>{r.s}</StatusBadge>
            <Button size="sm" variant="outline">Review</Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ARView() {
  return (
    <Card>
      <CardHeader title="City Ledger / AR aging" hint="Corporate accounts" />
      <div className="grid grid-cols-5 gap-px bg-border-subtle">
        {[
          { l: "Current", v: "₹18,42,000", c: "text-text-primary" },
          { l: "0–30 d", v: "₹6,82,000", c: "text-[var(--color-success)]" },
          { l: "31–60 d", v: "₹2,14,000", c: "text-[var(--color-info)]" },
          { l: "61–90 d", v: "₹84,000", c: "text-[var(--color-warning)]" },
          { l: "90+ d", v: "₹42,000", c: "text-[var(--color-error)]" },
        ].map(b => (
          <div key={b.l} className="bg-surface px-4 py-4">
            <div className="label-uppercase">{b.l}</div>
            <div className={`mt-1 font-mono text-[16px] font-semibold ${b.c}`}>{b.v}</div>
          </div>
        ))}
      </div>
      <table className="w-full text-[13px]">
        <thead className="bg-surface-2/40 text-left">
          <tr>{["Company", "Invoices", "Outstanding", "Oldest", "Credit limit", "Action"].map(h => <th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">{h}</th>)}</tr>
        </thead>
        <tbody>
          {[
            { c: "Infosys Ltd.", i: 8, o: 484000, oldest: "12 d", lim: 1000000 },
            { c: "HSBC India", i: 4, o: 218000, oldest: "32 d", lim: 800000 },
            { c: "Tata Steel", i: 12, o: 642000, oldest: "55 d", lim: 1500000 },
            { c: "Reliance Jio", i: 2, o: 98000, oldest: "92 d", lim: 500000 },
          ].map((r, i) => (
            <tr key={i} className="border-t border-border-subtle">
              <td className="px-4 py-3 font-medium text-text-primary">{r.c}</td>
              <td className="px-4 py-3 font-mono">{r.i}</td>
              <td className="px-4 py-3 font-mono text-text-primary">₹{r.o.toLocaleString()}</td>
              <td className="px-4 py-3 text-text-secondary">{r.oldest}</td>
              <td className="px-4 py-3 font-mono text-text-secondary">₹{r.lim.toLocaleString()}</td>
              <td className="px-4 py-3"><Button size="sm" variant="outline">Statement</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function Row({ label, value, bold, muted, tone }: { label: string; value: string; bold?: boolean; muted?: boolean; tone?: "success" }) {
  return (
    <div className="flex justify-between">
      <span className={muted ? "text-text-disabled" : "text-text-secondary"}>{label}</span>
      <span className={`font-mono ${bold ? "font-semibold" : ""} ${tone === "success" ? "text-[var(--color-success)]" : "text-text-primary"}`}>{value}</span>
    </div>
  );
}
