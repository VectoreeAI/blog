import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader, docsSchema } from '@prosefly/astro-theme-lotus/content';
import { categorySlugs, tagSlugs } from './lib/categories';

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema({
    extend: z.object({
      /** Funnel stage. One per post. See src/lib/categories.ts. */
      category: z.enum(categorySlugs).optional(),
      /** Optional topics. Not used as primary navigation. */
      tags: z.array(z.enum(tagSlugs)).optional(),
      /**
       * Right-rail labels, keyed by heading text or heading slug.
       * Values should be questions. Headings in the article stay as written.
       */
      nav: z.record(z.string(), z.string()).optional(),
      /** Short Q&A rendered after the article, with FAQPage schema. */
      faq: z
        .array(
          z.object({
            question: z.string(),
            answer: z.string(),
          }),
        )
        .optional(),
      /** Extra links in the right rail (posts or product pages). */
      links: z
        .array(
          z.object({
            label: z.string(),
            href: z.string(),
          }),
        )
        .optional(),
    }),
  }),
});

export const collections = { docs };
