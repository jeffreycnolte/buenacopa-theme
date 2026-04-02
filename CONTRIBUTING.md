# Developer Workflow — Buenacopa Theme

A step-by-step guide for working on the Buenacopa Shopify theme using Claude Code and Shopify CLI.

## Prerequisites

### 1. Install Homebrew (if not installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Node.js

```bash
brew install node
```

### 3. Install Shopify CLI

```bash
npm install -g @shopify/cli @shopify/theme
```

### 4. Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

You'll need an Anthropic API key or Claude Pro/Team subscription. See [claude.ai/code](https://claude.ai/code) for setup.

### 5. Install Git (if not installed)

```bash
brew install git
```

## Getting Started

### Clone the repo

```bash
git clone https://github.com/jeffreycnolte/buenacopa-theme.git
cd buenacopa-theme
```

### Authenticate with Shopify

```bash
shopify auth login --store buena-copa-mx.myshopify.com
```

This opens a browser window — log in with your Shopify admin credentials.

### Start the local dev server

```bash
shopify theme dev --store buena-copa-mx.myshopify.com
```

This gives you:
- **http://localhost:9292** — local preview with hot reload
- Uses real store data (products, collections, settings)
- Changes are local only — nothing goes live until you push

## Making Changes

### The workflow

```
1. Create a branch
2. Make changes locally
3. Test with `shopify theme dev`
4. Commit and push to GitHub
5. Create a PR (or push directly to main for small fixes)
6. GitHub sync deploys to Shopify automatically
```

### Creating a branch

```bash
git checkout -b fix/cart-image-sizing
```

Use prefixes: `fix/`, `feat/`, `perf/`, `docs/`

### Editing files

The theme is organized into:

| Folder | What it contains | When to edit |
|--------|-----------------|--------------|
| `layout/` | `theme.liquid` — the HTML wrapper for every page | Rarely. Only for head tags, scripts, global elements |
| `sections/` | Individual page sections (hero, FAQ, footer, etc.) | Most content and design changes happen here |
| `snippets/` | Reusable components (cart drawer, price display) | When fixing shared components |
| `templates/` | JSON files that define which sections appear on each page | When adding/removing sections from a page |
| `assets/` | CSS, JS, images | For styling and behavior changes |
| `locales/` | Spanish (`es.default.json`) and English (`en.json`) translations | When adding/changing UI text |
| `config/` | Theme settings schema and stored settings | Rarely edit directly — use the theme customizer instead |

### Key files you'll work with most

- `sections/hero.liquid` — Homepage hero banner
- `sections/product-showcase.liquid` — Main product section with variant selector
- `sections/footer.liquid` — Site footer
- `snippets/cart-drawer.liquid` — Cart slide-out HTML
- `assets/cart-drawer.js` — Cart behavior (add, remove, update)
- `assets/theme.js` — Global JavaScript
- `assets/theme.css` — Custom CSS (beyond Tailwind)
- `locales/es.default.json` — All Spanish UI strings

## Using Claude Code

Claude Code is an AI assistant that runs in your terminal. It can read, edit, and create theme files, run Shopify CLI commands, and help debug issues.

### Starting Claude Code

```bash
cd buenacopa-theme
claude
```

### What Claude Code can help with

**Ask it to make changes:**
```
> Fix the cart drawer image sizing on mobile
> Add a new FAQ question to the como-funciona page
> Update the footer to include a "Legal" section
> Change the hero button text to "Compra ahora"
```

**Ask it to explain code:**
```
> How does the cart drawer work?
> What sections are on the homepage?
> Where is the product price formatted?
```

**Ask it to debug:**
```
> The como-funciona page is showing a 404, why?
> The price is showing without decimals, can you fix it?
> This section isn't rendering on mobile, help me debug
```

**Ask it to deploy:**
```
> Push this to the live theme
> Create an unpublished theme for QA
> Show me the diff before pushing
```

### Tips for working with Claude Code

1. **Be specific** — "Fix the cart image on iPhone" is better than "fix the cart"
2. **Share screenshots** — Drag and drop screenshots into the terminal for visual bugs
3. **Reference files** — "Look at sections/hero.liquid" helps Claude find the right code
4. **Ask before pushing** — Claude will confirm before making live changes
5. **Use it for Shopify CLI** — Claude can run `shopify theme dev`, `shopify theme push`, etc.

### Example session

```
you: The footer links are wrong, the legal pages should be separate from the main nav

claude: Let me check the footer section...
        [reads sections/footer.liquid]
        [reads config/settings_data.json]
        I see the issue — the footer is pulling from a single menu.
        I'll restructure it into two groups: Navigation and Legal.
        [edits sections/footer.liquid]
        [pushes to dev server]
        Take a look at localhost:9292 — does that look right?

you: Yes, push it live

claude: [runs shopify theme push --live]
        Done. Live at bebuenacopa.com
```

## Deployment

### Option A: Push to live via GitHub (recommended)

The live theme is connected to the `main` branch. Merging to `main` auto-deploys.

```bash
git add -A
git commit -m "fix: describe what you changed"
git push origin main
```

### Option B: Push directly via Shopify CLI

```bash
# Push to the live theme
shopify theme push --theme 153768820925 --store buena-copa-mx.myshopify.com --allow-live

# Push to an unpublished theme for QA
shopify theme push --unpublished --store buena-copa-mx.myshopify.com
```

### Option C: Use the Shopify theme editor

For content-only changes (text, images, colors, toggle settings):

1. Go to **Shopify Admin > Online Store > Themes > Customize**
2. Make your changes in the visual editor
3. Click **Save**

**Important:** Don't use the theme editor for structural changes (HTML, CSS, JS). Those should go through Git so we have version history.

## Common Tasks

### Adding a new page

1. Create the section: `sections/main-your-page.liquid`
2. Create the template: `templates/page.your-page.json`
3. Push to Shopify
4. In Shopify Admin > Pages, create the page and assign the template

### Changing text/copy

For UI elements (buttons, labels, cart): edit `locales/es.default.json`
For section content (hero headline, FAQ): edit the section's `{% schema %}` defaults or use the theme customizer

### Adding an image

1. Add the image to `assets/` folder
2. Reference it in Liquid: `{{ 'your-image.png' | asset_url }}`
3. Or use the theme customizer's image picker for section images

### Debugging a broken page

```bash
# Check what template a page is using
shopify theme dev --store buena-copa-mx.myshopify.com
# Visit the page at localhost:9292/pages/your-page
# Check browser console for errors

# Or ask Claude Code:
claude
> The /pages/sobre-nosotros page is broken, help me debug
```

## Environment Info

| Item | Value |
|------|-------|
| Store | `buena-copa-mx.myshopify.com` |
| Domain | `bebuenacopa.com` |
| Live theme ID | `153768820925` |
| GitHub repo | `jeffreycnolte/buenacopa-theme` |
| Branch | `main` (auto-deploys to live) |
| Dev server | `localhost:9292` |

## Rules

1. **Never edit `config/settings_data.json` directly** — this file is managed by the theme customizer. Direct edits can break settings.
2. **Always test on mobile** — 70%+ of Buenacopa traffic is mobile. Use Chrome DevTools mobile view.
3. **Don't hardcode app scripts** — Apps should connect through Shopify's app embed system, not in theme code.
4. **Keep it lean** — This is a purpose-built theme. Don't add features that aren't needed.
5. **Commit messages matter** — Use the format: `fix:`, `feat:`, `perf:`, `docs:` followed by a clear description.
