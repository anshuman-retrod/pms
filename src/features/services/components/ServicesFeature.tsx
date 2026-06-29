import { useState } from "react";
import {
  PageHeader,
  Card,
  CardHeader,
  Button,
  StatusBadge,
  KpiCard,
} from "@/components/ui/Primitives";
import { Plus } from "lucide-react";
import { serviceCatalog } from "@/features/core/data/catalog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const statusTone: Record<string, "success" | "warning" | "neutral"> = {
  Active: "success",
  Seasonal: "warning",
  Draft: "neutral",
};

export function ServicesFeature() {
  const [services, setServices] = useState<any[]>([...serviceCatalog]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newService, setNewService] = useState({ name: "", category: "Add-On", price: "", status: "Active" });

  const handleAddService = () => {
    if (!newService.name || !newService.price) return;
    
    const id = `SV-${Math.floor(100 + Math.random() * 900)}`;
    setServices([{ id, ...newService }, ...services]);
    setNewService({ name: "", category: "Add-On", price: "", status: "Active" });
    setIsDialogOpen(false);
  };

  const activeCount = services.filter(s => s.status === "Active").length;
  const seasonalCount = services.filter(s => s.status === "Seasonal").length;
  const draftCount = services.filter(s => s.status === "Draft").length;

  return (
    <div>
      <PageHeader
        eyebrow="Commercial"
        title="Services"
        description="Unified service catalog for add-ons, concierge, and transport offerings."
        actions={
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            New service
          </Button>
        }
      />

      <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <SheetContent side="right" className="w-[400px] sm:max-w-[400px]">
          <SheetHeader>
            <SheetTitle>Add New Service</SheetTitle>
          </SheetHeader>
          <div className="grid gap-5 py-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                placeholder="e.g. Spa Session"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                placeholder="e.g. ₹2,500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={newService.category}
                onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Add-On">Add-On</option>
                <option value="Concierge">Concierge</option>
                <option value="Transport">Transport</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={newService.status}
                onChange={(e) => setNewService({ ...newService, status: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Active">Active</option>
                <option value="Seasonal">Seasonal</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
          <SheetFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddService}>Save Service</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <div className="responsive-page-x space-y-5 py-4 sm:space-y-6 sm:py-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiCard label="Catalog items" value={services.length.toString()} accent="brand" />
          <KpiCard label="Active" value={activeCount.toString()} accent="success" />
          <KpiCard label="Seasonal" value={seasonalCount.toString()} accent="warning" />
          <KpiCard label="Draft" value={draftCount.toString()} accent="info" />
        </div>

        <Card>
          <CardHeader title="Service catalog" hint="Cross-domain monetization controls" />
          <div className="table-scroll-shadow overflow-x-auto">
            <table className="w-full min-w-[760px] text-[13px]">
              <thead>
                <tr className="border-b border-border bg-surface-2/40 text-left">
                  {["Service ID", "Category", "Service", "Price", "Status"].map((h) => (
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
                {services.map((service) => (
                  <tr
                    key={service.id}
                    className="border-b border-border-subtle hover:bg-surface-2/40"
                  >
                    <td className="px-4 py-3 font-mono text-[12px]">{service.id}</td>
                    <td className="px-4 py-3 text-text-secondary">{service.category}</td>
                    <td className="px-4 py-3 font-medium text-text-primary">{service.name}</td>
                    <td className="px-4 py-3 font-mono text-text-secondary">{service.price}</td>
                    <td className="px-4 py-3">
                      <StatusBadge tone={statusTone[service.status] ?? "neutral"}>
                        {service.status}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ServicesFeature;
