# Skill: Portfolio Deploy

Deployment instructions for pushing the portfolio site to Vercel. Use this skill when Michael asks to deploy or when the build is ready for a live URL.

## Target

Vercel free tier. Static export. No backend, no serverless functions, no database.

## Pre-deploy checklist

Before running any deploy command, verify:

- [ ] `npm run build` passes cleanly with no errors or warnings
- [ ] Lighthouse score is 95+ across all four metrics (Performance, Accessibility, Best Practices, SEO) — run via `npx lighthouse http://localhost:3000 --output json` or Chrome DevTools
- [ ] Tested at 375px (mobile), 768px (tablet), 1440px (desktop) — use browser DevTools
- [ ] No console errors in production build
- [ ] Meta title and description are set in `app/layout.tsx` — not "Create Next App"
- [ ] All `[METRIC — PENDING DRIVE PULL]` placeholders are resolved or intentionally deferred
- [ ] No Oqton product names, customer names, or scrubbed content violations (see `ip-handling`)
- [ ] Favicon is set (replace default Next.js favicon)

## Deploy commands

```bash
# Install Vercel CLI if not present
npm i -g vercel

# From the project root — first deploy (interactive)
vercel

# Subsequent deploys
vercel --prod
```

On first run, Vercel CLI will prompt:
- Set up and deploy? → Yes
- Which scope? → Select Michael's personal account
- Link to existing project? → No (first time)
- Project name: `michael-korman-portfolio` (or similar)
- In which directory is your code? → `./` (current directory)
- Want to override settings? → No

## next.config.ts for static export

If deploying as a fully static site (no Next.js server), add to `next.config.ts`:

```ts
const nextConfig = {
  output: 'export',
  trailingSlash: true,
};
```

This is optional — Vercel handles Next.js App Router natively without static export. Only add `output: 'export'` if there's a specific reason (e.g., hosting on a non-Vercel CDN).

## Custom domain

After first deploy, a `*.vercel.app` URL is immediately shareable. To add a custom domain:
1. Go to vercel.com/dashboard → project → Settings → Domains
2. Add the domain and follow the DNS instructions
3. No code changes required

## Environment variables

There are none. This site has no backend. If a `.env` file exists, do not commit it and do not add it to Vercel.

## Rollback

If a deploy breaks:
```bash
vercel rollback
```
Or use the Vercel dashboard → Deployments → select a prior deployment → Promote to Production.
