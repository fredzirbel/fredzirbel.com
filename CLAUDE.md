# fredzirbel.com - SIGNAL (v2)

Next.js 16 (App Router, static export) + TypeScript + Tailwind CSS 4.
Cinematic portfolio + markdown blog for Fred Zirbel.

## Development

- Dev server: `npm run dev` (Next dev on http://localhost:3000). Use the
  Browser pane preview tools to open it; do not block the shell.
- Build: `npm run build` (static export to `out/`)

## Architecture notes

- `app/` routes; `components/sections/` page sections; `components/fx/`
  client-side effect systems (shader background, wave field, cursor,
  smooth scroll, preloader)
- `content/blog/*.md` posts parsed by `lib/posts.ts` (gray-matter)
- Page background color lives on `html` ONLY (body transparent) - an
  opaque body background paints over fixed effect layers
- Never use `requestIdleCallback` for must-run work (frozen in hidden
  tabs); use load + setTimeout
- All motion respects `prefers-reduced-motion`; `localStorage
  force-motion=1` (html.force-motion) opts back in for testing
- The in-app Browser pane cannot render motion or capture screenshots;
  visual verification requires Fred's real-browser screenshots
