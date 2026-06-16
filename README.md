# Lewis Conte — Portfolio

A fast, content-first portfolio and notebook built with [Astro](https://astro.build),
deployed free on GitHub Pages. Architecture projects, an ongoing blog, and a Lab of
self-contained interactive tools — all driven by Markdown so publishing is just adding a file.

- **Work** — architecture & computational-design projects (`src/content/projects/`)
- **Notebook** — blog posts (`src/content/blog/`)
- **Lab** — standalone interactive web apps hosted alongside the site (`public/lab/`)

Images are optimised at build time (responsive AVIF/WebP via Astro's `<Image>` + sharp),
TypeScript checking is on, and there's real metadata + Open Graph tags, a sitemap, and an RSS feed.

---

## Run locally

Requires [Node.js](https://nodejs.org) 20.3+ (or 22+).

```bash
npm install      # first time only
npm run dev      # start the dev server → http://localhost:4321/folio
```

| Command          | What it does                                            |
| ---------------- | ------------------------------------------------------- |
| `npm run dev`    | Local dev server with hot reload                        |
| `npm run build`  | Type-check (`astro check`) **and** build to `dist/`     |
| `npm run preview`| Serve the built `dist/` locally                         |
| `npm run check`  | Type-check only                                         |

> Drafts (`draft: true`) are visible in `dev` but excluded from production builds.

---

## Add a project

Create a folder under `src/content/projects/` named with the URL slug, with an `index.md`
and the project's images **inside the same folder**:

```
src/content/projects/my-new-project/
  index.md
  hero.jpg
  detail-01.jpg
```

```markdown
---
title: "My New Project"
date: 2026-03-01            # used for sorting (newest first)
category: "Built Projects & Professional Work"   # must match a category in src/consts.ts
summary: "One-sentence description used in cards and meta tags."
cover: "./hero.jpg"        # relative to this file; optimised automatically
coverAlt: "What the cover shows"
details:                   # optional spec sidebar (label/value rows)
  - label: "Year"
    value: "2026"
  - label: "Role"
    value: "Design & documentation"
featured: false            # true → surfaces on the home page
draft: false
---

Opening paragraph.

## A section heading

More prose. Drop images between paragraphs with normal Markdown — they're
optimised and become click-to-zoom automatically:

![Alt text describing the image](./detail-01.jpg)
```

That's it — the project page at `/projects/my-new-project` and its card are generated.
**Categories** live in [`src/consts.ts`](src/consts.ts); add new ones there.

## Add a notebook post

Create `src/content/blog/my-post.md`:

```markdown
---
title: My post title
date: 2026-03-15
summary: One or two sentences shown in the list and meta tags.
tags: [process, web]
draft: false
---

Write in Markdown. Add images relatively (`![alt](./pic.jpg)`) if the post is a folder.
```

Appears at `/blog/my-post` and in the RSS feed at `/rss.xml`.

## Add a Lab app

1. Drop a **self-contained** app into its own folder in `public/lab/`:
   `public/lab/my-tool/index.html`. It's served verbatim at `/folio/lab/my-tool/`
   and can use canvas/WebGL/three.js/whatever.
   **Use relative asset paths** (`./script.js`, not `/script.js`) — the site lives under `/folio/`.
2. Register it with `src/content/lab/my-tool.md`:

```markdown
---
title: My Tool
date: 2026-03-20
summary: What it does, in a sentence.
url: /lab/my-tool/        # path under the site base
tech: [canvas, generative]
newTab: false             # true → open in a new tab
# thumb: ./my-tool.png    # optional static thumbnail; omit for a live preview
featured: false
draft: false
---
```

The Lab gallery card shows a **live preview** of the app by default (a frozen iframe),
or a static image if you set `thumb`.

---

## Deploy (GitHub Pages)

Deployment is automatic via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
(the official `withastro/action`): **every push to `main` builds and deploys**.

### One-time GitHub setup (you must do these — they can't be scripted)

1. Create a GitHub repo named **`folio`** and push this project to its `main` branch.
   The repo name matters: it makes the site live at `lewismconte.github.io/folio`, which is
   why `base` is `/folio` (see below).
2. In the repo: **Settings → Pages → Build and deployment → Source → "GitHub Actions"**.
3. Push to `main` (or run the workflow from the **Actions** tab). The first run publishes the site.

### Site URL & `base`

Configured in [`astro.config.mjs`](astro.config.mjs):

```js
site: 'https://lewismconte.github.io',
base: '/folio',
```

- **Keeping the repo name `folio`** → leave these as-is. Site: `lewismconte.github.io/folio`.
- **A custom domain** (e.g. `lewisconte.com`) → set `base: '/'`, update `site`, add the domain in
  **Settings → Pages → Custom domain**, and create `public/CNAME` containing the domain.
- **A user site** (repo named `lewismconte.github.io`) → set `base: '/'`.

If you change the repo name, update `base` to match (`/<repo-name>`).

---

## Project structure

```
public/            # served as-is (favicon, og image, lab apps)
  lab/<app>/index.html
src/
  assets/          # build-optimised images not tied to a content entry (e.g. profile)
  components/      # Astro components (cards, head, header/footer, lightbox, filter)
  content/         # the Markdown content: projects / blog / lab + co-located images
  layouts/         # page shell
  lib/             # helpers (base-aware URLs)
  pages/           # routes (incl. dynamic [...slug] project/post/lab pages, rss.xml)
  styles/global.css# Tailwind v4 theme tokens + base styles ("dark Swiss grid")
  consts.ts        # site metadata, nav, categories, social links
  content.config.ts# typed content collection schemas
scripts/
  migrate-from-folio.mjs  # one-time import from the old Next.js repo (kept for reference)
  make-og.mjs             # regenerates public/og-default.png
```

## Notes

- **Design**: dark "Swiss grid" — deep charcoal canvas, hairline rules, neo-grotesque type
  (Space Grotesk display / Inter body, self-hosted), one signal accent. Tokens in `src/styles/global.css`.
- **Motion**: View Transitions between pages, IntersectionObserver scroll-reveals, smooth scroll —
  all respect `prefers-reduced-motion`. No WebGL on the main site (that's what the Lab is for).
- **Images**: source images are kept lean; the build generates responsive variants. Originals over
  ~2 MB were recompressed during migration.
