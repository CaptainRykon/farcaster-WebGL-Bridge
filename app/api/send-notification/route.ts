import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { title, body, target_url } = await req.json();

  // Minimal validation
  if (!title || !body) {
    return NextResponse.json({ error: "Missing title/body" }, { status: 400 });
  }

  const res = await fetch(
    "https://api.neynar.com/v2/farcaster/notifications/broadcast",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 👈  Neynar expects the header name **exactly** as `api_key`
        api_key: process.env.NEYNAR_API_KEY!
      },
      body: JSON.stringify({
        notification: {
          title,
          body,
          target_url: target_url ?? "https://webgl-bridge.vercel.app"
        }
      })
    }
  );

  const data = await res.json();
  return NextResponse.json(data);
}
