# Serena — life coaching showcase

Next.js 16 (App Router) site in four languages: `/en`, `/de`, `/sk`, `/it`.
Visitors to `/` are redirected to their browser language (`src/proxy.ts`).

```bash
npm run dev      # http://localhost:3000
npm run build
```

## Where things live

| What | File |
|---|---|
| All text, per language | `src/i18n/dictionaries/{en,de,sk,it}.json` — wrap a word in `*stars*` for the italic accent |
| Colours, spacing, animations | `src/app/globals.css` (tokens at the top) |
| Fonts (Fraunces + DM Sans) | `src/app/[locale]/layout.tsx` |
| Sections | `src/components/` |
| Contact form handler | `src/app/actions.ts` |

## Adding your media

- **Hero video**: put it at `public/video/hero.mp4` (and optionally `hero.webm`).
  Aim for 10–20 s, seamless loop, no audio, 1920px wide, under ~6 MB. Until it exists, a warm gradient shows.
- **Portrait**: `public/images/portrait.jpg` (portrait orientation, ~1200×1500).

## Still to do before launch

- Connect the contact form to an email service (see the TODO in `src/app/actions.ts`) — right now it only logs to the server.
- Replace placeholder copy, name, stats and testimonials; have native speakers review DE/SK/IT.
- Add real Privacy & Imprint pages (Impressum is legally required in DE/AT).
