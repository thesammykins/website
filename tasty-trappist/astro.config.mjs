// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

const portalPreview = process.env.PORTFOLIO_PORTAL_PREVIEW === '1';

// https://astro.build/config
export default defineConfig({
  site: "https://me.samanthamyers.au",
  // Preserve Astro 6's inter-element whitespace when upgrading the compiler.
  compressHTML: true,
  outDir: portalPreview ? "../.amp/preview" : "../docs",
  integrations: [svelte()],
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
