# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a portfolio website for Samantha Myers, a Technical Support Engineer and Corporate Engineering Manager. The site is built with Astro 5 and Svelte, featuring a military/defense tech brutalist aesthetic with custom pixelated graphics and animations.

## Development Commands

All commands must be run from the `tasty-trappist/` directory:

```bash
cd tasty-trappist
npm install              # Install dependencies
npm run dev             # Start dev server at localhost:4321
npm run build           # Build production site (outputs to ../docs/)
npm run preview         # Preview production build locally
```

## Build and Deployment Architecture

**Critical Build Configuration:**
- The Astro config (`tasty-trappist/astro.config.mjs`) outputs to `outDir: "../docs"`
- This places the built site in the root `/docs` directory, NOT in `tasty-trappist/dist/`
- GitHub Actions workflow (`.github/workflows/gh-pages.yml`) builds from `tasty-trappist/` and deploys the `/docs` directory
- The root `CNAME` file is copied into `/docs/CNAME` during deployment for custom domain support
- GitHub Pages serves directly from the `/docs` folder on the main branch

**Deployment Flow:**
1. Push to main branch triggers GitHub Actions
2. Workflow runs `npm ci && npm run build` in `tasty-trappist/`
3. Build outputs to `/docs` (due to `outDir: "../docs"`)
4. `CNAME` file is copied from root to `/docs/CNAME`
5. `/docs` directory is deployed to GitHub Pages

## Architecture and Structure

### Design System
The site uses a comprehensive design token system in `tasty-trappist/src/styles/design-tokens.css`:
- Military/defense tech brutalist aesthetic with mint/cyan background (`--bg-primary: #d0f7f4`)
- Heavy black borders (`--border-heavy: #000000`, 3-5px)
- Accent colors: orange (`#ff5722`), green (`#00ff88`), cyan (`#00eaff`)
- Typography: Space Grotesk (primary), IBM Plex Mono (monospace)
- Full dark mode support via `[data-theme="dark"]`
- Responsive breakpoints with mobile-first approach
- 8px base spacing unit system

All pages should reference design tokens from `design-tokens.css` rather than hardcoding values.

### Layout System
- **MainLayout** (`src/layouts/MainLayout.astro`): Base layout for all pages
  - Includes Navigation, Footer, StatusBar components
  - Supports optional `page-background` slot for full-page background images/effects
  - Includes GridPattern background via Svelte component
  - Implements Astro View Transitions for smooth page navigation
  - Contains accessibility features (skip link, semantic HTML)

### Key Components

**PixelatedCanvas** (`src/components/PixelatedCanvas.svelte`):
- Advanced Svelte component for pixelated image rendering with fade animations
- Samples image colors in blocks, renders as pixelated grid
- Features: random fade effects, hover interactions, edge blur gradients
- Highly configurable via props (pixel size, fade timing, hover behavior, edge blur)
- Used for hero background portraits with artistic pixelation effect
- Performance-optimized with requestAnimationFrame rendering loop
- See `PixelatedCanvas.README.md` for detailed documentation

**Other Key Components:**
- **Navigation**: Responsive nav with mobile hamburger menu
- **Footer**: Site footer with contact/social links
- **BorderBox**: Reusable container with brutalist border styling variants
- **StatusBar**: Scrolling status text (top/bottom of pages)
- **GridPattern**: Animated background grid (Svelte)
- **TechnicalCard**: Card component for displaying technical information

### Page Structure
Pages are in `src/pages/`:
- `index.astro`: Homepage with hero, capabilities, current role
- `about.astro`: About/biography page
- `experience.astro`: Work history and experience
- `skills.astro`: Technical skills and capabilities
- `contact.astro`: Contact information and links

All pages use MainLayout and follow the brutalist design system.

### Styling Approach
- Global styles in `src/styles/global.css`
- Design tokens in `src/styles/design-tokens.css` (imported in global.css)
- Component-scoped styles within `.astro` and `.svelte` files
- CSS variables used throughout for consistency
- Responsive design with mobile breakpoints defined in design-tokens.css

## Image Assets and Hero Backgrounds

Hero background images are located in `tasty-trappist/public/`:
- `hero-home.png`, `hero-about.png`, `hero-contact.png`, `hero-experience.png`, `hero-skills.png`
- Used with PixelatedCanvas component for pixelated portrait effects
- Rendered in the `page-background` slot of MainLayout
- Images should be high resolution and suitable for pixelation

Avatar images:
- `avatar-pixelated.png` / `avatar-pixelated-face.png`: Used in various components

## Technology Stack

- **Astro 5.14+**: Static site framework with Svelte integration
- **Svelte 5.28+**: For interactive components (PixelatedCanvas, GridPattern, etc.)
- **TypeScript**: Configured with strict mode (`astro/tsconfigs/strict`)
- **CSS Custom Properties**: Extensive use of CSS variables for theming
- **View Transitions API**: Astro's built-in page transition system

## Important Constraints from Cursor Rules

From `.cursor/rules/github-modern.mdc` and `github-pages-static.mdc`:

1. **Static Output Only**: GitHub Pages requires static HTML/CSS/JS. No server-side rendering at runtime.
2. **Design Consistency**: Must preserve the brutalist aesthetic: gradients, heavy borders, bold typography, geometric patterns.
3. **Custom Domain**: The `CNAME` file at project root must be present in the build output.
4. **Build Output Location**: The deployed site comes from `/docs`, not from repo root.
5. **Assets**: All assets must be in the repository or loaded from CDN (fonts, icons).

## Working with the Codebase

**When adding new pages:**
1. Create `.astro` file in `src/pages/`
2. Import and use MainLayout
3. Use design tokens from `design-tokens.css` for styling
4. Consider adding hero background via PixelatedCanvas in `page-background` slot
5. Ensure responsive styles follow existing breakpoint patterns

**When modifying styles:**
1. Check if a design token exists for the value in `design-tokens.css`
2. If adding new reusable values, add them to design-tokens.css
3. Ensure dark mode styles are defined in `[data-theme="dark"]` section
4. Test responsive behavior at all breakpoints (640px, 768px, 1024px, 1200px)

**When adding components:**
1. Place in `src/components/`
2. Use `.astro` for static/server-rendered components
3. Use `.svelte` with `client:load` directive for interactive components
4. Follow existing naming conventions (PascalCase)
5. Include TypeScript types for props

**Testing the build:**
```bash
cd tasty-trappist
npm run build
npm run preview
```
Then check that `/docs` directory contains the complete built site with all assets.

## Common Issues

**Build output not appearing in /docs:**
- Verify `astro.config.mjs` has `outDir: "../docs"`
- Ensure you're running `npm run build` from the `tasty-trappist/` directory

**Custom domain not working:**
- Ensure `CNAME` file exists at repository root
- Check GitHub Actions workflow copies CNAME to `/docs/CNAME`
- Verify DNS settings point to GitHub Pages

**Images not pixelating correctly:**
- Check image dimensions are multiples of `pixelSize` prop for pixel-perfect rendering
- PixelatedCanvas will log warnings if dimensions don't align
- See `PixelatedCanvas.README.md` for dimension guidelines

**Styles not applying:**
- Ensure `global.css` is imported in MainLayout (it is by default)
- Check that design tokens are being referenced with `var(--token-name)`
- Verify component styles are within `<style>` tags in `.astro` files

**Dark mode not working:**
- Theme toggle functionality needs to be implemented if desired
- Dark mode tokens are defined but theme switching mechanism is not yet built
- Currently respects `prefers-color-scheme` media query
