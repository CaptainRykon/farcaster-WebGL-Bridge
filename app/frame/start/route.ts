import { createFrame } from 'frames.js';
import { createImageResponse } from 'frames.js/next';

export const GET = createFrame({
  async handleRequest() {
    return {
      image: 'https://webgl-bridge.vercel.app/cover.png',
      buttons: ['Play'],
      postUrl: 'https://webgl-bridge.vercel.app/frames/start',
    };
  },
});
