import { categories, type CategoryKey } from "@/lib/finance-data";
import { cn } from "@/lib/utils";

export function CategoryBadge({
  category,
  className,
}: {
  category: CategoryKey;
  className?: string;
}) {
  const cat = categories[category];
  const Icon = cat.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        className,
      )}
      style={{
        backgroundColor: `color-mix(in oklch, ${cat.color} 14%, transparent)`,
        color: cat.color,
      }}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {cat.label}
    </span>
  );
}
