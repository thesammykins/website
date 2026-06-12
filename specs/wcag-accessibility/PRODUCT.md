# WCAG 2.1 AA Compliance Retrofit

## Problem Statement

The Samantha Myers portfolio website uses a military/defense-tech brutalist aesthetic with high-contrast design intent, but several accessibility gaps prevent conformance with WCAG 2.1 Level AA:

1. **Color contrast failures** — decorative accent colors (cyan `#00eaff`, orange `#ff5722`, green `#00ff88`) used as text backgrounds or small text on light backgrounds fail the 4.5:1 ratio for AA.
2. **No skip navigation link** — users relying on keyboard or screen readers cannot bypass the repetitive navigation block.
3. **Invalid ARIA** — the theme toggle `<button>` uses `aria-checked` (reserved for `role="checkbox"`/`role="switch"`) instead of `aria-pressed`.
4. **Distracting animated content** — the `StatusBar` ticker is not hidden from assistive technology.
5. **Heading hierarchy gaps** — some pages jump from `<h1>` to `<h3>` without an `<h2>`.
6. **Color-only indicators** — the active navigation page uses orange text/border as the sole differentiator.
7. **No custom form error messages** — the contact form relies on browser-default validation with no `aria-describedby` on error.
8. **Missing `prefers-reduced-motion` for noise overlay** — the CRT noise/grain animation runs even when the user requests reduced motion.

## Success Criteria

- **WCAG 2.1 Level AA conformance** across all 6 pages (Home, About, Experience, Skills, Contact, and the shared layout shell).
- All automated axe-core and WAVE scans pass with zero AA violations.
- Manual keyboard navigation confirms focus visibility, logical tab order, and functional skip link.

## Acceptance Criteria

| ID | Criterion | WCAG SC | Priority |
|----|-----------|---------|----------|
| A1 | Skip navigation link is the first focusable element on every page, visible on focus | 2.4.1 | Must |
| A2 | Focus indicator uses a color with ≥ 3:1 contrast against adjacent backgrounds | 1.4.11 | Must |
| A3 | All text‑on‑background combinations in interactive/UI elements meet 4.5:1 (small) / 3:1 (large) | 1.4.3 | Must |
| A4 | Theme toggle button uses `aria-pressed` instead of `aria-checked` | 4.1.2 | Must |
| A5 | StatusBar ticker is hidden from assistive technology (`aria-hidden="true"`, `tabindex="-1"`) | 4.1.2 | Must |
| A6 | Heading hierarchy follows a logical `h1 → h2 → h3` sequence on every page | 1.3.1 | Must |
| A7 | Active navigation page has a non‑color indicator (e.g. text underline, bold weight) | 1.4.1 | Should |
| A8 | Form inputs have `aria-describedby` pointing to an error‑message container | 3.3.3 | Should |
| A9 | CRT noise/grain animation is disabled when `prefers-reduced-motion: reduce` | 2.3.3 | Should |
| A10 | Site renders without horizontal scroll at 400% zoom on 1280px viewport | 1.4.10 | Must |

## Invariants

- No visual design or layout changes outside of color/value adjustments for contrast.
- The military/defense-tech brutalist aesthetic must be preserved — tone is maintained, only accessibility gaps are closed.
- All existing content and functionality remain unchanged.
- The site must build with zero errors (`npm run build`).

## Validation Plan

1. **Automated**: `axe DevTools` or `@axe-core/cli` scan on all pages at desktop and mobile viewports.
2. **Manual keyboard**: Tab through every page — verify skip link, focus rings, logical order, no traps.
3. **Contrast**: Color Contrast Analyser (CCA) spot-check every color pair changed in the fix.
4. **Build**: `npm run build` must succeed with zero warnings or errors.
5. **Visual regression**: Compare rendered pages before/after to confirm no unintended layout drift.
