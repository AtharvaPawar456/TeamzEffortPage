# TeamzEffort — Landing Page

Modern, high-converting digital marketing agency landing page for **TeamzEffort**. Built as a single static page optimized for Instagram, Facebook, and Google ad traffic and ready to deploy on **GitHub Pages**.

## Who / What / Why

| Question | Answer on the page |
| --- | --- |
| Who are you? | Hero + About (creative digital team) |
| What do you provide? | Services grid (12 offerings) |
| Why trust you? | Stats, Why Choose Us, testimonials, process |

## Stack

- Single `index.html` (no build step)
- [Tailwind CSS](https://tailwindcss.com) via CDN
- Vanilla HTML, CSS, and JavaScript
- Google Fonts: **Poppins** + **Inter**
- Semantic, accessible markup (ARIA, keyboard FAQ, skip link)

## Sections

1. Sticky navbar + mobile hamburger  
2. Hero (CTAs, glassmorphism visual)  
3. Animated statistics  
4. About team  
5. Services  
6. Why choose us  
7. Portfolio preview  
8. Work process (4 steps)  
9. Testimonials  
10. FAQ accordion  
11. Contact form (client-side validation)  
12. Footer + WhatsApp FAB  

## Local preview

Open the file in a browser:

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

Or serve with any static server:

```bash
npx serve .
```

## Deploy on GitHub Pages

This repo is set up for **root deployment** from the `main` branch (`index.html` at the repository root).

### Option A — GitHub UI

1. Push this repository to GitHub (if not already).
2. Open **Settings → Pages**.
3. Under **Build and deployment**:
   - **Source:** Deploy from a branch  
   - **Branch:** `main`  
   - **Folder:** `/ (root)`  
4. Click **Save**.
5. After a minute or two, the site will be live at:

   `https://<your-username>.github.io/TeamzEffortPage/`

   (Exact URL is shown on the Pages settings screen.)

### Option B — GitHub CLI

```bash
gh api repos/{owner}/{repo}/pages -X POST -f build_type=legacy -f source[branch]=main -f source[path]=/
```

Or enable Pages in the repo settings after the first push.

### Custom domain (optional)

1. Add a `CNAME` file in the repo root with your domain (e.g. `www.teamzeffort.com`).
2. Point DNS (A/CNAME records) as described in [GitHub Pages custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Customize before going live

Update placeholders in `index.html`:

| Item | Search for |
| --- | --- |
| Email | `hello@teamzeffort.com` |
| WhatsApp | `919999999999` (country code + number, no `+`) |
| Social links | Instagram / Facebook / LinkedIn `href`s |
| Stats / testimonials | Real client data when available |
| Portfolio images | Replace SVG data-URI placeholders with real project images |
| Contact form | Wire to [Formspree](https://formspree.io), Netlify Forms, or your API |

### Form backend example (Formspree)

Change the form tag to:

```html
<form id="contact-form" action="https://formspree.io/f/YOUR_ID" method="POST">
```

and adjust the submit handler if you want server-side submission instead of the demo success message.

## Design tokens

| Token | Value |
| --- | --- |
| Primary | `#2563EB` |
| Secondary | `#0F172A` |
| Accent | `#06B6D4` |
| Background | `#F8FAFC` |
| Text | `#334155` |
| Success | `#22C55E` |

## License

MIT — see [LICENSE](LICENSE).
