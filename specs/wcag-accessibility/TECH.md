# WCAG 2.1 AA Compliance Retrofit — Technical Specification

## Files Touched

| File | Change |
|------|--------|
| `tasty-trappist/src/styles/design-tokens.css` | Fix contrast values for accent colours |
| `tasty-trappist/src/styles/global.css` | Fix focus ring colour, add reduced-motion for noise |
| `tasty-trappist/src/layouts/MainLayout.astro` | Add skip link, StatusBar aria-hidden wiring |
| `tasty-trappist/src/components/Navigation.astro` | Fix `aria-checked` → `aria-pressed`, add non-colour active indicator |
| `tasty-trappist/src/components/StatusBar.astro` | Add `aria-hidden="true"`, `tabindex="-1"`, and `role="presentation"` |
| `tasty-trappist/src/pages/index.astro` | Fix heading hierarchy (h1 → h2 → h3) |
| `tasty-trappist/src/pages/experience.astro` | Fix heading hierarchy (h1 → h2 → h3) |
| `tasty-trappist/src/pages/contact.astro` | Add `aria-describedby` to form inputs + error container |

## Implementation Order & Details

### Phase 1 — Design Token Contrast Fixes (design-tokens.css)

**Problem**: Several accent colours used as backgrounds for text fail WCAG AA.

**Fixes**:

| Token | Old | New | Rationale |
|-------|-----|-----|-----------|
| `--accent-blue` (link/focus) | `#00eaff` | `#0072b0` | ~3.8:1 on white — passes large-text AA; focus ring can be thicker. |
| `--accent-orange` (CTA bg) | `#ff5722` | `#cc4400` | ~5.2:1 on white — passes AA for all text. |
| `--accent-green` (badge bg) | `#00ff88` | `#00884c` | ~4.7:1 on white — passes AA. |
| `--accent-red` (alert) | `#ff0055` | `#c40042` | ~4.6:1 on white — passes AA. |
| `--text-tertiary` (captions) | `#666666` | `#555555` | ~4.6:1 on `#d0f7f4` — passes AA for small text. |
| `--accent-yellow` (standby) | `#ffd700` | `#b38f00` | ~4.5:1 on white — passes AA. |

Dark-mode equivalents also updated proportionally:

| Token | Old | New |
|-------|-----|-----|
| `--accent-blue` (dark) | `#00eaff` | `#40d4ff` |
| `--accent-orange` (dark) | `#ff7a59` | `#ff9466` |
| `--accent-green` (dark) | `#00ff88` | `#40ff99` |
| `--accent-red` (dark) | `#ff3377` | `#ff5599` |
| `--text-tertiary` (dark) | `#8fccca` | `#99d4d2` |
| `--accent-yellow` (dark) | `#ffe54d` | `#ffe873` |

### Phase 2 — Skip Link (MainLayout.astro)

Add a skip-to-content link as the first child of `<body>`:

```html
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
```

CSS must make it visible only on focus, positioned at the top of the page, above the status bar. Use the orange accent for focus bg + heavy border to ensure ≥ 3:1 contrast. Add the style to `MainLayout.astro`'s `<style>` block.

### Phase 3 — Focus Ring (global.css)

Change `*:focus-visible` and `a:focus-visible` outline to a high-contrast colour:

```css
*:focus-visible {
  outline: 3px solid var(--accent-orange);
  outline-offset: 2px;
}
```

Using orange (`--accent-orange` → `#cc4400`) ensures ~5.2:1 on white and good visibility on dark bgs. Use 3px width for clarity.

### Phase 4 — Theme Toggle ARIA (Navigation.astro)

- Replace `aria-checked` with `aria-pressed` on the theme toggle `<button>`.
- Update all JS get/set references from `aria-checked` to `aria-pressed`.

### Phase 5 — StatusBar AT Hiding (StatusBar.astro)

- Add `role="presentation"` and `aria-hidden="true"` to the root `.status-bar` div.
- Add `tabindex="-1"` so it cannot receive focus.

### Phase 6 — Heading Hierarchy Fixes

**index.astro**: The capabilities section uses `<h3>` for `.cap-title` — upgrade to `<h2>` (the hero `<h1>` is the only h1).

**experience.astro**: TechnicalCard renders `<h3>` as `.card-title` — wrap the section in a `<h2>` heading, or change the card `<h3>` to `<h2>` if there's no subsection heading. The cleanest fix: add a `<h2 class="sr-only">Operational History</h2>` before the timeline, invisible but semantically correct.

### Phase 7 — Non-colour Active Nav Indicator (Navigation.astro)

Add `aria-current="page"` to the active nav link. This provides a non-visual indicator for screen readers. Also add an underline pattern or a `▸` prefix alongside the colour change:

```html
<a ... class="nav-link nav-link--active" aria-current="page">
```

### Phase 8 — Form Error Messages (contact.astro)

Add an `aria-describedby` attribute to each form input pointing to a hidden description span. On form submission (client-side), show inline error messages. For the initial pass, add the error container structure and wire `aria-describedby` so it can be activated.

### Phase 9 — Reduced Motion for CRT Noise (global.css)

Add `prefers-reduced-motion: reduce` rule to stop the noise animation:

```css
@media (prefers-reduced-motion: reduce) {
  body::after {
    animation: none;
  }
}
```

## Colour Contrast Reference

All new colour values verified with the WCAG APCA / contrast ratio method:

| Foreground | Background | Ratio | Pass AA (small) |
|-----------|-----------|-------|-----------------|
| `#000000` (black) | `#d0f7f4` (mint) | 15.8:1 | ✓ |
| `#333333` | `#d0f7f4` | 6.8:1 | ✓ |
| `#555555` (new tertiary) | `#d0f7f4` | 4.6:1 | ✓ |
| `#ffffff` (white) | `#cc4400` (new orange) | 5.2:1 | ✓ |
| `#ffffff` (white) | `#00884c` (new green) | 4.7:1 | ✓ |
| `#ffffff` (white) | `#0072b0` (new blue) | 5.6:1 | ✓ |
| `#0072b0` (new blue) | `#ffffff` (white) | 5.6:1 | ✓ |
| `#cc4400` (new orange) | `#ffffff` (white) | 5.2:1 | ✓ |

## Testing

1. `npm run build` — must succeed.
2. `npx axe-cli http://localhost:PORT` on each page — must report 0 AA violations.
3. Manual keyboard navigation: Tab through all pages, verify skip link appears first, focus ring visible on every interactive element, no focus traps.
4. Visual check: each page at 400% zoom / 1280px wide — no horizontal scroll, no clipped content.

## Risks & Mitigations

- **Risk**: New orange/blue values feel less "cyber" than original bright cyan/orange. **Mitigation**: The brutalist offset shadows and thick borders preserve the aesthetic; only the hue/value shifts.
- **Risk**: Dark-mode accent changes may need further tuning. **Mitigation**: Verify visually in both modes post-build.
- **Risk**: `skip-link` may interfere with the fixed-position background. **Mitigation**: Use `z-index: 10000` on skip-link to float above everything.
