# Aurea · Elena Repka

Coaching and pilgrimage site in four languages (`/en`, `/de`, `/sk`, `/it`), built with Next.js 16
and exported as static files for GitHub Pages.

```bash
npm run dev      # http://localhost:3000
npm run build    # static site in /out
```

## Pages

| Page | File |
|---|---|
| Landing | `src/app/[locale]/page.tsx` |
| My journey | `src/app/[locale]/journey/page.tsx` |
| La Via del Cuore (pilgrimage) | `src/app/[locale]/pilgrimage/page.tsx` |
| Research | `src/app/[locale]/research/page.tsx` |
| `/` (redirects to the visitor's language) | `src/app/(root)/page.tsx` |

## Where things live

| What | File |
|---|---|
| All text, per language | `src/i18n/dictionaries/{en,de,sk,it}.json`. Wrap a word in `*stars*` for the italic accent, `\n` for a line break. English is the fallback for anything missing. |
| Colours, spacing, animations | `src/app/globals.css` (tokens at the top) |
| Fonts (Cormorant Garamond + Inter) | `src/app/[locale]/layout.tsx` |
| Sections | `src/components/` |
| Photos | `public/images/` (each component lists its photos at the top) |

## Deployment (GitHub Pages)

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to
`https://<user>.github.io/<repo>/`. One-time setup: **Settings → Pages → Source: GitHub Actions**.

The site is served from a sub-folder, so internal links, images and video go through `withBase()`
(`src/lib/basePath.ts`). To test the published build locally, build with
`NEXT_PUBLIC_BASE_PATH=/ElaWebsite npm run build` and serve `out/` under `/ElaWebsite/`.

### Contact form

The site is static, so the form can't send mail itself. Set one of these as repository variables
(and pass them to the build step in the workflow):

- `NEXT_PUBLIC_FORM_ENDPOINT`: a form service URL (e.g. Formspree). Messages are posted there.
- `NEXT_PUBLIC_CONTACT_EMAIL`: without an endpoint, the form opens the visitor's email app addressed
  to this email (currently a placeholder, `hello@example.com`).

## Before launch

- Replace the placeholder testimonials with real ones (or remove the section).
- Set Elena's real contact email or a form endpoint.
- Add real Privacy and Imprint pages (an Impressum is legally required in Austria and Germany).
- Have native speakers review DE, SK and IT.
