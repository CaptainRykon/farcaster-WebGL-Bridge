"use client";

import { useEffect, useRef } from "react";
import sdk from "@farcaster/frame-sdk";

export default function App() {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const initBridge = async () => {
            try {
                await sdk.actions.ready();
                const context = await sdk.context;

                const user = context?.user || {};
                const userInfo = {
                    username: user.username || "Guest",
                    pfpUrl: user.pfpUrl || "",
                };

                const postUserInfo = () => {
                    const iframe = iframeRef.current;
                    if (iframe?.contentWindow) {
                        iframe.contentWindow.postMessage(
                            {
                                type: "FARCASTER_USER_INFO",
                                payload: userInfo,
                            },
                            "*"
                        );
                        console.log("✅ Sent user info to Unity:", userInfo);
                    }
                };

                const iframe = iframeRef.current;
                if (iframe) {
                    if (iframe.contentWindow?.document?.readyState === "complete") {
                        postUserInfo();
                    } else {
                        iframe.addEventListener("load", postUserInfo);
                    }
                }

                // 🔥 Listen for Unity events
                window.addEventListener("message", (event) => {
                    const { type, action, message } = event.data || {};
                    if (type !== "frame-action") return;

                    switch (action) {
                        case "share-game":
                            sdk.actions.openUrl(
                                `https://warpcast.com/~/compose?text=🎮 Try this awesome game!&embeds[]=https://webgl-bridge.vercel.app`
                            );
                            break;

                        case "share-score":
                            const score = Number(message) || 0;
                            console.log("📣 Sharing score:", score);
                            sdk.actions.openUrl(
                                `https://warpcast.com/~/compose?text=🏆 I scored ${score} points! Can you beat me?&embeds[]=https://webgl-bridge.vercel.app`
                            );
                            break;

                        default:
                            console.warn("⚠️ Unknown action from Unity:", action);
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
