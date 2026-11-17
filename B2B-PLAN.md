# sotercare-website: B2B plan

The public marketing site only, deployed separately from the care-home console.

- Next.js, SEO, analytics, Book a demo form
- Content and claims must stay within **wellness** positioning: no "medical", "diagnosis" or "guaranteed alert" wording

## Origin: this is `web-dev-v2`, renamed (D-20)
- GitHub **`SoterCare/web-dev-v2` was renamed to `SoterCare/sotercare-website`**, keeping its full history, branches and issues. GitHub redirects the old URL
- `main` is **already** the B2B marketing site:
  - B2B repositioning merged;
  - community and news pages, editnews, pitch page;
  - Book a demo popup;
  - SEO (`robots`, `sitemap`, `llms.txt`).
- The dashboard and carer login were removed in `e88ba1e`. That code goes to `sotercare-console`, created from this repo at `4837021`
- The `phase-1/alert-reliability` branch holds dashboard changes. They go to `sotercare-console` and are **not** merged into `main`
- Separate repo: `sotercare-links` (links.sotercare.com) stays as it is
