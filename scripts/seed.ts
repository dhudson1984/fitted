import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const pieces = [
  { brand: "Faherty", name: "Northwoods Shirt Jacket", price: 198, price_display: "$198", retailer: "Faherty Brand", retailer_url: "https://www.fahertybrand.com/products/northwoods-shirt-jacket", slot_type: "jacket", color: "Timber Brown", material: "Waffle Knit Cotton", fit_type: "Relaxed", description: "A warm, textured layer in a rich earth tone that anchors the whole palette." },
  { brand: "J.Crew", name: "Slim Oxford Shirt", price: 78, price_display: "$78", retailer: "J.Crew", retailer_url: "https://www.jcrew.com/p/slim-oxford-shirt", slot_type: "shirt", color: "White", material: "100% Cotton Oxford", fit_type: "Slim / Modern", description: "A clean foundation. Slim Modern fit that layers well." },
  { brand: "Bonobos", name: "Athletic Slim Chino", price: 118, price_display: "$118", retailer: "Bonobos", retailer_url: "https://www.bonobos.com/products/athletic-slim-chino", slot_type: "pants", color: "Khaki Sand", material: "Stretch Cotton", fit_type: "Athletic Slim", description: "Athletic Slim cut gives room through the seat and thigh." },
  { brand: "Veja", name: "V-10 Leather Sneaker", price: 150, price_display: "$150", retailer: "Veja", retailer_url: "https://www.veja-store.com/en_us/v-10-leather-extra-white", slot_type: "shoes", color: "Extra White", material: "Leather / B-Mesh", fit_type: "True to size", description: "Clean white leather sneaker that elevates a casual look without trying too hard." },
  { brand: "Seiko", name: "Presage Cocktail Time", price: 295, price_display: "$295", retailer: "Seiko", retailer_url: "https://www.seikowatches.com/us-en/products/presage/cocktailtime", slot_type: "accessory", color: "Blue Sunburst", material: "Stainless Steel", fit_type: "38mm", description: "Adds a finishing touch. The blue sunburst dial plays well against earth tones." },
  { brand: "Everlane", name: "The Air Oxford", price: 68, price_display: "$68", retailer: "Everlane", retailer_url: "https://www.everlane.com/products/air-oxford-shirt", slot_type: "shirt", color: "White", material: "Japanese Oxford Cotton", fit_type: "Slim Fit", description: "Lighter weave, same clean look. Japanese oxford has a subtle texture that elevates basics." },
  { brand: "Vuori", name: "Sherpa Lined Jacket", price: 168, price_display: "$168", retailer: "Vuori", retailer_url: "https://www.vuoriclothing.com/products/sherpa-lined-jacket", slot_type: "jacket", color: "Mocha", material: "Stretch Fleece", fit_type: "Athletic Fit", description: "Lightweight but warm. Bridges athletic and smart casual." },
  { brand: "Todd Snyder", name: "Italian Slim Fit Chino", price: 198, price_display: "$198", retailer: "Todd Snyder", retailer_url: "https://www.toddsnyder.com/products/italian-slim-fit-chino", slot_type: "pants", color: "Putty", material: "Italian Cotton", fit_type: "Slim Fit", description: "Premium option — Italian cotton has a slightly dressier drape." },
  { brand: "Faherty", name: "Stretch Terry Pant", price: 148, price_display: "$148", retailer: "Faherty Brand", retailer_url: "https://www.fahertybrand.com/products/stretch-terry-pant", slot_type: "pants", color: "Stone", material: "Stretch Terry", fit_type: "Relaxed", description: "Relaxed but refined." },
  { brand: "Common Projects", name: "Achilles Low Sneaker", price: 455, price_display: "$455", retailer: "Common Projects", retailer_url: "https://www.commonprojects.com/products/achilles-low-white", slot_type: "shoes", color: "White", material: "Full-Grain Leather", fit_type: "True to Size", description: "The clean white sneaker that elevates any smart casual outfit." },
  { brand: "Koio", name: "Capri Sneaker", price: 295, price_display: "$295", retailer: "Koio", retailer_url: "https://www.koio.co/products/capri-triple-white", slot_type: "shoes", color: "Triple White", material: "Italian Leather", fit_type: "True to Size", description: "Italian leather, minimalist design." },
  { brand: "Banana Republic", name: "Italian Wool Overshirt", price: 220, price_display: "$220", retailer: "Banana Republic", retailer_url: "https://bananarepublic.gap.com/browse/product.do?pid=italian-wool-overshirt", slot_type: "jacket", color: "Charcoal", material: "Italian Wool", fit_type: "Regular Fit", description: "Elevated version for work or evenings." },
  { brand: "Corridor", name: "Brushed Twill Overshirt", price: 185, price_display: "$185", retailer: "Corridor NYC", retailer_url: "https://corridornyc.com/products/brushed-twill-overshirt", slot_type: "jacket", color: "Chestnut", material: "Brushed Cotton Twill", fit_type: "Relaxed Fit", description: "Same earthy warmth, lighter weight. Great layering piece." },
  { brand: "Taylor Stitch", name: "Long Haul Jacket", price: 278, price_display: "$278", retailer: "Taylor Stitch", retailer_url: "https://www.taylorstitch.com/products/long-haul-jacket", slot_type: "jacket", color: "Waxed Timber", material: "Waxed Canvas", fit_type: "Regular Fit", description: "A step up in durability and polish. Waxed canvas ages beautifully." },
  { brand: "Buck Mason", name: "Pacific Shirt Jacket", price: 168, price_display: "$168", retailer: "Buck Mason", retailer_url: "https://www.buckmason.com/products/pacific-shirt-jacket", slot_type: "jacket", color: "Rust", material: "Heavy Cotton Twill", fit_type: "Slim Fit", description: "Cleaner silhouette in a similar palette." },
  { brand: "Faherty", name: "Legend Shirt", price: 128, price_display: "$128", retailer: "Faherty Brand", retailer_url: "https://www.fahertybrand.com/products/legend-shirt", slot_type: "shirt", color: "White", material: "Organic Cotton", fit_type: "Standard Fit", description: "Softer hand feel with a relaxed silhouette. Organic cotton wears in beautifully." },
  { brand: "Onia", name: "Knit Button-Down", price: 95, price_display: "$95", retailer: "Onia", retailer_url: "https://www.onia.com/products/knit-button-down", slot_type: "shirt", color: "Off-White", material: "Pima Cotton Knit", fit_type: "Slim Fit", description: "Knit construction means no ironing needed." },
  { brand: "Banana Republic", name: "Slim Supima Oxford", price: 59, price_display: "$59", retailer: "Banana Republic", retailer_url: "https://bananarepublic.gap.com/browse/product.do?pid=slim-supima-oxford", slot_type: "shirt", color: "White", material: "Supima Cotton", fit_type: "Slim Fit", description: "Best value option. Supima cotton holds its shape well." },
  { brand: "Faherty", name: "All Day Pant", price: 148, price_display: "$148", retailer: "Faherty Brand", retailer_url: "https://www.fahertybrand.com/products/all-day-pant", slot_type: "pants", color: "Khaki", material: "Stretch Terry", fit_type: "Athletic Slim", description: "Looks sharp, wears like sweats." },
  { brand: "Outlier", name: "Slim Dungarees", price: 198, price_display: "$198", retailer: "Outlier", retailer_url: "https://outlier.nyc/products/slim-dungarees", slot_type: "pants", color: "Sand", material: "Nyco Stretch", fit_type: "Slim Fit", description: "Technical fabric with a clean tailored look. Water-resistant and wrinkle-free." },
  { brand: "Uniqlo", name: "Slim Fit Chino", price: 49, price_display: "$49", retailer: "Uniqlo", retailer_url: "https://www.uniqlo.com/us/en/products/slim-fit-chino", slot_type: "pants", color: "Beige", material: "Cotton Blend", fit_type: "Slim Fit", description: "Best value in the category. Clean, simple, and consistently good fit." },
  { brand: "Oliver Cabell", name: "Low 1 Sneaker", price: 135, price_display: "$135", retailer: "Oliver Cabell", retailer_url: "https://olivercabell.com/products/low-1-white", slot_type: "shoes", color: "White", material: "Full-Grain Leather", fit_type: "True to Size", description: "Transparent supply chain, made in Italy." },
  { brand: "Axel Arigato", name: "Clean 90 Sneaker", price: 185, price_display: "$185", retailer: "Axel Arigato", retailer_url: "https://www.axelarigato.com/us/clean-90", slot_type: "shoes", color: "White/Grey", material: "Leather", fit_type: "True to Size", description: "Slightly streetwear-influenced but still clean." },
];

const looks = [
  { slug: "the-weekend-edit", name: "The Weekend Edit", category: "Smart Casual", vibe: "Relaxed", occasion: "Weekend", season: "Year-Round" },
  { slug: "sunday-brunch-look", name: "Sunday Brunch Look", category: "Smart Casual", vibe: "Classic", occasion: "Brunch", season: "Year-Round" },
  { slug: "earth-and-easy", name: "Earth & Easy", category: "Smart Casual", vibe: "Earthy", occasion: "Weekend", season: "Fall" },
  { slug: "the-refined-relaxed", name: "The Refined Relaxed", category: "Smart Casual", vibe: "Minimal", occasion: "Weekend", season: "Spring" },
  { slug: "classic-saturday", name: "Classic Saturday", category: "Smart Casual", vibe: "Classic", occasion: "Weekend", season: "Year-Round" },
  { slug: "the-clean-slate", name: "The Clean Slate", category: "Smart Casual", vibe: "Minimal", occasion: "Brunch", season: "Summer" },
  { slug: "autumn-tones", name: "Autumn Tones", category: "Smart Casual", vibe: "Earthy", occasion: "Travel", season: "Fall" },
  { slug: "sunday-in-the-city", name: "Sunday in the City", category: "Smart Casual", vibe: "Sharp", occasion: "Brunch", season: "Spring" },
  { slug: "the-low-key-flex", name: "The Low-Key Flex", category: "Smart Casual", vibe: "Relaxed", occasion: "Weekend", season: "Summer" },
  { slug: "the-trail-ready-set", name: "The Trail-Ready Set", category: "Athletic & Outdoors", vibe: "Relaxed", occasion: "Gym", season: "Year-Round" },
  { slug: "performance-meets-style", name: "Performance Meets Style", category: "Athletic & Outdoors", vibe: "Minimal", occasion: "Gym", season: "Year-Round" },
  { slug: "the-active-weekend", name: "The Active Weekend", category: "Athletic & Outdoors", vibe: "Relaxed", occasion: "Weekend", season: "Spring" },
  { slug: "morning-run-ready", name: "Morning Run Ready", category: "Athletic & Outdoors", vibe: "Minimal", occasion: "Gym", season: "Summer" },
  { slug: "park-to-brunch", name: "Park to Brunch", category: "Athletic & Outdoors", vibe: "Classic", occasion: "Brunch", season: "Spring" },
  { slug: "the-mountain-edit", name: "The Mountain Edit", category: "Athletic & Outdoors", vibe: "Earthy", occasion: "Travel", season: "Fall" },
  { slug: "sharp-without-trying", name: "Sharp Without Trying", category: "Work", vibe: "Sharp", occasion: "Office", season: "Year-Round" },
  { slug: "monday-meeting-ready", name: "Monday Meeting Ready", category: "Work", vibe: "Classic", occasion: "Office", season: "Year-Round" },
  { slug: "the-modern-professional", name: "The Modern Professional", category: "Work", vibe: "Minimal", occasion: "Office", season: "Year-Round" },
  { slug: "elevated-casual-friday", name: "Elevated Casual Friday", category: "Work", vibe: "Relaxed", occasion: "Office", season: "Year-Round" },
  { slug: "the-client-meeting", name: "The Client Meeting", category: "Work", vibe: "Sharp", occasion: "Office", season: "Fall" },
  { slug: "creative-director", name: "Creative Director", category: "Work", vibe: "Minimal", occasion: "Office", season: "Year-Round" },
  { slug: "the-after-hours-look", name: "The After-Hours Look", category: "Night Out", vibe: "Sharp", occasion: "Date Night", season: "Year-Round" },
  { slug: "date-night-uniform", name: "Date Night Uniform", category: "Night Out", vibe: "Classic", occasion: "Date Night", season: "Year-Round" },
  { slug: "the-dinner-reservation", name: "The Dinner Reservation", category: "Night Out", vibe: "Sharp", occasion: "Date Night", season: "Fall" },
  { slug: "easy-confidence", name: "Easy Confidence", category: "Night Out", vibe: "Relaxed", occasion: "Date Night", season: "Summer" },
  { slug: "the-late-edit", name: "The Late Edit", category: "Night Out", vibe: "Minimal", occasion: "Date Night", season: "Winter" },
  { slug: "uptown-casual", name: "Uptown Casual", category: "Night Out", vibe: "Classic", occasion: "Date Night", season: "Spring" },
];

const lookPieceAssignments: Record<string, { pieceName: string; brand: string; slotType: string; sortOrder: number }[]> = {
  "sunday-brunch-look": [
    { pieceName: "Northwoods Shirt Jacket", brand: "Faherty", slotType: "jacket", sortOrder: 0 },
    { pieceName: "Slim Oxford Shirt", brand: "J.Crew", slotType: "shirt", sortOrder: 1 },
    { pieceName: "Athletic Slim Chino", brand: "Bonobos", slotType: "pants", sortOrder: 2 },
    { pieceName: "V-10 Leather Sneaker", brand: "Veja", slotType: "shoes", sortOrder: 3 },
    { pieceName: "Presage Cocktail Time", brand: "Seiko", slotType: "accessory", sortOrder: 4 },
  ],
  "the-weekend-edit": [
    { pieceName: "Legend Shirt", brand: "Faherty", slotType: "shirt", sortOrder: 0 },
    { pieceName: "All Day Pant", brand: "Faherty", slotType: "pants", sortOrder: 1 },
    { pieceName: "V-10 Leather Sneaker", brand: "Veja", slotType: "shoes", sortOrder: 2 },
    { pieceName: "Presage Cocktail Time", brand: "Seiko", slotType: "accessory", sortOrder: 3 },
  ],
  "earth-and-easy": [
    { pieceName: "Brushed Twill Overshirt", brand: "Corridor", slotType: "jacket", sortOrder: 0 },
    { pieceName: "The Air Oxford", brand: "Everlane", slotType: "shirt", sortOrder: 1 },
    { pieceName: "Stretch Terry Pant", brand: "Faherty", slotType: "pants", sortOrder: 2 },
    { pieceName: "Low 1 Sneaker", brand: "Oliver Cabell", slotType: "shoes", sortOrder: 3 },
  ],
  "the-refined-relaxed": [
    { pieceName: "Slim Oxford Shirt", brand: "J.Crew", slotType: "shirt", sortOrder: 0 },
    { pieceName: "Italian Slim Fit Chino", brand: "Todd Snyder", slotType: "pants", sortOrder: 1 },
    { pieceName: "Achilles Low Sneaker", brand: "Common Projects", slotType: "shoes", sortOrder: 2 },
    { pieceName: "Presage Cocktail Time", brand: "Seiko", slotType: "accessory", sortOrder: 3 },
  ],
  "classic-saturday": [
    { pieceName: "Pacific Shirt Jacket", brand: "Buck Mason", slotType: "jacket", sortOrder: 0 },
    { pieceName: "Slim Supima Oxford", brand: "Banana Republic", slotType: "shirt", sortOrder: 1 },
    { pieceName: "Slim Fit Chino", brand: "Uniqlo", slotType: "pants", sortOrder: 2 },
    { pieceName: "V-10 Leather Sneaker", brand: "Veja", slotType: "shoes", sortOrder: 3 },
  ],
  "the-clean-slate": [
    { pieceName: "Knit Button-Down", brand: "Onia", slotType: "shirt", sortOrder: 0 },
    { pieceName: "Slim Dungarees", brand: "Outlier", slotType: "pants", sortOrder: 1 },
    { pieceName: "Achilles Low Sneaker", brand: "Common Projects", slotType: "shoes", sortOrder: 2 },
    { pieceName: "Presage Cocktail Time", brand: "Seiko", slotType: "accessory", sortOrder: 3 },
    { pieceName: "Italian Wool Overshirt", brand: "Banana Republic", slotType: "jacket", sortOrder: 4 },
  ],
  "autumn-tones": [
    { pieceName: "Long Haul Jacket", brand: "Taylor Stitch", slotType: "jacket", sortOrder: 0 },
    { pieceName: "Legend Shirt", brand: "Faherty", slotType: "shirt", sortOrder: 1 },
    { pieceName: "All Day Pant", brand: "Faherty", slotType: "pants", sortOrder: 2 },
    { pieceName: "Clean 90 Sneaker", brand: "Axel Arigato", slotType: "shoes", sortOrder: 3 },
    { pieceName: "Presage Cocktail Time", brand: "Seiko", slotType: "accessory", sortOrder: 4 },
  ],
  "sunday-in-the-city": [
    { pieceName: "Italian Wool Overshirt", brand: "Banana Republic", slotType: "jacket", sortOrder: 0 },
    { pieceName: "Slim Oxford Shirt", brand: "J.Crew", slotType: "shirt", sortOrder: 1 },
    { pieceName: "Italian Slim Fit Chino", brand: "Todd Snyder", slotType: "pants", sortOrder: 2 },
    { pieceName: "Koio", brand: "Koio", slotType: "shoes", sortOrder: 3 },
  ],
  "sharp-without-trying": [
    { pieceName: "Italian Wool Overshirt", brand: "Banana Republic", slotType: "jacket", sortOrder: 0 },
    { pieceName: "Slim Oxford Shirt", brand: "J.Crew", slotType: "shirt", sortOrder: 1 },
    { pieceName: "Italian Slim Fit Chino", brand: "Todd Snyder", slotType: "pants", sortOrder: 2 },
    { pieceName: "Achilles Low Sneaker", brand: "Common Projects", slotType: "shoes", sortOrder: 3 },
    { pieceName: "Presage Cocktail Time", brand: "Seiko", slotType: "accessory", sortOrder: 4 },
  ],
  "monday-meeting-ready": [
    { pieceName: "The Air Oxford", brand: "Everlane", slotType: "shirt", sortOrder: 0 },
    { pieceName: "Athletic Slim Chino", brand: "Bonobos", slotType: "pants", sortOrder: 1 },
    { pieceName: "Capri Sneaker", brand: "Koio", slotType: "shoes", sortOrder: 2 },
    { pieceName: "Presage Cocktail Time", brand: "Seiko", slotType: "accessory", sortOrder: 3 },
  ],
  "the-after-hours-look": [
    { pieceName: "Italian Wool Overshirt", brand: "Banana Republic", slotType: "jacket", sortOrder: 0 },
    { pieceName: "Knit Button-Down", brand: "Onia", slotType: "shirt", sortOrder: 1 },
    { pieceName: "Slim Dungarees", brand: "Outlier", slotType: "pants", sortOrder: 2 },
    { pieceName: "Achilles Low Sneaker", brand: "Common Projects", slotType: "shoes", sortOrder: 3 },
  ],
  "date-night-uniform": [
    { pieceName: "Long Haul Jacket", brand: "Taylor Stitch", slotType: "jacket", sortOrder: 0 },
    { pieceName: "Slim Oxford Shirt", brand: "J.Crew", slotType: "shirt", sortOrder: 1 },
    { pieceName: "Italian Slim Fit Chino", brand: "Todd Snyder", slotType: "pants", sortOrder: 2 },
    { pieceName: "Achilles Low Sneaker", brand: "Common Projects", slotType: "shoes", sortOrder: 3 },
  ],
};

async function seed() {
  console.log("Inserting pieces...");
  const { data: insertedPieces, error: piecesError } = await supabase
    .from("pieces")
    .upsert(pieces, { onConflict: "id" })
    .select();

  if (piecesError) {
    console.error("Error inserting pieces:", piecesError);
    return;
  }
  console.log(`Inserted ${insertedPieces?.length} pieces`);

  console.log("Inserting looks...");
  const { data: insertedLooks, error: looksError } = await supabase
    .from("looks")
    .upsert(looks, { onConflict: "slug" })
    .select();

  if (looksError) {
    console.error("Error inserting looks:", looksError);
    return;
  }
  console.log(`Inserted ${insertedLooks?.length} looks`);

  console.log("Creating look-piece relationships...");
  const lookPieceRows: { look_id: string; piece_id: string; slot_type: string; sort_order: number }[] = [];

  for (const [slug, assignments] of Object.entries(lookPieceAssignments)) {
    const look = insertedLooks?.find((l: any) => l.slug === slug);
    if (!look) {
      console.warn(`Look not found for slug: ${slug}`);
      continue;
    }

    for (const assignment of assignments) {
      const piece = insertedPieces?.find(
        (p: any) => p.name === assignment.pieceName && p.brand === assignment.brand
      );
      if (!piece) {
        const pieceByName = insertedPieces?.find((p: any) => p.name === assignment.pieceName);
        if (pieceByName) {
          lookPieceRows.push({
            look_id: look.id,
            piece_id: pieceByName.id,
            slot_type: assignment.slotType,
            sort_order: assignment.sortOrder,
          });
        } else {
          console.warn(`Piece not found: ${assignment.brand} ${assignment.pieceName}`);
        }
        continue;
      }

      lookPieceRows.push({
        look_id: look.id,
        piece_id: piece.id,
        slot_type: assignment.slotType,
        sort_order: assignment.sortOrder,
      });
    }
  }

  if (lookPieceRows.length > 0) {
    const { error: lpError } = await supabase.from("look_pieces").insert(lookPieceRows);
    if (lpError) {
      console.error("Error inserting look_pieces:", lpError);
    } else {
      console.log(`Inserted ${lookPieceRows.length} look-piece relationships`);
    }
  }

  console.log("Seed complete!");
}

seed().catch(console.error);
