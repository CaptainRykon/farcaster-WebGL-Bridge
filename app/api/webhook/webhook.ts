import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json(); // Parse incoming JSON payload
        console.log("Received Webhook:", body);

        const header = decodeBase64Json(body.header);
        const payload = decodeBase64Json(body.payload);

        const fid = header?.fid; // User ID who triggered the event
        const event = payload?.event; // Event type (e.g., frame_added)

        // ✅ Handle "frame_added" event (when a user adds the frame)
        if (event === "frame_added") {
            console.log(`User ${fid} added the frame!`);
            // You can store this in a database if needed
        }

        // ✅ Handle "notifications_enabled" event
        if (event === "notifications_enabled") {
            console.log(`User ${fid} enabled notifications.`);
            // No notification sending logic here
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
    }
}

// ✅ Helper function to decode Base64 JSON
function decodeBase64Json(str: string) {
    return JSON.parse(Buffer.from(str, "base64").toString("utf-8"));
}
