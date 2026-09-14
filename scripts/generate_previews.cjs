const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const artDir = 'C:\\Users\\zpit3\\.gemini\\antigravity\\brain\\1f368b34-f53a-40ca-92aa-e20bc2e91049';
const pubDir = path.resolve(__dirname, '..', 'public');

async function generatePreviews() {
  const logoContent = fs.readFileSync(path.join(pubDir, 'logo.svg'), 'utf8')
    .replace(/<svg[^>]*>|<\/svg>/g, '');
  const logoWhiteContent = fs.readFileSync(path.join(pubDir, 'logo-white.svg'), 'utf8')
    .replace(/<svg[^>]*>|<\/svg>/g, '');

  // 1. Logo on light
  const lightCardSvg = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="200" viewBox="0 0 600 200">
      <rect width="600" height="200" fill="#F8FAFC" rx="12"/>
      <rect x="1" y="1" width="598" height="198" fill="none" stroke="#E2E8F0" stroke-width="2" rx="11"/>
      <g transform="translate(170, 76) scale(1.3)">
        ${logoContent}
      </g>
    </svg>
  `);
  await sharp(lightCardSvg).png().toFile(path.join(artDir, 'logo_preview_light.png'));

  // 2. Logo on dark
  const darkCardSvg = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="200" viewBox="0 0 600 200">
      <rect width="600" height="200" fill="#0F172A" rx="12"/>
      <rect x="1" y="1" width="598" height="198" fill="none" stroke="#1E293B" stroke-width="2" rx="11"/>
      <g transform="translate(170, 76) scale(1.3)">
        ${logoWhiteContent}
      </g>
    </svg>
  `);
  await sharp(darkCardSvg).png().toFile(path.join(artDir, 'logo_preview_dark.png'));

  // 3. Mark standalone
  const markSvg = fs.readFileSync(path.join(pubDir, 'logo-mark.svg'));
  await sharp(markSvg).resize(300, 300).png().toFile(path.join(artDir, 'mark_preview.png'));

  // 4. Favicon preview
  const favSvg = fs.readFileSync(path.join(pubDir, 'favicon.svg'));
  await sharp(favSvg).resize(256, 256).png().toFile(path.join(artDir, 'favicon_preview.png'));

  console.log('Artifact preview images generated successfully in artifact directory.');
}

generatePreviews().catch(console.error);
