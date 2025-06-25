import { NextRequest, NextResponse } from "next/server";

function decode(str: string) {
  return JSON.parse(Buffer.from(str, "base64").toString("utf8"));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const header  = decode(body.header);   // { fid: ... }
    const payload = decode(body.payload);  // { event: ... }

    if (payload.event === "notifications_enabled") {
      console.log("✅  Notifications enabled by fid", header.fid);
    }

    // Neynar only needs a 200 OK to store the fid on its side
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Webhook error:", e);
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}
