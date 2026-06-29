import { useState } from "react";
import { Search, Plus, Minus, Trash2, Tag, Percent, Banknote, User, Utensils, Bed } from "lucide-react";
import { Button } from "@/components/ui/Primitives";
import { PaymentModal } from "./PaymentModal";
import { CustomerManagementModal } from "./CustomerManagementModal";
import { OrderTypeSelector } from "./OrderTypeSelector";
import { DiscountModal, DiscountInfo } from "./DiscountModal";
import { LocationSelectionModal } from "./LocationSelectionModal";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  variant?: string;
};

export function CartFeature({
  items,
  updateQty,
  removeItem,
  clearCart
}: {
  items: CartItem[];
  updateQty: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}) {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [customer, setCustomer] = useState<{id: string, name: string} | null>(null);
  const [orderType, setOrderType] = useState("Dine-in");
  const [table, setTable] = useState("");
  const [room, setRoom] = useState("");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [discount, setDiscount] = useState<DiscountInfo | null>(null);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  
  const discountAmount = discount 
    ? discount.type === "percentage" 
      ? (subtotal * discount.value) / 100 
      : discount.value
    : 0;

  const afterDiscount = subtotal - discountAmount;
  const tax = afterDiscount * 0.05; // 5% flat tax for example
  const total = afterDiscount + tax;

  return (
    <div className="flex h-full flex-col bg-surface border-l border-border w-[350px] shrink-0 xl:w-[400px]">
      {/* Customer / Order Info Header */}
      <div className="p-4 border-b border-border bg-surface-2/30">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[15px] font-semibold text-text-primary">Current Order</h2>
          <span className="text-[11px] font-mono text-text-secondary bg-surface-2 px-2 py-0.5 rounded">
            #NEW-101
          </span>
        </div>
        <div className="flex gap-2 text-[12px]">
          {customer ? (
            <Button variant="secondary" size="sm" className="flex-1 h-7 truncate justify-start" onClick={() => setIsCustomerModalOpen(true)}>
              <User className="h-3 w-3 mr-1" />
              {customer.name}
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="flex-1 h-7" onClick={() => setIsCustomerModalOpen(true)}>
              Add Customer
            </Button>
          )}
          <div className="flex-1">
            <OrderTypeSelector currentType={orderType} onSelect={setOrderType} />
          </div>
        </div>
        
        {/* Conditional Location Selection */}
        {(orderType === "Dine-in" || orderType === "Room Service") && (
          <div className="mt-2">
            <Button 
              variant={(orderType === "Dine-in" && table) || (orderType === "Room Service" && room) ? "secondary" : "outline"} 
              size="sm" 
              className="w-full h-7 justify-center" 
              onClick={() => setIsLocationModalOpen(true)}
            >
              {orderType === "Dine-in" ? (
                <>
                  <Utensils className="h-3 w-3 mr-1.5" />
                  {table ? `Table: ${table}` : "Select Table"}
                </>
              ) : (
                <>
                  <Bed className="h-3 w-3 mr-1.5" />
                  {room ? `Room: ${room}` : "Select Room"}
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[13px] text-text-disabled flex-col gap-2">
            <Search className="h-8 w-8 opacity-20" />
            <p>Cart is empty</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex gap-3 group items-start">
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-text-primary truncate">{item.name}</div>
                {item.variant && <div className="text-[11px] text-text-secondary">{item.variant}</div>}
                <div className="text-[12px] font-mono text-text-secondary mt-0.5">₹{item.price}</div>
              </div>
              <div className="flex items-center gap-2 bg-surface-2 rounded-md p-0.5">
                <button
                  onClick={() => updateQty(item.id, -1)}
                  className="p-1 text-text-secondary hover:text-text-primary hover:bg-surface rounded"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="text-[12px] font-medium min-w-[1.2rem] text-center">{item.qty}</span>
                <button
                  onClick={() => updateQty(item.id, 1)}
                  className="p-1 text-text-secondary hover:text-text-primary hover:bg-surface rounded"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <div className="font-mono text-[13px] font-semibold w-16 text-right">
                ₹{item.price * item.qty}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Summary */}
      <div className="p-4 border-t border-border bg-surface-2/30 space-y-2">
        <div className="flex justify-between text-[13px] text-text-secondary">
          <span>Subtotal</span>
          <span className="font-mono text-text-primary">₹{subtotal.toFixed(2)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-[13px] text-error font-medium">
            <span>Discount ({discount?.type === "percentage" ? `${discount.value}%` : `₹${discount?.value}`})</span>
            <span className="font-mono">-₹{discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-[13px] text-text-secondary">
          <span>Tax (5%)</span>
          <span className="font-mono text-text-primary">₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[16px] font-bold text-text-primary pt-2 border-t border-border-subtle">
          <span>Total</span>
          <span className="font-mono text-brand">₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2 bg-surface-2/30">
        <Button variant="outline" className="col-span-1" onClick={clearCart}>
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
        <Button 
          variant={discount ? "secondary" : "outline"} 
          className={`col-span-1 ${discount ? 'border-brand text-brand bg-brand-tint' : ''}`}
          onClick={() => setIsDiscountModalOpen(true)}
          disabled={items.length === 0}
        >
          <Tag className="h-4 w-4" />
          Discount
        </Button>
        <Button 
          variant="primary" 
          className="col-span-2 h-12 text-[15px]"
          disabled={items.length === 0}
          onClick={() => setIsPaymentOpen(true)}
        >
          <Banknote className="h-5 w-5 mr-1" />
          Charge ₹{total.toFixed(2)}
        </Button>
      </div>

      {/* Modals */}
      {isPaymentOpen && (
        <PaymentModal 
          total={total} 
          onClose={() => setIsPaymentOpen(false)} 
          onSuccess={() => {
            setIsPaymentOpen(false);
            clearCart();
            setCustomer(null);
            setDiscount(null);
            setTable("");
            setRoom("");
            alert("Payment Successful!");
          }} 
        />
      )}
      {isDiscountModalOpen && (
        <DiscountModal
          currentDiscount={discount}
          subtotal={subtotal}
          onClose={() => setIsDiscountModalOpen(false)}
          onApply={(newDiscount) => {
            setDiscount(newDiscount);
            setIsDiscountModalOpen(false);
          }}
          onRemove={() => {
            setDiscount(null);
            setIsDiscountModalOpen(false);
          }}
        />
      )}
      {isCustomerModalOpen && (
        <CustomerManagementModal
          onClose={() => setIsCustomerModalOpen(false)}
          onSelect={(cust) => {
            setCustomer(cust);
            setIsCustomerModalOpen(false);
          }}
        />
      )}
      {isLocationModalOpen && (orderType === "Dine-in" || orderType === "Room Service") && (
        <LocationSelectionModal
          type={orderType as "Dine-in" | "Room Service"}
          currentValue={orderType === "Dine-in" ? table : room}
          onClose={() => setIsLocationModalOpen(false)}
          onSave={(val) => {
            if (orderType === "Dine-in") setTable(val);
            if (orderType === "Room Service") setRoom(val);
            setIsLocationModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
