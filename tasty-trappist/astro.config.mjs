// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  site: "https://samanthamyers.au",
  // Preserve Astro 6's inter-element whitespace when upgrading the compiler.
  compressHTML: true,
  outDir: "../docs",
  integrations: [svelte()]
});
