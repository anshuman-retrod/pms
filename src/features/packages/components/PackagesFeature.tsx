import { useState } from "react";
import { Plus } from "lucide-react";
import {
  PageHeader,
  KpiCard,
  Button,
  Card,
  CardHeader,
  StatusBadge,
} from "@/components/ui/Primitives";
import {
  usePackageProductsQuery,
  useHotelPackagesQuery,
  usePackageItemsQuery,
} from "@/services/mock/queries";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PackagesFeature() {
  const { data: packageProducts = [] } = usePackageProductsQuery();
  const { data: hotelPackages = [] } = useHotelPackagesQuery();
  const { data: packageItems = [] } = usePackageItemsQuery();

  const [localPackages, setLocalPackages] = useState<any[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<any>({ name: "", price: "", inclusions: "", status: "Active" });

  const displayPackages = [
    ...localPackages,
    ...packageProducts.filter((p: any) => !localPackages.some(lp => lp.id === p.id))
  ];
  const revenue = displayPackages.reduce((a, p) => a + Number(p.price) * (p.bookingsMtd || 0), 0);
  const activeCount = displayPackages.filter((p) => p.status === "Active").length;

  const handleSavePackage = () => {
    if (!currentPackage.name || !currentPackage.price) return;
    
    if (currentPackage.id) {
      setLocalPackages([currentPackage, ...localPackages.filter(p => p.id !== currentPackage.id)]);
    } else {
      const id = `PKG-${Math.floor(1000 + Math.random() * 9000)}`;
      setLocalPackages([{ ...currentPackage, id, bookingsMtd: 0 }, ...localPackages]);
    }
    
    setCurrentPackage({ name: "", price: "", inclusions: "", status: "Active" });
    setIsSheetOpen(false);
  };

  const handleCreateNew = () => {
    setCurrentPackage({ name: "", price: "", inclusions: "", status: "Active" });
    setIsSheetOpen(true);
  };

  const handleEdit = (pkg: any) => {
    setCurrentPackage({ ...pkg });
    setIsSheetOpen(true);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Packages"
        title="Packages"
        description="Hospitality package setup"
        actions={
          <Button size="sm" onClick={handleCreateNew}>
            <Plus className="h-3.5 w-3.5" />
            Create package
          </Button>
        }
      />

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-[400px] sm:max-w-[400px]">
          <SheetHeader>
            <SheetTitle>{currentPackage.id ? "Edit Package" : "Create New Package"}</SheetTitle>
          </SheetHeader>
          <div className="grid gap-5 py-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Package Name</Label>
              <Input
                id="name"
                value={currentPackage.name}
                onChange={(e) => setCurrentPackage({ ...currentPackage, name: e.target.value })}
                placeholder="e.g. Honeymoon Special"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={currentPackage.price}
                onChange={(e) => setCurrentPackage({ ...currentPackage, price: e.target.value })}
                placeholder="e.g. 15000"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="inclusions">Inclusions</Label>
              <Input
                id="inclusions"
                value={currentPackage.inclusions}
                onChange={(e) => setCurrentPackage({ ...currentPackage, inclusions: e.target.value })}
                placeholder="e.g. Room, Breakfast, Spa"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={currentPackage.status}
                onChange={(e) => setCurrentPackage({ ...currentPackage, status: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
          <SheetFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>Cancel</Button>
            <Button onClick={handleSavePackage}>Save Package</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard
            label="Active packages"
            value={String(activeCount)}
            accent="brand"
          />
          <KpiCard label="Bookings · MTD" value="25" accent="info" />
          <KpiCard
            label="Package revenue"
            value={`₹${(revenue / 100000).toFixed(1)}L`}
            accent="success"
          />
          <KpiCard label="Avg uplift vs BAR" value="+14%" accent="success" />
        </div>
        <Card>
          <CardHeader title="Package catalog" />
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-surface-2/40 text-left">
                {["Package", "Price", "Inclusions", "Bookings", "Status", ""].map((h) => (
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
              {displayPackages.map((p) => (
                <tr key={p.id} className="border-b border-border-subtle hover:bg-surface-2/50">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 font-mono">₹{Number(p.price).toLocaleString()}</td>
                  <td className="px-4 py-3 text-text-secondary">{p.inclusions}</td>
                  <td className="px-4 py-3 font-mono">{p.bookingsMtd}</td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={p.status === "Active" ? "success" : "neutral"}>
                      {p.status}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" className="text-[12px] font-medium text-primary" onClick={() => handleEdit(p)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card>
          <CardHeader title="Hotel package templates" hint="Room + meals + services + activities" />
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-surface-2/40 text-left">
                {["Template", "Base Price", "Items", "Status"].map((h) => (
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
              {hotelPackages.map((pkg) => {
                const itemCount = packageItems.filter((it) => it.packageId === pkg.id).length;
                return (
                  <tr key={pkg.id} className="border-b border-border-subtle hover:bg-surface-2/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-text-primary">{pkg.name}</div>
                      <div className="text-[11px] text-text-secondary">{pkg.description}</div>
                    </td>
                    <td className="px-4 py-3 font-mono">₹{pkg.basePrice.toLocaleString()}</td>
                    <td className="px-4 py-3">{itemCount}</td>
                    <td className="px-4 py-3">
                      <StatusBadge tone={pkg.status === "Active" ? "success" : "neutral"}>
                        {pkg.status}
                      </StatusBadge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
export default PackagesFeature;
