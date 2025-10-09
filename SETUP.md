# Portfolio Website Setup Guide

This guide covers the setup and deployment configuration for Samantha Myers' portfolio website.

## Table of Contents

- [Development Setup](#development-setup)
- [Logo.dev Integration](#logodev-integration)
- [GitHub Actions Deployment](#github-actions-deployment)
- [Environment Variables](#environment-variables)

---

## Development Setup

### Prerequisites

- Node.js 20+
- npm

### Local Development

1. **Install dependencies:**
   ```bash
   cd tasty-trappist
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:4321`

3. **Build for production:**
   ```bash
   npm run build
   ```
   Output goes to `/docs` directory (configured in `astro.config.mjs`)

---

## Logo.dev Integration

The site uses [Logo.dev](https://logo.dev) to dynamically fetch company logos for the experience/employment history section.

### How It Works

- **Build-time fetching**: Logos are fetched during the Astro build process using logo.dev's API
- **Domain-based**: Each company has a `companyDomain` field that logo.dev uses to find the logo
- **Fallback support**: If logo.dev doesn't have a logo or the API token isn't set, the site falls back to local images in `/tasty-trappist/public/company-logo-*.jpg`

### Configuration

Logo URLs are generated using this format:
```
https://img.logo.dev/{domain}?token={API_TOKEN}&format=png&size=120&retina=true
```

**Key Parameters:**
- `size=120` - Display size (120×120px)
- `retina=true` - Fetches 2× resolution (240×240px source) for crisp display on high-DPI screens
- `format=png` - PNG format for transparency support

The implementation is in `/tasty-trappist/src/pages/experience.astro`:

```typescript
const LOGO_DEV_TOKEN = import.meta.env.PUBLIC_LOGO_DEV_TOKEN || '';

const getLogoUrl = (domain: string | null) => {
    if (!domain) return null;
    if (!LOGO_DEV_TOKEN) return null;
    // Use size=120 for display, retina=true for 2x resolution (240px source)
    // This ensures crisp logos on high-DPI displays
    return `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}&format=png&size=120&retina=true`;
};
```

**Dark Mode Support:**
Logos are automatically desaturated in dark mode using CSS filters:
- 60% grayscale + 90% brightness in dark mode
- 30% grayscale + 100% brightness on hover
- Smooth transitions for better UX

**Responsive Sizing:**
- Desktop: 120×120px
- Tablet: 100×100px
- Mobile: 80×80px

### Getting a Logo.dev API Key

1. Sign up at [https://logo.dev](https://logo.dev)
2. Navigate to your dashboard
3. Copy your **publishable API key** (starts with `pk_`)
4. Add it to GitHub Secrets (see below)

**Important**: Use the **publishable** key, not the secret key. The publishable key is safe to use in client-side code and build processes.

### Security: Is the API Token Exposed?

**Short answer**: The token appears in the built HTML, but this is **safe and intentional**.

**Why this is secure:**

1. **Publishable Key Design**: Logo.dev provides two types of keys:
   - **Secret Key** (`sk_xxx`) - NEVER exposed, used for server-side operations
   - **Publishable Key** (`pk_xxx`) - SAFE to expose, designed for client-side use

2. **Domain Restrictions**: You can restrict your publishable key to specific domains in the logo.dev dashboard (e.g., only allow `sammyers.io`), preventing unauthorized use.

3. **Usage Limits**: Logo.dev tracks usage per key and can rate-limit requests, protecting against abuse even if someone copies your key.

4. **Standard Practice**: This is the same approach used by services like:
   - Stripe (publishable keys in checkout forms)
   - Google Maps API (API keys in script tags)
   - Auth0, Algolia, and many others

**What appears in the built site:**
```html
<img src="https://img.logo.dev/apple.com?token=pk_xxxxx&format=png&size=120&retina=true" />
```

This is normal and expected for static site generation. The logo URLs are baked into the HTML during build time.

**Additional Protection:**
- Set domain restrictions in logo.dev dashboard
- Monitor usage in your logo.dev account
- Rotate keys if you suspect abuse (takes seconds to update GitHub Secret)

---

## GitHub Actions Deployment

The site is automatically deployed to GitHub Pages when you push to the `main` branch.

### Workflow Overview

The deployment workflow (`.github/workflows/gh-pages.yml`) does the following:

1. **Checkout code**
2. **Setup Node.js 20** with npm caching
3. **Install dependencies** in `tasty-trappist/`
4. **Build site** with logo.dev token from secrets
5. **Copy CNAME** for custom domain
6. **Upload artifact** to GitHub Pages
7. **Deploy** to GitHub Pages

### Setting Up GitHub Secrets

To enable logo.dev integration in production:

1. **Go to your GitHub repository**
2. **Navigate to**: Settings → Secrets and variables → Actions
3. **Click**: "New repository secret"
4. **Add the secret:**
   - **Name**: `LOGO_DEV_TOKEN`
   - **Value**: Your logo.dev publishable API key (e.g., `pk_xxxxxxxxxxxx`)
5. **Click**: "Add secret"

The workflow will automatically use this secret during the build process.

---

## Environment Variables

### Build-time Variables

| Variable | Description | Required | Where to Set |
|----------|-------------|----------|--------------|
| `PUBLIC_LOGO_DEV_TOKEN` | Logo.dev publishable API key | No (falls back to local logos) | GitHub Secrets as `LOGO_DEV_TOKEN` |

### Local Development

For local development with logo.dev:

1. **Create `.env` file** in `tasty-trappist/`:
   ```bash
   PUBLIC_LOGO_DEV_TOKEN=pk_your_token_here
   ```

2. **Add to `.gitignore`** (should already be there):
   ```
   .env
   .env.*
   !.env.example
   ```

**Never commit your API keys to the repository!**

---

## Deployment Architecture

```
┌─────────────────────────────────────────────┐
│  Push to main branch                        │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  GitHub Actions Workflow                    │
│  ┌────────────────────────────────────────┐ │
│  │  1. Checkout code                      │ │
│  │  2. Setup Node.js 20                   │ │
│  │  3. npm ci (install dependencies)      │ │
│  │  4. npm run build                      │ │
│  │     ├── Uses LOGO_DEV_TOKEN secret     │ │
│  │     └── Outputs to /docs               │ │
│  │  5. Copy CNAME to /docs                │ │
│  │  6. Upload /docs as artifact           │ │
│  │  7. Deploy to GitHub Pages             │ │
│  └────────────────────────────────────────┘ │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  GitHub Pages (https://sammyers.io)         │
└─────────────────────────────────────────────┘
```

---

## Troubleshooting

### Logos not loading in production

**Symptom**: Company logos don't appear on the deployed site.

**Solutions**:
1. Check that `LOGO_DEV_TOKEN` secret is set in GitHub repository settings
2. Verify the secret name is exactly `LOGO_DEV_TOKEN` (case-sensitive)
3. Check GitHub Actions logs for build errors
4. Ensure logo.dev account is active and key is valid

### Local logos not loading

**Symptom**: Fallback logos (local images) don't appear.

**Solutions**:
1. Verify images exist in `/tasty-trappist/public/` directory
2. Check image filenames match what's in `experience.astro` (`logoFallback` field)
3. Ensure `npm run build` completes without errors

### Build fails on GitHub Actions

**Symptom**: GitHub Actions workflow fails during build step.

**Solutions**:
1. Check that `package-lock.json` is committed to the repo
2. Verify Node.js version in workflow (should be 20)
3. Check for TypeScript errors in experience.astro
4. Review workflow logs for specific error messages

---

## Custom Domain Setup

The site uses a custom domain configured via the `CNAME` file in the repository root.

**Current domain**: `sammyers.io` (example)

To change the custom domain:

1. Update the `CNAME` file in the repository root with your domain
2. Configure DNS settings with your domain provider:
   - Type: `CNAME`
   - Name: `@` (or `www`)
   - Value: `{username}.github.io`
3. Push changes to main branch
4. Wait for DNS propagation (can take up to 48 hours)

---

## Additional Resources

- [Astro Documentation](https://docs.astro.build)
- [Logo.dev API Docs](https://docs.logo.dev)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

---

## Questions or Issues?

If you encounter any problems with the setup or deployment:

1. Check the [GitHub Actions logs](../../actions) for build errors
2. Review this documentation
3. Check the logo.dev dashboard for API usage/limits
4. Verify all secrets are correctly configured
