# Deploying fredzirbel.com to Cloudflare Pages

One-time setup, then every push to `main` deploys automatically.

## 1. Push the repo to GitHub

Create a repo named `fredzirbel.com` under your account, then:

```bash
git remote add origin https://github.com/fredzirbel/fredzirbel.com.git
git push -u origin main
```

## 2. Create the Cloudflare Pages project

1. Sign up / log in at https://dash.cloudflare.com (free plan is fine)
2. Workers & Pages -> Create -> Pages -> Connect to Git
3. Authorize GitHub and select `fredzirbel/fredzirbel.com`
4. Build settings:
   - Framework preset: **Next.js (Static HTML Export)**
   - Build command: `npm run build`
   - Build output directory: `out`
5. Save and Deploy. First build takes 1-2 minutes; you get a
   `*.pages.dev` preview URL immediately.

## 3. Point fredzirbel.com at Cloudflare

Recommended: move DNS to Cloudflare (free, and Pages custom domains
become one click).

1. In the Cloudflare dashboard: Add a domain -> `fredzirbel.com` (Free plan)
2. Cloudflare shows two nameservers. At your registrar (wherever you
   bought fredzirbel.com), replace the existing nameservers with those two.
3. Wait for propagation (minutes to a few hours)
4. Back in Workers & Pages -> your project -> Custom domains -> add
   `fredzirbel.com` (and `www.fredzirbel.com` if you want the redirect).
   Cloudflare creates the DNS records and provisions HTTPS automatically.

## 4. Verify

- https://fredzirbel.com loads with a valid certificate
- https://fredzirbel.com/rss.xml and /sitemap.xml respond
- Response headers include CSP, HSTS, nosniff, and the Permissions Policy
- Push a trivial commit and confirm a new deploy runs

## Email: me@fredzirbel.com

The site and resume use me@fredzirbel.com. Once the domain's DNS is on
Cloudflare: dashboard -> Email -> Email Routing -> enable, create a
custom address `me@fredzirbel.com` forwarding to your Proton inbox,
and let Cloudflare add the MX/SPF records. Free, takes 2 minutes.
(To also SEND from that address, configure it in Proton as an external
address or use Proton's custom-domain support.)

## Notes

- Security and cache headers live in public/_headers; Cloudflare Pages
  copies this file into the static output and applies it to matching responses
- Preview pages.dev hosts are marked noindex; the production custom domain
  remains indexable
- Next.js 16.2.10 currently brings PostCSS 8.4.31 through its supported
  dependency tree. Its moderate advisory is monitored pending a compatible
  upstream Next.js fix; do not use npm audit fix --force or override the
  nested PostCSS version
- Cloudflare Web Analytics (privacy-friendly, free) can be enabled from
  the dashboard without any code changes
