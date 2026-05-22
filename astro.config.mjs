import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://swarpi.com',
  integrations: [mdx(), sitemap()],
  output: 'static',
  compressHTML: true,
  prefetch: {
    defaultStrategy: 'hover',
  },
});
