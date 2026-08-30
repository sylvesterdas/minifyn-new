const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const SCREENSHOT_DIR = path.resolve(process.env.CLIPFYN_SCREENSHOT_DIR || path.join(projectRoot, 'ClipFyn/store-assets/screenshots'));
const OUTPUT_DIR = path.resolve(process.env.CLIPFYN_MARKETING_OUTPUT_DIR || path.join(SCREENSHOT_DIR, 'marketing'));

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 1080 x 2400 Google Play Store standard canvas
const CANVAS_W = 1080;
const CANVAS_H = 2400;

const CARDS = [
  {
    rawFile: `${SCREENSHOT_DIR}/01_hero_standards.png`,
    badge: '100% HARDWARE ACCELERATED',
    headline: 'Crisp 1080p for Reels & Shorts',
    subheadline: 'Native MediaCodec • Zero Cloud Uploads • Lossless Clarity',
    outputName: '01_playstore_crisp_1080p.png'
  },
  {
    rawFile: `${SCREENSHOT_DIR}/02_analysis_and_modes.png`,
    badge: 'SMART ASPECT RATIO',
    headline: 'Fit Any Video to 9:16 Vertical',
    subheadline: 'Fill & Crop • Gaussian Blurred Letterboxes • Original Aspect',
    outputName: '02_playstore_smart_aspect_ratio.png'
  },
  {
    rawFile: `${SCREENSHOT_DIR}/03_side_by_side_comparison.png`,
    badge: 'BEFORE & AFTER INSPECTION',
    headline: 'Side-by-Side Clarity Preview',
    subheadline: 'Compare Raw 4K (162MB) vs Prepared 1080p (23.5MB)',
    outputName: '03_playstore_before_after_preview.png'
  },
  {
    rawFile: `${SCREENSHOT_DIR}/04_verified_checks_and_sharing.png`,
    badge: 'PRO SPEC CHECKLIST',
    headline: 'Strict 30 FPS CFR & Direct Share',
    subheadline: 'Eliminate Stutter • BT.709 Tone-Mapping • Instant Share',
    outputName: '04_playstore_pro_specs_and_sharing.png'
  },
  {
    rawFile: `${SCREENSHOT_DIR}/05_hardware_encoder_profile.png`,
    badge: 'CHIP CALIBRATION & PRIVACY',
    headline: 'Zero PII • 100% On-Device Engine',
    subheadline: 'Calibrates directly with your SoC for fast, cool exports',
    outputName: '05_playstore_chip_calibration_privacy.png'
  }
];

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

async function buildMarketingScreenshot(config) {
  const { rawFile, badge, headline, subheadline, outputName } = config;

  const phoneTargetW = 920;
  const phoneTargetH = 1760;
  const phoneX = Math.round((CANVAS_W - phoneTargetW) / 2); // 80
  const phoneY = 560;

  const resizedScreenshot = await sharp(rawFile)
    .resize(phoneTargetW, phoneTargetH, { fit: 'cover', position: 'top' })
    .png()
    .toBuffer();

  const maskSvg = Buffer.from(`
    <svg width="${phoneTargetW}" height="${phoneTargetH}">
      <rect x="0" y="0" width="${phoneTargetW}" height="${phoneTargetH}" rx="32" ry="32" fill="#fff" />
    </svg>
  `);

  const roundedPhone = await sharp(resizedScreenshot)
    .composite([{ input: maskSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const headerSvg = Buffer.from(`
    <svg width="${CANVAS_W}" height="${CANVAS_H}">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#070c14" />
          <stop offset="35%" stop-color="#0a1322" />
          <stop offset="70%" stop-color="#080f1a" />
          <stop offset="100%" stop-color="#04080e" />
        </linearGradient>

        <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#10b981" stop-opacity="0.3" />
        </linearGradient>

        <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="#f1f5f9" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="${CANVAS_W}" height="${CANVAS_H}" fill="url(#bgGrad)" />

      <!-- Ambient Glow Circle -->
      <circle cx="540" cy="180" r="320" fill="#0ea5e9" opacity="0.12" />

      <!-- Top Badge Pill -->
      <g transform="translate(540, 140)">
        <rect x="-210" y="-24" width="420" height="48" rx="24" fill="url(#badgeGrad)" stroke="#38bdf8" stroke-width="1.5" />
        <text x="0" y="7" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="18" font-weight="800" fill="#38bdf8" letter-spacing="1.2">${escapeXml(badge)}</text>
      </g>

      <!-- Headline -->
      <text x="540" y="275" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="46" font-weight="900" fill="url(#textGrad)" letter-spacing="-0.5">${escapeXml(headline)}</text>

      <!-- Subheadline -->
      <text x="540" y="340" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="23" font-weight="500" fill="#94a3b8" letter-spacing="0.2">${escapeXml(subheadline)}</text>

      <!-- Outer Phone Bezel -->
      <rect x="${phoneX - 3}" y="${phoneY - 3}" width="${phoneTargetW + 6}" height="${phoneTargetH + 6}" rx="35" ry="35" fill="none" stroke="#38bdf8" stroke-width="2" stroke-opacity="0.35" />
    </svg>
  `);

  const finalOutput = path.join(OUTPUT_DIR, outputName);

  await sharp(headerSvg)
    .composite([
      {
        input: roundedPhone,
        top: phoneY,
        left: phoneX
      }
    ])
    .png()
    .toFile(finalOutput);

  console.log(`Generated: ${outputName}`);
}

async function run() {
  for (const card of CARDS) {
    await buildMarketingScreenshot(card);
  }
}

run().catch(console.error);
