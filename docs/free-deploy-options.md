# Free Deployment Options — maithresh.sh

Project profile: **React 19 + Vite static SPA** — build emits plain files into
`dist/` (HTML, hashed CSS/JS, images). No server code. Custom domain
`maithresh.sh`. Every emitted asset is content-hashed, so any host that honors
long cache lifetimes on hashed URLs is ideal and needs no manual cache-busting.

## How this repo actually deploys

Every push to `main` ships to **both** live targets, no manual steps:

1. **Cloudflare Pages** (git integration) — builds with default base `/`,
   serves `maithresh-sh.pages.dev` + custom domain.
2. **GitHub Pages** (`.github/workflows/deploy-pages.yml`) — rebuilds with
   `VITE_BASE=/maithresh.sh/`, uploads `dist/` as the Pages artifact.
3. **Contribution data** (`.github/workflows/refresh-contrib.yml`) — weekly
   snapshot refresh commits straight to `main`, which redeploys 1 + 2 with
   fresh graph data. Manual trigger: Actions → *refresh contribution snapshot*.

The host options below are ranked best-first if you ever move off this setup.
All are free for a site of this size and support the custom domain with free SSL.

---

## 1. Cloudflare Pages — RECOMMENDED

Why first for this project: unlimited free bandwidth, one of the fastest
global CDNs, automatic asset caching, free SSL, and a build step that already
exists. The content-hashed URLs cache perfectly at the edge.

> Per the latest Cloudflare docs (developers.cloudflare.com/pages), Pages now
> lives under the unified **Workers & Pages** area of the dashboard. Free-plan
> limits that matter here: 500 builds/month, 20,000 files, 25 MiB per file,
> unlimited preview deployments — all far above what this portfolio needs.

### Option A — Git integration (recommended)

1. In the Cloudflare dashboard, go to **Workers & Pages** (the repo is
   already on GitHub).
2. Select **Create application** → **Pages** tab → **Connect to Git**
   (labelled "Import an existing Git repository" in the docs).
3. Sign in with GitHub and authorize Cloudflare Pages.
4. Select this repository and **Begin setup**.
5. In **Set up builds and deployments**:
   - Project name: `maithresh-sh` (this becomes `maithresh-sh.pages.dev`)
   - Production branch: `main`
   - Framework preset: **None**
   - Build command: `npm run build` — runs the Vite build (minify + content
     hashing) and then the verification gate, so a regression fails the deploy
     rather than shipping. `npm ci` must run first; set the install command to
     `npm ci` if the default `npm install` is not used.
   - Build output directory: `dist`
   - Root directory (advanced): leave empty (site is at repo root)
6. Select **Save and Deploy**. The `*.pages.dev` URL goes live on first build.

Every push to `main` auto-redeploys production; pushes to any other branch
generate a preview deployment URL. Previews are free and unlimited.

### Option B — Direct Upload via Wrangler (no git needed)

The docs' current flow is create-then-deploy:

```bash
npx wrangler login                       # one-time browser auth
npm run build                            # build + verify gate
npx wrangler pages project create        # prompts for name + production branch
#   project name:  maithresh-sh
#   production branch: main
npm run deploy                           # wrangler pages deploy dist
```

(`npm run deploy` also creates the project on the fly if it does not exist
yet — you get the same name/branch prompts. Preview deploys:
`npm run deploy -- --branch=preview`.)

### Option B2 — Drag and drop (no CLI)

1. **Workers & Pages** → **Create application** → **Get started** →
   **Drag and drop your files**.
2. Enter project name `maithresh-sh` and drag the **`dist/`** folder in, **Deploy site**.
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

The repo-root `_headers` is copied into `dist/` by the Vite build and picked up
by Pages automatically:

```
/assets/*  →  Cache-Control: public, max-age=31536000, immutable
```

Everything Vite emits lands in `/assets/` under a content hash, so a source
edit produces a new filename and the edge cache invalidates on its own — no
manual `?v=` query strings. `index.html` gets Cloudflare's default short cache
so content edits show up immediately.

### Verify after deploy

- `https://maithresh-sh.pages.dev/` and `https://maithresh.sh/` both serve
  `index.html` (Pages serves root `index.html` at `/` — this repo satisfies
  that requirement).
- DevTools → Network: the hashed `/assets/*.css` and `/assets/*.js` responses
  carry `cache-control: public, max-age=31536000, immutable`.
- `cf-cache-status` header appears on asset responses (edge cache hit/miss).

### Gotchas (latest docs)

- Artifact-based deploys (Actions → Pages) skip Jekyll processing, so no
  `.nojekyll` file is needed anywhere in this repo.
- **CAA records** on the zone can block certificate issuance for the custom
  domain — allow `letsencrypt.org` and/or `pki.goog` if you use CAA.
- Moving the DNS entry away from Pages and back causes downtime until the
  domain re-activates — prefer a temporary Redirect Rule instead.
- Free plan: 500 builds/month, 1 concurrent build, 20-min build timeout —
  comfortably enough for a Vite build that finishes in well under a second.
- `_headers` caps at 100 rules (this repo uses 1); `_redirects` caps at
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
2. Framework preset: **Vite**. Build command: **`npm run build`**. Output: **`dist`**.
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
`assets/`). Great if you ever want Netlify Forms later.

### Option A — Drag and drop
1. `npm run build`, then drag the generated `dist/` folder onto
   app.netlify.com/drop. The repo root won't work — the published folder must
   be the build output.
2. Instant live URL.

### Option B — Git integration
1. Add New Site → Import from Git → pick repo.
2. Build command: `npm run build`. Publish directory: **`dist`**.

### Custom domain
Site settings → Domain management → Add `maithresh.sh` → follow DNS
values (apex via `A` + `www` via `CNAME`, or Cloudflare-style flattening).
HTTPS automatic.

Gotchas: none for static. Optional `netlify.toml` for long caching:
```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## 4. GitHub Pages — the zero-new-accounts option

Why fourth: free, custom-domain friendly, zero setup beyond a push.
Downsides for "load faster online": no edge cache control, single-origin
serving, noticeably slower global TTFB than 1–3 above.

This repo deploys to Pages with an **Actions workflow**
(`.github/workflows/deploy-pages.yml`), not branch-folder publishing —
the workflow builds with `VITE_BASE=/maithresh.sh/` (a project site serves
from `/<repo>/`, so root-absolute asset URLs would 404) and uploads `dist/`.

### Steps
1. Push to `main` — the workflow builds and deploys automatically.
2. Repo Settings → Pages → Source: **GitHub Actions** (one-time).
3. Site serves at `https://<user>.github.io/maithresh.sh/` (or user-site root).
4. Custom domain: set the domain in Pages settings (or drop a `CNAME` file
   containing `maithresh.sh` **inside `dist/`**, since that's the published
   folder), then add `A` records (`185.199.108.153` … `.111`) + `www CNAME`
   at DNS. Enforce HTTPS in the Pages settings.

Gotchas: `_headers` is inert here (Pages ignores it). Caching falls back to
GitHub's default (10 min on HTML), so repeat loads are slower than a
Cloudflare/Vercel edge.

---

## 5. Render Static Site — fine fallback

Why fifth: free static hosting with git auto-deploys and free SSL, but
slower dashboard/build UX than the top three and no advantage for a
single-page Vite build.

### Steps
1. dashboard.render.com → New → Static Site → connect repo.
2. Build command: `npm run build`. Publish directory: **`dist`**.
3. Add custom domain under Settings → follow DNS instructions.

Gotchas: free tier sleeps **web services**, but static sites stay always-on —
make sure you pick **Static Site**, not Web Service.

---

## 6. Surge.sh — fastest CLI-only deploys

Why sixth: tiny, fast, free (`surge.sh` subdomain) CLI publishing with
easy custom domains — but a thin CDN compared to 1–3, and no git previews.

### Steps
1. `npm run build`, then `npm i -g surge`.
2. `surge dist` — surge publishes the folder you point it at, so this must be
   the build output, not the repo root.
3. Accept/choose domain (`maithresh.surge.sh` free).
4. Custom domain: `surge dist maithresh.sh` after adding the `CNAME` DNS
   record pointing at `na-west1.surge.sh`.

Gotchas: `CNAME` file convention also works for domain memory. No free
automatic branch previews.

---

## Post-deploy checklist (any host)

- [ ] Open `https://maithresh.sh/` + `https://www.maithresh.sh/` — both load, HTTPS valid.
- [ ] Hard-refresh once, then reload: hashed `/assets/*` files served from cache.
- [ ] `⌘K` palette, workbench sims, mobile nav toggle all work on the live URL.
- [ ] Test on a phone over cellular (hero canvas + 37 KB portrait are the heaviest first-paint items).
- [ ] Confirm a content-hashed filename actually changed for the file you edited (that is the cache invalidation).
- [ ] Contribution graph shows a recent baseline: with the live API blocked, the caption reads `snapshot <date>` — if that date is weeks old, run Actions → *refresh contribution snapshot*.
