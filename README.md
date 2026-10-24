# SKANDA EVENTS — website

Single-page React (Vite) site: Hero · Services · Gallery · About · Contact · Footer.
Black-and-gold design, WhatsApp/phone actions, accessible photo viewer, optional Three.js gold-ring accent.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the production build
npm run check      # lint + build
```

Optional: set `SITE_URL=https://your-domain/` (in `.env`) before building to get a canonical URL and absolute social-image links.

## Add the real business images

Put the **original, full-resolution** files here (JPG / PNG / WebP / AVIF / TIFF; convert HEIC first):

| Folder | What goes there |
| --- | --- |
| `media/logo/` | The gorilla logo. `skanda-logo.png` is the supplied logo with only the white corners outside the circle made transparent (original kept in `media/source/`). |
| `media/invitation/` | The shop-opening invitation (cropped from the status screenshot; shown in About). |
| `media/gallery/decoration/` | Event decoration photos |
| `media/gallery/birthdays/` | Birthday photos |
| `media/gallery/weddings/` | Wedding set-up / entry photos |
| `media/gallery/fireworks-effects/` | Cold pyro, spark and smoke-entry photos |
| `media/hero/` | Optional: one photo to use as a dimmed hero backdrop |
| `media/services/` | Optional: photo for a service card's round badge, named by service id (`balloon-decor.jpg`, `mascots.jpg`, `theme-decoration.jpg`, …). The current balloon and mascot badges are cropped from the invitation; replace them with real photos for sharper results. |

`npm run dev` / `npm run build` automatically create resized WebP + JPEG/PNG copies (never upscaled, max 3840px wide),
favicons and the social-share image from the logo. In dev, adding files reloads the page.

- The **Gallery** section (and its nav link) appears only once gallery photos exist — no empty boxes.
- Service cards show the first photo of their category when available.
- Use only photos of SKANDA EVENTS' own events (no other companies' watermarks).
- Photos are ordered by file name. Optional alt text: `media/captions.json`
  e.g. `{ "gallery/weddings/IMG_0012.jpg": "Floral stage with gold backdrop" }`.

## Edit text / contact details

`src/content/site.js` — WhatsApp number (`whatsapp.number`, country code + number, e.g. `919391076007`),
Instagram URL (`instagram`; leave `''` to hide it), phone numbers, shop location, opening-date notice
(hides itself after 25 Oct 2026), default enquiry message, service copy.

## Deploy (free) — GitHub Pages

`.github/workflows/deploy.yml` builds and publishes the site on every push to `main`.

1. Create an **empty public** repo on GitHub (e.g. `skanda-events`) and push this code to `main`.
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The site goes live at `https://<username>.github.io/<repo>/` (progress: **Actions** tab).

Custom domain later: add it under Settings → Pages, then delete the `BASE_PATH` and `SITE_URL` lines in the workflow.

Also works unchanged on **Vercel / Netlify / Cloudflare Pages** (build `npm run build`, output `dist`).
