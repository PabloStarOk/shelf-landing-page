// @ts-check
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    integrations: [tailwind()],
    output: 'hybrid',
    security: {
        checkOrigin: true
    },
    adapter: vercel()
});
