import { useState } from "react";
import { Plus } from "lucide-react";
import {
  PageHeader,
  Card,
  CardHeader,
  KpiCard,
  StatusBadge,
  Button,
} from "@/components/ui/Primitives";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { toast } from "sonner";

const types = [
  { name: "Heritage Suite", count: 6, base: 35000, occ: 92 },
  { name: "Premier Suite", count: 14, base: 22000, occ: 84 },
  { name: "Executive", count: 24, base: 14400, occ: 78 },
  { name: "Deluxe King", count: 38, base: 12000, occ: 71 },
  { name: "Deluxe Twin", count: 38, base: 9800, occ: 64 },
];

export function RoomsFeature() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingType, setEditingType] = useState<any>(null);

  const handleAdd = () => {
    setEditingType(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (type: any) => {
    setEditingType(type);
    setIsEditorOpen(true);
  };

  const handleSave = () => {
    toast.success(editingType ? "Room type updated successfully" : "Room type created successfully");
    setIsEditorOpen(false);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Rooms & Inventory"
        description="Room type configuration, base rates, and live availability."
        actions={
          <Button size="sm" onClick={handleAdd}>
            <Plus className="h-3.5 w-3.5" />
            Add room type
          </Button>
        }
      />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <KpiCard label="Total Rooms" value="120" accent="info" />
          <KpiCard label="Room Types" value="5" accent="brand" />
          <KpiCard label="Avg Occupancy" value="78.4%" accent="success" />
          <KpiCard label="OOO" value="6" accent="warning" />
        </div>

        <Card>
          <CardHeader title="Room types" />
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-surface-2/40 text-left">
                {["Type", "Inventory", "Base rate", "Occupancy · MTD", "Status", ""].map((h) => (
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
              {types.map((t) => (
                <tr key={t.name} className="border-b border-border-subtle hover:bg-surface-2/50">
                  <td className="px-4 py-3 font-medium text-text-primary">{t.name}</td>
                  <td className="px-4 py-3 font-mono text-text-primary">{t.count} rooms</td>
                  <td className="px-4 py-3 font-mono text-text-primary">
                    ₹{t.base.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-32 overflow-hidden rounded-full bg-surface-2">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${t.occ}%` }}
                        />
                      </div>
                      <span className="font-mono text-[12px] text-text-secondary">{t.occ}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge tone="success">Selling</StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-[12px] font-medium text-primary hover:underline cursor-pointer" onClick={() => handleEdit(t)}>
                      Configure
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
            <SheetTitle>{editingType ? "Configure Room Type" : "Add Room Type"}</SheetTitle>
          </SheetHeader>
          <div className="py-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary border-b border-border-subtle pb-1">General Info</h3>
              <div>
                <label className="text-[11px] uppercase text-text-secondary font-medium mb-1 block">Room Type Name</label>
                <input type="text" defaultValue={editingType?.name || ""} className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-[13px] outline-none focus:border-primary" placeholder="e.g. Deluxe Suite" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase text-text-secondary font-medium mb-1 block">Inventory Count</label>
                  <input type="number" defaultValue={editingType?.count || ""} className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-[13px] outline-none focus:border-primary" placeholder="0" />
                </div>
                <div>
                  <label className="text-[11px] uppercase text-text-secondary font-medium mb-1 block">Base Rate (₹)</label>
                  <input type="number" defaultValue={editingType?.base || ""} className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-[13px] outline-none focus:border-primary" placeholder="0.00" />
                </div>
              </div>
              <div>
                <label className="text-[11px] uppercase text-text-secondary font-medium mb-1 block">Description</label>
                <textarea className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-[13px] outline-none focus:border-primary h-20" placeholder="Room amenities and features..." />
              </div>
              <div>
                <label className="text-[11px] uppercase text-text-secondary font-medium mb-1 block">Room Images</label>
                <input type="file" multiple accept="image/*" className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-[13px] outline-none focus:border-primary file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-[11px] file:bg-primary/10 file:text-primary file:font-medium" />
                <p className="text-[10px] text-text-secondary mt-1">Select multiple images to upload to the gallery.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-1">
                <h3 className="text-sm font-semibold text-text-primary">Physical Rooms</h3>
                <span className="text-[11px] font-medium px-2 py-0.5 bg-surface-2 rounded text-text-secondary">
                  {editingType?.count || 0} Rooms
                </span>
              </div>
              <div>
                <label className="text-[11px] uppercase text-text-secondary font-medium mb-1 block">Assign Room Numbers</label>
                <textarea 
                  className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-[13px] outline-none focus:border-primary h-20" 
                  placeholder="Enter comma-separated room numbers (e.g., 101, 102, 103, 104...)" 
                />
                <p className="text-[10px] text-text-secondary mt-1">
                  Enter the specific room numbers that belong to this room type. Separate multiple rooms with commas.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary border-b border-border-subtle pb-1">Occupancy Limits</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase text-text-secondary font-medium mb-1 block">Max Adults</label>
                  <input type="number" defaultValue="2" className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-[13px] outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-[11px] uppercase text-text-secondary font-medium mb-1 block">Max Children</label>
                  <input type="number" defaultValue="1" className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-[13px] outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-[11px] uppercase text-text-secondary font-medium mb-1 block">Extra Adult (₹)</label>
                  <input type="number" defaultValue="1500" className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-[13px] outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-[11px] uppercase text-text-secondary font-medium mb-1 block">Extra Child (₹)</label>
                  <input type="number" defaultValue="800" className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-[13px] outline-none focus:border-primary" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary border-b border-border-subtle pb-1">Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Free Wi-Fi", "Air Conditioning", "Mini Bar", "Room Service", 
                  "Flat-screen TV", "Safe Deposit Box", "Coffee Maker", "Bathtub",
                  "Hairdryer", "Ironing Board", "Balcony / Terrace", "Work Desk"
                ].map(amenity => (
                  <div key={amenity} className="flex items-center gap-2">
                    <input type="checkbox" id={`amenity-${amenity}`} className="rounded border-border text-primary focus:ring-primary" />
                    <label htmlFor={`amenity-${amenity}`} className="text-[12px] text-text-primary cursor-pointer select-none">{amenity}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary border-b border-border-subtle pb-1">Meal Plans</h3>
              <div className="space-y-3">
                {[
                  { id: "ep", name: "EP (Room Only)", price: 0 },
                  { id: "cp", name: "CP (Breakfast)", price: 500 },
                  { id: "map", name: "MAP (Half Board)", price: 1200 },
                  { id: "ap", name: "AP (Full Board)", price: 1800 },
                ].map(plan => (
                  <div key={plan.id} className="flex items-center gap-3 bg-surface-2/30 p-2 rounded border border-border-subtle">
                    <input type="checkbox" id={plan.id} defaultChecked={plan.id !== "ap"} className="rounded border-border text-primary focus:ring-primary" />
                    <label htmlFor={plan.id} className="text-[13px] font-medium text-text-primary flex-1">{plan.name}</label>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-text-secondary">₹</span>
                      <input type="number" defaultValue={plan.price} className="w-20 rounded border border-border-subtle bg-surface px-2 py-1 text-[12px] outline-none focus:border-primary" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary border-b border-border-subtle pb-1">Settings</h3>
              <div>
                <label className="text-[11px] uppercase text-text-secondary font-medium mb-1 block">Status</label>
                <select className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-[13px] outline-none focus:border-primary">
                  <option>Active / Selling</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsEditorOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
export default RoomsFeature;
