# Deploying fredzirbel.com to Cloudflare Workers (static assets)

One-time setup, then every push to `main` deploys automatically.

## 1. Push the repo to GitHub

Create a repo named `fredzirbel.com` under your account, then:

```bash
git remote add origin https://github.com/fredzirbel/fredzirbel.com.git
git push -u origin main
```

## 2. Create the Worker (Workers Builds)

1. Sign up / log in at https://dash.cloudflare.com (free plan is fine)
2. Workers & Pages -> Create -> Import a repository
3. Authorize GitHub and select `fredzirbel/fredzirbel.com`
4. Build settings:
   - Project name: `fredzirbel-com` (must match `name` in
     `wrangler.jsonc`, or builds fail)
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
5. Save and Deploy. First build takes 1-2 minutes.

`wrangler.jsonc` serves `out/` as static assets, uses `out/404.html` for
unknown paths, and disables the production `workers.dev` host
(`workers_dev: false`), so the site is reachable only on the custom domain.
Manual deploy from a local machine: `npx wrangler login`, then `npm run deploy`.

Docs: https://developers.cloudflare.com/workers/static-assets/ and
https://developers.cloudflare.com/workers/ci-cd/builds/

## 3. Point fredzirbel.com at Cloudflare

Required: Workers custom domains only work when Cloudflare runs the
domain's nameservers.

1. In the Cloudflare dashboard: Add a domain -> `fredzirbel.com` (Free plan)
2. Cloudflare shows two nameservers. At your registrar (wherever you
   bought fredzirbel.com), replace the existing nameservers with those two.
3. Wait for propagation (minutes to a few hours)
4. Back in Workers & Pages -> `fredzirbel-com` -> Settings -> Domains & Routes -> Add -> Custom domain ->
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

- Security and cache headers live in public/_headers; Next copies it into
  `out/` and Workers static assets applies it to matching responses
  (https://developers.cloudflare.com/workers/static-assets/headers/)
- Preview URLs get `X-Robots-Tag: noindex` from Cloudflare automatically;
  `_headers` also marks the production workers.dev host noindex in case
  `workers_dev` is ever re-enabled. The custom domain remains indexable
- `npm run audit:ci` fails CI for every new high or critical advisory. It
  narrowly accepts the documented PostCSS and Sharp advisories inherited
  through Next.js because those packages process only trusted repository
  inputs during this static build and are absent from the exported site.
  Remove each acceptance when Next.js updates its supported dependency tree;
  do not use `npm audit fix --force` or override the nested versions
- Before enabling Cloudflare Web Analytics, update `public/_headers` to allow
  its script host in `script-src` and beacon host in `connect-src`; the current
  CSP intentionally allows only same-origin scripts and connections
