# TeamzEffort — Learning Program Landing Page

Modern landing page for **TeamzEffort**, a **digital marketing learning program** for individuals. Optimized for Instagram, Facebook, and Google ad traffic. Deployable on **GitHub Pages**.

## Who / What / Why

| Question | Answer on the page |
| --- | --- |
| Who are you? | Hero + About (learning platform + mentors) |
| What do you teach? | Curriculum grid (marketing, brand, design, web, ads, SEO, content) |
| Why join? | Trust bar, process, learner stories, FAQ, WhatsApp community |

## Stack

- `index.html` + small static pages (`privacy.html`, `terms.html`)
- [Tailwind CSS](https://tailwindcss.com) **built** to `static/css/styles.css` (not CDN)
- Vanilla HTML, CSS, and JavaScript
- Google Fonts: **Poppins** + **Inter** + **Noto Sans Devanagari** (Marathi / Hindi)
- Client-side i18n: English (default), Marathi, Hindi — YAML source in `i18n/`
- JSON-LD (Organization, Course, FAQPage)
- Semantic markup (ARIA FAQ, skip link)

## Languages (i18n)

| Code | Language | Default |
|------|----------|---------|
| `en` | English | Yes |
| `mr` | Marathi (मराठी) | |
| `hi` | Hindi (हिन्दी) | |

- Edit copy in `i18n/en.yaml`, `i18n/mr.yaml`, `i18n/hi.yaml`
- Run `npm run build:i18n` to regenerate `static/i18n/*.json` and `static/js/i18n-data.js`
- Navbar language switcher persists choice in `localStorage` (`tz-lang`)
- Optional URL: `?lang=mr` or `?lang=hi`
- English remains in HTML as progressive default if JS fails

## Sections

1. Sticky navbar + mobile menu (solid panel + backdrop)
2. Hero (program CTAs)
3. Trust / program highlights bar
4. About
5. Curriculum (skills modules + outcomes)
6. How it works (4 steps)
7. Learner stories
8. FAQ accordion
9. Enroll / contact form + **WhatsApp community group only**
10. Basic footer (year, Privacy, Terms, group link)

## Local preview

```bash
npm install
npm run build
npx serve .
```

Or open `index.html` after building CSS and i18n.

### Build scripts

```bash
npm run build:css    # Tailwind → static/css/styles.css
npm run build:i18n   # i18n/*.yaml → static/i18n/*.json + static/js/i18n-data.js
npm run build        # i18n + CSS
npm run watch:css    # while editing classes
```

Source: `src/input.css` → output: `static/css/styles.css`.

## Deploy on GitHub Pages

Root deployment from `main` (`index.html` at repository root).

1. Push to GitHub.
2. **Settings → Pages** → Deploy from branch `main` / folder `/ (root)`.
3. Site URL: `https://atharvapawar456.github.io/TeamzEffortPage/`

Update `canonical`, Open Graph image URLs, `robots.txt`, and `sitemap.xml` if the live domain changes.

## Notes

- Primary CTA language is unified: **Enroll Now**.
- Only WhatsApp entry point: community group invite.
- Form is client-side validation for now; wire to a backend/Formspree when ready.
- After enrollment submit, copy states follow-up via **WhatsApp group + DM**.
