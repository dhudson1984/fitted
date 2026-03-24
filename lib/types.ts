export interface Look {
  id: string;
  slug: string;
  name: string;
  category: string;
  vibe: string;
  occasion: string;
  season: string;
  image_url?: string | null;
}

export interface Piece {
  id: string;
  brand: string;
  name: string;
  price: number;
  price_display: string;
  retailer: string;
  retailer_url: string;
  slot_type: string;
  color: string;
  material: string;
  fit_type: string;
  description: string;
  image_url?: string | null;
}

export interface LookWithPieces extends Look {
  pieces: (Piece & { sort_order: number })[];
}

export interface CategoryCount {
  category: string;
  count: number;
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  "Smart Casual": "linear-gradient(165deg, #8B7355 0%, #5C4A32 40%, #2C2416 100%)",
  "Athletic & Outdoors": "linear-gradient(165deg, #4A5E4A 0%, #2E3D2E 40%, #1A2318 100%)",
  "Work": "linear-gradient(165deg, #5C5A6E 0%, #3A3848 40%, #1E1C28 100%)",
  "Night Out": "linear-gradient(165deg, #6E4E3A 0%, #4A3226 40%, #221815 100%)",
};

const VIBE_GRADIENTS: Record<string, string> = {
  "Relaxed": "linear-gradient(165deg, #8B7355 0%, #6B5A3E 40%, #3C2E1C 100%)",
  "Classic": "linear-gradient(165deg, #4A5568 0%, #2D3748 40%, #1A202C 100%)",
  "Earthy": "linear-gradient(165deg, #6B4E32 0%, #4A3520 40%, #2A1E12 100%)",
  "Minimal": "linear-gradient(165deg, #718096 0%, #4A5568 40%, #2D3748 100%)",
  "Sharp": "linear-gradient(165deg, #2C2C2A 0%, #1A1A18 40%, #0D0D0C 100%)",
};

export function getGradient(look: Look): string {
  return VIBE_GRADIENTS[look.vibe] || CATEGORY_GRADIENTS[look.category] || CATEGORY_GRADIENTS["Smart Casual"];
}

export function getCategoryGradient(category: string): string {
  return CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS["Smart Casual"];
}

export function getFilterOptions() {
  return {
    vibes: ["Relaxed", "Classic", "Earthy", "Minimal", "Sharp"],
    occasions: ["Weekend", "Brunch", "Travel", "Gym", "Office", "Date Night"],
    seasons: ["Year-Round", "Fall", "Spring", "Summer", "Winter"],
    categories: ["Smart Casual", "Athletic & Outdoors", "Work", "Night Out"],
  };
}
