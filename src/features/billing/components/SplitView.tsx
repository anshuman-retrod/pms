import { Card, CardHeader, Button } from "@/components/ui/Primitives";

interface FolioItem {
  id: number;
  date: string;
  desc: string;
  cat: string;
  qty: number;
  amt: number;
  hsn: string;
}

interface SplitViewProps {
  folio: FolioItem[];
}

export function SplitView({ folio }: SplitViewProps) {
  return (
    <Card>
      <CardHeader title="Split folio" hint="Select charges to split into a second folio" />
      <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-2">
        <div>
          <div className="label-uppercase mb-2">Folio A · Guest pays</div>
          <ul className="rounded-md border border-border divide-y divide-border-subtle">
            {folio
              .filter((f) => f.cat !== "Room")
              .map((f) => (
                <li key={f.id} className="flex items-center justify-between px-4 py-2.5 text-[13px]">
                  <span className="text-text-primary">{f.desc}</span>
                  <span className="font-mono text-text-secondary">₹{f.amt.toLocaleString()}</span>
                </li>
              ))}
          </ul>
          <div className="mt-2 text-right text-[12px] text-text-secondary">
            Subtotal: <span className="font-mono text-text-primary">₹9,250</span>
          </div>
        </div>
        <div>
          <div className="label-uppercase mb-2">Folio B · Direct bill to Infosys Ltd.</div>
          <ul className="rounded-md border border-primary/30 bg-primary-tint/20 divide-y divide-border-subtle">
            {folio
              .filter((f) => f.cat === "Room")
              .map((f) => (
                <li key={f.id} className="flex items-center justify-between px-4 py-2.5 text-[13px]">
                  <span className="text-text-primary">{f.desc}</span>
                  <span className="font-mono text-text-primary">₹{f.amt.toLocaleString()}</span>
                </li>
              ))}
          </ul>
          <div className="mt-2 text-right text-[12px] text-text-secondary">
            Subtotal: <span className="font-mono text-text-primary">₹44,000</span>
          </div>
        </div>
      </div>
      <div className="border-t border-border-subtle bg-surface-2/40 p-4 text-right">
        <Button size="sm">Apply split</Button>
      </div>
    </Card>
  );
}
