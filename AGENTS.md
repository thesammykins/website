# AGENTS.md - AI Agent Guide for Samantha Myers Portfolio

**Last Updated:** October 2025  
**Project:** Samantha Myers Portfolio Website  
**Tech Stack:** Astro, Svelte, TypeScript, CSS  
**Design System:** Military/Defense Tech Brutalist Aesthetic

---

## Table of Contents

> **Navigation Note for AI Agents:**  
> Line numbers (e.g., `L23`) are provided for efficient file reading.  
> Use `read_file(path="website/AGENTS.md", start_line=X, end_line=Y)` to jump directly to specific sections.  
> This allows you to access only the relevant information without processing the entire 760-line document.

1. [Overview](#overview) - L62-L75
2. [Project Structure](#project-structure) - L76-L116
3. [Content Data Locations](#content-data-locations) - L117-L254
   - 3.1 [Experience/Work History](#1-experiencework-history) - L119-L143
   - 3.2 [Skills/Capabilities](#2-skillscapabilities) - L145-L174
   - 3.3 [Certifications](#3-certifications) - L176-L192
   - 3.4 [About/Bio Content](#4-aboutbio-content) - L194-L210
   - 3.5 [Homepage Content](#5-homepage-content) - L212-L227
   - 3.6 [Navigation & Footer](#6-navigation--footer) - L229-L235
   - 3.7 [Status Bar Messages](#7-status-bar-messages) - L237-L254
4. [Common Update Patterns](#common-update-patterns) - L255-L360
   - 4.1 [Pattern 1: Adding a New Role](#pattern-1-adding-a-new-role) - L257-L286
   - 4.2 [Pattern 2: Adding a New Skill](#pattern-2-adding-a-new-skill) - L288-L310
   - 4.3 [Pattern 3: Adding a Certification](#pattern-3-adding-a-certification) - L312-L333
   - 4.4 [Pattern 4: Updating Current Status](#pattern-4-updating-current-status) - L335-L343
   - 4.5 [Pattern 5: Changing Design Tokens](#pattern-5-changing-design-tokens) - L345-L360
5. [Design System Reference](#design-system-reference) - L361-L416
   - 5.1 [CSS Variables (Design Tokens)](#css-variables-design-tokens) - L363-L416
6. [Component Guide](#component-guide) - L417-L486
   - 6.1 [BorderBox Component](#borderbox-component) - L419-L441
   - 6.2 [TechnicalCard Component](#technicalcard-component) - L443-L468
   - 6.3 [GridPattern Component](#gridpattern-component) - L470-L475
   - 6.4 [StatusBar Component](#statusbar-component) - L477-L486
7. [Examples: Understanding User Requests](#examples-understanding-user-requests) - L488-L569
   - 7.1 [Example 1: Role Update](#example-1-role-update) - L490-L499
   - 7.2 [Example 2: Skill Addition](#example-2-skill-addition) - L501-L511
   - 7.3 [Example 3: Certification](#example-3-certification) - L513-L522
   - 7.4 [Example 4: Content Update](#example-4-content-update) - L524-L533
   - 7.5 [Example 5: Visual Change](#example-5-visual-change) - L535-L544
   - 7.6 [Example 6: Navigation](#example-6-navigation) - L546-L556
   - 7.7 [Example 7: Status Update](#example-7-status-update) - L558-L569
8. [File Modification Guide](#file-modification-guide) - L571-L614
   - 8.1 [Adding New Pages](#adding-new-pages) - L573-L589
   - 8.2 [Modifying Existing Content](#modifying-existing-content) - L591-L600
   - 8.3 [Design Consistency Checklist](#design-consistency-checklist) - L602-L614
9. [Common CSS Patterns](#common-css-patterns) - L615-L653
10. [Build & Deployment](#build--deployment) - L655-L675
11. [Key Terminology & Language](#key-terminology--language) - L677-L694
12. [Visual Identity Elements](#visual-identity-elements) - L696-L716
13. [Accessibility Notes](#accessibility-notes) - L718-L726
14. [Quick Reference: File → Purpose](#quick-reference-file--purpose) - L728-L744
15. [Final Notes for AI Agents](#final-notes-for-ai-agents) - L746-L760

---

## Overview

This website is a portfolio for Samantha Myers, a Corporate Engineering Manager. The design follows a **military/defense tech brutalist aesthetic** with:

- Heavy black borders and geometric shapes
- Technical precision and grid systems
- Mint/cyan color palette (#d0f7f4 background)
- Military-inspired typography (Space Grotesk + IBM Plex Mono)
- Data-driven, tactical presentation style

**Key Philosophy:** Functionality first, technical precision, bold minimalism, tactical credibility.

---

## Project Structure

```
website/
├── tasty-trappist/                    # Main Astro project
│   ├── src/
│   │   ├── components/                # Reusable UI components
│   │   │   ├── BorderBox.astro        # Container with border styles
│   │   │   ├── TechnicalCard.astro    # Card for experience/projects
│   │   │   ├── Navigation.astro       # Main navigation
│   │   │   ├── Footer.astro           # Site footer
│   │   │   ├── Header.astro           # Page headers
│   │   │   ├── Section.astro          # Section wrapper
│   │   │   ├── StatusBar.astro        # Top/bottom status bars
│   │   │   └── GridPattern.svelte     # Background grid pattern
│   │   ├── layouts/
│   │   │   └── MainLayout.astro       # Base page layout
│   │   ├── pages/                     # Site pages (routes)
│   │   │   ├── index.astro            # Homepage
│   │   │   ├── about.astro            # About/Team page
│   │   │   ├── experience.astro       # Work history
│   │   │   ├── skills.astro           # Skills matrix
│   │   │   └── contact.astro          # Contact page
│   │   └── styles/
│   │       ├── design-tokens.css      # CSS variables/tokens
│   │       └── global.css             # Global styles
│   ├── public/                        # Static assets
│   │   ├── avatar.png
│   │   ├── avatar-pixelated.png
│   │   └── favicon_io/
│   ├── astro.config.mjs
│   ├── package.json
│   └── tsconfig.json
├── docs/                              # Build output (GitHub Pages)
├── DESIGN_MIGRATION_PLAN.md           # Detailed design documentation
├── AGENTS.md                          # This file
└── CNAME                              # Custom domain config
```

---

## Content Data Locations

### 1. **Experience/Work History**
**Location:** `tasty-trappist/src/pages/experience.astro`  
**Data Structure:** Array of experience objects in frontmatter

```javascript
const experiences = [
  {
    title: 'JOB TITLE',              // All caps, role name
    company: 'Company Name',          // Company name
    companyUrl: 'https://...',        // Company website
    location: 'City (Type)',          // e.g., "Melbourne (Hybrid)"
    period: 'MMM YYYY – Present',     // Date range
    description: '...',               // Brief role description
    achievements: [                   // Bullet points of accomplishments
      'Achievement 1',
      'Achievement 2'
    ],
    tags: ['TAG1', 'TAG2']           // All caps tags
  }
];
```

**Update Pattern:** Add new experiences to the beginning of the array. Current role should always be first.

---

### 2. **Skills/Capabilities**
**Location:** `tasty-trappist/src/pages/skills.astro`  
**Data Structure:** Array of skill categories in frontmatter

```javascript
const skillCategories = [
  {
    title: 'CATEGORY NAME',           // All caps
    icon: '◆',                        // Geometric icon (◆, ▲, ■, ●)
    color: 'orange',                  // orange, green, blue, red
    skills: [
      { name: 'Skill Name', level: 95 }  // level: 0-100
    ]
  }
];
```

**Icons by Category:**
- Technical Operations: `◆`
- Leadership/Management: `▲`
- Tools/Platforms: `■`
- Specialized: `●`

**Colors:**
- `orange` → `--accent-orange` (#ff5722)
- `green` → `--accent-green` (#00ff88)
- `blue` → `--accent-blue` (#00eaff)
- `red` → `--accent-red` (#ff0055)

---

### 3. **Certifications**
**Location:** `tasty-trappist/src/pages/skills.astro`  
**Data Structure:** Array of certification objects

```javascript
const certifications = [
  {
    title: 'CERTIFICATION NAME',      // All caps
    issuer: 'Issuing Organization',
    date: 'MMM YYYY',                 // Issue date
    id: 'CREDENTIAL-ID',              // Optional credential ID
    active: true                      // Shows "ACTIVE" badge
  }
];
```

---

### 4. **About/Bio Content**
**Location:** `tasty-trappist/src/pages/about.astro`  
**Content Areas:**
- **Mission Profile**: Main bio section
- **Operational Philosophy**: 3-4 philosophy items
- **Capabilities**: Categorized skill lists
- **Certifications**: Listed in dedicated section

**Philosophy Structure:**
```astro
<div class="philosophy-item">
  <h4 class="philosophy-title">PRINCIPLE NAME</h4>
  <p class="philosophy-text">Description...</p>
</div>
```

---

### 5. **Homepage Content**
**Location:** `tasty-trappist/src/pages/index.astro`  
**Sections:**
- **Hero**: Main title, subtitle, stats, CTAs
- **Capabilities**: 3-column capability overview
- **Current Role**: Featured current position

**Stats Structure:**
```astro
<div class="stat">
  <span class="stat-value">10+</span>
  <span class="stat-label">YEARS</span>
</div>
```

---

### 6. **Navigation & Footer**
**Navigation:** `tasty-trappist/src/components/Navigation.astro`  
**Footer:** `tasty-trappist/src/components/Footer.astro`

Navigation links are hardcoded. Update these files to add/remove pages.

---

### 7. **Status Bar Messages**
**Location:** `tasty-trappist/src/layouts/MainLayout.astro`  
**Default Items:**
```javascript
statusBarItems = [
  "FIELD TESTED IN ADELAIDE, AU",
  "OPERATIONAL IN MELBOURNE, AU",
  "SYSTEMS OPERATIONAL",
  "LAST UPDATED: OCT 2025",
  "AVAILABLE FOR DEPLOYMENT",
  "VIBE CODES THINGS",
  "OPEN TO OPPORTUNITIES",
  "CONTACT TODAY"
]
```

---

## Common Update Patterns

### Pattern 1: Adding a New Role
**User Says:** "Add the role of CTO"

**Action:**
1. Open `tasty-trappist/src/pages/experience.astro`
2. Add new object to **beginning** of `experiences` array
3. Update homepage `tasty-trappist/src/pages/index.astro` in "Current Role" section

**Example:**
```javascript
// In experience.astro
const experiences = [
  {
    title: 'CHIEF TECHNOLOGY OFFICER',
    company: 'Company Name',
    companyUrl: 'https://company.com',
    location: 'Melbourne',
    period: 'Nov 2025 – Present',
    description: 'Leading technical strategy and engineering teams.',
    achievements: [
      'Key achievement 1',
      'Key achievement 2'
    ],
    tags: ['LEADERSHIP', 'CTO', 'STRATEGY']
  },
  // ... existing experiences
];
```

---

### Pattern 2: Adding a New Skill
**User Says:** "Add Python programming to skills"

**Action:**
1. Open `tasty-trappist/src/pages/skills.astro`
2. Find appropriate category (or create new one)
3. Add skill object with name and level (0-100)

**Example:**
```javascript
// Add to existing category
{
  title: 'TECHNICAL OPERATIONS',
  icon: '◆',
  color: 'orange',
  skills: [
    // ... existing skills
    { name: 'Python Programming', level: 85 }
  ]
}
```

---

### Pattern 3: Adding a Certification
**User Says:** "Add AWS certification"

**Action:**
1. Open `tasty-trappist/src/pages/skills.astro`
2. Add to `certifications` array

**Example:**
```javascript
const certifications = [
  {
    title: 'AWS SOLUTIONS ARCHITECT',
    issuer: 'Amazon Web Services',
    date: 'Nov 2025',
    id: 'AWS-12345',
    active: true
  },
  // ... existing certifications
];
```

---

### Pattern 4: Updating Current Status
**User Says:** "Update location to Sydney"

**Action:**
1. Update `tasty-trappist/src/layouts/MainLayout.astro` status bar items
2. Update `tasty-trappist/src/pages/about.astro` profile meta location
3. Update homepage stats if relevant

---

### Pattern 5: Changing Design Tokens
**User Says:** "Make the background more blue"

**Action:**
1. Open `tasty-trappist/src/styles/design-tokens.css`
2. Modify color variables in `:root`

**Example:**
```css
:root {
  --bg-primary: #d0f4ff;  /* Changed from #d0f7f4 */
}
```

---

## Design System Reference

### CSS Variables (Design Tokens)
**Location:** `tasty-trappist/src/styles/design-tokens.css`

#### Key Variables:

**Colors:**
```css
--bg-primary: #d0f7f4;        /* Main background */
--bg-secondary: #e8fffe;      /* Card backgrounds */
--bg-elevated: #ffffff;       /* Elevated surfaces */

--border-heavy: #000000;      /* Primary borders */
--border-medium: #1a1a1a;     /* Secondary borders */
--border-light: #333333;      /* Tertiary borders */

--accent-orange: #ff5722;     /* Primary CTA */
--accent-green: #00ff88;      /* Success/active */
--accent-blue: #00eaff;       /* Links/interactive */
--accent-red: #ff0055;        /* Alerts */
```

**Typography:**
```css
--font-primary: 'Space Grotesk', sans-serif;
--font-mono: 'IBM Plex Mono', monospace;

--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-xl: 1.25rem;    /* 20px */
--text-3xl: 2rem;      /* 32px */
--text-5xl: 3.5rem;    /* 56px */
```

**Spacing:**
```css
--space-1: 0.5rem;   /* 8px */
--space-2: 1rem;     /* 16px */
--space-3: 1.5rem;   /* 24px */
--space-4: 2rem;     /* 32px */
--space-6: 3rem;     /* 48px */
--space-8: 4rem;     /* 64px */
```

**Borders:**
```css
--border-thin: 1px;
--border-medium: 2px;
--border-thick: 3px;
--border-heavy-width: 5px;
```

---

## Component Guide

### BorderBox Component
**Location:** `tasty-trappist/src/components/BorderBox.astro`

**Usage:**
```astro
<BorderBox variant="corners">
  Content here
</BorderBox>

<BorderBox variant="accent" accentColor="blue">
  Content here
</BorderBox>
```

**Variants:**
- `default` - Standard border
- `corners` - Registration mark corners (tactical style)
- `accent` - Colored left border
- `elevated` - Elevated shadow effect

**Accent Colors:** `orange`, `green`, `blue`, `red`

---

### TechnicalCard Component
**Location:** `tasty-trappist/src/components/TechnicalCard.astro`

**Usage:**
```astro
<TechnicalCard
  title="CARD TITLE"
  subtitle="Subtitle text"
  meta="Metadata"
  showCorners={true}
>
  <p>Card body content</p>
  
  <div slot="footer">
    <span class="tag">TAG1</span>
  </div>
</TechnicalCard>
```

**Props:**
- `title` (required) - Card title (uppercase)
- `subtitle` (optional) - Subtitle text
- `meta` (optional) - Metadata (dates, etc)
- `showCorners` (boolean) - Show corner registration marks

---

### GridPattern Component
**Location:** `tasty-trappist/src/components/GridPattern.svelte`

Background grid pattern. Used in MainLayout automatically.

---

### StatusBar Component
**Location:** `tasty-trappist/src/components/StatusBar.astro`

Scrolling status bar at top/bottom of pages.

**Props:**
- `position` - "top" or "bottom"
- `items` - Array of status messages

---

## Examples: Understanding User Requests

### Example 1: Role Update
**User:** "Add the role of CTO at TechCorp starting January 2026"

**Understanding:**
- Component: Experience/Work History
- Action: Add new experience entry
- Files: `experience.astro`, `index.astro` (current role section)
- Data: Create experience object with CTO title, TechCorp company, Jan 2026 start

---

### Example 2: Skill Addition
**User:** "Add Docker and Kubernetes to my technical skills"

**Understanding:**
- Component: Skills/Capabilities
- Action: Add skills to appropriate category
- File: `skills.astro`
- Category: "TECHNICAL OPERATIONS" or "TOOLS & PLATFORMS"
- Data: Create skill objects with reasonable proficiency levels

---

### Example 3: Certification
**User:** "I got certified in ITIL Foundation last month"

**Understanding:**
- Component: Certifications
- Action: Add certification entry
- File: `skills.astro` (certifications array)
- Data: ITIL Foundation, date = last month, active = true

---

### Example 4: Content Update
**User:** "Update my bio to mention my new focus on AI infrastructure"

**Understanding:**
- Component: About/Bio
- Action: Modify mission profile text
- File: `about.astro`
- Section: Mission Profile paragraph

---

### Example 5: Visual Change
**User:** "Make the primary accent color more blue"

**Understanding:**
- Component: Design System
- Action: Modify CSS variable
- File: `design-tokens.css`
- Variable: `--accent-blue` or possibly `--accent-orange` if primary CTA

---

### Example 6: Navigation
**User:** "Add a blog page to the navigation"

**Understanding:**
- Component: Navigation, Pages
- Action: 1) Create new page, 2) Add nav link
- Files: 
  - Create `pages/blog.astro`
  - Update `components/Navigation.astro`

---

### Example 7: Status Update
**User:** "Change my availability status to 'Not Available'"

**Understanding:**
- Component: Status Bar, About Page
- Action: Update status messages and profile metadata
- Files: 
  - `layouts/MainLayout.astro` (statusBarItems)
  - `about.astro` (profile meta STATUS field)
  - `index.astro` (hero stats ACTIVE status)

---

## File Modification Guide

### Adding New Pages

1. **Create page file:** `src/pages/newpage.astro`
2. **Use MainLayout:**
```astro
---
import MainLayout from "../layouts/MainLayout.astro";
---

<MainLayout title="Page Title" description="Page description">
  <!-- Content here -->
</MainLayout>
```

3. **Add to navigation:** Update `components/Navigation.astro`

---

### Modifying Existing Content

**Always maintain:**
- All-caps styling for titles, tags, labels
- Military/technical language (e.g., "OPERATIONAL", "DEPLOYED", "SYSTEMS")
- Geometric icons (◆, ▲, ■, ●, ⬢)
- Border box containers for content sections
- Consistent spacing using design token variables

---

### Design Consistency Checklist

When making updates, ensure:
- [ ] Text follows capitalization conventions (headings uppercase, body sentence case)
- [ ] Colors use design token variables, not hardcoded values
- [ ] Spacing uses `var(--space-N)` variables
- [ ] Borders use `var(--border-*)` variables
- [ ] Typography uses `var(--font-primary)` or `var(--font-mono)`
- [ ] New content matches tactical/military aesthetic
- [ ] Mobile responsiveness considered

---

## Common CSS Patterns

### Section Spacing
```css
.section {
  padding: var(--space-8) 0;
}
```

### Border Box Pattern
```css
.container {
  border: var(--border-thick) solid var(--border-heavy);
  padding: var(--space-4);
  background: var(--bg-elevated);
}
```

### Tactical Title Pattern
```css
.title {
  font-family: var(--font-primary);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}
```

### Hover Effect Pattern
```css
.interactive:hover {
  border-color: var(--accent-blue);
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 var(--border-heavy);
}
```

---

## Build & Deployment

**Development:**
```bash
cd tasty-trappist
npm run dev
```

**Build:**
```bash
cd tasty-trappist
npm run build
# Outputs to ../docs/
```

**Deployment:**
- Automatic via GitHub Actions (`.github/workflows/gh-pages.yml`)
- Pushes to `gh-pages` branch
- Served via GitHub Pages with custom domain

---

## Key Terminology & Language

Use military/technical language consistently:

**✅ Good:**
- "Operational History" (not "Work Experience")
- "Tactical Operations Log" (not "Resume")
- "Systems & Capabilities" (not "Skills")
- "Deployed", "Operational", "Active Status"
- "Field-tested", "Mission-ready"
- "Strategic initiatives", "Technical precision"

**❌ Avoid:**
- Casual or playful language
- Marketing jargon without technical backing
- Unprofessional terms

---

## Visual Identity Elements

**Registration Marks:** Corner brackets on important cards
```css
.corners::before, .corners::after { /* tactical registration marks */ }
```

**Geometric Icons:**
- `◆` Diamond - Technical/Systems
- `▲` Triangle - Leadership/Direction
- `■` Square - Tools/Platforms  
- `●` Circle - Specialized/Focus
- `⬢` Hexagon - Metrics/Data

**Status Indicators:**
- Green (`--accent-green`) - Active, Success, Current
- Blue (`--accent-blue`) - Links, Interactive
- Orange (`--accent-orange`) - CTAs, Highlights
- Red (`--accent-red`) - Alerts, Critical

---

## Accessibility Notes

- Use semantic HTML
- Maintain WCAG AA color contrast
- Include alt text for images
- Support keyboard navigation
- Respect `prefers-reduced-motion`

---

## Quick Reference: File → Purpose

| File | Purpose |
|------|---------|
| `pages/index.astro` | Homepage - hero, capabilities, current role |
| `pages/experience.astro` | Work history timeline |
| `pages/skills.astro` | Skills matrix, certifications |
| `pages/about.astro` | Bio, philosophy, profile |
| `pages/contact.astro` | Contact information |
| `layouts/MainLayout.astro` | Base layout, status bar config |
| `components/Navigation.astro` | Site navigation |
| `components/BorderBox.astro` | Styled container component |
| `components/TechnicalCard.astro` | Card component for content |
| `styles/design-tokens.css` | All CSS variables |
| `styles/global.css` | Global styles |

---

## Final Notes for AI Agents

1. **Always check existing patterns** before creating new ones
2. **Maintain consistency** with military/technical aesthetic
3. **Use design tokens** instead of hardcoded values
4. **Test responsiveness** when adding new sections
5. **Follow capitalization conventions** (titles uppercase, body normal)
6. **Keep data in page frontmatter** for easy updates
7. **Reference DESIGN_MIGRATION_PLAN.md** for detailed design specs

---

**Questions or Issues?**
Refer to `DESIGN_MIGRATION_PLAN.md` for detailed design specifications and implementation guidelines.