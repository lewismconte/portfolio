// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Production URL. With a project page on GitHub Pages the site lives at
  // <user>.github.io/<repo>, so `base` must match the repo name.
  // If you move to a custom domain or a user-site (user.github.io), set base to '/'.
  site: 'https://lewismconte.github.io',
  base: '/portfolio',
  trailingSlash: 'ignore',
  integrations: [
    mdx(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
  image: {
    // Build-time optimization via sharp. Produces responsive AVIF/WebP into the
    // static output — fully compatible with GitHub Pages (no server needed).
    responsiveStyles: true,
  },
});
