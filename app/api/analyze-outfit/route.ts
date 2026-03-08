import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SLOT_TYPES = ["shirt", "pants", "shoes", "jacket", "accessory"] as const;

interface AnalysisResult {
  garments: { type: string; description: string }[];
  dominant_colors: string[];
  formality: string;
  vibe: string;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be under 10MB" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only JPG and PNG images are accepted" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = file.type || "image/jpeg";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 1024,
      messages: [
        {
          role: "system",
          content: `You are a fashion analysis expert. Analyze outfit images and extract structured information. Always respond with valid JSON only, no markdown.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this outfit image and return a JSON object with exactly these fields:
{
  "garments": [{"type": "shirt|pants|shoes|jacket|accessory", "description": "brief description"}],
  "dominant_colors": ["color1", "color2"],
  "formality": "casual|smart casual|business casual|formal",
  "vibe": "one of: Relaxed, Classic, Earthy, Minimal, Sharp"
}

For garment types, map to these slot types: shirt (any top/t-shirt/polo/sweater), pants (any trousers/jeans/shorts), shoes (any footwear), jacket (any outerwear/blazer/coat), accessory (watch/belt/bag/hat/sunglasses).
Return only valid JSON, no other text.`,
            },
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64}` },
            },
          ],
        },
      ],
    });

    const rawContent = completion.choices[0]?.message?.content || "{}";
    const cleaned = rawContent.replace(/```json\n?|```\n?/g, "").trim();
    let analysis: AnalysisResult;

    try {
      analysis = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response", raw: rawContent },
        { status: 500 }
      );
    }

    const matchedPieces: Record<string, unknown> = {};

    for (const slot of SLOT_TYPES) {
      const garment = analysis.garments?.find((g) => g.type === slot);
      const colors = analysis.dominant_colors || [];

      let query = supabase
        .from("pieces")
        .select("*")
        .eq("slot_type", slot);

      if (colors.length > 0) {
        const colorFilter = colors.map((c) => `color.ilike.%${c}%`).join(",");
        query = query.or(colorFilter);
      }

      const { data: pieces } = await query.limit(1);

      if (pieces && pieces.length > 0) {
        matchedPieces[slot] = pieces[0];
      } else {
        const { data: fallback } = await supabase
          .from("pieces")
          .select("*")
          .eq("slot_type", slot)
          .limit(1);

        if (fallback && fallback.length > 0) {
          matchedPieces[slot] = fallback[0];
        } else {
          matchedPieces[slot] = null;
        }
      }
    }

    return NextResponse.json({
      analysis,
      pieces: matchedPieces,
    });
  } catch (error: unknown) {
    console.error("Analyze outfit error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
