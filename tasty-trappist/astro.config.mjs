// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

const portalPreview = process.env.PORTFOLIO_PORTAL_PREVIEW === '1';

// https://astro.build/config
export default defineConfig({
  site: "https://samanthamyers.au",
  // Preserve Astro 6's inter-element whitespace when upgrading the compiler.
  compressHTML: true,
  outDir: portalPreview ? "../.amp/preview" : "../docs",
  integrations: [svelte()],
  // Avoid blocking stylesheet round trips in the high-latency orb preview.
  // Normal builds keep Astro's default CSS splitting and production output.
  ...(portalPreview ? { build: { inlineStylesheets: 'always' } } : {})
});
