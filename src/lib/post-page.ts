import { getCollection, type CollectionEntry } from 'astro:content';
import { categoryBySlug, type CategorySlug } from './categories';

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface RailLink {
  label: string;
  href: string;
}

export interface RelatedPost {
  href: string;
  title: string;
  description?: string;
  kicker?: string;
}

export interface PostPage {
  id: string;
  title: string;
  description?: string;
  pageUrl: string;
  faq: FaqEntry[];
  nav?: Record<string, string>;
  links: RailLink[];
  related: RelatedPost[];
}

export const defaultCtas: { label: string; href: string; variant: 'primary' | 'secondary' }[] = [
  { label: 'Try Vectoree', href: 'https://vectoree.ai', variant: 'primary' },
  { label: 'Read the docs', href: 'https://docs.vectoree.ai', variant: 'secondary' },
];

type DocsEntry = CollectionEntry<'docs'>;

interface PostFields {
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  faq?: FaqEntry[];
  nav?: Record<string, string>;
  links?: RailLink[];
  sidebar?: { order?: number };
  draft?: boolean;
}

export function isBlogPostId(id: string): boolean {
  const normalized = id.replace(/\\/g, '/');
  return normalized.startsWith('posts/') && normalized !== 'posts/index';
}

export function pathnameToId(pathname: string): string {
  return pathname
    .replace(/\/index\.html$/, '/')
    .replace(/\/+$/, '')
    .replace(/^\/+/, '');
}

function fields(entry: DocsEntry): PostFields {
  return entry.data as PostFields;
}

function hrefFor(id: string): string {
  return `/${id.replace(/\\/g, '/')}/`;
}

function scoreRelated(current: PostFields, other: PostFields): number {
  let score = 0;
  if (current.category && other.category === current.category) score += 5;
  const tags = new Set(current.tags ?? []);
  for (const tag of other.tags ?? []) {
    if (tags.has(tag)) score += 1;
  }
  return score;
}

export async function getPostPage(pathname: string, site?: URL): Promise<PostPage | undefined> {
  const id = pathnameToId(pathname);
  if (!isBlogPostId(id)) return undefined;

  const entries = await getCollection('docs', (entry) => {
    if (entry.data.draft && import.meta.env.PROD) return false;
    return isBlogPostId(entry.id);
  });

  const current = entries.find((entry) => entry.id.replace(/\\/g, '/') === id);
  if (!current) return undefined;

  const currentFields = fields(current);
  const related = entries
    .filter((entry) => entry.id !== current.id)
    .map((entry) => ({ entry, score: scoreRelated(currentFields, fields(entry)) }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const orderA = fields(a.entry).sidebar?.order ?? Number.POSITIVE_INFINITY;
      const orderB = fields(b.entry).sidebar?.order ?? Number.POSITIVE_INFINITY;
      if (orderA !== orderB) return orderA - orderB;
      return fields(a.entry).title.localeCompare(fields(b.entry).title);
    })
    .slice(0, 3)
    .map(({ entry }) => {
      const data = fields(entry);
      const category = categoryBySlug(data.category as CategorySlug | undefined);
      return {
        href: hrefFor(entry.id),
        title: data.title,
        description: data.description,
        kicker: category?.label,
      } satisfies RelatedPost;
    });

  const pageUrl = site ? new URL(hrefFor(id), site).toString() : hrefFor(id);

  return {
    id,
    title: currentFields.title,
    description: currentFields.description,
    pageUrl,
    faq: currentFields.faq ?? [],
    nav: currentFields.nav,
    links: currentFields.links ?? [],
    related,
  };
}
