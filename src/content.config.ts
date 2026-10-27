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
    }),
  }),
});

export const collections = { docs };
