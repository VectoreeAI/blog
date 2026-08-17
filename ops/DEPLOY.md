# Deploy notes (Vectoree Blog)

## GitHub Pages

1. Repo Settings → Pages → Source: **GitHub Actions**
2. After first green `Site` workflow, custom domain: `blog.vectoree.ai`
3. `public/CNAME` already contains `blog.vectoree.ai`
4. Enforce HTTPS once the certificate is ready

## DNS (Cloudflare)

On the `vectoree.ai` zone:

| Type | Name | Target | Proxy |
| --- | --- | --- | --- |
| CNAME | `blog` | `VectoreeAI.github.io` | DNS only while GitHub issues the cert; then can proxy if desired |

Exact Pages target may be `VectoreeAI.github.io` (org) — confirm in GitHub Pages settings after first deploy.

## Path redirect

On the apex / app hostname (`vectoree.ai`), add a Cloudflare Redirect Rule (or Bulk Redirect):

```text
https://vectoree.ai/blog
https://vectoree.ai/blog/*
  → 301 → https://blog.vectoree.ai/$1
```

Do not reverse-proxy; canonical host is the subdomain.

## After DNS

- Update Mintlify `docs/docs.json` Blog anchor to `https://blog.vectoree.ai` (or keep `/blog` and rely on 301)
- Restore landing footer Blog link when the site responds 200
