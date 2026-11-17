# sotercare-website

The Next.js marketing site behind **[sotercare.com](https://sotercare.com)**: the B2B care-home product site, news, the [SoterCare Developers](https://sotercare.com/community) community page, the pitch page and the Book a demo popup. The repo was renamed from `web-dev-v2`. The care-home dashboard was removed from here (`e88ba1e`) and now lives in the separate `sotercare-console` repo.

Built collaboratively by student developers. See [SoterCare Developers](https://github.com/SoterCare/community) for the community behind it.

## Features

- **Product site** — hero, mission, product, features, pricing, team, and FAQ sections with GSAP-driven scroll animation and Lenis smooth scrolling
- **Community page** — [`/community`](https://sotercare.com/community): the student developer community, its events, impact figures, partners, and GitHub links
- **News** — [`/news`](https://sotercare.com/news) index and per-article pages, statically generated from a JSON-backed store
- **Newsroom editor** — `/editnews`, a protected editor for creating and updating articles, with image cropping
- **Pitch page** — `/pitch`, the pitch deck viewer
- **Book a demo, newsletter and waitlist** — popups backed by server actions
- **SEO** — generated `sitemap.xml` and `robots.txt`, `llms.txt`, JSON-LD structured data, per-route metadata
- **Email** — transactional sending via Resend with React Email templates

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | **Next.js 16** (App Router) |
| Language | **TypeScript** |
| Styling | **Tailwind CSS** · `styled-components` |
| Animation | **GSAP** + `@gsap/react` · **Lenis** smooth scroll |
| Email | **Resend** + `@react-email/components` |
| Icons | **lucide-react** |
| Analytics | **@vercel/analytics** |

## Project structure

```
src/
  app/
    page.tsx            homepage
    community/          community page
    news/               news index + [slug] article pages
    pitch/              pitch page
    editnews/           newsroom editor
    actions.ts          server actions (newsletter, waitlist, Book a demo e-mails via Resend)
    llms.txt            llms.txt for AI crawlers
    sitemap.ts          generated sitemap
    robots.ts           generated robots.txt
  components/           page sections and popups
  lib/                  data access helpers (news store, etc.)
data/
  news.json             news article source of truth
public/assets/          images, logos, and event photos
```

## Running locally

```bash
git clone https://github.com/SoterCare/sotercare-website.git
cd sotercare-website
npm install
npm run dev             # http://localhost:3000
```

Email features need environment variables (for example the Resend key). Without them the public pages still render.

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm start        # serve the production build
npm run lint     # ESLint
```

## Contributors

Built by student developers in the SoterCare Developers community — Daham, Hirusha, Komudi, Kaweesha, Nimna, and Sanjula. See the [contributors graph](https://github.com/SoterCare/sotercare-website/graphs/contributors) for the full record.

## Related repositories

- [sotercare-links](https://github.com/SoterCare/sotercare-links) — links.sotercare.com
- [community](https://github.com/SoterCare/community) — events, guides, and how to get involved

---

<sub>Maintained by <a href="https://github.com/SoterCare">SoterCare Developers</a>.</sub>
