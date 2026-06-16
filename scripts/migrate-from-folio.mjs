/**
 * One-time migration from the old Next.js "folio" repo into Astro content.
 *
 * For each project in ../folio/app/projects.ts it:
 *   1. resizes + recompresses every referenced image (cover + body images)
 *      from ../folio/public/images into src/content/projects/<slug>/
 *   2. writes a Markdown file src/content/projects/<slug>/index.md with typed
 *      frontmatter and the prose/images interleaved as a vertical flow.
 *
 * Re-runnable: it overwrites the generated folders. Safe to delete and redo.
 *
 * Run:  node scripts/migrate-from-folio.mjs
 */
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const OLD_REPO = join(root, '..', 'folio');
const OLD_IMAGES = join(OLD_REPO, 'public', 'images');
const OUT_DIR = join(root, 'src', 'content', 'projects');

// Longest-edge cap for source images. Astro generates smaller responsive
// variants at build time; this just keeps the committed sources lean.
const MAX_EDGE = 2200;
const JPEG_QUALITY = 80;

// Import the old data directly (Node strips the TS type-only syntax).
const dataUrl = new URL(
  'file:///' + join(OLD_REPO, 'app', 'projects.ts').replace(/\\/g, '/'),
).href;
const { projects } = await import(dataUrl);

const imgName = (src) => basename(src); // "/images/foo.jpg" -> "foo.jpg"

function startYear(details) {
  const blob = details.map((d) => d.value).join(' ');
  const m = blob.match(/(19|20)\d{2}/);
  return m ? m[0] : '2020';
}

async function optimize(srcName, destPath) {
  const srcPath = join(OLD_IMAGES, srcName);
  if (!existsSync(srcPath)) {
    console.warn('  ! missing source:', srcName);
    return false;
  }
  const ext = srcName.toLowerCase().split('.').pop();
  let pipeline = sharp(srcPath).rotate().resize({
    width: MAX_EDGE,
    height: MAX_EDGE,
    fit: 'inside',
    withoutEnlargement: true,
  });
  if (ext === 'png') {
    pipeline = pipeline.png({ compressionLevel: 9, palette: true });
  } else {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  }
  await pipeline.toFile(destPath);
  return true;
}

function yaml(value) {
  // JSON strings are valid YAML double-quoted scalars.
  return JSON.stringify(value);
}

function buildFrontmatter(p) {
  const lines = ['---'];
  lines.push(`title: ${yaml(p.title)}`);
  lines.push(`date: ${startYear(p.details)}-01-01`);
  lines.push(`category: ${yaml(p.category)}`);
  lines.push(`summary: ${yaml(p.description)}`);
  lines.push(`cover: ${yaml('./' + imgName(p.image))}`);
  lines.push(`coverAlt: ${yaml(p.title)}`);
  if (p.details?.length) {
    lines.push('details:');
    for (const d of p.details) {
      lines.push(`  - label: ${yaml(d.label)}`);
      lines.push(`    value: ${yaml(d.value)}`);
    }
  }
  lines.push('draft: false');
  lines.push('---');
  return lines.join('\n');
}

function buildBody(p) {
  const blocks = [];
  for (const s of p.sections) {
    if (s.type === 'text') {
      const parts = [];
      if (s.title) parts.push(`## ${s.title}`);
      if (s.content) parts.push(s.content.trim());
      blocks.push(parts.join('\n\n'));
    } else if (s.type === 'image' && s.src) {
      const alt = (s.alt || '').replace(/]/g, '').replace(/\[/g, '');
      blocks.push(`![${alt}](./${imgName(s.src)})`);
    }
  }
  return blocks.join('\n\n');
}

async function run() {
  console.log(`Migrating ${projects.length} projects -> ${OUT_DIR}\n`);
  for (const p of projects) {
    const dir = join(OUT_DIR, p.slug);
    await rm(dir, { recursive: true, force: true });
    await mkdir(dir, { recursive: true });
    console.log(`• ${p.slug}`);

    // Collect every unique image used by the project.
    const names = new Set([imgName(p.image)]);
    for (const s of p.sections) if (s.type === 'image' && s.src) names.add(imgName(s.src));

    for (const name of names) {
      await optimize(name, join(dir, name));
    }

    const md = `${buildFrontmatter(p)}\n\n${buildBody(p)}\n`;
    await writeFile(join(dir, 'index.md'), md, 'utf8');
    console.log(`  ${names.size} images, ${md.length} bytes md`);
  }
  console.log('\nDone.');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
