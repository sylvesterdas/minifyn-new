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
   - Production Access granted on Google Play Console; store linked in Google AdMob.
3. **CensorFyn**:
   - 100% On-device image redaction (BlazeFace, OCR PII parsing, Barcode/QR, Freehand gesture drawing).
   - Auto screenshot cropping (`ScreenshotCropService`) for status bar and navigation bar removal.
   - Batch media redaction & background isolate export coordinator (`BatchExportCoordinator`).
   - Video Redaction Engine (AndroidX Media3 Transformer + custom OpenGL ES shader raster masks).
   - Destructive raster pixel modifications (Gaussian blur, Mosaic pixelation, Solid blackout) & EXIF/GPS stripping.
   - SHA-256 legal audit manifest generator.
   - **Multi-Language Play Store Listings Published**: `en-US`, `en-GB`, `es-419`, `es-ES`, `pt-BR`, `de-DE`, `fr-FR`, `hi-IN`.
4. **MiniFyn Web Platform**:
   - Next.js 16 Edge Route Handlers (`~15ms` 307 redirects).
   - Aggregated daily click metrics (`analytics_summary`) saving 95%+ DB footprint.
   - Dual-gateway payments (Razorpay + PayPal PPP regional tiers).
   - Web utilities: Code Minifier, JSON Formatter, JWT Debugger, and Branded QR Code Generator.
   - ScamGuard Trust & Inspection Banner embedded on `mnfy.in/[slug]+` inspection views.
5. **Marketing Cockpit (`scamguard-studio`)**:
   - Multi-tenant Fastify/React operational dashboard.
   - AES-256 BYO credentials vault and Gemini Flash AI batch composer.
   - Buffer integration and safety heuristics engine.

---

### ⏳ Upcoming Focus & Active Priorities

1. **MiniFyn Web & Free Tools**:
   - **Universal Link Expander & Hop Tracer (`/tools/link-expander`)**: Expands shortened redirect chains safely without executing target scripts.

2. **Store Creatives & ClipFyn Production Launch**:
   - **AdMob Review & CMP**: Monitor AdMob app review completion (2-3 days) and enable GDPR/US-state privacy messages.
   - **Production Promotion**: Promote validated ClipFyn release bundle to Google Play Production track.

3. **Desktop Extension**:
   - Build a lightweight **MiniFyn + ScamGuard Chrome Extension** with 1-click URL shortening and inline link safety warnings on desktop.
