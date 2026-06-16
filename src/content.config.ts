import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';
import { glob } from 'astro/loaders';
import { CATEGORIES } from '@/consts';

// Strip the file extension and any trailing `/index` so a folder-based entry
// (`wentworth/index.mdx`) and a flat file (`hello-world.md`) both yield a clean
// slug. Lets a project be a self-contained folder of MDX + its images.
const cleanId = ({ entry }: { entry: string }) =>
  entry.replace(/\.(md|mdx)$/, '').replace(/\/index$/, '');

const projects = defineCollection({
  loader: glob({
    base: './src/content/projects',
    pattern: '**/*.{md,mdx}',
    generateId: cleanId,
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Sortable date. Use the project's (start) year, e.g. 2022-01-01.
      date: z.coerce.date(),
      category: z.enum(CATEGORIES),
      summary: z.string(),
      cover: image(),
      coverAlt: z.string().optional(),
      // Optional supplementary gallery (the main images live in the body).
      gallery: z
        .array(z.object({ src: image(), alt: z.string().default('') }))
        .optional(),
      // Spec-style label/value rows shown in the project sidebar.
      details: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

const lab = defineCollection({
  loader: glob({
    base: './src/content/lab',
    pattern: '**/*.{md,mdx}',
    generateId: cleanId,
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      summary: z.string(),
      // Path (under the site base) to the standalone app in /public, e.g. "/lab/harmonograph/".
      url: z.string(),
      // Open the app in a new tab instead of the same tab.
      newTab: z.boolean().default(false),
      tech: z.array(z.string()).default([]),
      // Optional static thumbnail. If omitted, the card shows a live preview.
      thumb: image().optional(),
      thumbAlt: z.string().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/*.{md,mdx}',
    generateId: cleanId,
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      summary: z.string(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects, lab, blog };
