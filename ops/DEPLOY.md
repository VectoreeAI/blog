# Deploy notes (Vectoree Blog)

## GitHub Pages + custom domain

Canonical: **https://blog.vectoree.ai** (`astro.config.ts`: `site` + `base: '/'`).

1. Pages → Source: **GitHub Actions**
2. Custom domain: `blog.vectoree.ai` (`public/CNAME`)
3. Enforce HTTPS after the certificate is ready (avoid HTTP↔HTTPS redirect loops)

Do **not** use `base: '/blog'` once the custom domain is live — that was only for the
temporary `vectoreeai.github.io/blog/` preview.

## Brand assets

| File | Use |
| --- | --- |
| `public/logo.png` | Header mark (Lotus `logo.light` / `logo.dark`) |
| `public/favicon.svg` | Favicon (same mark, SVG) |
| `public/favicon.png` / `favicon-32.png` | Raster fallbacks |
| `public/apple-touch-icon.png` | iOS home screen |

Replace `logo.png` (and regenerate sizes) when the brand mark changes.

## DNS (Cloudflare)

| Type | Name | Target | Proxy |
| --- | --- | --- | --- |
| CNAME | `blog` | `VectoreeAI.github.io` | Prefer **DNS only** until GitHub HTTPS works; then proxy if needed |

## Path redirect

```text
https://vectoree.ai/blog
https://vectoree.ai/blog/*
  → 301 → https://blog.vectoree.ai/$1
```

## After DNS

- Mintlify Blog anchor → `https://blog.vectoree.ai`
- Landing footer Blog link when the site responds 200 over HTTPS
