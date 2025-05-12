import { useEffect, useState, useRef } from "react";
import sdk from "@farcaster/frame-sdk";
import WalletConnector from "./wallet-connector";

export default function App() {
  const [farcasterUserContext, setFarcasterUserContext] = useState<any>();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setFarcasterUserContext(context);
      sdk.actions.ready();

      // Wait for iframe to be ready
      setTimeout(() => {
        if (iframeRef.current && context?.user?.username) {
          iframeRef.current.contentWindow?.postMessage(
            { type: "farcaster-context", username: context.user.username },
            "*"
          );
        }
      }, 1000); // Delay ensures iframe has loaded
    };

    load();
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