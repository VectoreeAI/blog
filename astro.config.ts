import { defineConfig } from 'astro/config';
import lotus from '@prosefly/astro-theme-lotus';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://blog.vectoree.ai',
  base: '/',
  integrations: [lotus(), sitemap()],
});
