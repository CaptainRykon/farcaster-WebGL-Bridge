'use client';

import { useEffect } from 'react';

const gameUrl = 'https://webgl-bridge.vercel.app'; // ✅ Your actual domain

export const metadata = {
  title: 'BaseDrop',
  description: 'Farcaster Frame WebGL Game',
  openGraph: {
    title: 'BaseDrop',
    images: [`${gameUrl}/cover.png`],
  },
  // No 'other' section — you can move this to `frames/start/route.ts` for server-side metadata
};

export default function Page() {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, action, message } = event.data || {};

      if (type !== 'frame-action') return;

      console.log('⚡ Frame Action Received:', action, message);

      if (action === 'share-game') {
        window.open(
          `https://warpcast.com/~/compose?text=🎮 Try this awesome game!&embeds[]=${gameUrl}`,
          '_blank'
        );
      } else if (action === 'share-score') {
        window.open(
          `https://warpcast.com/~/compose?text=🏆 I scored ${message} points! Can you beat me?&embeds[]=${gameUrl}`,
          '_blank'
        );
      } else {
        console.warn('Unknown frame action received:', action);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <iframe
      src="/BridgeWebgl/index.html"
      width="100%"
      height="1000"
      allow="fullscreen"
      className="border rounded-xl shadow-xl"
    />
  );
}
