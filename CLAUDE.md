# CLAUDE.md — Conventions and rules for this repo

Claude Code reads this file on every session start. Follow these rules.

---

## ⚠️ Branch hygiene (read this first)

Multiple Claude Code sessions sharing this directory will **race for the same HEAD**. A `git checkout` in one session silently flips every other session's working tree. This has caused repeated lost-work incidents.

**Rules:**
- **One PR per fix.** Never reuse a branch after its PR merges — each new bug or change gets its own fresh branch off `origin/main` and its own PR. No piling follow-up commits onto a merged branch (causes squash-merge conflicts and muddies PR history).
- **Don't `git checkout`** unless you really need to. Stay on one branch as long as possible.
- **Don't sync main with `git checkout main && git reset --hard origin/main`.** That moves HEAD. Use `git fetch origin` instead — it updates remote-tracking refs without touching the working tree.
- **Branch off `origin/main` directly**, not local main: `git checkout -b new-branch origin/main`.
- **Commit + push immediately** after meaningful edits. Origin is the safety net when local state gets clobbered.
- **Don't run `git reset --hard`** on shared branches without checking the reflog first.
- If you need long-running parallel work, use `git worktree add` — separate dir, separate HEAD.

If you discover the working tree drifted unexpectedly, check `git reflog HEAD --date=iso` for the cause before reacting.

---

## Snippet naming — Shopify rejects subfolders

All brand-canonical primitives live at **`snippets/brand-*.liquid`** (flat).

Shopify's theme-check rule "Theme files may not be stored in subfolders" rejects anything under `snippets/<dir>/`. We learned this the hard way — see PR #17. **Never** create `snippets/brand/`, `snippets/ui/`, etc.

Render via `{% render 'brand-<name>', ... %}`.

---

## Brand canonicals (source of truth)

`sections/brand-guide.liquid` (page handle: `brand-guide`) is the live spec for everything below. When in doubt, render that page.

### Colors
- **Navy** `#001D45` — primary backgrounds, header, footer
- **Blue** `#0056D0` — brand, cards, secondary backgrounds
- **Green** `#00A33C` — CTAs and functional accents only; never dominant
- **White** `#FFFFFF`

**Deprecated, do not use:** `#071D40` (old navy), `#00AB43` (old green). Replace on sight.

### Typography
- **Nunito** — display/headings (weights 700/800/900)
- **Inter** — body/UI (weights 400/600/700)
- No other `font-family` declarations.

### Primary button — global standard
- Class: **`.btn-cta`** (defined in `assets/theme.css`)
- Spec: rounded-rect (12px, **not pill**), Nunito 800, 15px, 14px/32px padding, accent green, subtle hover (opacity only)
- Render via: `{% render 'brand-button', text: '…', href: '…' %}`
- One button. Everywhere. (lander, hero, buybox, cart, about, contact, 404)
- `brand-button` accepts `tag: 'button'` for `<button>`, `full_width: true`, `class_extra: 'flex-1 …'`, `onclick: '…'`

### Approved copy
Source: `BUENACOPA — APPROVED COPY & COMMUNICATION GUIDELINES.pdf`
- Tagline (primary): `Buenacopa, bienestar post-fiesta.`
- Render via `{% render 'brand-tagline' %}` — never hardcode.

### Forbidden COFEPRIS phrases (regulatory — never ship)
- `cura la cruda`
- `elimina la cruda`
- `garantiza resultados` / `garantizado`
- `permite beber más`
- `evita los efectos del alcohol`
- `sustituye el descanso` (or `sustituye los hábitos saludables`)

The `brand-claim` snippet only ships the 6 COFEPRIS-aligned phrases. Unknown ids render an HTML comment. Never invent new claim copy outside the snippet.

---

## Snippet library (already built)

| Snippet | Purpose |
|---|---|
| `brand-tagline` | Approved tagline (primary/secondary/long) |
| `brand-campaign-hook` | Approved campaign hooks (3 variants) |
| `brand-disclaimer` | "Bebe de forma responsable." |
| `brand-claim` | id-based COFEPRIS claims |
| `brand-button` | Primary CTA — wraps `.btn-cta` |
| `brand-section-label` | Small green uppercase label |
| `brand-badge` | Pill badge (best-value/discount/new) |
| `brand-quantity-stepper` | −/N/+ control (couples to `ProductForm` JS) |
| `brand-trust-bar` | Dotted text trust row |
| `brand-steps` | Canonical 4-step icon-card grid |
| `brand-buybox` | Full purchase module — pure view (section file pre-computes all data) |

When refactoring sections to use these, **do not put Shopify-data logic inside snippets** (no `selling_plan_groups` lookups, no variant filtering for business reasons, no price math). Section file is the controller; snippet is the view. See `brand-buybox` doc comment for the architectural rule.

---

## CI — deploy gate

Every PR and every push to `main` runs `.github/workflows/theme-check.yml`, which has two jobs:

1. **`shopify theme check --fail-level error`** — fails on any theme-check error. Suppressed rules are declared in `.theme-check.yml`; edit that file (not the workflow) to tune.
2. **Locale key parity** — compares the key sets of `locales/en.json` and `locales/es.default.json`. Fails if they diverge. Fix by adding the missing key on both sides with matching structure; values can differ (they're the translations) but keys must not.

**Run the same checks locally before pushing:**

```bash
shopify theme check --fail-level error
diff <(jq -r 'paths(scalars) | join(".")' locales/en.json | sort) \
     <(jq -r 'paths(scalars) | join(".")' locales/es.default.json | sort)
```

Both must exit 0. If either fails in CI, the PR can't merge once branch protection is enabled on `main`.

**Shopify CLI is pinned to `@shopify/cli@3`** in both CI and `.claude/hooks/session-start.sh` so web sessions, local dev, and CI use the same major version. Bump deliberately.

---

## Local dev workflow

```bash
shopify theme dev    # local preview at http://127.0.0.1:9292
                     # syncs to a development theme on the store
```

If the dev server shows "Section type X does not refer to an existing section file" persistently — the dev theme likely got deleted on Shopify's side. Stop dev server, restart `shopify theme dev` to provision a fresh dev theme.

### Themes on the store
- `buenacopa-theme/main` — **LIVE** customer-facing
- `JN - Buenacopa Production` (#153767116989) — **unpublished** preview theme. Push here for live verification before merging to main: `shopify theme push --theme 153767116989`
- Development themes are auto-created by `shopify theme dev`

---

## Liquid gotchas

- **Filters don't always evaluate in `render`-tag args.** Specifically `| t` (translation) — pre-assign first:
  ```liquid
  {%- assign t_ssl = 'general.security.ssl_badge' | t -%}
  {% render 'brand-buybox', trust_ssl: t_ssl, ... %}
  ```
- **Section files must have a `{% schema %}` block** to register as a valid section type.
- **Snippet files cannot have a `{% schema %}` block** — they're not registered as sections.

---

## Important files / where to look

- `sections/brand-guide.liquid` + `templates/page.brand-guide.json` — the live brand reference page (handle `brand-guide`)
- `assets/theme.css` lines 100-130 — `.btn-cta` canonical class definition
- `snippets/brand-*.liquid` — all brand primitives
- `.claude/memory/priscila-review-2026-04-20.md` — running summary of brand changes for stakeholder review (gitignored)
- `SEO-ADMIN-RUNBOOK.md` — admin tasks for Google Search Console / indexing fixes

---

## Common pitfalls (we have hit each of these)

1. Putting snippets in subfolders → Shopify rejects → footer + sobre-nosotros render empty.
2. Using `| t` inline in `render` args → renders the literal key string, not the translated text.
3. Force-pushing to a shared branch while another session is on it → loses work.
4. Hardcoding hex colors at call sites → drift from the canonical palette (audit found 79 in one sweep).
5. Hardcoding tagline strings → drift from approved copy (3 different punctuations across 5 files at one point).
6. Using inline-style + `onmouseover` for hover instead of `.btn-cta` → button drift across the theme.
7. Treating `.btn-cta` as pill (border-radius: 9999px) instead of rounded-rect 12px — the brand book says rounded-rect.
