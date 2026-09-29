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

> Per the latest Cloudflare docs (developers.cloudflare.com/pages), Pages now
> lives under the unified **Workers & Pages** area of the dashboard. Free-plan
> limits that matter here: 500 builds/month, 20,000 files, 25 MiB per file,
> unlimited preview deployments — all far above what this portfolio needs.

### Option A — Git integration (recommended)

1. Push this repo to GitHub (already a git repo).
2. In the Cloudflare dashboard, go to **Workers & Pages**.
3. Select **Create application** → **Pages** tab → **Connect to Git**
   (labelled "Import an existing Git repository" in the docs).
4. Sign in with GitHub and authorize Cloudflare Pages.
5. Select this repository and **Begin setup**.
6. In **Set up builds and deployments**:
   - Project name: `maithresh-sh` (this becomes `maithresh-sh.pages.dev`)
   - Production branch: `main`
   - Framework preset: **None**
   - Build command: `exit 0` — the docs now recommend this even for sites
     with no build step (it unlocks Pages Functions features later). Leaving
     it **blank** also works for a pure static deploy.
   - Build output directory: `/` (repo root — `index.html` sits at root)
   - Root directory (advanced): leave empty (site is at repo root)
7. Select **Save and Deploy**. The `*.pages.dev` URL goes live on first build.

Every push to `main` auto-redeploys production; pushes to any other branch
generate a preview deployment URL. Previews are free and unlimited.

### Option B — Direct Upload via Wrangler (no git needed)

The docs' current flow is create-then-deploy:

```bash
npx wrangler login                       # one-time browser auth
npx wrangler pages project create        # prompts for name + production branch
#   project name:  maithresh-sh
#   production branch: main
npx wrangler pages deploy .              # deploys this folder as-is
```

(`npx wrangler pages deploy` also creates the project on the fly if it does
not exist yet — you get the same name/branch prompts. Preview deploys:
`npx wrangler pages deploy . --branch=preview`.)

### Option B2 — Drag and drop (no CLI)

1. **Workers & Pages** → **Create application** → **Get started** →
   **Drag and drop your files**.
2. Enter project name `maithresh-sh`, drag the project folder in, **Deploy site**.
3. Later updates: open the project → **Create a new deployment** → choose
   production or preview → re-drag the folder.

> ⚠️ **Pick once:** a project started with Git integration can never be
> switched to Direct Upload, and vice versa. Changing later means creating a
> new project. Also: dashboard drag-and-drop is not available for
> Git-integrated projects (Wrangler deploys still work).

### Custom domain `maithresh.sh`

1. **Workers & Pages** → select the Pages project → **Custom domains** →
   **Set up a domain** → enter `maithresh.sh` → **Continue**.
2. **Apex domains require the domain as a Cloudflare zone.** Add
   `maithresh.sh` as a zone on this Cloudflare account and point your
   registrar's nameservers to Cloudflare's. Once nameservers resolve,
   Cloudflare creates the CNAME (flattened at apex) automatically.
3. Add `www.maithresh.sh` the same way (subdomains only need a CNAME record
   pointing to `maithresh-sh.pages.dev`; on a Cloudflare zone it is added
   automatically after you confirm).
4. Redirect `www` → apex: add a `_redirects` file at repo root
   (`www.maithresh.sh/* https://maithresh.sh/:splat 301`) or a Cloudflare
   **Redirect Rule** — the rule is easier and doesn't need a redeploy.
5. SSL is automatic (universal cert per hostname). Turn on **Always Use
   HTTPS** under zone → SSL/TLS → Edge Certificates.

Do **not** just hand-add a CNAME at your registrar without going through
"Set up a domain" first — the domain will fail to resolve (522).

### Caching on Pages — already wired up

The repo-root `_headers` file is picked up by Pages automatically (it ships
with the site, at the build output directory root):

```
/css/*, /js/*, /assets/*  →  Cache-Control: public, max-age=31536000, immutable
```

Keep bumping `?v=` on every CSS/JS edit so edge caches invalidate (the
project's standard flow). HTML gets Cloudflare's default short cache.

### Verify after deploy

- `https://maithresh-sh.pages.dev/` and `https://maithresh.sh/` both serve
  `index.html` (Pages serves root `index.html` at `/` — this repo satisfies
  that requirement).
- DevTools → Network: `style.min.css`, `main.min.js`, `scene.min.js` responses
  carry `cache-control: public, max-age=31536000, immutable`.
- `cf-cache-status` header appears on asset responses (edge cache hit/miss).

### Gotchas (latest docs)

- `.nojekyll` is ignored by Pages (harmless — it's for GitHub Pages).
- **CAA records** on the zone can block certificate issuance for the custom
  domain — allow `letsencrypt.org` and/or `pki.goog` if you use CAA.
- Moving the DNS entry away from Pages and back causes downtime until the
  domain re-activates — prefer a temporary Redirect Rule instead.
- Free plan: 500 builds/month, 1 concurrent build, 20-min build timeout —
  irrelevant for this no-build site.
- `_headers` caps at 100 rules (this repo uses 3); `_redirects` caps at
  2,100 redirects.
- Related docs: [Deploy anything](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/),
  [Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/),
  [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/),
  [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/),
  [Headers](https://developers.cloudflare.com/pages/configuration/headers/),
  [Limits](https://developers.cloudflare.com/pages/platform/limits/).

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
