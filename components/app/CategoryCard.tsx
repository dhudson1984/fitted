import Link from "next/link";
import { getCategoryGradient } from "@/lib/types";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  category: string;
  count: number;
}

const CATEGORY_ICONS: Record<string, string> = {
  "Smart Casual": "Weekend-ready style",
  "Athletic & Outdoors": "Active & adventure",
  "Work": "Office-ready looks",
  "Night Out": "Evening essentials",
};

export default function CategoryCard({ category, count }: CategoryCardProps) {
  const gradient = getCategoryGradient(category);
  const subtitle = CATEGORY_ICONS[category] || "";

  return (
    <Link
      href={`/explore?category=${encodeURIComponent(category)}`}
      data-testid={`card-category-${category.toLowerCase().replace(/\s+&?\s*/g, "-")}`}
      className="block no-underline group"
    >
      <div
        className="relative flex flex-col justify-end overflow-hidden transition-transform duration-200"
        style={{
          background: gradient,
          height: 160,
          borderRadius: 6,
          padding: "20px 18px",
        }}
      >
        <div
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ color: "rgba(250,247,242,0.6)" }}
        >
          <ArrowRight size={16} />
        </div>

        <h3
          data-testid={`text-category-name-${category.toLowerCase().replace(/\s+&?\s*/g, "-")}`}
          className="font-display text-xl font-light"
          style={{ color: "rgba(250,247,242,0.95)" }}
        >
          {category}
        </h3>

        <div className="flex items-center justify-between gap-2 mt-1">
          <span
            className="text-[11px] font-light"
            style={{ color: "rgba(250,247,242,0.5)" }}
          >
            {subtitle}
          </span>
          <span
            data-testid={`text-category-count-${category.toLowerCase().replace(/\s+&?\s*/g, "-")}`}
            className="text-[11px] font-light"
            style={{ color: "rgba(250,247,242,0.5)" }}
          >
            {count} look{count !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}
