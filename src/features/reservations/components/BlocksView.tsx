import { Card, CardHeader, StatusBadge, Button } from "@/components/ui/Primitives";
import { type GroupBlock } from "@/types/pms";
import { useState } from "react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Plus } from "lucide-react";

export function BlocksView({ blocks }: { blocks: GroupBlock[] }) {
  const [localBlocks, setLocalBlocks] = useState(blocks);
  const [filterMonth, setFilterMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [blockPurpose, setBlockPurpose] = useState("Group");
  const [blockName, setBlockName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [roomType, setRoomType] = useState("All Room Types");
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [roomCount, setRoomCount] = useState("1");
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  const openAddBlock = () => {
    setEditingBlockId(null);
    setBlockName("");
    setStartDate("");
    setEndDate("");
    setRoomCount("1");
    setSelectedRooms([]);
    setIsAddOpen(true);
  };

  const openEditBlock = (b: GroupBlock) => {
    setEditingBlockId(b.id);
    setBlockName(b.name);
    // Parse dates if they are in "YYYY-MM-DD to YYYY-MM-DD" format, else clear
    const parts = b.dates.split(" to ");
    setStartDate(parts[0] || "");
    setEndDate(parts[1] || "");
    setRoomCount(b.blocked.toString());
    setSelectedRooms([]); 
    setIsAddOpen(true);
  };

  const availableRooms = [
    { number: "101", floor: 1 }, { number: "102", floor: 1 }, { number: "103", floor: 1 }, { number: "104", floor: 1 },
    { number: "201", floor: 2 }, { number: "202", floor: 2 }, { number: "203", floor: 2 }, { number: "204", floor: 2 },
    { number: "301", floor: 3 }, { number: "302", floor: 3 }, { number: "303", floor: 3 }, { number: "304", floor: 3 },
  ];

  const toggleRoom = (num: string) => {
    setSelectedRooms((prev) => 
      prev.includes(num) ? prev.filter((r) => r !== num) : [...prev, num]
    );
  };

  const handleAddBlock = () => {
    if (!blockName || !startDate || !endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingBlockId) {
      setLocalBlocks(localBlocks.map(b => 
        b.id === editingBlockId 
          ? { 
              ...b, 
              name: blockName, 
              dates: `${startDate} to ${endDate}`, 
              blocked: selectedRooms.length > 0 ? selectedRooms.length : parseInt(roomCount) || 1,
              cutOff: endDate
            } 
          : b
      ));
      toast.success(`Block updated successfully!`);
    } else {
      const newBlock: GroupBlock = {
        id: `BLK-${Math.floor(1000 + Math.random() * 9000)}`,
        name: blockName,
        dates: `${startDate} to ${endDate}`,
        blocked: selectedRooms.length > 0 ? selectedRooms.length : parseInt(roomCount) || 1,
        pickedUp: 0,
        cutOff: endDate,
        status: "Open"
      };

      setLocalBlocks([...localBlocks, newBlock]);
      toast.success(`Block for ${blockName} created successfully!`);
    }
    
    setIsAddOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader 
          title="Group blocks & allotments" 
          hint={`${localBlocks.length} active blocks`} 
          action={
            <div className="flex items-center gap-3">
              <input 
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="h-8 rounded-md border border-border bg-surface px-2 text-sm focus:border-primary focus:outline-none"
              />
              <Button size="sm" onClick={openAddBlock}>
                <Plus className="h-4 w-4 mr-1" />
                Add Block
              </Button>
            </div>
          }
        />
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-surface-2/40 text-left">
              {["Block", "Group", "Dates", "Blocked", "Pickup", "Cut-off", "Status", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {localBlocks.map((b) => {
              const pickupPct = Math.round((b.pickedUp / b.blocked) * 100);
              return (
                <tr key={b.id} className="border-b border-border-subtle hover:bg-surface-2/50">
                  <td className="px-4 py-3 font-mono text-[12px]">{b.id}</td>
                  <td className="px-4 py-3 font-medium text-text-primary">{b.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{b.dates}</td>
                  <td className="px-4 py-3 font-mono">{b.blocked}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-text-primary">{b.pickedUp}</span>
                    <span className="ml-1 text-[11px] text-text-secondary">({pickupPct}%)</span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{b.cutOff}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      tone={
                        b.status === "Open" ? "info" : b.status === "Closed" ? "success" : "neutral"
                      }
                    >
                      {b.status}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openEditBlock(b)}
                      className="text-[12px] font-medium text-primary hover:underline"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      </Card>

      <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
        <SheetContent side="right" className="sm:max-w-md w-full overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingBlockId ? "Edit Block" : "Add Block"}</SheetTitle>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">Purpose</label>
              <select 
                className="col-span-3 h-9 w-full rounded-md border border-border bg-surface px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                value={blockPurpose}
                onChange={(e) => setBlockPurpose(e.target.value)}
              >
                <option value="Group">Group Booking</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Internal">Internal Use</option>
                <option value="Allotment">Allotment</option>
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">Block Reason</label>
              <input 
                type="text"
                placeholder={blockPurpose === "Maintenance" ? "e.g. Plumbing Repair" : "e.g. Wedding Group"}
                className="col-span-3 h-9 w-full rounded-md border border-border bg-surface px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                value={blockName}
                onChange={(e) => setBlockName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">Room Type</label>
              <select 
                className="col-span-3 h-9 w-full rounded-md border border-border bg-surface px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option value="All Room Types">All Room Types</option>
                <option value="Deluxe King">Deluxe King</option>
                <option value="Executive Suite">Executive Suite</option>
              </select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">Start Date</label>
              <input 
                type="date"
                className="col-span-3 h-9 w-full rounded-md border border-border bg-surface px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">End Date</label>
              <input 
                type="date"
                className="col-span-3 h-9 w-full rounded-md border border-border bg-surface px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <label className="text-right text-sm font-medium pt-2">Select Rooms</label>
              <div className="col-span-3 space-y-4">
                <div className="rounded-md border border-border bg-surface p-3">
                  <div className="mb-2 text-[11px] font-medium text-text-secondary uppercase tracking-wider flex justify-between">
                    <span>Available Rooms</span>
                    <span className="text-primary">{selectedRooms.length} selected</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {availableRooms.map((room) => {
                      const isSelected = selectedRooms.includes(room.number);
                      return (
                        <button
                          key={room.number}
                          type="button"
                          onClick={() => toggleRoom(room.number)}
                          className={`flex items-center justify-center rounded border p-2 text-xs transition-colors ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary font-medium"
                              : "border-border hover:border-primary/50 text-text-secondary"
                          }`}
                        >
                          {room.number}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {selectedRooms.length === 0 && (
                  <div>
                    <label className="text-[11px] font-medium text-text-secondary uppercase tracking-wider mb-1 block">Or enter quantity directly:</label>
                    <input 
                      type="number"
                      min="1"
                      className="h-9 w-full rounded-md border border-border bg-surface px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                      value={roomCount}
                      onChange={(e) => setRoomCount(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <SheetFooter className="mt-4 border-t pt-4">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddBlock}>{editingBlockId ? "Save Changes" : "Create Block"}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
