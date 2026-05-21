import { Download, Mail, Printer } from "lucide-react";
import { Card, CardHeader, StatusBadge, Button } from "@/components/ui/Primitives";

interface FolioItem {
  id: number;
  date: string;
  desc: string;
  cat: string;
  qty: number;
  amt: number;
  hsn: string;
}

interface FolioViewProps {
  folio: FolioItem[];
  calcTax: (sub: number) => { cgst: number; sgst: number; total: number };
}

export function FolioView({ folio, calcTax }: FolioViewProps) {
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
              {["Date", "Description", "HSN/SAC", "Qty", "Amount"].map((h) => (
                <th key={h} className="px-6 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {folio.map((f) => (
              <tr key={f.id} className="border-b border-border-subtle">
                <td className="px-6 py-2.5 text-text-secondary">{f.date}</td>
                <td className="px-6 py-2.5 text-text-primary">
                  {f.desc} <span className="text-text-disabled">· {f.cat}</span>
                </td>
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
            <Button variant="outline" size="sm">
              <Printer className="h-3.5 w-3.5" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="h-3.5 w-3.5" />
              Email guest
            </Button>
            <Button size="sm">
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </Button>
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

function Row({ label, value, bold, muted, tone }: { label: string; value: string; bold?: boolean; muted?: boolean; tone?: "success" }) {
  return (
    <div className="flex justify-between">
      <span className={muted ? "text-text-disabled" : "text-text-secondary"}>{label}</span>
      <span className={`font-mono ${bold ? "font-semibold" : ""} ${tone === "success" ? "text-[var(--color-success)]" : "text-text-primary"}`}>
        {value}
      </span>
    </div>
  );
}
