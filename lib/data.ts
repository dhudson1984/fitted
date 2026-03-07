import { createServerSupabase } from "./supabase-server";
import type { Look, Piece, LookWithPieces, CategoryCount } from "./types";

export type { Look, Piece, LookWithPieces, CategoryCount } from "./types";
export { getGradient, getCategoryGradient, getFilterOptions } from "./types";

export async function getLooks(filters?: {
  category?: string;
  vibe?: string;
  occasion?: string;
  season?: string;
  sort?: string;
  limit?: number;
}): Promise<Look[]> {
  const supabase = createServerSupabase();
  let query = supabase.from("looks").select("*");

  if (filters?.category) query = query.eq("category", filters.category);
  if (filters?.vibe) query = query.eq("vibe", filters.vibe);
  if (filters?.occasion) query = query.eq("occasion", filters.occasion);
  if (filters?.season) query = query.eq("season", filters.season);

  if (filters?.sort === "name") {
    query = query.order("name", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  if (filters?.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching looks:", error);
    return [];
  }
  return data || [];
}

export async function getLookBySlug(slug: string): Promise<LookWithPieces | null> {
  const supabase = createServerSupabase();

  const { data: look, error: lookError } = await supabase
    .from("looks")
    .select("*")
    .eq("slug", slug)
    .single();

  if (lookError || !look) {
    console.error("Error fetching look:", lookError);
    return null;
  }

  const { data: lookPieces, error: lpError } = await supabase
    .from("look_pieces")
    .select("piece_id, slot_type, sort_order")
    .eq("look_id", look.id)
    .order("sort_order", { ascending: true });

  if (lpError || !lookPieces || lookPieces.length === 0) {
    return { ...look, pieces: [] };
  }

  const pieceIds = lookPieces.map((lp: { piece_id: string }) => lp.piece_id);
  const { data: pieces, error: pError } = await supabase
    .from("pieces")
    .select("*")
    .in("id", pieceIds);

  if (pError || !pieces) {
    return { ...look, pieces: [] };
  }

  const orderedPieces = lookPieces.map((lp: { piece_id: string; sort_order: number }) => {
    const piece = pieces.find((p: Piece) => p.id === lp.piece_id);
    return piece ? { ...piece, sort_order: lp.sort_order } : null;
  }).filter(Boolean) as (Piece & { sort_order: number })[];

  return { ...look, pieces: orderedPieces };
}

export async function getCategoryCounts(): Promise<CategoryCount[]> {
  const supabase = createServerSupabase();
  const categories = ["Smart Casual", "Athletic & Outdoors", "Work", "Night Out"];
  const counts: CategoryCount[] = [];

  for (const category of categories) {
    const { count, error } = await supabase
      .from("looks")
      .select("*", { count: "exact", head: true })
      .eq("category", category);

    if (!error) {
      counts.push({ category, count: count || 0 });
    }
  }

  return counts;
}

export async function getRelatedLooks(category: string, excludeSlug: string, limit = 4): Promise<Look[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("looks")
    .select("*")
    .eq("category", category)
    .neq("slug", excludeSlug)
    .limit(limit);

  if (error) {
    console.error("Error fetching related looks:", error);
    return [];
  }
  return data || [];
}
