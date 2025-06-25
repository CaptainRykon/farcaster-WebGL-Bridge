// File: app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const header = decodeBase64Json(body.header);
    const payload = decodeBase64Json(body.payload);

    const fid = header?.fid;
    const event = payload?.event;

    if (event === "notifications_enabled") {
      console.log(`✅ User ${fid} enabled notifications`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

function decodeBase64Json(str: string) {
  return JSON.parse(Buffer.from(str, "base64").toString("utf-8"));
}
