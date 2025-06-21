"use client";

import { useEffect, useRef } from "react";
import sdk from "@farcaster/frame-sdk";

export default function App() {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const userInfoRef = useRef({
        username: "Guest",
        pfpUrl: "",
        fid: "", // Added to send in notifications
    });

    useEffect(() => {
        const initBridge = async () => {
            try {
                await sdk.actions.ready();
                const context = await sdk.context;
                const user = context?.user || {};

                userInfoRef.current = {
                    username: user.username || "Guest",
                    pfpUrl: user.pfpUrl || "",
                    fid: user.fid?.toString() || "", // Save FID for later use
                };

                const postUserInfoToUnity = () => {
                    const iframe = iframeRef.current;
                    if (iframe?.contentWindow) {
                        iframe.contentWindow.postMessage(
                            {
                                type: "FARCASTER_USER_INFO",
                                payload: userInfoRef.current,
                            },
                            "*"
                        );
                        console.log("✅ Sent user info to Unity:", userInfoRef.current);
                    }
                };

                const iframe = iframeRef.current;
                if (iframe) {
                    iframe.addEventListener("load", postUserInfoToUnity);
                }

                window.addEventListener("message", async (event) => {
                    const { type, action, message } = event.data || {};
                    if (type !== "frame-action") return;

                    switch (action) {
                        case "share-game":
                            sdk.actions.openUrl(
                                `https://warpcast.com/~/compose?text=🎮 Try this awesome game!&embeds[]=https://webgl-bridge.vercel.app`
                            );
                            break;

                        case "share-score":
                            sdk.actions.openUrl(
                                `https://warpcast.com/~/compose?text=🏆 I scored ${message} points! Can you beat me?&embeds[]=https://webgl-bridge.vercel.app`
                            );
                            break;

                        case "get-user-context":
                            console.log("📨 Unity requested Farcaster user context");
                            postUserInfoToUnity();
                            break;

                        case "send-notification":
                            console.log("📬 Notification requested from Unity with message:", message);
                            if (userInfoRef.current.fid) {
                                await fetch("/api/send-notification", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        fid: userInfoRef.current.fid,
                                        title: "🎉 You're on fire!",
                                        body: message,
                                    }),
                                });
                            } else {
                                console.warn("❌ FID not available for sending notification.");
                            }
                            break;

                        default:
                            console.warn("Unknown action from Unity:", action);
                    }
                });
            } catch (error) {
                console.error("❌ Error setting up Farcaster bridge:", error);
            }
        };

        initBridge();
    }, []);

    return (
        <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
            <iframe
                ref={iframeRef}
                src="/BridgeWebgl/index.html"
                style={{ width: "100%", height: "100%", border: "none" }}
                allowFullScreen
            ></iframe>
        </div>
    );
}
