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
- https://fredzirbel.com/rss.xml and /sitemap-index.xml respond
- Push a trivial commit and confirm a new deploy runs

## Email: me@fredzirbel.com

The site and resume use me@fredzirbel.com. Once the domain's DNS is on
Cloudflare: dashboard -> Email -> Email Routing -> enable, create a
custom address `me@fredzirbel.com` forwarding to your Proton inbox,
and let Cloudflare add the MX/SPF records. Free, takes 2 minutes.
(To also SEND from that address, configure it in Proton as an external
address or use Proton's custom-domain support.)

## Notes

- Security headers (CSP, HSTS, etc.) can be added later via a
  `public/_headers` file, which Cloudflare Pages picks up natively
- Cloudflare Web Analytics (privacy-friendly, free) can be enabled from
  the dashboard without any code changes
