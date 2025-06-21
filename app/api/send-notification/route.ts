import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fid, message } = body;

    if (!fid || !message) {
      return NextResponse.json({ error: "Missing fid or message" }, { status: 400 });
    }

    // 🔎 Get token from Supabase
    const { data, error } = await supabase
      .from("notifications")
      .select("token")
      .eq("fid", fid)
      .single();

    if (error || !data?.token) {
      console.warn(`❌ No token found for fid ${fid}`);
      return NextResponse.json({ error: "No token found" }, { status: 404 });
    }

    const token = data.token;

    // 📤 Send notification
    const fcRes = await fetch("https://api.farcaster.xyz/v2/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FARCASTER_API_KEY}`,
      },
      body: JSON.stringify({
        notification: {
          title: "🎮 Farcaster Game",
          body: message,
          token,
        },
      }),
    });

    const result = await fcRes.json();

    if (!fcRes.ok) {
      console.error("❌ Farcaster notification failed:", result);
      return NextResponse.json({ error: "Farcaster API error" }, { status: 500 });
    }

    console.log(`✅ Notification sent to fid ${fid}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Send Notification error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
