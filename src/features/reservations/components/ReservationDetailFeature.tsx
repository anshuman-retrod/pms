import { useParams, Link } from "@tanstack/react-router";
import { useReservationQuery } from "@/services/mock/queries";
import { PageHeader, Card, CardHeader } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  Calendar,
  CreditCard,
  User,
  Bed,
  CheckCircle2,
  Clock,
  Ban,
  Pencil,
  ArrowRightLeft,
  AlertCircle,
  Printer,
  Trash,
  History,
  Activity
} from "lucide-react";
import { useState, useEffect } from "react";

interface PaymentTransaction {
  id: string;
  type: string;
  method: string;
  date: string;
  amount: number;
}

interface FolioCharge {
  id: string;
  date: string;
  description: string;
  qty: number;
  amount: number;
}

export function ReservationDetailFeature() {
  const { reservationId } = useParams({ strict: false });
  const { data: reservation, isLoading } = useReservationQuery(reservationId as string);

  const [statusOverride, setStatusOverride] = useState<string | null>(null);
  const [checkoutOverride, setCheckoutOverride] = useState<string | null>(null);
  const [isAmendOpen, setIsAmendOpen] = useState(false);
  const [newCheckoutDate, setNewCheckoutDate] = useState("");

  const [guestNameOverride, setGuestNameOverride] = useState<string | null>(null);
  const [guestEmailOverride, setGuestEmailOverride] = useState<string | null>(null);
  const [guestPhoneOverride, setGuestPhoneOverride] = useState<string | null>(null);
  const [guestAddressOverride, setGuestAddressOverride] = useState<string | null>(null);
  const [guestIdTypeOverride, setGuestIdTypeOverride] = useState<string | null>(null);
  const [guestIdNumberOverride, setGuestIdNumberOverride] = useState<string | null>(null);

  const [specialRequestsOverride, setSpecialRequestsOverride] = useState<string | null>(null);
  const [isSpecialRequestsEditOpen, setIsSpecialRequestsEditOpen] = useState(false);
  const [editSpecialRequests, setEditSpecialRequests] = useState("");

  const [activityLogs, setActivityLogs] = useState<{id: string, action: string, user: string, timestamp: string}[]>([
    { id: "log-1", action: "Reservation Created via OTA", user: "System", timestamp: new Date(Date.now() - 86400000).toLocaleString() },
    { id: "log-2", action: "Deposit Payment Received", user: "Front Desk (Admin)", timestamp: new Date(Date.now() - 80000000).toLocaleString() }
  ]);

  const addLog = (action: string) => {
    setActivityLogs(prev => [{ id: `log-${Date.now()}`, action, user: "Current User", timestamp: new Date().toLocaleString() }, ...prev]);
  };

  const [isGuestEditOpen, setIsGuestEditOpen] = useState(false);
  const [editGuestName, setEditGuestName] = useState("");
  const [editGuestEmail, setEditGuestEmail] = useState("");
  const [editGuestPhone, setEditGuestPhone] = useState("");
  const [editGuestAddress, setEditGuestAddress] = useState("");
  const [editGuestIdType, setEditGuestIdType] = useState("");
  const [editGuestIdNumber, setEditGuestIdNumber] = useState("");

  const [roomOverride, setRoomOverride] = useState<string | null>(null);
  const [isRoomEditOpen, setIsRoomEditOpen] = useState(false);
  const [editRoom, setEditRoom] = useState("");

  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [paymentForm, setPaymentForm] = useState({ type: "Partial Payment", method: "Cash", amount: "" });

  const [charges, setCharges] = useState<FolioCharge[]>([]);
  const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);
  const [editingChargeId, setEditingChargeId] = useState<string | null>(null);
  const [chargeForm, setChargeForm] = useState({
    description: "Room Service",
    amount: "",
    taxType: "Excluded",
    taxPercent: "18",
  });

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printDocumentType, setPrintDocumentType] = useState("Estimated Invoice");

  useEffect(() => {
    if (reservation && payments.length === 0) {
      const defaultPayments: PaymentTransaction[] = [];
      const paid = reservation.amount - reservation.balance;
      if (paid > 0) {
        defaultPayments.push({
          id: "p1",
          type: "Deposit",
          method: "Visa ending in 4242",
          date: new Date(reservation.ci).toLocaleDateString(),
          amount: paid
        });
      }
      if (reservation.balance === 0) {
        defaultPayments.push({
          id: "p2",
          type: "Final Settlement",
          method: "Mastercard ending in 1123",
          date: new Date().toLocaleDateString(),
          amount: reservation.balance // Or whatever
        });
      }
      setPayments(defaultPayments);
    }
    
    if (reservation && charges.length === 0) {
      setCharges([
        {
          id: "c1",
          date: reservation.ci,
          description: `Room Charge (${reservation.type})`,
          qty: reservation.nights,
          amount: reservation.amount * 0.8
        },
        {
          id: "c2",
          date: reservation.ci,
          description: "Taxes & Fees",
          qty: 1,
          amount: reservation.amount * 0.2
        }
      ]);
    }
  }, [reservation]);

  if (isLoading) {
    return <div className="p-8 text-center text-text-secondary">Loading reservation...</div>;
  }

  if (!reservation) {
    return <div className="p-8 text-center text-error">Reservation not found.</div>;
  }

  const currentStatus = statusOverride || reservation.status;
  const currentCheckout = checkoutOverride || reservation.co;
  const currentGuestName = guestNameOverride || reservation.guest;
  const currentGuestEmail = guestEmailOverride || "guest@example.com";
  const currentGuestPhone = guestPhoneOverride || "+1 (555) 019-2834";
  const currentGuestAddress = guestAddressOverride || "123 Main St, New York, NY 10001";
  const currentGuestIdType = guestIdTypeOverride || "Passport";
  const currentGuestIdNumber = guestIdNumberOverride || "P12345678";
  const currentSpecialRequests = specialRequestsOverride || "Late check-in requested (around 8 PM). Extra pillows.";
  const currentRoom = roomOverride || reservation.room;

  // Calculate dynamic nights if checkout changed
  const checkInDate = new Date(reservation.ci);
  const checkOutDateObj = new Date(currentCheckout);
  const diffTime = Math.abs(checkOutDateObj.getTime() - checkInDate.getTime());
  const currentNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  const totalCharges = charges.length > 0 ? charges.reduce((acc, c) => acc + c.amount, 0) : (reservation ? reservation.amount : 0);
  const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);
  const currentBalanceDue = totalCharges - totalPaid;

  const handleAction = (action: string) => {
    if (action === "check-in") { setStatusOverride("Checked-In"); addLog("Guest Checked In"); }
    if (action === "undo-check-in") { setStatusOverride("Confirmed"); addLog("Undo Check-In"); }
    if (action === "check-out") { setStatusOverride("Checked-Out"); addLog("Guest Checked Out"); }
    if (action === "undo-check-out") { setStatusOverride("Checked-In"); addLog("Undo Check-Out"); }
    if (action === "cancel") { setStatusOverride("Cancelled"); addLog("Reservation Cancelled"); }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "bg-brand/10 text-brand";
      case "Checked-In": return "bg-success/10 text-success";
      case "Checked-Out": return "bg-border text-text-secondary";
      case "Cancelled": case "No-Show": return "bg-error/10 text-error";
      default: return "bg-warning/10 text-warning";
    }
  };

  return (
    <div className="space-y-6 print-container p-4">
      <div className="flex items-center gap-4">
        <Link to="/reservations" className="text-text-secondary hover:text-text-primary">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
              {currentGuestName}
            </h1>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${getStatusBadgeColor(currentStatus)}`}>
              {currentStatus}
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Res ID: {reservation.id} • {reservation.source}
          </p>
        </div>
        
        <div className="flex gap-2">
          {currentStatus === "Confirmed" && (
            <Button onClick={() => handleAction("check-in")} className="bg-success text-white hover:bg-success/90">
              Check In
            </Button>
          )}
          {currentStatus === "Checked-In" && (
            <>
              <Button onClick={() => handleAction("undo-check-in")} variant="outline">
                Undo Check-In
              </Button>
              <Button onClick={() => handleAction("check-out")} className="bg-red-500 text-white hover:bg-red-600">
                Check Out
              </Button>
            </>
          )}
          {currentStatus === "Checked-Out" && (
            <Button onClick={() => handleAction("undo-check-out")} variant="outline">
              Undo Check-Out
            </Button>
          )}
          <Button variant="outline" onClick={() => {
            setNewCheckoutDate(currentCheckout);
            setIsAmendOpen(true);
          }}>
            <Pencil className="h-3.5 w-3.5 mr-2" /> Amend
          </Button>
          <Button variant="outline" onClick={() => setIsPrintModalOpen(true)}>
            <Printer className="h-3.5 w-3.5 mr-2" /> Print
          </Button>
          {["Confirmed", "Pending"].includes(currentStatus) && (
            <Button variant="outline" className="text-error border-error/20 hover:bg-error/10" onClick={() => handleAction("cancel")}>
              <Ban className="h-3.5 w-3.5 mr-2" /> Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Stay Details" />
            <div className="p-4 flex flex-wrap gap-8">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-brand/10 rounded-lg text-brand">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] text-text-secondary uppercase font-medium">Check In</p>
                  <p className="text-sm font-medium text-text-primary">{new Date(reservation.ci).toLocaleDateString("en-GB", { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                  <p className="text-[12px] text-text-secondary">After 14:00</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center justify-center text-border">
                <ArrowRightLeft className="h-4 w-4" />
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-brand/10 rounded-lg text-brand">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] text-text-secondary uppercase font-medium">Check Out</p>
                  <p className="text-sm font-medium text-text-primary">{checkOutDateObj.toLocaleDateString("en-GB", { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                  <p className="text-[12px] text-text-secondary">Before 11:00</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pl-4 sm:border-l border-border">
                <div className="p-2 bg-surface-hover rounded-lg text-text-secondary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] text-text-secondary uppercase font-medium">Duration</p>
                  <p className="text-sm font-medium text-text-primary">{currentNights} Nights</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-border grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[11px] text-text-secondary uppercase font-medium">Room</p>
                  <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[10px] text-brand" onClick={() => {
                    setEditRoom(currentRoom);
                    setIsRoomEditOpen(true);
                  }}>
                    Change
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4 text-brand" />
                  <span className="text-sm font-medium text-text-primary">{currentRoom} ({reservation.type})</span>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-text-secondary uppercase font-medium mb-1">Guests</p>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-brand" />
                  <span className="text-sm font-medium text-text-primary">2 Adults, 0 Children</span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="text-sm font-semibold text-text-primary">Folio Itemization</h2>
              <Button variant="outline" size="sm" onClick={() => {
                setEditingChargeId(null);
                setChargeForm({ description: "Room Service", amount: "", taxType: "Excluded", taxPercent: "18" });
                setIsChargeModalOpen(true);
              }}>
                Add Charge
              </Button>
            </div>
            <div className="p-0">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-hover text-[11px] uppercase tracking-wider text-text-secondary">
                    <th className="px-4 py-2 font-medium">Date</th>
                    <th className="px-4 py-2 font-medium">Description</th>
                    <th className="px-4 py-2 font-medium text-right">Qty</th>
                    <th className="px-4 py-2 font-medium text-right">Amount</th>
                    <th className="px-4 py-2 font-medium text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {charges.map(charge => (
                    <tr key={charge.id} className="group">
                      <td className="px-4 py-3 text-text-secondary">{charge.date}</td>
                      <td className="px-4 py-3 font-medium text-text-primary">{charge.description}</td>
                      <td className="px-4 py-3 text-right text-text-secondary">{charge.qty}</td>
                      <td className="px-4 py-3 text-right text-text-primary">{charge.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-text-secondary hover:text-brand transition-colors" onClick={() => {
                            setEditingChargeId(charge.id);
                            setChargeForm({ description: charge.description, amount: String(charge.amount), taxType: "Included", taxPercent: "0" });
                            setIsChargeModalOpen(true);
                          }}>
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button className="text-text-secondary hover:text-error transition-colors" onClick={() => {
                            setCharges(charges.filter(c => c.id !== charge.id));
                          }}>
                            <Trash className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {charges.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-text-secondary">No charges found.</td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="border-t-2 border-border">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right font-medium text-text-primary">Total Charges</td>
                    <td className="px-4 py-3 text-right font-semibold text-text-primary">{totalCharges.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 border-b border-border p-4">
              <History className="h-4 w-4 text-text-secondary" />
              <h2 className="text-sm font-semibold text-text-primary">Activity Log</h2>
            </div>
            <div className="p-4">
              <div className="relative border-l border-border ml-2 space-y-6 pb-2">
                {activityLogs.map((log, index) => (
                  <div key={log.id} className="relative pl-6">
                    <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-surface border-2 border-brand ring-4 ring-surface" />
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                      <p className="text-sm font-medium text-text-primary">{log.action}</p>
                      <time className="text-[11px] text-text-secondary whitespace-nowrap">{log.timestamp}</time>
                    </div>
                    <p className="text-[12px] text-text-secondary">By: {log.user}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Payment Summary" />
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">Total Amount</span>
                <span className="font-medium text-text-primary">{totalCharges.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">Paid</span>
                <span className="font-medium text-success">{totalPaid.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold border-t border-border pt-3">
                <span className="text-text-primary">Balance Due</span>
                <span className={currentBalanceDue > 0 ? "text-error" : "text-text-primary"}>
                  {currentBalanceDue.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </span>
              </div>

              {currentBalanceDue > 0 && (
                <Button className="w-full mt-2" onClick={() => {
                  setEditingPaymentId(null);
                  setPaymentForm({ type: "Partial Payment", method: "Credit Card", amount: String(currentBalanceDue) });
                  setIsPaymentModalOpen(true);
                }}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Process Payment
                </Button>
              )}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="text-sm font-semibold text-text-primary">Guest Information</h2>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px]" onClick={() => {
                setEditGuestName(currentGuestName);
                setEditGuestEmail(currentGuestEmail);
                setEditGuestPhone(currentGuestPhone);
                setEditGuestAddress(currentGuestAddress);
                setEditGuestIdType(currentGuestIdType);
                setEditGuestIdNumber(currentGuestIdNumber);
                setIsGuestEditOpen(true);
              }}>
                <Pencil className="h-3 w-3 mr-1" /> Edit
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-[11px] text-text-secondary uppercase font-medium mb-1">Primary Guest</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-lg">
                    {currentGuestName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{currentGuestName}</p>
                    <p className="text-[12px] text-text-secondary">{currentGuestEmail}</p>
                    <p className="text-[12px] text-text-secondary">{currentGuestPhone}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-3 border-t border-border">
                <p className="text-[11px] text-text-secondary uppercase font-medium mb-1">Address</p>
                <p className="text-sm text-text-primary">{currentGuestAddress}</p>
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-[11px] text-text-secondary uppercase font-medium mb-1">ID Document</p>
                <div className="flex gap-4 items-start">
                  <div className="h-16 w-24 bg-surface-hover border border-border rounded overflow-hidden flex items-center justify-center">
                    <span className="text-[10px] text-text-secondary uppercase font-semibold">ID Proof</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{currentGuestIdType}</p>
                    <p className="text-[12px] text-text-secondary"># {currentGuestIdNumber}</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-[11px] text-text-secondary uppercase font-medium mb-1">Booking Source</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-primary">{reservation.source}</span>
                  {reservation.source !== "Direct" && (
                    <span className="px-1.5 py-0.5 rounded bg-surface-hover text-[10px] text-text-secondary border border-border">OTA</span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="text-sm font-semibold text-text-primary">Special Requests & Preferences</h2>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px]" onClick={() => {
                setEditSpecialRequests(currentSpecialRequests);
                setIsSpecialRequestsEditOpen(true);
              }}>
                <Pencil className="h-3 w-3 mr-1" /> Edit
              </Button>
            </div>
            <div className="p-4">
              {currentSpecialRequests ? (
                <p className="text-sm text-text-primary whitespace-pre-wrap">{currentSpecialRequests}</p>
              ) : (
                <p className="text-sm text-text-secondary italic">No special requests added.</p>
              )}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="text-sm font-semibold text-text-primary">Payment History</h2>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px]" onClick={() => {
                setEditingPaymentId(null);
                setPaymentForm({ type: "Deposit", method: "Cash", amount: "" });
                setIsPaymentModalOpen(true);
              }}>
                + Add Payment
              </Button>
            </div>
            <div className="p-0">
              <div className="divide-y divide-border">
                {payments.length > 0 ? payments.map((p) => (
                  <div key={p.id} className="flex justify-between items-center p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-text-primary">{p.type}</p>
                        <button className="text-text-secondary hover:text-brand transition-colors" onClick={() => {
                          setEditingPaymentId(p.id);
                          setPaymentForm({ type: p.type, method: p.method, amount: String(p.amount) });
                          setIsPaymentModalOpen(true);
                        }}>
                          <Pencil className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-[11px] text-text-secondary">{p.method} • {p.date}</p>
                    </div>
                    <span className="text-sm font-semibold text-text-primary">
                      {p.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </span>
                  </div>
                )) : (
                  <div className="p-4 text-center text-[12px] text-text-secondary">No payments recorded.</div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={isAmendOpen} onOpenChange={setIsAmendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Amend Stay</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="checkout">New Check-Out Date</Label>
              <Input
                id="checkout"
                type="date"
                value={newCheckoutDate}
                onChange={(e) => setNewCheckoutDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAmendOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setCheckoutOverride(newCheckoutDate);
              setIsAmendOpen(false);
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isGuestEditOpen} onOpenChange={setIsGuestEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Guest Information</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="guestName">Full Name</Label>
                <Input
                  id="guestName"
                  value={editGuestName}
                  onChange={(e) => setEditGuestName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="guestEmail">Email Address</Label>
                <Input
                  id="guestEmail"
                  type="email"
                  value={editGuestEmail}
                  onChange={(e) => setEditGuestEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="guestPhone">Contact Number</Label>
                <Input
                  id="guestPhone"
                  value={editGuestPhone}
                  onChange={(e) => setEditGuestPhone(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="guestAddress">Address</Label>
                <Input
                  id="guestAddress"
                  value={editGuestAddress}
                  onChange={(e) => setEditGuestAddress(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
              <div className="grid gap-2">
                <Label htmlFor="guestIdType">ID Type</Label>
                <select
                  id="guestIdType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editGuestIdType}
                  onChange={(e) => setEditGuestIdType(e.target.value)}
                >
                  <option value="Passport">Passport</option>
                  <option value="Driver's License">Driver's License</option>
                  <option value="National ID">National ID</option>
                  <option value="Aadhaar Card">Aadhaar Card</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="guestIdNumber">ID Number</Label>
                <Input
                  id="guestIdNumber"
                  value={editGuestIdNumber}
                  onChange={(e) => setEditGuestIdNumber(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="guestIdFile">Update ID Proof Image</Label>
              <Input
                id="guestIdFile"
                type="file"
                className="cursor-pointer"
                accept="image/*,.pdf"
              />
              <p className="text-[11px] text-text-secondary">Optional. Upload a new image or PDF of the guest's ID.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGuestEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setGuestNameOverride(editGuestName);
              setGuestEmailOverride(editGuestEmail);
              setGuestPhoneOverride(editGuestPhone);
              setGuestAddressOverride(editGuestAddress);
              setGuestIdTypeOverride(editGuestIdType);
              setGuestIdNumberOverride(editGuestIdNumber);
              setIsGuestEditOpen(false);
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRoomEditOpen} onOpenChange={setIsRoomEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Assigned Room</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="roomNum">New Room Number</Label>
              <Input
                id="roomNum"
                value={editRoom}
                onChange={(e) => setEditRoom(e.target.value)}
                placeholder="e.g. 204"
              />
              <p className="text-[11px] text-text-secondary">Note: ensure the new room matches the {reservation.type} type category.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoomEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setRoomOverride(editRoom);
              setIsRoomEditOpen(false);
            }}>
              Confirm Room Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPaymentId ? "Edit Payment" : "Add Payment"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="paymentType">Payment Type</Label>
              <Input
                id="paymentType"
                value={paymentForm.type}
                onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value })}
                placeholder="e.g. Deposit, Partial Payment"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Input
                id="paymentMethod"
                value={paymentForm.method}
                onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                placeholder="e.g. Cash, Visa ending in 4242"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="paymentAmount">Amount (₹)</Label>
              <Input
                id="paymentAmount"
                type="number"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              const amountVal = Number(paymentForm.amount) || 0;
              if (editingPaymentId) {
                setPayments(payments.map(p => p.id === editingPaymentId ? { ...p, ...paymentForm, amount: amountVal } : p));
                addLog(`Updated Payment: ${paymentForm.type} (${paymentForm.method}) for ₹${amountVal}`);
              } else {
                setPayments([...payments, { id: `p-${Date.now()}`, ...paymentForm, amount: amountVal, date: new Date().toLocaleDateString() }]);
                addLog(`Added Payment: ${paymentForm.type} (${paymentForm.method}) for ₹${amountVal}`);
              }
              setIsPaymentModalOpen(false);
            }}>
              {editingPaymentId ? "Save Changes" : "Add Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isChargeModalOpen} onOpenChange={setIsChargeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingChargeId ? "Edit Folio Charge" : "Add Folio Charge"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="chargeDesc">Charge Description</Label>
              {editingChargeId ? (
                <Input
                  id="chargeDesc"
                  value={chargeForm.description}
                  onChange={(e) => setChargeForm({ ...chargeForm, description: e.target.value })}
                />
              ) : (
                <select
                  id="chargeDesc"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={chargeForm.description}
                  onChange={(e) => setChargeForm({ ...chargeForm, description: e.target.value })}
                >
                  <option value="Room Service">Room Service</option>
                  <option value="Minibar">Minibar</option>
                  <option value="Spa & Wellness">Spa & Wellness</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Laundry">Laundry</option>
                  <option value="Airport Transfer">Airport Transfer</option>
                  <option value="Other">Other</option>
                </select>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="chargeAmount">Amount (₹)</Label>
              <Input
                id="chargeAmount"
                type="number"
                value={chargeForm.amount}
                onChange={(e) => setChargeForm({ ...chargeForm, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>
            {!editingChargeId && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="taxType">Tax Application</Label>
                  <select
                    id="taxType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={chargeForm.taxType}
                    onChange={(e) => setChargeForm({ ...chargeForm, taxType: e.target.value })}
                  >
                    <option value="Excluded">Tax Excluded</option>
                    <option value="Included">Tax Included</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="taxPercent">Tax Percentage</Label>
                  <select
                    id="taxPercent"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={chargeForm.taxPercent}
                    onChange={(e) => setChargeForm({ ...chargeForm, taxPercent: e.target.value })}
                  >
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChargeModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              const baseAmount = Number(chargeForm.amount) || 0;
              
              if (editingChargeId) {
                setCharges(charges.map(c => c.id === editingChargeId ? { ...c, description: chargeForm.description, amount: baseAmount } : c));
                addLog(`Updated Folio Charge: ${chargeForm.description} for ₹${baseAmount}`);
              } else {
                const taxPercent = Number(chargeForm.taxPercent) || 0;
                let finalAmount = baseAmount;
                let taxAmount = 0;
                
                if (chargeForm.taxType === "Excluded") {
                  taxAmount = baseAmount * (taxPercent / 100);
                  finalAmount = baseAmount;
                } else {
                  taxAmount = baseAmount - (baseAmount / (1 + taxPercent / 100));
                  finalAmount = baseAmount - taxAmount;
                }

                const newCharges: FolioCharge[] = [];
                const chargeId = `c${Date.now()}`;
                newCharges.push({
                  id: chargeId,
                  date: new Date().toLocaleDateString(),
                  description: chargeForm.description,
                  qty: 1,
                  amount: finalAmount
                });
                
                if (taxAmount > 0) {
                  newCharges.push({
                    id: `${chargeId}-tax`,
                    date: new Date().toLocaleDateString(),
                    description: `${chargeForm.description} Tax (${chargeForm.taxPercent}%)`,
                    qty: 1,
                    amount: taxAmount
                  });
                }
                
                setCharges([...charges, ...newCharges]);
                addLog(`Added Folio Charge: ${chargeForm.description} for ₹${baseAmount}`);
              }
              setIsChargeModalOpen(false);
            }}>
              {editingChargeId ? "Save Changes" : "Add Charge"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPrintModalOpen} onOpenChange={setIsPrintModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Print Document</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="docType">Select Document Type</Label>
              <select
                id="docType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={printDocumentType}
                onChange={(e) => setPrintDocumentType(e.target.value)}
              >
                <option value="Estimated Invoice">Estimated Invoice</option>
                <option value="Final Invoice">Final Invoice (Bill)</option>
                <option value="Guest Voucher">Guest Voucher</option>
                <option value="Registration Card">Registration Card</option>
              </select>
            </div>
            <p className="text-[12px] text-text-secondary mt-2">
              This will generate a printable version of the {printDocumentType} based on the current reservation details.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPrintModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setIsPrintModalOpen(false);
              setTimeout(() => window.print(), 300);
            }}>
              <Printer className="h-3.5 w-3.5 mr-2" /> Print Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSpecialRequestsEditOpen} onOpenChange={setIsSpecialRequestsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Special Requests</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="specialRequests">Requests & Preferences</Label>
              <textarea
                id="specialRequests"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={editSpecialRequests}
                onChange={(e) => setEditSpecialRequests(e.target.value)}
                placeholder="Enter any special requests, dietary requirements, or room preferences..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSpecialRequestsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setSpecialRequestsOverride(editSpecialRequests);
              setIsSpecialRequestsEditOpen(false);
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
