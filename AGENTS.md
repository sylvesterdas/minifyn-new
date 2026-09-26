<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# MiniFyn backend agent guidance
URL shortener, link management, developer tools, and app marketing/APIs for the MiniFyn apps.

## Stack
- Next.js 16.3.1 (App Router, Turbopack, Server Actions), React 19.2.8, Tailwind v3, Radix, Lucide.
- Firebase Realtime Database + `firebase-admin`.
- pnpm v11+; overrides and native builds in `pnpm-workspace.yaml`.
- Vercel serverless, free tier; `output: 'standalone'` stays disabled.
- Tests: Vitest v4 (jsdom) and Playwright.

## Commands
- `npm run typecheck`, `npm test`, `npm run build`, `npm run dev -- --port 9002`.
- E2E: `node scripts/e2e-geo-verification.mjs`, `node scripts/e2e-pricing-and-billing.mjs`.

## Payments (PPP)
- Country comes from `x-vercel-ip-country` (`src/lib/geo.ts`). `IN` gets INR via Razorpay; everyone else gets USD at a regional tier. Users can switch on `/pricing`. Never expose tier names.
- India: ₹149/mo, ₹999/yr.
  - Razorpay supports UPI, RuPay, cards and netbanking.
  - Code: `src/app/payments/actions.ts`; webhook `/api/payment/webhook`.
- USD tiers are set in `src/lib/plans.ts` (`PRICING_CONFIG`):
  - T1: $4.99/mo, $39/yr.
  - T2: $2.99/mo, $24/yr.
  - T3: $1.49/mo, $12/yr.
- USD checkout uses Razorpay card first, then PayPal subscriptions.
  - Code: `src/lib/paypal.ts`, `src/app/payments/paypal-actions.ts`.
  - Webhook: `/api/payment/paypal/webhook`.

## Env vars
- One set of names, with no `_TEST_` prefixes. Vercel injects live values in Production and test values in Preview/Dev.
- Sensitive (never print or commit):
  - `FIREBASE_PRIVATE_KEY`
  - `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
  - `PAYPAL_CLIENT_SECRET`
  - `SMTP_PASS`
  - `LINKGUARD_PLAY_SERVICE_ACCOUNT_JSON`, `LINKGUARD_ENTITLEMENT_SIGNING_SECRET`, `LINKGUARD_RECOVERY_SIGNING_SECRET`
- Non-sensitive:
  - `FIREBASE_CLIENT_EMAIL`
  - `RAZORPAY_KEY_ID` (`rzp_live_*`/`rzp_test_*`), `RAZORPAY_MONTHLY_PLAN_ID`, `RAZORPAY_YEARLY_PLAN_ID`
  - `PAYPAL_CLIENT_ID`, `PAYPAL_WEBHOOK_ID`, `PAYPAL_ENVIRONMENT` (`live`/`sandbox`)
  - SMTP settings: ZeptoMail in Prod, Mailtrap in Dev.
    - `SMTP_HOST`
    - `SMTP_PORT` (587/2525)
    - `SMTP_USER`
    - `SMTP_FROM` (`MiniFyn <noreply@minifyn.com>`)

## Cross-repo sync (manual; drifts silently)
- `src/app/(apps)/scamguard/page.tsx` JSON-LD `softwareVersion` = `ScamGuard/pubspec.yaml` semver without the build number. Check it right after every ScamGuard release.
- `src/app/(marketing)/pricing/page.tsx` JSON-LD `OfferCatalog` must derive from `PRICING_CONFIG`; never hardcode currency or amounts.

## SEO and routing
- App pages: `/scamguard`, `/clipfyn`, `/censorfyn` (`src/app/(apps)/*/page.tsx`). Each has `MobileApplication`, `FAQPage` and `BreadcrumbList` JSON-LD.
- `next.config.mjs` 301-redirects the CamelCase variants and `/LinkGuard` to the lowercase pages.
- `/api/scamguard/v1/*` (`check`, `policy`, `model-manifest`, `announcements/send`) is only for Play Integrity-verified clients, never public web widgets. `/api/linkguard/*` and `/api/scamguard-ai/*` are compatibility-only.

## Links
- `mnfy.in/[slug]` and `/go/[slug]` go through route handlers (`src/app/[slug]/route.ts`): a 307 with no SSR.
- Analytics are daily buckets at `analytics_summary/${slug}/${YYYY-MM-DD}`, to stay on the Firebase Spark plan.
  - Encode keys with `encodeRtdbKey`/`decodeRtdbKey`.
  - Keep legacy raw-log compatibility in `src/app/dashboard/actions.ts`.
- `slug+` (or `%2B`) and `/info/[slug]` show the inspection page: destination, Web Risk rating, creation date and clicks. Never log a click there.
- On create, check for:
  - Private IPs and DNS rebinding (SSRF).
  - Web Risk threats.
  - Blocked executable extensions: `.exe .msi .apk .bat .cmd .vbs .scr .pif .hta .iso .jar .com .wsf .cpl`.
  - Non-HTTP(S) schemes (blocked).
  Forms use honeypots.

## Pro
- 100 links/day, permanent links (free links expire in 60 days, guest links in 7), 1-year analytics, alias priority.
- Hide AdSense (`src/components/ad-banner.tsx`) for `pro` and `admin`.
- Free links show an amber expiry badge that links to upgrade.

## Status
- Live:
  - ScamGuard: v2.5.0+77, model v22.
  - ClipFyn and CensorFyn: Production.
  - Web tools: minifier, JSON, JWT, QR, `/tools/link-expander`.
  - Docs: `/help`, `/docs`.
  - `scamguard-studio` marketing cockpit.
- Priorities: two separate desktop extensions (MiniFyn Shortener here, ScamGuard Link Checker in ScamGuard) and in-product guidance.

## MiniFyn URL Shortener extension (published, `browser-extension/`)
**Boundaries**
- Source, tests, assets and CI go in an extension-specific directory here. No ScamGuard logic or branding.
- MV3 toolbar popup and context menu that shorten the current HTTP(S) page or a chosen link.
  - Editable URL, one-click copy, clear errors, a link to the dashboard.
  - No page-content access.
- Users paste a key from `/dashboard/settings/api-keys`.
  - `POST /api/shorten` with `Authorization: Bearer <key>`, `{ "url": ... }` returns `shortUrl`. It rewrites to the Go service, so validate the deployed contract before release.
  - No new auth or payment system.
- Disclose that the URL and key go to MiniFyn.
- Key handling:
  - Never send it to third parties or telemetry, put it in URLs, log it, or commit it.
  - Mask it and provide remove-key.
  - Use local storage, not sync storage.
  - Warn about shared browser profiles; revocation happens in the dashboard.
- Validate HTTP(S) and show distinct errors: unsafe URL, 401/revoked, daily limit, network, timeout.
  - Never imply a short link is safe.
  - Prevent duplicate submits; copy only a successful URL.
- First release: no background collection, auto-shortening, content scripts or broad permissions. Minimum permissions, with access only to the MiniFyn API origin.

**Gates**
1. Browser-neutral core with a Chrome/Edge MV3 adapter. Firefox, Opera and Safari come later (Safari needs Apple packaging).
2. Tests:
   - URL selection, schemes, API handling, key replace/remove.
   - 401/429, retry, copy, no key leakage.
   - Real-browser popup and context-menu tests against a test endpoint, checking account and plan limits.
   - Production smoke tests stay non-destructive and use a dedicated test key.
3. Standalone extension CI:
   - Lint, typecheck, tests and minified build.
   - Secret/unwanted-file scan.
   - Manifest/permission validation.
   - ZIP artifact.
   Re-run contract tests when `/api/shorten`, its rewrite or key validation changes. Never auto-publish from the website pipeline.
4. Independent version and tag; reproducible package with checksums. Chrome first, then Edge.
   - Report built, submitted, approved and live separately.
   - Publishing needs review and explicit authorisation.
5. Before submitting, have privacy/support pages, truthful data-use and permission text, real screenshots and a setup/revocation guide. The listing stays separate from ScamGuard's.
6. Confirm the Chrome Web Store and Edge Partner Center publisher accounts (fee, verified email, 2FA). Store credentials go in store/CI secrets, never the repo.
