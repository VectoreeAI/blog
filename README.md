# Vectoree Blog

> Product updates and guides for https://vectoree.ai

- Site: https://blog.vectoree.ai
- Source theme: [Astro Theme Lotus](https://astro.build/themes/details/lotus/)
- Product docs (API / SDK): https://docs.vectoree.ai

`https://vectoree.ai/blog` should 301 to this host (Cloudflare on the app zone).

## Operators: publish a post

1. Copy `ops/post-template.mdx` → `src/content/docs/posts/<slug>.mdx`
2. Fill `title` / `description` / body
3. Open a PR; merge to `main` → GitHub Pages deploys

Do not edit theme or CI for a normal article. See `/writing/` on the site.

## Develop

```sh
pnpm install
pnpm dev
```

```sh
pnpm build
pnpm preview
```

## Deploy

GitHub Actions (`.github/workflows/site.yml`) builds with pnpm and publishes to
GitHub Pages. Enable Pages → Source: **GitHub Actions**, then set custom domain
`blog.vectoree.ai` (CNAME file is already in `public/`).

## Layout

```text
src/content/docs/
  index.mdx          Splash homepage
  about.mdx
  writing.mdx
  posts/             ← day-to-day publishing
theme.config.json    Nav, footer, search
astro.config.ts      site = https://blog.vectoree.ai
```
