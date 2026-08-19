# MiniFyn

**Modern URL Shortener, Link Management, Developer Tools & Mobile Security Ecosystem**

Live Website: [https://www.minifyn.com](https://www.minifyn.com)

---

## ⚡ Overview

MiniFyn is a next-generation link shortening and digital utility platform built with **Next.js 16 (Turbopack)**, **React 19**, and **Firebase**. It provides high-performance URL redirection, detailed analytics, developer utilities, and backend APIs for native mobile security apps.

---

## 🚀 Features

### 🔗 URL Shortener & Link Management
- **Instant Shortening**: Fast hash-based slug generation with custom alias support.
- **SSRF & Phishing Protection**: Pre-validation of target URLs with Google Web Risk integration.
- **Rich OpenGraph Unfurling**: Automatic metadata, title, and favicon extraction for social previews.
- **Granular Analytics**: Real-time click stream, device breakdown, top referrers, and geolocation tracking.

### 🛠️ Developer Tools Hub
- **JSON Formatter & Validator**: Interactive tree explorer and syntax minifier.
- **JWT Debugger**: Header, payload, and signature decoding with algorithm inspection.
- **Code Minifier**: In-browser JavaScript, HTML, and CSS minification.

### 🛡️ Mobile Ecosystem Apps & APIs
- **ScamGuard AI**: On-device AI scam/phishing detection via Google Cloud Storage models.
- **LinkGuard**: Anti-phishing browser protection with Google Play Integrity verification.
- **CensorFyn & ClipFyn**: Privacy and smart clipboard utility applications.

### 💳 Global Monetization (Dual Gateway)
- **🇮🇳 India (INR)**: Seamless domestic checkout via **Razorpay** (UPI, RuPay, Netbanking).
- **🌍 International (USD)**: Global subscriptions via **PayPal Subscriptions** ($2/mo, $15/yr).
- **Edge Geolocation**: Automatic country detection to serve local currencies and gateway defaults.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **UI**: [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), Lucide Icons
- **Database & Auth**: [Firebase](https://firebase.google.com/) Realtime Database & Firebase Admin SDK
- **Testing**: [Vitest](https://vitest.dev/) & [Playwright](https://playwright.dev/)
- **Deployment**: [Vercel](https://vercel.com/) Serverless

---

## 💻 Getting Started

### 1. Prerequisites
- Node.js `20.x` or `22.x`
- `pnpm` v11+ (or `npm`)

### 2. Installation
```bash
# Clone the repository
git clone git@github.com:sylvesterdas/minifyn-new.git
cd minifyn-new

# Install dependencies
pnpm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory (see `AGENTS.md` for variable reference).

### 4. Development Server
```bash
pnpm dev -- --port 9002
```
Open [http://localhost:9002](http://localhost:9002) in your browser.

---

## 🧪 Testing & Building

```bash
# Run TypeScript validation
pnpm typecheck

# Run Vitest unit tests
pnpm test

# Build production bundle with Turbopack
pnpm build
```

---

## 📄 License
All rights reserved © MiniFyn.
