import { build } from 'vite';

const base = process.env.TWEL_BASE_PATH || '/';

await build({ base });
await build({ base, build: { ssr: 'src/prerender.jsx', outDir: '.prerender' } });
await import('./prerender.mjs');
