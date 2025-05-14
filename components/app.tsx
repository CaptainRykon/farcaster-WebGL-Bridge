'use client';

import { useEffect } from 'react';
import { createFrames } from 'frames.js/next';
import { farcasterHubContext, getFrameMetadata } from '@farcaster/frame-sdk';

const frames = createFrames({
    basePath: '/frames',
    hub: farcasterHubContext,
});

const gameUrl = 'https://webgl-bridge.vercel.app'; // Update to your real game URL

export const metadata = {
    title: 'BaseDrop',
    description: 'Farcaster Frame WebGL Game',
    openGraph: {
        title: 'BaseDrop',
        images: [`${gameUrl}/cover.png`],
    },
    other: {
        ...getFrameMetadata({
            buttons: ['Play'],
            image: `${gameUrl}/cover.png`,
            postUrl: `${gameUrl}/frames/start`,
        }),
    },
};

export default function Page() {
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const { type, action, message } = event.data || {};

            if (type !== 'frame-action') return;

            console.log('⚡ Frame Action Received:', action, message);

            switch (action) {
                case 'share-game':
                    window.open(
                        `https://warpcast.com/~/compose?text=🎮 Try this awesome game!&embeds[]=${gameUrl}`,
                        '_blank'
                    );
                    break;

                case 'share-score':
                    window.open(
                        `https://warpcast.com/~/compose?text=🏆 I scored ${message} points in BaseDrop! Can you beat me?&embeds[]=${gameUrl}`,
                        '_blank'
                    );
                    break;

                default:
                    console.warn('Unknown action received from Unity:', action);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return (
        <iframe
            src="/Build/index.html"
            width="100%"
            height="600"
            allow="fullscreen"
            className="border rounded-xl shadow-md"
        />
    );
}
