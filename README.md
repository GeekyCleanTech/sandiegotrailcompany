# San Diego Trail Company

Marketing website for **San Diego Trail Company** — guided horseback trail rides, ranch stays, equine programs, and horse rescue in Poway, CA.

- **Live site:** https://sdtc.pages.dev
- **Stack:** [Astro](https://astro.build) 6 + [Tailwind CSS](https://tailwindcss.com) v4 (based on the [AstroWind](https://github.com/onwidget/astrowind) template)
- **Hosting:** Cloudflare Pages (auto-deploys on every push to `main`)

## Pages

| Route                 | Page             |
| --------------------- | ---------------- |
| `/`                   | Home             |
| `/ride-and-learn`     | Ride & Learn     |
| `/stay-and-celebrate` | Stay & Celebrate |
| `/give-and-support`   | Give & Support   |

## Local development

Requires Node.js **>= 22.12.0**.

```bash
npm install        # install dependencies
npm run dev        # start dev server at http://localhost:4321
npm run build      # build the production site to ./dist/
npm run preview    # preview the production build locally
```

## Deploying

Cloudflare Pages builds automatically on every push to `main`:

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Environment:** `NODE_VERSION = 22.12.0`

To deploy a change, commit and push to `main` — Cloudflare rebuilds and publishes within a couple of minutes.

## Project structure

```
public/
  images/            # photos + logo (referenced as /images/...)
  videos/            # hero background videos (/videos/...)
src/
  components/sdtc/   # Header, Footer, ServiceCard (site-specific components)
  layouts/           # Layout.astro (base <head>) + SiteLayout.astro (header/footer wrapper)
  pages/             # index, ride-and-learn, stay-and-celebrate, give-and-support, 404
  components/CustomStyles.astro   # brand colors + fonts
  config.yaml        # site name, SEO defaults, theme
```

## Brand tokens

Colors and fonts live in `src/components/CustomStyles.astro`:

| Token         | Value     | Use                                   |
| ------------- | --------- | ------------------------------------- |
| Saddle Brown  | `#3B2314` | Headlines, nav, footer, dark sections |
| Sunbaked Gold | `#C49A3C` | CTA buttons, accents                  |
| Canyon Sage   | `#8A9E7B` | Eyebrow labels, dividers, icons       |
| Warm Linen    | `#F5F0E8` | Page background                       |
| Charcoal      | `#2C2C2C` | Body text                             |

Fonts: **Cormorant Garamond** (headings) and **DM Sans** (body), loaded via Google Fonts.

---

Converted from a Figma Make design to AstroWind. Contact info and booking links point to [sandiegotrailcompany.com](https://sandiegotrailcompany.com).
