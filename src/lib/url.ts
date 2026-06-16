// Prefix an internal path with the configured `base` (e.g. "/folio").
// Use for every internal <a href> and asset URL so links work on GitHub Pages.
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (!path || path === '/') return base ? `${base}/` : '/';
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

// Absolute URL (for OG tags, canonical, RSS). `site` must be set in config.
export function absoluteUrl(path: string, site: URL | undefined): string {
  const rel = withBase(path);
  return site ? new URL(rel, site).href : rel;
}
