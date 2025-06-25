import { NextRequest, NextResponse } from "next/server";

// Replace with your Neynar API key
const NEYNAR_API_KEY = "19AEA007-0425-4A90-A59E-AEBCAA63256B";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("api_key");

  if (authHeader !== NEYNAR_API_KEY) {
    return NextResponse.json({ error: "Missing or invalid API key" }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log("✅ Webhook received:", body);

    // Your webhook logic here

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
