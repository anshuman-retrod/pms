import { useState } from "react";
import { type GroupBlock } from "@/types/pms";
import { PageHeader, Card, CardHeader, Button, StatusBadge } from "@/components/ui/Primitives";
import { ArrowLeft, Users, CalendarDays, CreditCard, FileText } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { toast } from "sonner";

interface GroupDetailProps {
  group: GroupBlock;
  onBack: () => void;
}

export function GroupDetail({ group, onBack }: GroupDetailProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "matrix" | "rooming" | "billing">("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: <FileText className="h-4 w-4" /> },
    { id: "matrix", label: "Room Block & Rates", icon: <CalendarDays className="h-4 w-4" /> },
    { id: "rooming", label: "Rooming List", icon: <Users className="h-4 w-4" /> },
    { id: "billing", label: "Billing & Routing", icon: <CreditCard className="h-4 w-4" /> },
  ] as const;

  return (
    <div>
      <PageHeader
        eyebrow="Group Booking"
        title={group.name}
        description={`Code: ${group.groupCode || "—"} | Dates: ${group.dates}`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Back to Groups
            </Button>
            <StatusBadge tone={group.status === "Definite" || group.status === "Actualized" ? "success" : group.status === "Tentative" ? "warning" : "info"}>
              {group.status}
            </StatusBadge>
          </>
        }
      />

      <div className="px-6 border-b border-border-subtle bg-surface flex gap-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id 
                ? "border-primary text-primary" 
                : "border-transparent text-text-secondary hover:text-text-primary hover:border-border"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === "overview" && <OverviewTab group={group} />}
        {activeTab === "matrix" && <RoomMatrixTab group={group} />}
        {activeTab === "rooming" && <RoomingListTab group={group} />}
        {activeTab === "billing" && <BillingTab group={group} />}
      </div>
    </div>
  );
}

function OverviewTab({ group }: { group: GroupBlock }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader title="Group Details" />
        <div className="p-4 space-y-4 text-sm">
          <div className="flex justify-between border-b border-border-subtle pb-2">
            <span className="text-text-secondary">Group Name</span>
            <span className="font-medium text-text-primary">{group.name}</span>
          </div>
          <div className="flex justify-between border-b border-border-subtle pb-2">
            <span className="text-text-secondary">Block Code</span>
            <span className="font-mono text-text-primary">{group.groupCode || "—"}</span>
          </div>
          <div className="flex justify-between border-b border-border-subtle pb-2">
            <span className="text-text-secondary">Sales Manager</span>
            <span className="font-medium text-text-primary">{group.salesManager || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Status</span>
            <StatusBadge tone={group.status === "Definite" ? "success" : "warning"}>{group.status}</StatusBadge>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Dates & Cut-off" />
        <div className="p-4 space-y-4 text-sm">
          <div className="flex justify-between border-b border-border-subtle pb-2">
            <span className="text-text-secondary">Dates</span>
            <span className="font-medium text-text-primary">{group.dates}</span>
          </div>
          <div className="flex justify-between border-b border-border-subtle pb-2">
            <span className="text-text-secondary">Cut-off Policy</span>
            <span className="font-medium text-text-primary">{group.cutOffType === "RollingDays" ? `Rolling (${group.cutOffRollingDays} days)` : "Fixed Date"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Cut-off Date</span>
            <span className="font-medium text-[var(--color-error)]">{group.cutOff}</span>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Contact Information" />
        <div className="p-4 space-y-4 text-sm">
          <div className="flex justify-between border-b border-border-subtle pb-2">
            <span className="text-text-secondary">Primary Contact</span>
            <span className="font-medium text-text-primary">{group.contactName || "—"}</span>
          </div>
          <div className="flex justify-between border-b border-border-subtle pb-2">
            <span className="text-text-secondary">Email</span>
            <span className="font-medium text-primary hover:underline cursor-pointer">{group.contactEmail || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Phone</span>
            <span className="font-medium text-text-primary">{group.contactPhone || "—"}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function RoomMatrixTab({ group }: { group: GroupBlock }) {
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [localMatrix, setLocalMatrix] = useState(group.roomMatrix || []);

  const handleSave = () => {
    // Generate dummy matrix to simulate setup
    const simulatedMatrix = [
      { roomType: "Deluxe King", date: "24 May", blocked: 10, pickedUp: 0, rate: 12000 },
      { roomType: "Deluxe King", date: "25 May", blocked: 10, pickedUp: 0, rate: 12000 },
      { roomType: "Executive Suite", date: "24 May", blocked: 2, pickedUp: 0, rate: 22000 },
    ];
    setLocalMatrix(simulatedMatrix);
    setIsSetupOpen(false);
    toast.success("Room block matrix configured successfully");
  };

  if (localMatrix.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16">
        <p className="text-text-secondary text-sm">No room matrix configured for this block.</p>
        <Button size="sm" className="mt-4" onClick={() => setIsSetupOpen(true)}>Setup Room Block Matrix</Button>

        <Sheet open={isSetupOpen} onOpenChange={setIsSetupOpen}>
          <SheetContent side="right" className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Setup Room Block Matrix</SheetTitle>
            </SheetHeader>
            <div className="py-6 space-y-4">
              <p className="text-sm text-text-secondary">Select the room types and base allocations for this block.</p>
              <div>
                <label className="text-[11px] uppercase text-text-secondary font-medium mb-1 block">Room Types</label>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 bg-brand/10 text-brand rounded text-sm border border-brand/20">Deluxe King</span>
                  <span className="px-3 py-1.5 bg-brand/10 text-brand rounded text-sm border border-brand/20">Executive Suite</span>
                </div>
              </div>
              <div>
                <label className="text-[11px] uppercase text-text-secondary font-medium mb-1 block">Base Negotiated Rate (Avg)</label>
                <input type="text" defaultValue="₹12,000" className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-[13px] outline-none focus:border-primary" />
              </div>
            </div>
            <SheetFooter>
              <Button variant="outline" onClick={() => setIsSetupOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Generate Matrix</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Daily Allocation Matrix" hint="Manage blocked rooms and negotiated rates by date" action={<Button size="sm" variant="outline" onClick={() => setIsSetupOpen(true)}>Edit Matrix</Button>} />
      <div className="overflow-x-auto p-4">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-2/40 text-left">
              <th className="px-4 py-2.5 font-medium text-text-secondary uppercase tracking-wider text-[10px]">Room Type</th>
              <th className="px-4 py-2.5 font-medium text-text-secondary uppercase tracking-wider text-[10px]">Date</th>
              <th className="px-4 py-2.5 font-medium text-text-secondary uppercase tracking-wider text-[10px]">Blocked</th>
              <th className="px-4 py-2.5 font-medium text-text-secondary uppercase tracking-wider text-[10px]">Picked Up</th>
              <th className="px-4 py-2.5 font-medium text-text-secondary uppercase tracking-wider text-[10px]">Available</th>
              <th className="px-4 py-2.5 font-medium text-text-secondary uppercase tracking-wider text-[10px]">Negotiated Rate</th>
            </tr>
          </thead>
          <tbody>
            {localMatrix.map((m, i) => (
              <tr key={i} className="border-b border-border-subtle hover:bg-surface-2/50">
                <td className="px-4 py-3 font-medium text-text-primary">{m.roomType}</td>
                <td className="px-4 py-3 text-text-secondary">{m.date}</td>
                <td className="px-4 py-3 font-mono">{m.blocked}</td>
                <td className="px-4 py-3 font-mono">{m.pickedUp}</td>
                <td className="px-4 py-3 font-mono text-[var(--color-success)] font-semibold">{m.blocked - m.pickedUp}</td>
                <td className="px-4 py-3 font-mono text-text-primary">₹{m.rate.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Sheet open={isSetupOpen} onOpenChange={setIsSetupOpen}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Room Block Matrix</SheetTitle>
          </SheetHeader>
          <div className="py-6 space-y-4">
            <p className="text-sm text-text-secondary">Update the matrix for this group block.</p>
            <div>
              <label className="text-[11px] uppercase text-text-secondary font-medium mb-1 block">Quick Add Room Type</label>
              <select className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-[13px] outline-none focus:border-primary">
                <option>Select a room type...</option>
                <option>Standard Room</option>
                <option>Premium Suite</option>
              </select>
            </div>
            <Button size="sm" variant="outline" className="w-full">Open Advanced Grid Editor</Button>
          </div>
        </SheetContent>
      </Sheet>
    </Card>
  );
}

function RoomingListTab({ group }: { group: GroupBlock }) {
  return (
    <Card>
      <CardHeader 
        title="Rooming List" 
        hint={`${group.pickedUp} of ${group.blocked} rooms assigned`} 
        action={
          <div className="flex gap-2">
            <Button size="sm" variant="outline">Import CSV</Button>
            <Button size="sm">Add Guest</Button>
          </div>
        }
      />
      <div className="p-16 flex flex-col items-center text-center">
        <Users className="h-10 w-10 text-text-disabled mb-4" />
        <h3 className="text-text-primary font-medium">No guests added yet</h3>
        <p className="text-sm text-text-secondary mt-1 max-w-md">Add guests manually or import a rooming list CSV to assign guests to the blocked inventory.</p>
      </div>
    </Card>
  );
}

function BillingTab({ group }: { group: GroupBlock }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader title="Master Account Settings" />
        <div className="p-4 space-y-4 text-sm">
          <div className="flex justify-between border-b border-border-subtle pb-2">
            <span className="text-text-secondary">Master Account ID</span>
            <span className="font-mono text-primary cursor-pointer hover:underline">{group.masterAccountId || "Not assigned"}</span>
          </div>
          <div className="flex justify-between border-b border-border-subtle pb-2">
            <span className="text-text-secondary">Routing Instructions</span>
            <span className="font-medium text-text-primary">{group.routingInstruction || "Individual Pays All"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Payment Status</span>
            <StatusBadge tone="warning">Deposit Pending</StatusBadge>
          </div>
        </div>
      </Card>
      
      <Card>
        <CardHeader title="Payment & Deposit Schedule" action={<Button size="sm" variant="outline">Add Schedule</Button>} />
        <div className="p-12 flex flex-col items-center text-center">
          <CreditCard className="h-8 w-8 text-text-disabled mb-3" />
          <p className="text-sm text-text-secondary">No deposit schedule configured.</p>
        </div>
      </Card>
    </div>
  );
}
