import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("fitted_survey_completed", "true", {
    path: "/",
    maxAge: 31536000,
    sameSite: "lax",
  });
  return res;
}
