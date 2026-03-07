"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Look } from "@/lib/types";
import LookCard from "./LookCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PickedForYou() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPicks() {
      try {
        const raw = localStorage.getItem("fitted_survey");
        const parsed = raw ? JSON.parse(raw) : null;
        const lifestyle: string[] = parsed?.lifestyle ?? [];

        const categories = lifestyle.length > 0 ? lifestyle : [];

        const TOTAL = 5;

        if (categories.length === 0) {
          const { data } = await supabase
            .from("looks")
            .select("*")
            .not("image_url", "is", null)
            .neq("image_url", "")
            .order("created_at", { ascending: false })
            .limit(TOTAL);
          setLooks(data || []);
        } else {
          const cats = categories.slice(0, TOTAL);
          const perCategory = Math.floor(TOTAL / cats.length);
          const remainder = TOTAL % cats.length;

          const results: Look[] = [];

          for (let i = 0; i < cats.length; i++) {
            const take = perCategory + (i < remainder ? 1 : 0);
            if (take === 0) continue;
            const { data } = await supabase
              .from("looks")
              .select("*")
              .eq("category", cats[i])
              .not("image_url", "is", null)
              .neq("image_url", "")
              .order("created_at", { ascending: false })
              .limit(take);
            if (data) results.push(...data);
          }

          setLooks(results.slice(0, TOTAL));
        }
      } catch {
        const { data } = await supabase
          .from("looks")
          .select("*")
          .not("image_url", "is", null)
          .neq("image_url", "")
          .order("created_at", { ascending: false })
          .limit(5);
        setLooks(data || []);
      } finally {
        setLoading(false);
      }
    }

    fetchPicks();
  }, []);

  return (
    <section data-testid="section-picked-for-you" className="mb-12">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
        <h2
          data-testid="text-picked-title"
          className="font-display text-2xl font-light tracking-wide"
          style={{ color: "var(--charcoal)" }}
        >
          Picked For You
        </h2>
        <Link
          href="/explore"
          data-testid="link-see-all-looks"
          className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.1em] uppercase no-underline transition-colors"
          style={{ color: "var(--bark)" }}
        >
          See All
          <ArrowRight size={13} />
        </Link>
      </div>

      {loading ? (
        <div
          data-testid="picked-loading"
          className="flex gap-4 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 animate-pulse"
              style={{
                width: 220,
                height: 300,
                background: "var(--cream)",
                borderRadius: 4,
              }}
            />
          ))}
        </div>
      ) : (
        <div
          data-testid="scroll-picked-looks"
          className="flex gap-4 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {looks.map((look) => (
            <LookCard key={look.id} look={look} />
          ))}
        </div>
      )}
    </section>
  );
}
