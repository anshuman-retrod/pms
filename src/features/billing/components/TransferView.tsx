import { ArrowRightLeft } from "lucide-react";
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

interface TransferViewProps {
  folio: FolioItem[];
}

export function TransferView({ folio }: TransferViewProps) {
  return (
    <Card>
      <CardHeader title="Transfer charges" hint="Move charges between folios or to a master account" />
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-[1fr_60px_1fr]">
        <div>
          <div className="label-uppercase mb-2">From folio</div>
          <select className="h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px]">
            <option>Room 312 · Priya Sharma</option>
          </select>
          <ul className="mt-3 rounded-md border border-border divide-y divide-border-subtle">
            {folio.slice(2, 5).map((f) => (
              <li key={f.id} className="flex items-center gap-2 px-3 py-2 text-[12px]">
                <input type="checkbox" defaultChecked={f.cat === "F&B"} />
                <span className="flex-1 text-text-primary">{f.desc}</span>
                <span className="font-mono text-text-secondary">₹{f.amt.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-center">
          <ArrowRightLeft className="h-6 w-6 text-text-disabled" />
        </div>
        <div>
          <div className="label-uppercase mb-2">To</div>
          <select className="h-9 w-full rounded-md border border-primary bg-surface px-3 text-[13px]">
            <option>Master · Tata Steel Group GRP-014</option>
            <option>Room 401 · Elena Rodriguez</option>
            <option>City Ledger · Infosys Ltd.</option>
          </select>
          <label className="mt-3 block">
            <div className="label-uppercase mb-1">Authorization (Manager)</div>
            <input
              className="h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px]"
              placeholder="Manager PIN"
            />
          </label>
          <Button className="mt-4 w-full" size="sm">
            Transfer charges
          </Button>
        </div>
      </div>
    </Card>
  );
}
