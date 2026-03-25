# Buenacopa Theme — QA Checklist

**Date:** March 25, 2026
**Theme:** buenacopa-theme/main (GitHub: jeffreycnolte/buenacopa-theme)
**Store:** buena-copa-mx.myshopify.com / bebuenacopa.com

---

## 1. SHOPIFY ADMIN TASKS (Required before QA)

### Page Template Assignments
Go to **Online Store > Pages** and update the Template for each page:

| Page | Current Template | Change To |
|------|-----------------|-----------|
| ¿Cómo funciona? | Default page | `page.como-funciona` |
| Contact | page.contact | ✅ Already correct |
| Sobre nosotros | page.about | ✅ Already correct |
| Políticas | Default page | ✅ OK (content is in page body) |
| Aviso de privacidad | Default page | ✅ OK (content is in page body) |

### Pages to Hide
Go to **Online Store > Pages**, click each page, change Visibility to **Hidden**:

- [ ] Rise rewards page
- [ ] Referral

### Page Title to Fix
- [ ] **Contact** → Change page title to **"Contáctanos"** (currently English "Contact")

### Footer Navigation
Go to **Content > Menus** and update the footer menu to include all pages:

**Recommended footer structure (2 link groups):**

**Grupo 1: "Producto"**
- ¿Cómo funciona? → `/pages/que-es`
- Sobre nosotros → `/pages/sobre-nosotros`
- Contáctanos → `/pages/contact`

**Grupo 2: "Legal"**
- Políticas → `/pages/politicas`
- Aviso de privacidad → `/pages/aviso-de-privacidad`

To add a second link group in the footer:
1. Go to **Online Store > Themes > Customize**
2. Scroll to Footer section
3. Click **"Add block"** > **"Link Group"**
4. Set heading to "Legal" and select the appropriate menu

### Rise.ai Removal (Needs Natalia)
- [ ] Uninstall Rise.ai app from **Apps** (requires login at platform.rise.ai)
- [ ] This will remove 86 KiB of JS and 18ms main thread time

### Upcart Decision (Needs Natalia)
- [ ] Confirm if Upcart Cart Drawer is still needed or if the custom cart drawer replaces it

---

## 2. IMAGE UPLOADS

The original Be Yours theme images are no longer in Shopify Files. Upload new images through **Customize theme > Pages > [page name]**.

### Sobre Nosotros page images:
- [ ] **Hero background** — Brand lifestyle photo (1920x800 recommended)
- [ ] **Manifesto image** — Product/lifestyle photo (800x600)
- [ ] **Story section image** — Team/founding story photo (800x900)
- [ ] **Commitment image 1** — Lifestyle photo (480x640, portrait)
- [ ] **Commitment image 2** — Lifestyle photo (480x640, portrait)

### Product images to verify:
- [ ] All product images load correctly on homepage product showcase
- [ ] Product thumbnails are clickable and change main image

---

## 3. PAGE-BY-PAGE QA

### Homepage (bebuenacopa.com/)
- [ ] Hero loads with correct heading and product image
- [ ] "Comprar" header button scrolls to product section
- [ ] Social proof bar displays correctly (mobile: marquee, desktop: 3 columns)
- [ ] Product variant selector works (radio buttons highlight, price updates)
- [ ] Quantity +/- buttons work
- [ ] "Agregar al carrito" adds product to cart
- [ ] "Pagar" goes to checkout
- [ ] Cart drawer opens with correct items
- [ ] Product thumbnails change main image on click
- [ ] Amazon/MercadoLibre buttons open correct external links
- [ ] Video testimonials play on click
- [ ] FAQ accordions expand/collapse
- [ ] Mobile sticky CTA bar shows at bottom

### Sobre Nosotros (/pages/sobre-nosotros)
- [ ] Hero section displays with green background
- [ ] Manifesto text is centered and readable
- [ ] Historia/Misión/Visión section shows 3 columns on desktop, stacks on mobile
- [ ] 6 value cards display with correct icons
- [ ] "Comprar ahora" CTA links to homepage #comprar
- [ ] All content is in Spanish

### ¿Cómo Funciona? (/pages/que-es)
**⚠️ REQUIRES TEMPLATE ASSIGNMENT FIRST**
- [ ] Template assigned to `page.como-funciona`
- [ ] Hero section with science heading
- [ ] 3 hangover cause cards (Acetaldehído, Desequilibrio, Inflamación)
- [ ] 4 ingredient cards (DHM, L-Cisteína, Vitamina C, Cúrcuma)
- [ ] 4 usage steps
- [ ] FAQ section with 4 questions
- [ ] CTA section links to homepage #comprar

### Contáctanos (/pages/contact)
- [ ] Contact form renders with all fields (nombre, email, teléfono, mensaje)
- [ ] Form submission works (test with a test email)
- [ ] WhatsApp CTA button visible (if configured)
- [ ] Social links (Instagram, Facebook) work
- [ ] Page title shows "Contáctanos" (not "Contact")

### Políticas (/pages/politicas)
- [ ] Full policy content renders
- [ ] All mailto links work (contacto@bebuenacopa.com)
- [ ] PayPal and MercadoPago external links work
- [ ] Text is readable on mobile

### Aviso de Privacidad (/pages/aviso-de-privacidad)
- [ ] Full privacy policy content renders
- [ ] ARCO rights contact link works
- [ ] Text is readable on mobile

---

## 4. MOBILE TESTING (375px width)

Test on an actual phone or Chrome DevTools mobile mode:

### All Pages
- [ ] Header: logo + cart + hamburger menu visible
- [ ] Hamburger menu opens/closes correctly
- [ ] "Comprar" button in mobile nav works
- [ ] Footer stacks to single column
- [ ] Footer links are tappable (44px+ touch targets)
- [ ] Social icons are tappable (44px)
- [ ] No horizontal scrolling on any page
- [ ] WhatsApp widget doesn't overlap content

### Homepage Mobile Specific
- [ ] Hero stacks (text above, image below)
- [ ] Social proof marquee scrolls horizontally
- [ ] Product variant cards stack properly
- [ ] Mobile sticky CTA bar visible at bottom
- [ ] Video testimonials scroll horizontally (snap carousel)

---

## 5. TRACKING & PIXELS VERIFICATION

All pixels confirmed firing as of March 25, 2026:

| Tracker | Status | ID/Note |
|---------|--------|---------|
| TikTok Pixel | ✅ Active | D1JEHJRC77U87UH7IK6G |
| Facebook Pixel | ✅ Active | 1202273107745741 |
| Google Analytics 4 | ✅ Active | G-EFWXRTH278 |
| Google Tag Manager | ✅ Active | GT-MB6TXH9C |
| Klaviyo | ✅ Active | Company VyrM2D |
| Judge.me | ✅ Active | Core widget |
| Recharge | ✅ Active | Storefront experiences |
| my-coco.ai (WhatsApp) | ✅ Active | Bubble + dashboard |
| Shopify Analytics | ✅ Active | Monorail |
| Microsoft Clarity | ❌ Removed | Per client request |
| Rise.ai | ⚠️ Still loading | Needs app uninstall |

### Post-QA Pixel Check
- [ ] Add to cart event fires in TikTok, Facebook, GA4
- [ ] Purchase event fires in TikTok, Facebook, GA4
- [ ] Klaviyo identifies users on email capture
- [ ] Judge.me review widget loads on product page

---

## 6. PERFORMANCE

Current scores (March 25, 2026):
- Mobile: 68 → Expected 80-88 after optimizations
- Desktop: 93

### After deployment, re-run PageSpeed:
- [ ] Run PageSpeed on https://bebuenacopa.com/
- [ ] Verify LCP < 4.0s on mobile
- [ ] Verify CLS < 0.1
- [ ] Verify no new render-blocking resources

---

## 7. SEO & INDEXING

- [ ] Verify `buena-copa-mx.myshopify.com` 301 redirects to `bebuenacopa.com`
- [ ] Submit `buena-copa-mx.myshopify.com` removal in Google Search Console
- [ ] Verify sitemap at `bebuenacopa.com/sitemap.xml` lists correct pages
- [ ] Check no hidden/draft pages appear in sitemap
- [ ] Verify canonical URLs are correct on all pages

---

## 8. PRODUCTS (For Natalia)

- [ ] Decide which products to keep Active vs Draft
- [ ] All product pages currently show the main Buenacopa product (hardcoded template)
- [ ] Bundle products (Pack Doble, Party Starter, Pareja Perfecta) show wrong content on their product pages
- [ ] Consider drafting bundles or making the product template dynamic

---

## 9. GITHUB REPOSITORY

**Repo:** github.com/jeffreycnolte/buenacopa-theme
**Branch:** main (connected to Shopify live theme)
**Detach from fork:** Contact GitHub Support to detach from eduuusama/buena-copa-theme

### Commit History (17 commits on restore branch):
1. fix(layout): semantic HTML, dynamic lang, deferred TikTok pixel
2. fix(price): correct decimal display for MXN currency
3. fix(product): thumbnail carousel click-to-change-main-image
4. fix(cart): accessible cart drawer with proper quantity controls
5. feat(templates): add missing page templates to prevent 404s
6. chore: remove Rise rewards section and dead app blocks
7. feat(i18n): add English locale and expand Spanish translation keys
8. fix(sections): accessibility, schema, and semantic HTML
9. refactor(css): consolidate stylesheets, add skip-to-content
10. docs: add README
11. perf: optimize critical rendering path and preconnects
12. perf: add responsive srcset to formula and how-it-works images
13. perf: consolidate marketplace buttons, optimize header logo
14. perf: remove Rise.ai embed and disabled app blocks
15. perf: add delayed third-party script loader
16. feat: add Cómo Funciona, About, and Contact page sections
17. fix: broken #comprar anchor links, footer touch targets
