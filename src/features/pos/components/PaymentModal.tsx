import { useState } from "react";
import { X, CreditCard, Banknote, Smartphone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Primitives";

export function PaymentModal({
  total,
  onClose,
  onSuccess
}: {
  total: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [tender, setTender] = useState<number>(total);
  const [method, setMethod] = useState<"Cash" | "Card" | "UPI">("Cash");

  const change = Math.max(0, tender - total);
  const isSufficient = tender >= total;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border shadow-e2 rounded-xl w-full max-w-lg overflow-hidden flex flex-col max-h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-[18px] font-semibold text-text-primary">Payment</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-surface-2 text-text-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-2 gap-6">
          {/* Left: Summary & Tender */}
          <div className="space-y-4">
            <div className="bg-surface-2/50 rounded-lg p-4 text-center">
              <div className="text-[12px] text-text-secondary label-uppercase mb-1">Total Due</div>
              <div className="text-[32px] font-display font-semibold text-text-primary font-mono tracking-tight">
                ₹{total.toFixed(2)}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-medium text-text-secondary">Tender Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary font-mono">₹</span>
                <input 
                  type="number" 
                  className="w-full h-10 bg-background border border-border rounded-md pl-7 pr-3 font-mono text-[16px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  value={tender || ""}
                  onChange={(e) => setTender(parseFloat(e.target.value) || 0)}
                  autoFocus
                />
              </div>
              
              {/* Quick Cash Buttons */}
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[100, 500, 2000].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setTender(amt)}
                    className="h-8 rounded border border-border bg-surface-2/30 text-[12px] font-mono hover:bg-surface-2"
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-success-tint/30 border border-success/20 rounded-lg p-3 flex justify-between items-center text-success">
              <span className="text-[13px] font-medium">Change Due</span>
              <span className="text-[18px] font-mono font-bold">₹{change.toFixed(2)}</span>
            </div>
          </div>

          {/* Right: Payment Methods */}
          <div className="space-y-3">
            <div className="text-[12px] font-medium text-text-secondary mb-1">Payment Method</div>
            
            <MethodButton 
              active={method === "Cash"} 
              onClick={() => setMethod("Cash")}
              icon={<Banknote className="h-5 w-5" />} 
              label="Cash" 
            />
            <MethodButton 
              active={method === "Card"} 
              onClick={() => { setMethod("Card"); setTender(total); }}
              icon={<CreditCard className="h-5 w-5" />} 
              label="Credit / Debit Card" 
            />
            <MethodButton 
              active={method === "UPI"} 
              onClick={() => { setMethod("UPI"); setTender(total); }}
              icon={<Smartphone className="h-5 w-5" />} 
              label="UPI / QR Code" 
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border bg-surface-2/30 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button 
            variant="primary" 
            className="min-w-[120px]"
            disabled={!isSufficient}
            onClick={onSuccess}
          >
            <CheckCircle2 className="h-4 w-4 mr-1.5" />
            Complete Payment
          </Button>
        </div>
      </div>
    </div>
  );
}

function MethodButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
        active 
          ? "border-primary bg-primary-tint text-primary-pressed ring-1 ring-primary/20" 
          : "border-border bg-surface text-text-secondary hover:bg-surface-2 hover:text-text-primary"
      }`}
    >
      <div className={active ? "text-primary" : "text-text-disabled"}>{icon}</div>
      <span className="text-[14px] font-medium">{label}</span>
      {active && <CheckCircle2 className="h-4 w-4 ml-auto text-primary" />}
    </button>
  );
}
