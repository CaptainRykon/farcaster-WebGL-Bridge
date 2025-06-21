import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Helper to decode base64 JSON
function decodeBase64Json(str: string) {
  return JSON.parse(Buffer.from(str, "base64").toString("utf-8"));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📩 Received Webhook:", body);

    const header = decodeBase64Json(body.header);
    const payload = decodeBase64Json(body.payload);

    const fid = header?.fid;
    const event = payload?.event;

    if (!fid) {
      console.warn("❌ Missing FID in header");
      return NextResponse.json({ error: "Missing FID" }, { status: 400 });
    }

    // 🟣 Store token on "notifications_enabled"
    if (event === "notifications_enabled") {
      const token = header.notificationToken;
      if (!token) {
        console.warn("❌ No notificationToken in header");
        return NextResponse.json({ error: "Missing token" }, { status: 400 });
      }

      const { error } = await supabase
        .from("notifications")
        .upsert({ fid, token });

      if (error) {
        console.error("❌ Failed to store token:", error.message);
        return NextResponse.json({ error: "Failed to store token" }, { status: 500 });
      }

      console.log(`✅ Stored token for FID ${fid}`);
    }

    if (event === "frame_added") {
      console.log(`🟪 User ${fid} added the mini app frame.`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
