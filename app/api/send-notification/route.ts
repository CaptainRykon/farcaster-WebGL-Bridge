// pages/api/send-notification.ts or app/api/send-notification/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { fid, title, body, target_url } = await req.json();

  if (!fid) {
    return NextResponse.json({ error: "Missing FID" }, { status: 400 });
  }

  const response = await fetch("https://api.neynar.com/v2/notifications/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "API-Key": process.env.NEYNAR_API_KEY!, // Set in .env
    },
    body: JSON.stringify({
      fid,
      notification: {
        title,
        body,
        target_url,
      },
    }),
  });

  const result = await response.json();

  return NextResponse.json(result);
}
