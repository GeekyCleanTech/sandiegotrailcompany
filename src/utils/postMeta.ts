import type { CollectionEntry } from 'astro:content';
import type { MetaData } from '~/types';

const TITLE_SUFFIX = ' | San Diego Trail Company';
const MAX_TITLE = 60;
const MAX_DESCRIPTION = 158;

/** Strip MDX/Markdown syntax from a post body, leaving readable prose. */
export const bodyToText = (body = ''): string =>
  body
    .replace(/^(import|export)\s.*$/gm, '') // MDX imports/exports
    .replace(/<([A-Z]\w*)[^>]*\/>/gs, '') // self-closing components
    .replace(/<([A-Z]\w*)[^>]*>(.*?)<\/\1>/gs, '') // components with children (CTAs)
    .replace(/<[^>]+>/g, ' ') // remaining HTML tags
    .replace(/^#{1,6}\s.*$/gm, '') // headings
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links → text
    .replace(/[*_`>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** Trim text to `max` characters on a word boundary. */
export const truncate = (text: string, max: number): string => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:.–-]+$/, '')}…`;
};

/**
 * Build page metadata from a blog post. Everything is derived from the article itself
 * (title, excerpt or opening paragraph, featured video/image, dates, tags); any
 * `metadata` set in frontmatter still wins field by field.
 */
export const buildPostMetadata = (post: CollectionEntry<'post'>): MetaData => {
  const { data } = post;
  const override = data.metadata ?? {};

  const title = override.title ?? data.title;
  const description =
    override.description ?? truncate(data.excerpt || bodyToText(post.body) || data.title, MAX_DESCRIPTION);

  // Social card: explicit override, else the video poster (so shares preview the featured video), else the image.
  const autoImage = data.video?.poster ?? data.image;
  const images = override.openGraph?.images ?? (autoImage ? [{ url: autoImage }] : undefined);

  return {
    ...override,
    title,
    // Long headlines read better without the site-name suffix than cut off in search results.
    ignoreTitleTemplate: override.ignoreTitleTemplate ?? title.length + TITLE_SUFFIX.length > MAX_TITLE,
    description,
    openGraph: { ...override.openGraph, type: 'article', ...(images ? { images } : {}) },
  };
};

/** schema.org BlogPosting for the post, built from the same fields as the meta tags. */
export const buildPostJsonLd = (post: CollectionEntry<'post'>, pageUrl: string, site: URL | undefined) => {
  const { data } = post;
  const abs = (path?: string) => (path ? String(new URL(path, site)) : undefined);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.title,
    description: data.excerpt,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    datePublished: data.publishDate?.toISOString(),
    dateModified: (data.updateDate ?? data.publishDate)?.toISOString(),
    image: abs(data.image),
    articleSection: data.category,
    keywords: data.tags?.join(', '),
    author: { '@type': 'Organization', name: data.author ?? 'San Diego Trail Company' },
    publisher: { '@type': 'Organization', name: 'San Diego Trail Company', url: abs('/') },
    ...(data.video && {
      video: {
        '@type': 'VideoObject',
        name: data.title,
        description: data.video.label,
        contentUrl: abs(data.video.src),
        thumbnailUrl: abs(data.video.poster ?? data.image),
        uploadDate: data.publishDate?.toISOString(),
      },
    }),
  };
};
