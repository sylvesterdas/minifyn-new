<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# MiniFyn Architecture & Developer Guidelines

MiniFyn is a high-performance URL shortener, link management platform, developer utility suite, and mobile security ecosystem built on Next.js 16 (Turbopack) and Firebase.

---

## 🏗️ 1. Tech Stack & Infrastructure

- **Framework**: Next.js `16.3.1` (App Router, Turbopack, Server Actions)
- **UI Library**: React `19.2.8`, Tailwind CSS v3, Radix UI Primitives, Lucide Icons
- **Database & Auth**: Firebase Realtime Database & Firebase Admin SDK (`firebase-admin`)
- **Package Manager**: `pnpm` (v11+; overrides & native builds configured in `pnpm-workspace.yaml`)
- **Deployment**: Vercel Serverless (Free Tier optimized; `output: 'standalone'` disabled for serverless NFT tracing)
- **Test Suite**: Vitest v4 (`jsdom` environment) & Playwright E2E

---

## 💳 2. Payment & Monetization Architecture

MiniFyn uses a **Dual Payment Gateway + Purchasing Power Parity (PPP) Regional Model** to maximize conversion, preserve equity, and minimize transaction fees:

### 🇮🇳 Domestic India (INR) & Global Cards — Razorpay
- **Merchant Account**: `sylvester.das@minifyn.com`
- **India Plans**: Monthly (₹149/mo), Yearly (₹999/yr)
- **Payment Methods**: UPI, RuPay, Domestic Cards, Netbanking, International Credit/Debit Cards (Active)
- **Engine**: [`src/app/payments/actions.ts`](file:///Users/sylvester/Projects/personal/minifyn/backend/src/app/payments/actions.ts)
- **Webhook**: [`/api/payment/webhook`](file:///Users/sylvester/Projects/personal/minifyn/backend/src/app/api/payment/webhook/route.ts)

### 🌍 Global Regional PPP Tiers (USD) — Automated Provisioning
Pricing is automatically resolved based on visitor country via [`src/lib/plans.ts`](file:///Users/sylvester/Projects/personal/minifyn/backend/src/lib/plans.ts) without exposing tier classifications to users:
- **Tier 1 (High Income - US, GB, CA, AU, DE, FR, JP, etc.)**: $4.99/mo, $39.00/yr
- **Tier 2 (Upper-Middle - BR, MX, PL, TR, MY, ZA, etc.)**: $2.99/mo, $24.00/yr
- **Tier 3 (Developing - NP, BD, PK, LK, EG, NG, etc.)**: $1.49/mo, $12.00/yr
- **Checkout Routing**:
  - **Primary**: Razorpay Credit/Debit Card (~5.5% effective take rate).
  - **Secondary**: PayPal Subscriptions (for buyers preferring PayPal wallet).
- **Engine**: [`src/lib/paypal.ts`](file:///Users/sylvester/Projects/personal/minifyn/backend/src/lib/paypal.ts) & [`src/app/payments/paypal-actions.ts`](file:///Users/sylvester/Projects/personal/minifyn/backend/src/app/payments/paypal-actions.ts)
- **Webhook**: [`/api/payment/paypal/webhook`](file:///Users/sylvester/Projects/personal/minifyn/backend/src/app/api/payment/paypal/webhook/route.ts)

### 🌐 Smart Edge Geolocation
- Resolves visitor country at the edge via `x-vercel-ip-country` header ([`src/lib/geo.ts`](file:///Users/sylvester/Projects/personal/minifyn/backend/src/lib/geo.ts)).
- **India (`IN`)**: Serves INR (₹) with Razorpay UPI/Cards default.
- **Rest of World (`!IN`)**: Serves USD ($) at the exact localized regional tier price.
- Users can switch currency if needed on [`/pricing`](file:///Users/sylvester/Projects/personal/minifyn/backend/src/app/(marketing)/pricing/page.tsx).

---

## 🔐 3. Environment Variables Standard

All environment variables follow unified standard names without duplicate `_TEST_` prefixes. Vercel injects live values in Production (marked **Sensitive**) and test values in Preview/Development.

| Variable Name | Description | Sensitivity |
|---|---|---|
| `FIREBASE_CLIENT_EMAIL` | Firebase Admin service account email | Non-sensitive |
| `FIREBASE_PRIVATE_KEY` | Firebase Admin private key | **Sensitive** |
| `RAZORPAY_KEY_ID` | Razorpay Key ID (`rzp_live_*` in Prod, `rzp_test_*` in Dev) | Non-sensitive |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret | **Sensitive** |
| `RAZORPAY_MONTHLY_PLAN_ID` | Razorpay Monthly Plan ID | Non-sensitive |
| `RAZORPAY_YEARLY_PLAN_ID` | Razorpay Yearly Plan ID | Non-sensitive |
| `RAZORPAY_WEBHOOK_SECRET` | Secret to verify Razorpay webhook signatures | **Sensitive** |
| `PAYPAL_CLIENT_ID` | PayPal REST API Client ID | Non-sensitive |
| `PAYPAL_CLIENT_SECRET` | PayPal REST API Secret Key | **Sensitive** |
| `PAYPAL_WEBHOOK_ID` | PayPal webhook ID used for signature verification | Non-sensitive |
| `PAYPAL_ENVIRONMENT` | `'live'` in Production, `'sandbox'` in Dev/Preview | Non-sensitive |
| `SMTP_HOST` | SMTP server (`smtp.zeptomail.in` in Prod, Mailtrap in Dev) | Non-sensitive |
| `SMTP_PORT` | SMTP port (`587` in Prod, `2525` in Dev) | Non-sensitive |
| `SMTP_USER` | SMTP username | Non-sensitive |
| `SMTP_PASS` | SMTP password / API token | **Sensitive** |
| `SMTP_FROM` | Default sender header (`MiniFyn <noreply@minifyn.com>`) | Non-sensitive |
| `LINKGUARD_PLAY_SERVICE_ACCOUNT_JSON` | Google Play Integrity Service Account Base64 JSON | **Sensitive** |
| `LINKGUARD_ENTITLEMENT_SIGNING_SECRET`| HMAC key for LinkGuard Pro licensing | **Sensitive** |
| `LINKGUARD_RECOVERY_SIGNING_SECRET`   | HMAC key for LinkGuard account recovery | **Sensitive** |

---

## 🧪 4. Commands & Workflow

```bash
# Typecheck (Next.js + Vitest config)
npm run typecheck

# Unit Tests (Vitest)
npm test

# Production Build (Turbopack)
npm run build

# Start Local Dev Server
npm run dev -- --port 9002

# Run Playwright E2E Tests
node scripts/e2e-geo-verification.mjs
node scripts/e2e-pricing-and-billing.mjs
```

---

## 🔁 Cross-Repo Sync Obligations

The following values in this repo are **manually maintained** and must be updated whenever sibling repos release:

| File | Field | Source of truth |
|---|---|---|
| `src/app/(apps)/scamguard/page.tsx` | `softwareVersion` in JSON-LD | `ScamGuard/pubspec.yaml` `version` field (semver only, drop build number) |
| `src/app/(marketing)/pricing/page.tsx` | JSON-LD `OfferCatalog` prices | `src/lib/plans.ts` `PRICING_CONFIG` — do **not** hardcode currency or amounts |

These are not auto-generated. A code review found `softwareVersion: '2.4.2'` in JSON-LD while the live app was `v2.5.0`, and the `OfferCatalog` hardcoded INR for all visitors regardless of resolved country. After any ScamGuard app release, check `softwareVersion` immediately.


## 📱 5. SEO, App Routing & Mobile API Security

- **App Suite Canonical URLs**:
  - ScamGuard: [`/scamguard`](file:///Users/sylvester/Projects/personal/minifyn/backend/src/app/(apps)/scamguard/page.tsx)
  - ClipFyn: [`/clipfyn`](file:///Users/sylvester/Projects/personal/minifyn/backend/src/app/(apps)/clipfyn/page.tsx)
  - CensorFyn: [`/censorfyn`](file:///Users/sylvester/Projects/personal/minifyn/backend/src/app/(apps)/censorfyn/page.tsx)
- **Marketing Case Redirects**: All CamelCase variations (`/ScamGuard`, `/ClipFyn`, `/CensorFyn`) and legacy `/LinkGuard` are 301-redirected in [`next.config.mjs`](file:///Users/sylvester/Projects/personal/minifyn/backend/next.config.mjs) to their canonical lowercase endpoints to preserve SEO authority.
- **Rich Structured Data**: Every app landing page contains Google JSON-LD schema for `MobileApplication`, `FAQPage`, and `BreadcrumbList`.
- **Mobile Backend Protection**: `/api/scamguard/v1/*` endpoints are strictly reserved for Google Play Integrity verified mobile clients and must not be called directly by public unauthenticated web widgets. Legacy `/api/linkguard/*` and `/api/scamguard-ai/*` routes remain compatibility-only.

---

## 🔗 6. Link Redirection, Safety & Inspection Engine

- **High-Performance Edge Redirection**:
  - `mnfy.in/[slug]` and `/go/[slug]` execute via lightweight Next.js Route Handlers (`src/app/[slug]/route.ts`) serving instant **HTTP 307 redirects (~15ms)** with zero React SSR overhead.
  - Decommissioned separate Firebase Cloud Functions in favor of unified Vercel Edge routing.
- **Pre-Aggregated Daily Analytics (`analytics_summary`)**:
  - Replaced raw event-level log arrays with daily summary buckets (`analytics_summary/${slug}/${YYYY-MM-DD}`).
  - Cuts Realtime Database storage by **~95%** and dashboard query bandwidth by **~99%**, allowing permanent operation on the Firebase Spark ($0/mo) free plan.
  - Automatically sanitizes RTDB forbidden characters (`.`, `$`, `#`, `[`, `]`, `/`, `%`) using `encodeRtdbKey` / `decodeRtdbKey`.
  - Maintains backward compatibility with legacy raw logs in `src/app/dashboard/actions.ts`.
- **Link Inspection Pages (`/[slug]+` & `/info/[slug]`)**:
  - Appending `+` (or `%2B`) to any short link (e.g. `mnfy.in/xyz+`) routes to the safety inspection view [`src/app/info/[slug]/page.tsx`](file:///Users/sylvester/Projects/personal/minifyn/backend/src/app/info/[slug]/page.tsx).
  - Displays original destination preview, Web Risk safety rating, creation timestamp, and click metrics without triggering redirect click logs.
- **SSRF & Malicious Payload Filtering**:
  - All URLs undergo private IP validation, DNS rebinding checks, and Google Web Risk API threat scans prior to creation.
  - Direct executable file extensions (`.exe`, `.msi`, `.apk`, `.bat`, `.cmd`, `.vbs`, `.scr`, `.pif`, `.hta`, `.iso`, `.jar`, `.com`, `.wsf`, `.cpl`) and non-HTTP(S) schemes are blocked.
  - Forms are protected against automated bots with invisible honeypots.

---

## 👑 7. Pro Entitlements & Ad-Free Experience

- **Feature Gates**: Pro users receive 100 links/day, **permanent non-expiring URLs** (free links auto-expire in 60 days, guest links in 7 days), 1-year granular analytics, and custom alias prioritization.
- **100% Ad-Free**: AdSense units ([`src/components/ad-banner.tsx`](file:///Users/sylvester/Projects/personal/minifyn/backend/src/components/ad-banner.tsx)) are strictly suppressed when `user.plan === 'pro'` or `'admin'`, backed by the Pro badge indicator.
- **Dashboard Conversion Triggers**: Free tier links display an amber expiration countdown badge in the links table linking directly to upgrade settings.

---

## 🚀 8. Product Growth, Marketing & Strategic Roadmap

### Current Implementation & Roadmap Status

#### ✅ Completed & Live
1. **ScamGuard**:
   - Production App `v2.5.0+77` with bundled on-device AI Model `v22` (41 features + 256 char sequence).
   - Canonical `/api/scamguard/v1/*` endpoints (`check`, `policy`, `model-manifest`, `announcements/send`) with Play Integrity verification and backward-compatibility preservation.
   - On-device TFLite model evaluation + fallback cloud checks (`WebRisk + OpenPhish`).
   - Daily silent security tip rotation (8:30 AM local) & zero-PII categorical analytics.
   - Automated AAB/IPA release publishing pipelines supporting multi-track (`internal`, `production`).
   - **Multi-Language Play Store Listings Published**: `en-US`, `en-GB`, `es-419`, `es-ES`, `pt-BR`, `de-DE`, `fr-FR`, `hi-IN`.
2. **ClipFyn**:
   - AndroidX Media3 hardware encoding with 9:16 vertical safe-zone centering.
   - Aspect ratio modes (Fill & Crop, Gaussian Blur Letterbox, Original).
   - Google AdMob UMP integration and lifetime Pro billing.
   - Production bundle live on Google Play Production track.
   - Google AdMob account linkage, app review, and GDPR/US-state CMP privacy messages configured.
3. **CensorFyn**:
   - 100% On-device image redaction (BlazeFace, OCR PII parsing, Barcode/QR, Freehand gesture drawing).
   - Auto screenshot cropping (`ScreenshotCropService`) for status bar and navigation bar removal.
   - Batch media redaction & background isolate export coordinator (`BatchExportCoordinator`).
   - Video Redaction Engine (AndroidX Media3 Transformer + custom OpenGL ES shader raster masks).
   - Destructive raster pixel modifications (Gaussian blur, Mosaic pixelation, Solid blackout) & EXIF/GPS stripping.
   - SHA-256 legal audit manifest generator.
   - **Multi-Language Play Store Listings Published**: `en-US`, `en-GB`, `es-419`, `es-ES`, `pt-BR`, `de-DE`, `fr-FR`, `hi-IN`.
   - **Production bundle live on Google Play Production track.**
4. **MiniFyn Web Platform**:
   - Next.js 16 Edge Route Handlers (`~15ms` 307 redirects).
   - Aggregated daily click metrics (`analytics_summary`) saving 95%+ DB footprint.
   - Dual-gateway payments (Razorpay + PayPal PPP regional tiers).
   - Web utilities: Code Minifier, JSON Formatter, JWT Debugger, Branded QR Code Generator, and Universal Link Expander & Hop Tracer (`/tools/link-expander`).
   - ScamGuard Trust & Inspection Banner embedded on `mnfy.in/[slug]+` inspection views.
   - Public MiniFyn Help Center and Documentation Hub (`/help`, `/docs`, `/docs/guides/*`) across MiniFyn, ScamGuard, ClipFyn, CensorFyn, and Studio.
5. **Marketing Cockpit (`scamguard-studio`)**:
   - Multi-tenant Fastify/React operational dashboard.
   - AES-256 BYO credentials vault and Gemini Flash AI batch composer.
   - Buffer integration, safety heuristics engine, and ethical behavioral marketing experimentation standards.

---

### ⏳ Upcoming Focus & Active Priorities

1. **Desktop Extensions**:
   - Build two separately listed and released products: the **MiniFyn URL Shortener extension** in this repository and the **ScamGuard Link Checker extension** in the ScamGuard repository. Their permissions, privacy disclosures, versions, tests, and release workflows must remain separate.

2. **In-Product Contextual Guidance**:
   - Expand interactive walkthroughs and contextual help across MiniFyn mobile apps.

### MiniFyn URL Shortener browser extension plan (planned; not implemented)

**Product and boundaries**

- Own the MiniFyn extension source, tests, store assets, and dedicated CI/release workflow in this backend repository, under an extension-specific directory. Do not put ScamGuard checking, heuristics, or branding into this package.
- The extension is a compact toolbar popup and context-menu action for shortening the current HTTP(S) page or a user-selected link, with an editable URL field, one-click copy, clear errors, and a link to the MiniFyn dashboard/API-key page. Do not request access to page content when a tab URL or context-menu link URL suffices.
- Users generate their own key at `/dashboard/settings/api-keys` and explicitly paste it into the extension. `POST /api/shorten` already accepts `Authorization: Bearer <key>` and `{ "url": "https://..." }`, and returns `shortUrl`; the endpoint currently rewrites to the Go service, so validate the deployed contract before release. The extension does not add an authentication endpoint or separate payment system.
- Explain that the extension sends the URL being shortened and the user's key to MiniFyn. Never send the key to a third party, include it in telemetry, place it in a URL/query string, or commit it. Mask the saved key, offer a visible remove-key action, use extension-only local storage rather than synced storage, and avoid logging request headers. Warn that anyone with access to an unlocked browser profile may use a locally stored key; users can revoke it in the dashboard.
- Validate HTTP(S) input before submission. Display server-side unsafe-URL, unauthorized/revoked-key, daily-limit, network, and timeout responses distinctly. Never imply that creating a short link certifies its destination as safe. Avoid duplicate submissions and copy only the successful returned URL.
- No background URL collection, automatic shortening, content scripts, or broad site permissions for the first release. Request the minimum permissions needed for toolbar and context-menu invocation and access only to the MiniFyn API origin. Review the permissions and data-use disclosures for each target store.

**Delivery and quality gates**

1. Build a browser-neutral core and a Manifest V3 Chrome/Edge adapter. Keep store-specific manifests/assets in the extension directory. Firefox, Opera, and Safari are later ports subject to browser-specific tests and store review; Safari requires its own Apple packaging/distribution path.
2. Create focused tests for URL selection, invalid schemes, API request/response handling, key replacement/removal, 401/429 errors, retry behavior, copy, and no key leakage into logs or sync storage. Test popup and context-menu flows in a real browser against a controlled test endpoint; verify that a created link appears in the correct account and respects existing plan limits. Keep production smoke tests non-destructive and use a dedicated test account/key.
3. Add a standalone extension CI workflow that lints, typechecks, tests, builds/minifies, scans the package for secrets/unwanted files, validates its manifest and permissions, and uploads a reviewable ZIP artifact. Path-filter extension checks where useful, but rerun contract tests when `/api/shorten`, its rewrite, or key validation changes. Keep this workflow separate from the Next.js deployment and do not auto-publish from the website release pipeline.
4. Use an independent extension version and release tag/dispatch. Produce a reproducible package with checksums and store notes; submit to Chrome first, then Edge after browser smoke tests. Report built, submitted, approved, and live states separately. Store publication requires review of the final package/listing and explicit authorization; creating this plan does not publish anything.
5. Prepare privacy/support pages and store assets before submission: truthful description of URL/key transmission, data retention, permission purposes, screenshots of real extension UI, support contact, and a beginner-first setup/revocation guide. Maintain distinct store listings for MiniFyn and ScamGuard.
6. Before publishing, confirm ownership and readiness of the Chrome Web Store publisher account (registration fee, verified contact email, two-step verification) and Microsoft Edge Partner Center publisher account. One publisher may own two distinct listings; store credentials and upload tokens belong in store/CI secrets, never in the repository. Firefox/Opera accounts and Apple Developer membership are needed only when those ports are scheduled.
