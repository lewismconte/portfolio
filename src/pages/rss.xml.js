import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '@/consts';
import { withBase } from '@/lib/url';

export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: `${SITE.title} — Notebook`,
    description: SITE.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
      link: withBase(`/blog/${post.id}/`),
      categories: post.data.tags,
    })),
    customData: `<language>en-au</language>`,
  });
}
