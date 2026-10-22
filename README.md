# Aurea · Elena Repka

Coaching and pilgrimage site in four languages (`/en`, `/de`, `/sk`, `/it`), built with Next.js 16
and exported as static files, hosted on Cloudflare at https://elarepka.com.

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

## Deployment

```bash
npm run deploy   # next build, then wrangler uploads out/ (config: wrangler.toml)
```

Served as static assets on Cloudflare Workers (the successor to Cloudflare Pages, free for static
sites) on `elarepka.com` and `www.elarepka.com`. The first `wrangler` run asks you to log in.

### Contact form

The site is static, so the form can't send mail itself. Set one of these in `.env.production`
(read at build time):

- `NEXT_PUBLIC_FORM_ENDPOINT`: a form service URL (e.g. Formspree). Messages are posted there.
- `NEXT_PUBLIC_CONTACT_EMAIL`: without an endpoint, the form opens the visitor's email app addressed
  to this email (currently a placeholder, `hello@example.com`).

## Client review mode

The client can comment directly on the site: open any page with `?review=<key>`
(e.g. `https://elarepka.com/en/?review=<key>`). The key is remembered in that
browser; `?review=off` turns it off. Regular visitors never load the review code.

- **＋ Comment** (or the C key): hover highlights an element, click opens a popup to comment on it.
  Highlighting text inside the element first quotes that text in the comment.
- **Comments**: list of all comments, filterable by language and page, with Show / Resolve / Delete.
  Each comment records the language the page was shown in (EN/DE/SK/IT), the page, the element and
  its text at the time. Pins mark commented elements (purple = written in another language).

Without a backend (local `npm run dev`, any key), comments stay in that browser's localStorage.
To share them, deploy the small Cloudflare Worker in `review-worker/` (free plan is enough):

```bash
cd review-worker
npx wrangler kv namespace create REVIEW   # paste the id into wrangler.toml
npx wrangler secret put REVIEW_KEY        # a long random string: the key in the review link
npx wrangler deploy                       # prints https://aurea-review.<you>.workers.dev
```

That URL goes in `.env.production` as `NEXT_PUBLIC_REVIEW_ENDPOINT` (already set), so every
production build uses it. Send the client `https://elarepka.com/en/?review=<REVIEW_KEY>`.

To read the comments locally, put `REVIEW_ENDPOINT` and `REVIEW_KEY` in `.env.local` and run
`npm run comments`. It writes `feedback/comments.json` and prints the open comments by page and language.

## Before launch

- Replace the placeholder testimonials with real ones (or remove the section).
- Set Elena's real contact email or a form endpoint.
- Add real Privacy and Imprint pages (an Impressum is legally required in Austria and Germany).
- Have native speakers review DE, SK and IT.
