'use client';

import { useEffect } from 'react';
import { createFrames } from 'frames.js';
import { farcasterHubContext, getFrameMetadata } from '@farcaster/frame-sdk';

const gameUrl = 'https://webgl-bridge.vercel.app'; // Replace with your actual domain

const frames = createFrames({
    basePath: '/frames',
    hub: farcasterHubContext,
});

// Frame metadata for Warpcast preview
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

            if (action === 'share-game') {
                window.open(
                    `https://warpcast.com/~/compose?text=🎮 Try this awesome game!&embeds[]=${gameUrl}`,
                    '_blank'
                );
            } else if (action === 'share-score') {
                window.open(
                    `https://warpcast.com/~/compose?text=🏆 I scored ${message} points in BaseDrop! Can you beat me?&embeds[]=${gameUrl}`,
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
