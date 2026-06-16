---
title: Rebuilding my portfolio with Astro
date: 2026-06-16
summary: >-
  Why I moved from a flashy, image-heavy one-shot site to a content-first
  platform I can actually maintain — and how the new one is put together.
tags:
  - meta
  - web
  - process
draft: false
---

I rebuilt this site. The old one did its job — it got me in the room a few times — but it was a showpiece, not a place. Every change meant editing a React component, the images were multi-megabyte originals served raw, and the metadata literally said "v0 App". It was a site I'd made *once*, not one I could keep adding to.

This version is the opposite by design: **content-first**, and built so that publishing is the easy part.

## What changed

The whole thing is now [Astro](https://astro.build) with two content collections — one for **projects**, one for these **notebook** posts. Adding either is a single Markdown file with typed frontmatter; the per-page routes generate themselves. No components to touch.

Images go through Astro's build-time pipeline, so the 6 MB photographs from the old repo become responsive, modern formats served at the size your screen actually needs. The source images got recompressed on the way in, too — nothing multi-megabyte ships.

A few deliberate constraints:

- **No WebGL, no spectacle.** The old hero had morphing shapes. This one lets the architecture imagery carry the page in a calm vertical flow.
- **Two small interactive pieces survive** — the category filter on the Work page and a click-to-zoom image lightbox — both as tiny vanilla-JS islands rather than a framework.
- **TypeScript checking stays on.** The old project disabled it; this one fails the build if types are wrong.

## Why a notebook

Architecture is slow, but the thinking around it doesn't have to be. I want somewhere to write — about computational design, about the BIM tools I keep building, about what I'm reading and looking at — without it being a Production. This is that place. Posts will be short and frequent rather than polished and rare.

It's hosted free on GitHub Pages and deploys itself on every push. If you're reading this, it worked.
