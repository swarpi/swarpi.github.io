import { defineCollection, z } from 'astro:content';

const writing = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    private: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  writing,
};
