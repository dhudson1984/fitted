import { track } from "@vercel/analytics";

export function trackAffiliateClick({
  pieceId,
  retailer,
  lookSlug,
}: {
  pieceId: string;
  retailer: string;
  lookSlug: string;
}) {
  track("affiliate_click", {
    piece_id: pieceId,
    retailer,
    look_slug: lookSlug,
  });
}
