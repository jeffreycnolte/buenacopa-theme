# SEO / Indexing Admin Runbook — for Natalia

Context: GSC audit April 10 showed only 11 of 60 pages indexed. This doc lists every task that requires Shopify admin or Google Search Console access. Code-side fixes are already deployed on the `figma-design-system` branch (FAQ JSON-LD, `/collections` noindex, meta description fallback).

Work top-to-bottom. Each checkbox is one atomic action. When a step says "verify", open an incognito window and paste the URL — do not trust the admin preview.

---

## P1 — Soft 404s (highest priority)

### 1. `/collections`
- [x] Theme fix deployed: page now returns `<meta name="robots" content="noindex">` and canonicals to `/`. No admin action required.
- [ ] After theme is published to live, request re-crawl in GSC → URL Inspection → paste `https://buenacopa.mx/collections` → "Request indexing".

### 2. `/collections/frontpage`
- [ ] Shopify admin → **Settings → Navigation → URL redirects** → Create redirect.
- [ ] From: `/collections/frontpage`  →  To: `/`
- [ ] Save. Verify in incognito: visiting `/collections/frontpage` should 301 to homepage.

### 3. `/collections/bundles`
- [ ] Shopify admin → **Products → Collections → Bundles**.
- [ ] Check product count. If **0 products**:
  - [ ] Open collection → **Sales channels** section in sidebar → uncheck **Online Store** → Save.
  - [ ] Create a URL redirect from `/collections/bundles` → `/` (same flow as step 2).
- [ ] If it has products: skip — the issue will resolve on its own once Google recrawls. Make sure the collection has a unique meta description (**Search engine listing** section at bottom of collection page).

### 4. Pull remaining soft 404 URLs
- [ ] Open **Google Search Console → Page Indexing → Soft 404** report for buenacopa.mx.
- [ ] Export the full list (top-right "Export" button → CSV).
- [ ] For each URL:
  - If the page should exist → add a meta description and unique H1 via Shopify admin (Pages or Collections → Search engine listing).
  - If it shouldn't exist → create a 301 redirect to the closest live page.
- [ ] Paste the export into this doc under section P1.5 so we have a record.

---

## P2 — Hard 404s

### 5. `/pages/faq`
- [ ] Shopify admin → **Online Store → Pages** → Check if a page with handle `faq` exists. It does not (per audit).
- [ ] Decision: do we want a standalone FAQ page, or should we redirect to the homepage FAQ section?
  - **Redirect (recommended, fastest):** Settings → Navigation → URL redirects → From `/pages/faq` → To `/#faq`. Save.
  - **Create page:** Pages → Add page → Title "Preguntas frecuentes", handle `faq`. Paste FAQ content. Save. (Heavier — only do this if we want FAQ to rank on its own.)

### 6. `/blogs`
- [ ] Settings → Navigation → URL redirects → From `/blogs` → To `/blogs/news`. Save.
- [ ] Verify in incognito: `buenacopa.mx/blogs` should 301 to `/blogs/news`.

### 7. Pull remaining 4 hard 404s
- [ ] GSC → Page Indexing → **Not found (404)** → Export CSV.
- [ ] For each of the 4 remaining URLs, decide: recreate the page or 301 redirect.
- [ ] Log each decision and the redirect target in this doc (P2.7.x).

---

## P3 — Redirect cleanup

### 8. Export current redirects
- [ ] Settings → Navigation → URL redirects → **Export**.
- [ ] Save the CSV somewhere accessible.

### 9. Find redirect chains
- [ ] In the CSV, look for any "From" URL that also appears as a "To" URL in another row. That's a chain.
- [ ] Example: if `A → B` and `B → C` both exist, update `A → B` to `A → C`.
- [ ] Delete the intermediate row if nothing else points to it.

### 10. Remove dead-target redirects
- [ ] For each "To" URL in the CSV, open it in incognito. If it 404s or is a draft/unpublished page, delete the redirect row.

---

## P4 — Thin content

### 11. Add meta descriptions
For each of these pages, go to the admin record → scroll to **Search engine listing** → write a unique 140–160 char description. Generic "Buenacopa: bienestar post-fiesta" is NOT enough — each description must describe what's on *that specific page*.

- [ ] Homepage → Online Store → Preferences (or theme customizer → SEO).
- [ ] Product: Buenacopa — Products → buenacopa-bienestar-post-fiesta.
- [ ] Page: `sobre-nosotros` — Pages → Sobre nosotros.
- [ ] Page: `contact` — Pages → Contact.
- [ ] Policy custom pages: `politicas`, `aviso-de-privacidad` — Pages.

### 12. Internal links
- [ ] Theme customizer → Footer → add link groups pointing to: Sobre nosotros, Contacto, Cómo funciona, Preguntas frecuentes (can anchor to `/#faq`), Políticas, Aviso de privacidad, Blog.
- [ ] Homepage should already link to the product — verify in incognito.

### 13. Audit `/pages/que-es` and `/pages/aviso-de-privacidad`
- [ ] Open each page in admin. If the body is under ~150 words, either:
  - Expand it to 300+ words of genuinely useful content, OR
  - Consolidate into another page and 301-redirect this URL.

### 14. Blog articles (~20 posts under `/blogs/news`)
For each article:
- [ ] Title set and unique
- [ ] Meta description set and unique
- [ ] At least one internal link back to the product page (`/products/buenacopa-bienestar-post-fiesta`)

---

## P5 — Sitemap & structured data

### 15. Sitemap verification
- [ ] Open `https://buenacopa.mx/sitemap.xml` in incognito.
- [ ] Confirm it lists: homepage, product, all published pages (sobre-nosotros, contact, como-funciona, politicas, aviso-de-privacidad, que-es, brand-guide if public), `/blogs/news`, and all published blog articles.
- [ ] If a page is missing: open it in admin and confirm **Visibility** is "Visible" and Online Store is a selected sales channel.
- [ ] In GSC → Sitemaps → submit `https://buenacopa.mx/sitemap.xml` if not already submitted.

### 16. FAQ structured data
- [x] Theme fix deployed: FAQPage JSON-LD now emitted from the FAQ section on the homepage. No admin action required.
- [ ] After publish, validate at https://search.google.com/test/rich-results — paste `https://buenacopa.mx/` — should show "FAQ" as a detected item.

### 17. Policy indexing
- [ ] Confirm `/policies/*` URLs return `x-robots-tag: noindex` (Shopify sets this automatically — only verify).
- [ ] In GSC → URL Inspection, paste `https://buenacopa.mx/pages/politicas` and `https://buenacopa.mx/pages/aviso-de-privacidad`. Both should be "URL is on Google" (indexed).

---

## Merchant Center

The brief mentioned Merchant Center but didn't list specific tasks. Spot-check these while we're in there:

- [ ] Merchant Center → **Products → Diagnostics**. Any disapprovals? Note top 3 error types.
- [ ] Product titles include brand + descriptor (e.g., "Buenacopa — Bienestar post-fiesta, 10 sobres").
- [ ] **GTIN on the product** (Shopify admin → Product → Variants → Barcode field — paste the 12/13/14-digit GTIN there).
- [ ] **MPN on the product** (if no GTIN exists — Shopify admin → Product → Variants → SKU field is NOT the MPN; see metafield setup below).
- [ ] Product images ≥ 800×800, white/neutral background, no text overlays.
- [ ] Shipping configured in Merchant Center settings.
- [ ] Tax configured (Mexico).

### Custom metafields for Product JSON-LD

The theme's Product JSON-LD reads `product.metafields.custom.gtin` and `product.metafields.custom.mpn`. If we want these emitted in structured data (vs just surfaced to Merchant Center via the barcode field), create the metafield definitions once:

- [ ] Shopify admin → **Settings → Custom data → Products → Add definition**
  - Namespace and key: `custom.gtin` — Type: single-line text — Validations: numbers only, 8–14 chars
  - Namespace and key: `custom.mpn` — Type: single-line text
- [ ] Open the product → scroll to **Metafields** → fill `gtin` (use the same value as the Barcode field) and/or `mpn`. Save.
- [ ] Verify: load `https://buenacopa.mx/products/buenacopa-bienestar-post-fiesta`, view-source, search for `"gtin"` — should show your value in the JSON-LD block.

---

## After everything is done

- [ ] GSC → **Validate fix** on each of the Soft 404, Not Found, and Crawled-not-indexed reports.
- [ ] Schedule a 2-week check-in to see indexed-page count move back toward 60.
- [ ] Save a screenshot of the GSC "Indexed pages" graph today as a baseline.
