import { redirect } from "next/navigation";

const CATEGORY_MAP: Record<string, string> = {
  "smart-casual": "Smart Casual",
  "work": "Work",
  "athletic-outdoors": "Athletic & Outdoors",
  "athletic": "Athletic & Outdoors",
  "night-out": "Night Out",
};

export default function ExploreCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const decoded = decodeURIComponent(params.category);
  const mapped = CATEGORY_MAP[decoded.toLowerCase()] || decoded;
  redirect(`/explore?category=${encodeURIComponent(mapped)}`);
}
