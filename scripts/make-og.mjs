/**
 * Generates public/og-default.png — the default social-share card.
 * Run:  node scripts/make-og.mjs
 */
import sharp from 'sharp';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const W = 1200;
const H = 630;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#0e0e10"/>
  <g stroke="#26262b" stroke-width="1">
    <line x1="80" y1="0" x2="80" y2="${H}"/>
    <line x1="0" y1="${H - 110}" x2="${W}" y2="${H - 110}"/>
  </g>
  <rect x="80" y="90" width="34" height="34" fill="#ff4a1c"/>
  <text x="128" y="117" font-family="Arial, Helvetica, sans-serif" font-size="26" letter-spacing="3" fill="#9a9a95">LEWIS CONTE — ARCHITECTURAL DESIGNER</text>
  <text x="78" y="330" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="78" letter-spacing="-2" fill="#ededeb">I design buildings, and</text>
  <text x="78" y="420" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="78" letter-spacing="-2" fill="#ededeb">the tools that build them.</text>
  <text x="80" y="${H - 55}" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#6a6a6d">Selected work &amp; an ongoing notebook</text>
  <text x="${W - 80}" y="${H - 55}" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#6a6a6d">lewismconte.github.io/portfolio</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(join(root, 'public', 'og-default.png'));
console.log('public/og-default.png written');
