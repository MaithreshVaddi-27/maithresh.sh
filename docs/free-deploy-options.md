# Free Deployment Options — maithresh.sh

Project profile: **pure static site** — `index.html` + `css/` + `js/` + `assets/`,
no build step, no framework, no server code. Custom domain `maithresh.sh`.
Static assets are already cache-busted with `?v=` query strings
(`style.css`, `main.js`, `scene.js`), so any host that honors long cache
lifetimes on versioned URLs is ideal.

Sorted **best-first for this exact project**. All options below are free
for a site of this size and support the custom domain with free SSL.

---

## 1. Cloudflare Pages — RECOMMENDED

Why first for this project: unlimited free bandwidth, one of the fastest
global CDNs, automatic asset caching, free SSL, and zero build config for
static output. The versioned `?v=` URLs cache perfectly at the edge.

### Option A — Git integration (recommended)
1. Push this repo to GitHub (already a git repo).
2. Go to dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git.
3. Select the repo. Framework preset: **None**. Build command: **(leave empty)**.
   Build output directory: **`/`** (repo root — `index.html` sits at root).
4. Deploy. You get `https://maithresh-sh.pages.dev` instantly.

### Option B — Direct upload (no git needed)
1. `npx wrangler pages deploy . --project-name maithresh-sh`
   (deploys the current folder as-is; add `--commit-dirty=true` if needed).

### Custom domain `maithresh.sh`
1. Pages project → Custom domains → Set up `maithresh.sh` (+ `www` → redirect).
2. If DNS is already on Cloudflare: automatic. If not: add the shown
   `CNAME`/flattened record at your registrar, or transfer nameservers.
3. SSL is automatic. Turn on **Always Use HTTPS**.

Gotchas: none significant. `.nojekyll` is ignored (harmless).
Preview deployments per commit are free and unlimited.

---

## 2. Vercel — best developer experience

Why second: zero-config static deploys, excellent global edge, instant
previews per commit, free hobby tier (100 GB bandwidth/month — far above
what this portfolio will use). Slightly less generous than Cloudflare,
slightly nicer workflow.

### Option A — Git integration
1. Push repo to GitHub → vercel.com → Add New → Project → Import.
2. Framework preset: **Other**. Build command: **empty**. Output: **`.`**.
3. Deploy → `https://maithresh-sh.vercel.app`.

### Option B — CLI
1. `npm i -g vercel && vercel` (link project, accept defaults for static).
2. `vercel --prod` to ship.

### Custom domain
Project → Settings → Domains → add `maithresh.sh` → add the suggested
`A`/`CNAME` records at your registrar. SSL automatic.

Gotchas: hobby tier = 100 GB bandwidth/mo (fine here). No server code
needed, so nothing to adapt — do **not** add a `vercel.json` unless you
want custom cache headers.

---

## 3. Netlify — simplest dashboard + useful extras

Why third: free starter (100 GB bandwidth/mo), drag-and-drop deploys,
trivial custom headers via `netlify.toml` (e.g. immutable caching for
`css/`, `js/`, `assets/`). Great if you ever want Netlify Forms later.

### Option A — Drag and drop
1. Zip the project folder (or drag the folder) onto app.netlify.com/drop.
2. Instant live URL.

### Option B — Git integration
1. Add New Site → Import from Git → pick repo.
2. Build command: **empty**. Publish directory: **`.`** (or `/`).

### Custom domain
Site settings → Domain management → Add `maithresh.sh` → follow DNS
values (apex via `A` + `www` via `CNAME`, or Cloudflare-style flattening).
HTTPS automatic.

Gotchas: none for static. Optional `netlify.toml` for long caching:
```toml
[[headers]]
  for = "/css/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## 4. GitHub Pages — the zero-new-accounts option

Why fourth: this repo already contains `.nojekyll` (the classic Pages
marker), so you may already be hosted here. Free, custom-domain friendly,
zero setup beyond a branch. Downsides for "load faster online": no edge
cache control, single-origin serving, noticeably slower global TTFB than
1–3 above.

### Steps
1. Push to GitHub → repo Settings → Pages → Source: **Deploy from branch**,
   branch `main`, folder `/ (root)`.
2. Site serves at `https://<user>.github.io/<repo>/` (or user-site root).
3. Custom domain: add file `CNAME` containing `maithresh.sh` at repo root,
   then add `A` records (`185.199.108.153` … `.111`) + `www CNAME` at DNS.
   Enforce HTTPS in the Pages settings.

Gotchas: keep `.nojekyll` (prevents Jekyll processing of `_`-prefixed
paths). No custom headers — caching is GitHub's default (10 min on HTML),
so repeat loads are slower than Cloudflare/Vercel edge.

---

## 5. Render Static Site — fine fallback

Why fifth: free static hosting with git auto-deploys and free SSL, but
slower dashboard/build UX than the top three and no advantage for a
no-build site.

### Steps
1. dashboard.render.com → New → Static Site → connect repo.
2. Build command: **empty** (or `echo static`). Publish directory: **`.`**.
3. Add custom domain under Settings → follow DNS instructions.

Gotchas: free tier sleeps **web services**, but static sites stay always-on —
make sure you pick **Static Site**, not Web Service.

---

## 6. Surge.sh — fastest CLI-only deploys

Why sixth: tiny, fast, free (`surge.sh` subdomain) CLI publishing with
easy custom domains — but a thin CDN compared to 1–3, and no git previews.

### Steps
1. `npm i -g surge && surge` inside the project folder.
2. Accept/choose domain (`maithresh.surge.sh` free).
3. Custom domain: `surge ./ maithresh.sh` after adding the `CNAME` DNS
   record pointing at `na-west1.surge.sh`.

Gotchas: `CNAME` file convention also works for domain memory. No free
automatic branch previews.

---

## Post-deploy checklist (any host)

- [ ] Open `https://maithresh.sh/` + `https://www.maithresh.sh/` — both load, HTTPS valid.
- [ ] Hard-refresh once, then reload: `css/`, `js/`, portrait SVG served from cache.
- [ ] `⌘K` palette, workbench sims, mobile nav toggle all work on the live URL.
- [ ] Test on a phone over cellular (hero canvas + 37 KB portrait are the heaviest first-paint items).
- [ ] Keep the `?v=` versions bumped on every CSS/JS edit so edge caches invalidate.
