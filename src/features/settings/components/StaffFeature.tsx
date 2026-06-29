import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader, Card, CardHeader, StatusBadge, Button } from "@/components/ui/Primitives";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { toast } from "sonner";

const staff = [
  {
    name: "Aarav Malhotra",
    role: "General Manager",
    dept: "Leadership",
    shift: "—",
    status: "Active",
  },
  {
    name: "Neha Kapoor",
    role: "Front Desk Lead",
    dept: "Front Office",
    shift: "Morning",
    status: "On duty",
  },
  {
    name: "Priya Reddy",
    role: "Housekeeping Supervisor",
    dept: "Housekeeping",
    shift: "Morning",
    status: "On duty",
  },
  {
    name: "Lakshmi Iyer",
    role: "Housekeeper",
    dept: "Housekeeping",
    shift: "Morning",
    status: "On duty",
  },
  { name: "Sunil Rao", role: "Concierge", dept: "Front Office", shift: "Evening", status: "Off" },
  {
    name: "Anjali Bose",
    role: "Housekeeper",
    dept: "Housekeeping",
    shift: "Evening",
    status: "Off",
  },
  {
    name: "Rahul Singh",
    role: "Maintenance Lead",
    dept: "Engineering",
    shift: "On-call",
    status: "Active",
  },
];

export function StaffFeature() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);

  const handleAdd = () => {
    setEditingStaff(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (s: any) => {
    setEditingStaff(s);
    setIsEditorOpen(true);
  };

  const handleSave = () => {
    toast.success(editingStaff ? "Staff profile and permissions updated" : "New staff member added successfully");
    setIsEditorOpen(false);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Staff Management"
        description="Roster, roles, and access permissions."
        actions={
          <Button size="sm" onClick={handleAdd}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add staff
          </Button>
        }
      />
      <div className="p-6">
        <Card>
          <CardHeader title="Staff roster" hint={`${staff.length} members`} />
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-surface-2/40 text-left">
                {["Name", "Role", "Department", "Shift", "Status", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.name} className="border-b border-border-subtle hover:bg-surface-2/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
                        {s.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <span className="font-medium text-text-primary">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-primary">{s.role}</td>
                  <td className="px-4 py-3 text-text-secondary">{s.dept}</td>
                  <td className="px-4 py-3 text-text-secondary">{s.shift}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      tone={
                        s.status === "On duty"
                          ? "success"
                          : s.status === "Active"
                            ? "info"
                            : "neutral"
                      }
                    >
                      {s.status}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-[12px] font-medium text-primary hover:underline cursor-pointer" onClick={() => handleEdit(s)}>
                      Edit & Permissions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <Sheet open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingStaff ? "Edit Staff Profile" : "Add Staff Member"}</SheetTitle>
          </SheetHeader>
          
          <div className="py-6 space-y-6">
            {/* Profile Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary border-b border-border-subtle pb-1">Profile Details</h3>
              <div>
                <label className="text-[11px] uppercase text-text-secondary font-medium mb-1 block">Full Name</label>
                <input type="text" defaultValue={editingStaff?.name || ""} className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-[13px] outline-none focus:border-primary" placeholder="e.g. John Doe" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase text-text-secondary font-medium mb-1 block">Email Address</label>
                  <input type="email" defaultValue="" className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-[13px] outline-none focus:border-primary" placeholder="john@hotel.com" />
                </div>
                <div>
                  <label className="text-[11px] uppercase text-text-secondary font-medium mb-1 block">Phone Number</label>
                  <input type="text" defaultValue="" className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-[13px] outline-none focus:border-primary" placeholder="+1 555-0192" />
                </div>
              </div>
            </div>

            {/* Role & Department */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary border-b border-border-subtle pb-1">Employment Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase text-text-secondary font-medium mb-1 block">Department</label>
                  <select defaultValue={editingStaff?.dept || ""} className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-[13px] outline-none focus:border-primary">
                    <option value="">Select Department...</option>
                    <option>Leadership</option>
                    <option>Front Office</option>
                    <option>Housekeeping</option>
                    <option>Engineering</option>
                    <option>Food & Beverage</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] uppercase text-text-secondary font-medium mb-1 block">Role / Title</label>
                  <input type="text" defaultValue={editingStaff?.role || ""} className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-[13px] outline-none focus:border-primary" placeholder="e.g. Front Desk Agent" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase text-text-secondary font-medium mb-1 block">Status</label>
                  <select defaultValue={editingStaff?.status || "Active"} className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-[13px] outline-none focus:border-primary">
                    <option>Active</option>
                    <option>On duty</option>
                    <option>Off</option>
                    <option>Terminated</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] uppercase text-text-secondary font-medium mb-1 block">Shift Preference</label>
                  <select defaultValue={editingStaff?.shift || "Morning"} className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-[13px] outline-none focus:border-primary">
                    <option>Morning</option>
                    <option>Evening</option>
                    <option>Night</option>
                    <option>On-call</option>
                    <option>—</option>
                  </select>
                </div>
              </div>
            </div>

            {/* System Access & Permissions */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary border-b border-border-subtle pb-1">System Permissions</h3>
              
              <div className="flex items-center justify-between bg-surface-2 p-3 rounded-md border border-border-subtle">
                <div>
                  <h4 className="text-[13px] font-medium text-text-primary">Enable System Login</h4>
                  <p className="text-[11px] text-text-secondary">Allow this user to access the PMS dashboard.</p>
                </div>
                <input type="checkbox" defaultChecked={true} className="rounded border-border text-primary focus:ring-primary h-4 w-4" />
              </div>

              <div>
                <label className="text-[11px] uppercase text-text-secondary font-medium mb-2 block mt-4">Module Access</label>
                <div className="space-y-2">
                  {[
                    "Front Desk Operations",
                    "Reservations Management",
                    "Housekeeping & Maintenance",
                    "Night Audit",
                    "Billing & Accounts Receivable",
                    "Reporting & Analytics",
                    "System Settings (Admin)"
                  ].map(module => (
                    <div key={module} className="flex items-center gap-2">
                      <input type="checkbox" id={`module-${module}`} defaultChecked={module !== "System Settings (Admin)"} className="rounded border-border text-primary focus:ring-primary" />
                      <label htmlFor={`module-${module}`} className="text-[12px] text-text-primary cursor-pointer select-none">{module}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          <SheetFooter>
            <Button variant="outline" onClick={() => setIsEditorOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Profile</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
export default StaffFeature;
