# Task 1 — Multi-language support (EN / MR / HI)

**Status:** Implemented  
**Created:** 2026-07-18  
**Completed:** 2026-07-18  
**Scope:** Primary landing page `index.html` (privacy/terms optional follow-up)  
**Languages:** English (default) · Marathi (`mr`) · Hindi (`hi`)

---

## Goal

Add proper client-side i18n so visitors can switch the landing page between **English**, **Marathi**, and **Hindi** without reloading a different HTML file, without hardcoding three copies of the page, and without breaking GitHub Pages (static hosting).

English remains the default and the fallback when a key is missing.

---

## Constraints (current stack)

| Item | Detail |
|------|--------|
| Site type | Static HTML + Tailwind build + vanilla JS |
| Hosting | GitHub Pages (no Node server at runtime) |
| Build today | CSS only (`npm run build:css`) |
| Pages in scope | `index.html` (main); legal pages later |

---

## Recommended architecture

### Approach: YAML catalogs + `data-i18n` attributes + small runtime loader

```
i18n/
  en.yaml          # English (source of truth for keys)
  mr.yaml          # Marathi
  hi.yaml          # Hindi
static/js/
  i18n.js          # load YAML, apply strings, switcher, persistence
index.html         # markup gets data-i18n keys; English text stays as SSR-friendly default
```

**Why YAML**

- Easy for non-devs to edit copy later
- Nested sections map cleanly to page areas (`nav.home`, `hero.title`, `faq.q1`, …)
- Matches the “use .yaml if needed” requirement

**Runtime strategy (static-friendly)**

1. Keep **YAML as the only translation source of truth** under `i18n/`.
2. Ship a tiny browser-side loader that either:
   - **Option A (recommended for simplicity):** convert YAML → JSON once into `static/i18n/*.json` (or one bundled object in `static/js/i18n-data.js`) at edit time / optional npm script, then `fetch` or script-include at runtime; **or**
   - **Option B:** `fetch('i18n/en.yaml')` + parse with a lightweight YAML subset parser / CDN `js-yaml` (adds a dependency and FOUC risk if not cached).

**Decision for implementation:** Prefer **Option A** — edit YAML, optional `npm run build:i18n` (or commit generated JSON alongside YAML). Page loads JSON (fast, no CDN YAML parser). English strings remain in HTML as progressive default before JS runs.

### Markup pattern

```html
<!-- text content -->
<a href="#home" data-i18n="nav.home">Home</a>

<!-- attribute (placeholder, aria-label, title) -->
<input data-i18n-placeholder="form.name_placeholder" placeholder="Your full name" />

<!-- rich HTML (FAQ answers with <strong>) -->
<p data-i18n-html="faq.a1">…</p>
```

### Language switcher UX

- Place in **navbar** (desktop + mobile menu): compact control  
  `EN · मरा · हिं` or a `<select>` / button group labeled for a11y.
- Persist choice: `localStorage['tz-lang']` = `en` | `mr` | `hi`.
- On load: read storage → else browser `navigator.language` (`mr*`, `hi*`) → else `en`.
- On switch: apply all keys, set `<html lang="…">`, update `document.title` + meta description when keys exist, mark active language on switcher.

### Fonts for Devanagari

- Add **Noto Sans Devanagari** (or Noto Sans + Noto Sans Devanagari) via Google Fonts when `lang` is `mr` or `hi`.
- Keep Inter/Poppins for Latin; body font-family should include Devanagari fallback so Marathi/Hindi render cleanly.

### What stays untranslated

| Keep as-is | Reason |
|------------|--------|
| Brand name **TeamzEffort** | Proper noun / brand |
| Learner names (Devendra Dalvi, …) | Proper nouns |
| WhatsApp group URL | External |
| Country `<option value="…">` values | Form data stability (labels may be translated) |
| Step numbers `01`–`04` | Universal |
| Logo image alts that are decorative | Empty `alt=""` stays |

### SEO / meta (index)

- Translate `title`, meta description, `og:title`, `og:description`, `twitter:*` via i18n keys when language changes (client-side).
- JSON-LD FAQ text: optional phase-2 update on language change; default English in HTML is OK for crawlers that do not run JS.
- Do **not** require separate URLs (`?lang=mr`) in v1; optional `?lang=` query support is nice-to-have for sharing.

---

## String inventory (keys by section)

Use nested YAML. Approximate key map for `en.yaml` (and mirrored in `mr` / `hi`):

### `meta`
- `title`, `description`, `og_title`, `og_description`

### `a11y`
- `skip_to_main`, `nav_main`, `nav_mobile`, `toggle_menu`, `lang_switcher`

### `nav`
- `home`, `about`, `curriculum`, `how_it_works`, `stories`, `faq`, `enroll`

### `hero`
- `badge`, `title_line1`, `title_highlight`, `subtitle`
- `cta_enroll`, `cta_curriculum`
- `chip_beginner`, `chip_selfpaced`, `chip_whatsapp`
- `sound_on`, `sound_off`, `sound_aria_on`, `sound_aria_off`, `video_label`

### `trust`
- Four stat titles + subtitles (`practical`, `modules`, `community`, `flexible` + descriptions)

### `about`
- `eyebrow`, `heading`, `body`, `quote`
- Feature cards: title + body × 4

### `curriculum`
- `eyebrow`, `heading`, `intro`
- Nine modules: `title`, `body`, `outcome` each
- `cta_enroll`

### `process`
- `eyebrow`, `heading`, `intro`
- Steps 1–4: `title`, `body`

### `stories`
- `eyebrow`, `heading`, `intro`
- Six quotes + role lines (names stay English/Latin)
- `cta_enroll`
- `stars_label` (aria)

### `faq`
- `eyebrow`, `heading`, `intro`
- Five pairs: `q1`…`q5`, `a1`…`a5` (HTML allowed in answers)

### `contact`
- `eyebrow`, `heading`, `body`
- WhatsApp card: `wa_title`, `wa_body`, `wa_cta`
- Form: labels, placeholders, errors, submit, success, error, consent note
- Country option **labels** (optional v1.1)

### `footer`
- `tagline`, `enroll`, `faq`, `whatsapp`, `privacy`, `terms`

**Estimated keys:** ~120–160 strings per language.

---

## YAML schema example

```yaml
# i18n/en.yaml
meta:
  title: "Learn Digital Marketing | TeamzEffort Program"
  description: "TeamzEffort is a digital marketing learning program..."

nav:
  home: "Home"
  about: "About"
  curriculum: "Curriculum"
  how_it_works: "How It Works"
  stories: "Stories"
  faq: "FAQ"
  enroll: "Enroll Now"

hero:
  badge: "Digital Marketing Learning Program"
  title_line1: "Learn Digital Marketing Skills That"
  title_highlight: "Grow Your Career"
  # ...
```

Same structure in `mr.yaml` / `hi.yaml` with Devanagari copy.

---

## Implementation plan (ordered)

### Phase 0 — Plan (this document)
- [x] Define languages, architecture, inventory, acceptance criteria
- [x] Track TODOs in this file + agent TODO list

### Phase 1 — Scaffold
- [x] Create `i18n/en.yaml` with **all** keys (English extracted from current `index.html`)
- [x] Create `i18n/mr.yaml` and `i18n/hi.yaml` skeletons (same keys; fill translations)
- [x] Choose runtime format: generate `static/i18n/{en,mr,hi}.json` (or single `i18n-data.js`)
- [x] Add optional `npm run build:i18n` if conversion is automated

### Phase 2 — Runtime
- [x] Implement `static/js/i18n.js`:
  - load locale catalog
  - resolve nested keys (`nav.home`)
  - apply `data-i18n` / `data-i18n-html` / `data-i18n-placeholder` / `data-i18n-aria-label`
  - set `document.documentElement.lang`
  - persist + restore language
  - optional `?lang=` query override
- [x] Wire script in `index.html` (defer; run after DOM ready)
- [x] English fallback if key missing

### Phase 3 — Markup instrumentation
- [x] Add language switcher UI (navbar desktop + mobile)
- [x] Tag all user-visible strings in `index.html` with `data-i18n*` (keep English text nodes as defaults)
- [x] Hook hero sound button labels to i18n keys (they currently set text in JS)
- [x] Hook form validation / success / error strings to i18n

### Phase 4 — Translations
- [x] Complete **Marathi** (`mr`) natural marketing copy (not machine-only tone where possible)
- [x] Complete **Hindi** (`hi`) natural marketing copy
- [x] Review Devanagari line-length on mobile (nav, hero H1, CTAs)

### Phase 5 — Polish
- [x] Load Devanagari-capable font when `mr` / `hi`
- [x] CSS: switcher styles match existing nav (scrolled / menu-open states)
- [x] Ensure no FOUC worse than today (English visible first is OK)
- [x] Test: language switch mid-scroll, form labels, FAQ open state, mobile menu
- [x] Update README with i18n usage notes

### Out of scope for Task 1
- [ ] Full i18n for `privacy.html` / `terms.html` (follow-up task)
- [ ] Server-side locale routes / hreflang multi-URL SEO
- [ ] Translating JSON-LD dynamically (optional later)
- [ ] RTL (not needed for EN/MR/HI)

---

## Acceptance criteria

1. Default load shows **English**; `<html lang="en">`.
2. User can switch to **Marathi** and **Hindi** from the navbar (desktop + mobile).
3. Choice survives refresh (`localStorage`).
4. All major sections translate: nav, hero, trust, about, curriculum, process, stories, FAQ, contact, footer, form UI strings, sound control labels.
5. Missing keys fall back to English without blank UI.
6. Brand name and learner names remain correct.
7. Page still works on GitHub Pages with no backend.
8. Translations live in **YAML** files under `i18n/` as the editable source.
9. No three full copies of `index.html`.

---

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Long Devanagari strings break nav / buttons | Shorter MR/HI labels for nav; allow wrap on CTAs |
| YAML parse in browser is heavy/fragile | Generate JSON/JS from YAML for runtime |
| FOUC or empty text if JS fails | Keep English in HTML as default content |
| Form validation messages stay English | Route all JS-set strings through `t(key)` |
| Fonts missing glyphs | Add Noto Sans Devanagari for `mr`/`hi` |

---

## File checklist (to create/edit)

| Path | Action |
|------|--------|
| `aispace/task_1.md` | This plan / TODO tracker |
| `i18n/en.yaml` | Create |
| `i18n/mr.yaml` | Create |
| `i18n/hi.yaml` | Create |
| `static/i18n/*.json` or `static/js/i18n-data.js` | Create (generated or hand-synced) |
| `static/js/i18n.js` | Create |
| `index.html` | `data-i18n` attrs + switcher + script tag + font |
| `package.json` | Optional `build:i18n` script |
| `README.md` | Document languages |

---

## Progress log

| Date | Note |
|------|------|
| 2026-07-18 | Task planned; architecture and TODOs locked for implementation. |
| 2026-07-18 | Implemented: YAML catalogs (172 keys × 3), build:i18n, i18n.js, switcher, full index.html wiring, Devanagari fonts, README. |

---

*Implementation complete for `index.html`. Follow-ups: privacy/terms i18n if needed.*
