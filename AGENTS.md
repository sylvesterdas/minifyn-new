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
