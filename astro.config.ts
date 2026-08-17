import { defineConfig } from 'astro/config';
import lotus from '@prosefly/astro-theme-lotus';
import sitemap from '@astrojs/sitemap';

// Custom domain blog.vectoree.ai → base must be '/'
export default defineConfig({
  site: 'https://blog.vectoree.ai',
  base: '/',
  integrations: [lotus(), sitemap()],
});
