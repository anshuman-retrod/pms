import { Plus } from "lucide-react";
import { PageHeader, Button, Card, CardHeader, StatusBadge } from "@/components/ui/Primitives";

const menuItems = [
  { code: "M-101", name: "Butter Chicken", category: "Main Course", price: 680, status: "Active" },
  { code: "M-102", name: "Dal Makhani", category: "Main Course", price: 420, status: "Active" },
  { code: "M-201", name: "Continental Breakfast", category: "Breakfast", price: 820, status: "Active" },
  { code: "M-301", name: "Chef's Tasting Menu", category: "Special", price: 3600, status: "86'd" },
];

export function PosMenuFeature() {
  return (
    <div>
      <PageHeader
        eyebrow="Menu Management"
        title="Menu & modifiers"
        description="Categories, pricing, and outlet-specific menus."
        actions={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            Add item
          </Button>
        }
      />
      <div className="p-6">
        <Card>
          <CardHeader title="Main Restaurant menu" hint={`${menuItems.length} items`} />
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-surface-2/40 text-left">
                {["Code", "Item", "Category", "Price", "Status"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.code} className="border-b border-border-subtle hover:bg-surface-2/40">
                  <td className="px-4 py-3 font-mono text-[12px]">{item.code}</td>
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{item.category}</td>
                  <td className="px-4 py-3 font-mono">₹{item.price}</td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={item.status === "Active" ? "success" : "warning"}>
                      {item.status}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
