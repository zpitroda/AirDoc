const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');

const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const appDir = path.join(rootDir, 'app');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// ---------------------------------------------------------------------------
// 1. MARK GEOMETRY DESIGN ("The Aero-Clinical Cross")
// ViewBox: 0 0 48 48
// Center: (24, 24)
//
// Concepts unified:
// 1. Unmistakable medical cross (hospitals & clinical staffing)
// 2. Dynamic aerodynamic wing (speed, agility, "Air" lift, locum tenens)
// 3. Central pulse anchor (care focus & instant vital sign)
// ---------------------------------------------------------------------------

function getMarkSvgInner({ idPrefix = 'ad', isWhite = false, isMonochrome = false } = {}) {
  const bluePrimary = isWhite ? '#FFFFFF' : (isMonochrome ? 'currentColor' : '#1D4ED8');
  const blueDeep = isWhite ? '#F8FAFC' : (isMonochrome ? 'currentColor' : '#1E40AF');
  const cyanLight = isWhite ? '#BAE6FD' : (isMonochrome ? 'currentColor' : '#38BDF8');
  const cyanDark = isWhite ? '#7DD3FC' : (isMonochrome ? 'currentColor' : '#0284C7');

  return `
  <defs>
    <linearGradient id="${idPrefix}_primary" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bluePrimary}" />
      <stop offset="100%" stop-color="${blueDeep}" />
    </linearGradient>
    <linearGradient id="${idPrefix}_wing" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${cyanDark}" />
      <stop offset="50%" stop-color="${cyanLight}" />
      <stop offset="100%" stop-color="#E0F2FE" />
    </linearGradient>
    <filter id="${idPrefix}_shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#0F172A" flood-opacity="0.28" />
    </filter>
  </defs>

  <!-- Base Clinical Cross (Vertical & Horizontal Tapered Rounded Bars) -->
  <rect x="19" y="5" width="10" height="38" rx="5" fill="url(#${idPrefix}_primary)" />
  <rect x="5" y="19" width="38" height="10" rx="5" fill="url(#${idPrefix}_primary)" />

  <!-- Aerodynamic Forward-Lift Wing (Airfoil Curve) -->
  <path d="M 5 33 
           C 12 32, 19 28, 24 24 
           C 29 20, 36 13, 44 9 
           C 39 16, 32 23, 27 27 
           C 21 32, 13 36, 5 33 Z" 
        fill="url(#${idPrefix}_wing)" 
        filter="url(#${idPrefix}_shadow)" />

  <!-- Secondary Airfoil Highlight Accent -->
  <path d="M 12 11 
           C 17 14, 21 17, 24 19 
           C 20 18, 16 16, 12 11 Z" 
        fill="${cyanLight}" 
        opacity="0.8" />

  <!-- Central Clinical Pulse Node -->
  <circle cx="24" cy="24" r="2.8" fill="${isWhite ? '#1E40AF' : '#FFFFFF'}" />
  <circle cx="24" cy="24" r="1.5" fill="${cyanDark}" />
`;
}

// 1. Standalone Mark (public/logo-mark.svg)
const logoMarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" fill="none" role="img" aria-label="AirDoc Mark">
${getMarkSvgInner({ idPrefix: 'mark' })}
</svg>`;

// 2. Full Horizontal Lockup (public/logo.svg)
const fullLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 48" width="190" height="48" fill="none" role="img" aria-label="AirDoc Logo">
  <g transform="translate(0, 0)">
    ${getMarkSvgInner({ idPrefix: 'logo' })}
  </g>
  <g transform="translate(60, 32)">
    <text font-family="system-ui, -apple-system, 'Geist', 'Inter', 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="600" letter-spacing="-0.035em">
      <tspan fill="#0F172A">Air</tspan><tspan fill="#1D4ED8">Doc</tspan>
    </text>
  </g>
</svg>`;

// 3. Full White Lockup for Dark Surfaces (public/logo-white.svg)
const fullLogoWhiteSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 48" width="190" height="48" fill="none" role="img" aria-label="AirDoc Logo">
  <g transform="translate(0, 0)">
    ${getMarkSvgInner({ idPrefix: 'logo_w', isWhite: true })}
  </g>
  <g transform="translate(60, 32)">
    <text font-family="system-ui, -apple-system, 'Geist', 'Inter', 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="600" letter-spacing="-0.035em">
      <tspan fill="#FFFFFF">Air</tspan><tspan fill="#38BDF8">Doc</tspan>
    </text>
  </g>
</svg>`;

// 4. Favicon SVG (public/favicon.svg)
// 64x64 geometry with dark-mode responsive styling and rounded squircle container
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none">
  <defs>
    <linearGradient id="fav_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#1E293B" />
    </linearGradient>
    <linearGradient id="fav_border" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#1D4ED8" stop-opacity="0.2" />
    </linearGradient>
    <linearGradient id="fav_cross" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#E2E8F0" />
    </linearGradient>
    <linearGradient id="fav_wing" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284C7" />
      <stop offset="50%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#BAE6FD" />
    </linearGradient>
    <filter id="fav_glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#0284C7" flood-opacity="0.6" />
    </filter>
  </defs>

  <!-- Deep Slate-Navy Squircle with Cyan Micro-Border for universal browser tab pop -->
  <rect x="2" y="2" width="60" height="60" rx="15" fill="url(#fav_bg)" />
  <rect x="2.5" y="2.5" width="59" height="59" rx="14.5" stroke="url(#fav_border)" stroke-width="1.2" />

  <!-- Aero-Clinical Cross scaled to 64x64 -->
  <g transform="translate(8, 8)">
    <rect x="19" y="5" width="10" height="38" rx="5" fill="url(#fav_cross)" />
    <rect x="5" y="19" width="38" height="10" rx="5" fill="url(#fav_cross)" />

    <!-- Upward Aero Wing -->
    <path d="M 5 33 
             C 12 32, 19 28, 24 24 
             C 29 20, 36 13, 44 9 
             C 39 16, 32 23, 27 27 
             C 21 32, 13 36, 5 33 Z" 
          fill="url(#fav_wing)" 
          filter="url(#fav_glow)" />

    <circle cx="24" cy="24" r="2.8" fill="#0F172A" />
    <circle cx="24" cy="24" r="1.5" fill="#38BDF8" />
  </g>
</svg>`;

async function main() {
  console.log('Generating SVG files...');
  fs.writeFileSync(path.join(publicDir, 'logo-mark.svg'), logoMarkSvg.trim());
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), fullLogoSvg.trim());
  fs.writeFileSync(path.join(publicDir, 'logo-white.svg'), fullLogoWhiteSvg.trim());
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg.trim());
  fs.writeFileSync(path.join(appDir, 'icon.svg'), faviconSvg.trim());

  console.log('Rendering high-density raster images with Sharp...');
  // Apple Touch Icon (180x180)
  await sharp(Buffer.from(faviconSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // PWA / Web App Icons (192x192 and 512x512)
  await sharp(Buffer.from(faviconSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));

  await sharp(Buffer.from(faviconSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));

  // Generate site.webmanifest
  const webManifest = {
    name: "AirDoc Healthcare Staffing",
    short_name: "AirDoc",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],
    theme_color: "#1d4ed8",
    background_color: "#0f172a",
    display: "standalone"
  };
  fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(webManifest, null, 2));

  console.log('Packaging multi-resolution favicon.ico via Python Pillow...');
  const pyScript = `
from PIL import Image
import os

png_path = r"${path.join(publicDir, 'icon-512.png')}"
ico_path = r"${path.join(publicDir, 'favicon.ico')}"
app_ico_path = r"${path.join(appDir, 'favicon.ico')}"

img = Image.open(png_path)
sizes = [(16, 16), (32, 32), (48, 48)]
img.save(ico_path, format='ICO', sizes=sizes)
img.save(app_ico_path, format='ICO', sizes=sizes)
print("favicon.ico generated successfully at:", ico_path)
`;
  fs.writeFileSync(path.join(__dirname, '_gen_ico.py'), pyScript);
  execSync(`python "${path.join(__dirname, '_gen_ico.py')}"`, { stdio: 'inherit' });
  fs.unlinkSync(path.join(__dirname, '_gen_ico.py'));

  console.log('\nAll brand assets successfully generated!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
