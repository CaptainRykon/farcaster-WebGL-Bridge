"use client";

import { useEffect, useRef } from "react";
import sdk from "@farcaster/frame-sdk";

export default function App() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const loadContext = async () => {
      try {
        const context = await sdk.context;
        sdk.actions.ready();

        const user = context.user || {};
        const userInfo = {
          username: user.username || "",
          pfpUrl: user.pfpUrl || "",
        };

        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
          iframe.onload = () => {
            iframe.contentWindow?.postMessage(
              { type: "FARCASTER_USER_INFO", payload: userInfo },
              "*"
            );
          };
        }
      } catch (error) {
        console.error("Error loading Farcaster context:", error);
      }
    };

    loadContext();
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
