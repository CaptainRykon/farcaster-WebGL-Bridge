"use client";

import { useEffect, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import WalletConnector from "./wallet-connector";

export default function App() {
    const [isSDKLoaded, setIsSDKLoaded] = useState(false);
    const [farcasterUserContext, setFarcasterUserContext] = useState<any>();
    const [gameLoaded, setGameLoaded] = useState(false);

    useEffect(() => {
        const load = async () => {
            const context = await sdk.context;
            setFarcasterUserContext(context);
            sdk.actions.ready();
        };

        if (sdk && !isSDKLoaded) {
            setIsSDKLoaded(true);
            load();
        }

        // Simulate game loading delay (or you can use actual onLoad from iframe if needed)
        const timeout = setTimeout(() => {
            setGameLoaded(true);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [isSDKLoaded]);

    return (
        <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
            {gameLoaded ? (
                <iframe
                    src="/BridgeWebgl/index.html"
                    style={{ width: "100%", height: "100%", border: "none" }}
                    allowFullScreen
                ></iframe>
            ) : (
                <div style={{ padding: "2rem", textAlign: "center" }}>
                    <p>Loading...</p>
                    <WalletConnector />
                </div>
            )}
        </div>
    );
}
