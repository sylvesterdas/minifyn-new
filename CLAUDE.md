# backend
Full details: `AGENTS.md` (read only the relevant section when needed).

- Next.js 16 has breaking changes: read `node_modules/next/dist/docs/` before coding.
- Stack: Next 16, React 19, Tailwind v3, Radix, Firebase RTDB/Admin, pnpm, Vercel, Vitest, Playwright.

## Commands
- `npm run typecheck`, `npm test`, `npm run build`
- `npm run dev -- --port 9002`
- E2E: `node scripts/e2e-*.mjs`

## Rules
- Payments: Razorpay (INR), PayPal (USD PPP) in `src/lib/plans.ts`, `src/lib/paypal.ts`, `src/lib/geo.ts`.
- Pricing JSON-LD from `PRICING_CONFIG`, never hardcoded.
- `scamguard/page.tsx` `softwareVersion` = ScamGuard `pubspec.yaml`.
- Lowercase canonical app routes; CamelCase 301-redirects.
- `/api/scamguard/v1/*` only for Play-Integrity clients.
- Short links: `src/app/[slug]/route.ts` (307); analytics in `analytics_summary` via `encodeRtdbKey`.
- Follow AGENTS.md for SSRF, blocked extensions, Pro gates, env vars before touching those areas.
- URL Shortener extension (published, `browser-extension/`): separate from ScamGuard extension, user API key via `POST /api/shorten`, minimal permissions, no auto-publish.
