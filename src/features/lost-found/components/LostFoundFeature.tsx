import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import {
  PageHeader,
  KpiCard,
  Button,
  Card,
  CardHeader,
  StatusBadge,
} from "@/components/ui/Primitives";
import { useLostFoundItemsQuery, useSaveLostFoundItemMutation } from "@/services/mock/queries";

export function LostFoundFeature() {
  const { data: lostFoundItems = [] } = useLostFoundItemsQuery();
  const saveMutation = useSaveLostFoundItemMutation();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLogItemOpen, setIsLogItemOpen] = useState(false);
  
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemLoc, setNewItemLoc] = useState("");
  const [newItemDetail, setNewItemDetail] = useState("");
  const [newItemImage, setNewItemImage] = useState("");
  
  const selected = lostFoundItems.find((i) => i.id === selectedId) ?? lostFoundItems[0] ?? null;
  const open = lostFoundItems.filter((i) => i.status === "Open" || i.status === "Matched").length;

  const handleSave = () => {
    if (!newItemDesc || !newItemLoc) {
      toast.error("Please fill in the description and location.");
      return;
    }
    const newItem = {
      id: `LF-${Math.floor(Math.random() * 1000) + 400}`,
      description: newItemDesc,
      location: newItemLoc,
      itemDetail: newItemDetail,
      imageUrl: newItemImage || undefined,
      foundAt: "Today",
      status: "Open" as const,
    };
    saveMutation.mutate(newItem);
    setSelectedId(newItem.id);
    toast.success("Item logged successfully.");
    setIsLogItemOpen(false);
    setNewItemDesc("");
    setNewItemLoc("");
    setNewItemDetail("");
    setNewItemImage("");
  };

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Lost & Found"
        description="Log, match, and release found items."
        actions={
          <Button size="sm" onClick={() => setIsLogItemOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            Log item
          </Button>
        }
      />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="Open items" value={String(open)} accent="brand" />
          <KpiCard label="Awaiting claim" value="1" accent="warning" />
          <KpiCard label="Released · MTD" value="12" accent="success" />
          <KpiCard label="Match suggestions" value="1" accent="info" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <Card>
            <CardHeader title="Registry" />
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border bg-surface-2/40 text-left">
                  {["ID", "Item", "Location", "Found", "Status"].map((h) => (
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
                {lostFoundItems.map((i) => (
                  <tr
                    key={i.id}
                    onClick={() => setSelectedId(i.id)}
                    className={`cursor-pointer border-b border-border-subtle hover:bg-surface-2/50 ${selected?.id === i.id ? "bg-primary-tint/30" : ""}`}
                  >
                    <td className="px-4 py-3 font-mono text-[12px]">{i.id}</td>
                    <td className="px-4 py-3 font-medium">{i.description}</td>
                    <td className="px-4 py-3 text-text-secondary">{i.location}</td>
                    <td className="px-4 py-3">{i.foundAt}</td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        tone={
                          i.status === "Open"
                            ? "warning"
                            : i.status === "Matched"
                              ? "info"
                              : "success"
                        }
                      >
                        {i.status}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Card>
            <CardHeader title="Item details" />
            {selected ? (
              <div className="flex flex-col text-[13px]">
                {selected.imageUrl && (
                  <div className="relative h-48 w-full border-b border-border-subtle bg-surface-2">
                    <img 
                      src={selected.imageUrl} 
                      alt={selected.description} 
                      className="absolute inset-0 h-full w-full object-cover" 
                    />
                  </div>
                )}
                <div className="p-5 space-y-5">
                  <div>
                    <h3 className="text-[16px] font-semibold text-text-primary">{selected.description}</h3>
                    <div className="mt-1 flex items-center gap-2 text-[12px] text-text-secondary">
                      <span>{selected.location}</span>
                      <span>&middot;</span>
                      <span>{selected.foundAt}</span>
                    </div>
                  </div>
                  
                  {selected.itemDetail && (
                    <div>
                      <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-text-secondary">Item Description</div>
                      <p className="leading-relaxed text-text-primary">{selected.itemDetail}</p>
                    </div>
                  )}

                  {selected.roomDetail && (
                    <div>
                      <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-text-secondary">Found Location Details</div>
                      <p className="leading-relaxed text-text-primary">{selected.roomDetail}</p>
                    </div>
                  )}

                  <div className="border-t border-border-subtle pt-4">
                    {selected.guestMatch ? (
                      <div className="rounded-md border border-border-subtle bg-surface-2/40 p-3">
                        <div className="text-[11px] font-medium uppercase tracking-wider text-text-secondary">Suggested match</div>
                        <div className="mt-1 font-medium">{selected.guestMatch}</div>
                        <Button size="sm" className="mt-3 w-full justify-center">
                          Notify guest
                        </Button>
                      </div>
                    ) : (
                      <div className="rounded-md border border-dashed border-border-subtle p-4 text-center">
                        <p className="text-[12px] text-text-secondary">No match found in current records.</p>
                        <Button variant="outline" size="sm" className="mt-3 w-full justify-center">Search historical stays</Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 text-[13px] text-text-secondary">No items logged yet.</div>
            )}
          </Card>
        </div>
      </div>

      {isLogItemOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity" 
            onClick={() => setIsLogItemOpen(false)} 
          />
          <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-hidden border-l border-border bg-surface shadow-e3 animate-in slide-in-from-right duration-200">
            <div className="shrink-0 border-b border-border-subtle px-5 py-4">
              <div className="text-[16px] font-semibold text-text-primary">Log new item</div>
              <div className="text-[12px] text-text-secondary">
                Enter details for the found item to add it to the registry.
              </div>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              <label className="block">
                <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-text-secondary">
                  Short Description *
                </div>
                <input
                  type="text"
                  placeholder="e.g. iPhone 12 Pro"
                  className="h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px]"
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                />
              </label>
              <label className="block">
                <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-text-secondary">
                  Location Found *
                </div>
                <input
                  type="text"
                  placeholder="e.g. Room 204 or Lobby"
                  className="h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px]"
                  value={newItemLoc}
                  onChange={(e) => setNewItemLoc(e.target.value)}
                />
              </label>
              <label className="block">
                <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-text-secondary">
                  Detailed Description
                </div>
                <textarea
                  placeholder="Color, brand, distinguishing features, etc."
                  className="w-full rounded-md border border-border bg-surface p-3 text-[13px] min-h-[100px]"
                  value={newItemDetail}
                  onChange={(e) => setNewItemDetail(e.target.value)}
                />
              </label>
              <label className="block">
                <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-text-secondary">
                  Upload Image (Optional)
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-[13px] file:mr-4 file:rounded-md file:border-0 file:bg-surface-2 file:px-4 file:py-2 file:text-[13px] file:font-medium file:text-text-primary hover:file:bg-surface-2/80"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewItemImage(URL.createObjectURL(file));
                    } else {
                      setNewItemImage("");
                    }
                  }}
                />
                {newItemImage && (
                  <div className="mt-2 h-24 w-full overflow-hidden rounded-md border border-border-subtle bg-surface-2">
                    <img src={newItemImage} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </label>
            </div>
            <div className="shrink-0 flex justify-end gap-2 border-t border-border-subtle bg-surface-2/50 px-5 py-4">
              <Button variant="outline" size="sm" onClick={() => setIsLogItemOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save item
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default LostFoundFeature;
