/** Funnel stages for blog posts. */
export const categorySlugs = ['challenge', 'evaluate', 'solution', 'adopt'] as const;

export type CategorySlug = (typeof categorySlugs)[number];

export const tagSlugs = ['models', 'gateway', 'agents', 'cli', 'integration'] as const;

export type TagSlug = (typeof tagSlugs)[number];

export const categories: {
  slug: CategorySlug;
  label: string;
  blurb: string;
}[] = [
  {
    slug: 'challenge',
    label: 'Challenge',
    blurb: 'Challenges and the situations agents are asked to handle.',
  },
  {
    slug: 'evaluate',
    label: 'Evaluate',
    blurb: 'Selection and integration notes for models and APIs.',
  },
  {
    slug: 'solution',
    label: 'Solution',
    blurb: 'What Vectoree provides, and why that is worth using.',
  },
  {
    slug: 'adopt',
    label: 'Adopt',
    blurb: 'Pilot setup and the path from a trial to production.',
  },
];

export function categoryBySlug(slug: string | undefined) {
  return categories.find((category) => category.slug === slug);
}
