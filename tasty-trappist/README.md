# samanthamyers-portfolio (tasty-trappist)

This is the repository for Samantha Myers' portfolio website, built with [Astro](https://astro.build/) and Svelte. The project is located within the `tasty-trappist` directory.

## ✨ Features

*   **Modern Stack**: Built with Astro for optimized static output and Svelte for dynamic components.
*   **Responsive Design**: Adapts to various screen sizes.
*   **Theming**: Supports light and dark modes using CSS variables, respecting `prefers-color-scheme`.
*   **Styling**: Custom styling with CSS, featuring gradients and a design aesthetic described in `index.astro` (potentially glassmorphism, geometric patterns, etc.).
*   **Fonts**: Uses Google Fonts (Inter, Fira Mono, Orbitron) and Font Awesome icons, loaded via CDN.
*   **Components**: Modular UI built with Astro and Svelte components found in `src/components/` (e.g., `Header.astro`, `Card.svelte`, `ThemeToggle.svelte`).
*   **Single Page**: Currently, the site consists of a single main page: `src/pages/index.astro`.

## 🚀 Project Structure (within `tasty-trappist/`)

```
tasty-trappist/
├── public/             # Static assets (images, favicon)
│   ├── avatar.png
│   └── favicon.svg
├── src/
│   ├── components/     # Astro and Svelte components
│   │   ├── Header.astro
│   │   ├── Section.astro
│   │   ├── MemphisBackground.svelte
│   │   ├── ThemeToggle.svelte
│   │   ├── Card.svelte
│   │   ├── Tag.svelte
│   │   └── Card.astro
│   ├── pages/          # Site pages
│   │   └── index.astro # Main homepage
├── astro.config.mjs    # Astro configuration (build output set to ../docs)
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration for Astro
└── ... (other configuration files)
```

## 🛠️ Local Development

All commands are run from the `tasty-trappist/` directory:

| Command         | Action                                         |
| :-------------- | :--------------------------------------------- |
| `npm install`   | Installs dependencies                          |
| `npm run dev`   | Starts local dev server at `localhost:4321`    |
| `npm run build` | Builds the production site                     |
| `npm run preview` | Previews your build locally before deploying |

## 🏗️ Build Process

*   Running `npm run build` inside the `tasty-trappist` directory compiles the site.
*   The output directory is configured in `tasty-trappist/astro.config.mjs` as `outDir: "../docs"`. This means the built site is placed directly into the `docs/` folder at the **root of the repository**.

## 🌐 Deployment

*   The site is deployed to GitHub Pages.
*   Deployment is handled by the GitHub Actions workflow defined in `.github/workflows/gh-pages.yml`.
*   The workflow performs the following key steps:
    1.  Checks out the repository.
    2.  Sets up Node.js.
    3.  Navigates into `tasty-trappist/`, installs dependencies (`npm ci`).
    4.  Runs `npm run build` (which outputs to the root `docs/` directory).
    5.  Copies the `CNAME` file from the repository root to the `docs/` directory (e.g., `docs/CNAME`) to ensure the custom domain works with GitHub Pages.
    6.  Deploys the contents of the root `docs/` directory to the `gh-pages` branch.

## 📝 Notes & Potential Improvements

*   **CNAME File**: There is a `CNAME` file located in `tasty-trappist/public/`. The build process copies this to `docs/CNAME`. However, the GitHub Actions workflow also explicitly copies the `CNAME` file from the repository root to `docs/CNAME`, overwriting the one from `tasty-trappist/public/`. To maintain a single source of truth, it's recommended to rely solely on the root `CNAME` file and remove `tasty-trappist/public/CNAME`.
*   **Linting/Formatting**: This review did not include running linters or formatters. It's good practice to have these set up (e.g., ESLint, Prettier) for Astro and Svelte to maintain code quality and consistency.
*   **Design Details**: The specific aesthetic (e.g., "glassmorphism", "bold typography") mentioned in previous README versions should be verified against the actual implementation in `index.astro` and components if further detail is required. This updated README focuses on the verifiable structure and build.
