import { Card, CardHeader } from "@/components/ui/Primitives";

interface ReportsSidebarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (c: string) => void;
}

export function ReportsSidebar({ categories, selectedCategory, onSelectCategory }: ReportsSidebarProps) {
  return (
    <Card>
      <CardHeader title="Categories" />
      <ul className="p-2">
        {categories.map((c) => {
          const active = selectedCategory === c;
          return (
            <li key={c}>
              <button
                onClick={() => onSelectCategory(c)}
                className={`w-full rounded-md px-3 py-2 text-left text-[13px] transition ${
                  active
                    ? "bg-primary-tint text-primary-pressed font-medium"
                    : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                }`}
              >
                {c}
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
export default ReportsSidebar;
