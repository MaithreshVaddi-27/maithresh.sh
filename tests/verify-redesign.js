// tests/verify-redesign.js
const fs = require('fs');
const path = require('path');

function runChecks() {
  console.log('🧪 Starting Redesign Verification Suite...');
  let errors = [];

  const htmlPath = path.join(__dirname, '../index.html');
  const cssPath = path.join(__dirname, '../css/style.css');
  const jsPath = path.join(__dirname, '../js/main.js');

  if (!fs.existsSync(htmlPath)) errors.push('Missing index.html');
  if (!fs.existsSync(cssPath)) errors.push('Missing css/style.css');
  if (!fs.existsSync(jsPath)) errors.push('Missing js/main.js');

  if (errors.length > 0) {
    console.error('❌ Critical files missing:');
    errors.forEach(e => console.error('  - ' + e));
    process.exit(1);
  }

  const html = fs.readFileSync(htmlPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');
  const js = fs.readFileSync(jsPath, 'utf8');

  // Check 1: Brand name maithresh.sh
  if (!html.includes('maithresh.sh')) {
    errors.push('index.html must include new brand "maithresh.sh"');
  }

  // Check 2: Refined Subdued Cyan variable in CSS
  if (!css.includes('--accent-cyan') || !css.includes('#38bdf8')) {
    errors.push('css/style.css must define --accent-cyan as #38bdf8 (subdued ice cyan)');
  }

  // Check 3: Workbench shell classes (renamed from doppelrand-shell/core
  // in the production pass — behavior externalized, names clarified)
  if (!css.includes('.wb-shell') || !css.includes('.wb-core')) {
    errors.push('css/style.css must define .wb-shell and .wb-core');
  }
  if (css.includes('.doppelrand-shell') || html.includes('doppelrand')) {
    errors.push('doppelrand naming must be fully retired (html/css/js)');
  }

  // Check 4: Button-in-button nested class
  if (!css.includes('.btn-nested') || !css.includes('.btn-nested-badge')) {
    errors.push('css/style.css must define .btn-nested and .btn-nested-badge');
  }

  // Check 5: TrustRAG interactive SVG pipeline visualizer in HTML
  if (!html.includes('id="trustrag-pipeline-svg"') && !html.includes('id="pipelineSvg"')) {
    errors.push('index.html must contain TrustRAG interactive SVG pipeline element');
  }

  // Check 6: Interactive simulation function in js/main.js
  if (!js.includes('runTrustRagSim')) {
    errors.push('js/main.js must contain runTrustRagSim function');
  }

  // Check 7: Command Console ⌘K listener in js/main.js
  if (!js.includes('initCommandConsole') && !js.includes('openCommandPalette')) {
    errors.push('js/main.js must contain Command Console initialization logic');
  }

  // Check 8: Terminal portrait SVG reference
  if (!html.includes('maithresh-terminal-portrait.59fb7aed.svg')) {
    errors.push('index.html must reference maithresh-terminal-portrait.59fb7aed.svg');
  }

  // Check 9: Purge muddy aurora divs
  if (html.includes('class="bg-aurora"')) {
    errors.push('index.html must not contain muddy .bg-aurora gradient divs');
  }

  // Check 10: Dot Matrix canvas engine in js/scene.js
  const scenePath = path.join(__dirname, '../js/scene.js');
  if (fs.existsSync(scenePath)) {
    const sceneJs = fs.readFileSync(scenePath, 'utf8');
    if (!sceneJs.includes('dot-matrix') && !sceneJs.includes('SPACING') && !sceneJs.includes('linear-dot-matrix')) {
      errors.push('js/scene.js must implement the Linear proximity dot-matrix canvas engine');
    }
  } else {
    errors.push('Missing js/scene.js');
  }

  // Check 11: Tactile matte noise overlay
  if (!html.includes('noise-overlay') && !css.includes('noise-overlay')) {
    errors.push('index.html or css/style.css must include tactile matte noise-overlay');
  }

  // Check 12: Live telemetry pointer coordinates in js/main.js
  if (!js.includes('updatePointerTelemetry') && !js.includes('PTR:')) {
    errors.push('js/main.js must implement live pointer telemetry tracking');
  }

  // Check 13: Multi-System Architectural Workbench Tabs & Panes
  const tabs = ['tab-trustrag', 'tab-docuchat', 'tab-resumecrew', 'tab-careeros'];
  tabs.forEach(t => {
    if (!html.includes(`id="${t}"`)) {
      errors.push(`index.html must contain workbench tab #${t}`);
    }
  });

  const simFuncs = ['switchWorkbenchTab', 'runDocuChatSim', 'runResumeCrewSim', 'runCareerOSSim'];
  simFuncs.forEach(f => {
    if (!js.includes(f)) {
      errors.push(`js/main.js must contain multi-system workbench function: ${f}`);
    }
  });

  // Check 14: All 5 Featured Projects must have precision SVG schematics (.proj-diagram)
  const projDiagramMatches = (html.match(/class="proj-diagram"/g) || []).length;
  if (projDiagramMatches < 5) {
    errors.push(`index.html must contain at least 5 .proj-diagram SVG schematics (found ${projDiagramMatches})`);
  }

  // Check 15: All 5 project diagrams use standardized Flight Telemetry palette
  const requiredPaletteColors = ['#38bdf8', '#10b981', '#f59e0b', '#ef4444', '#a855f7'];
  requiredPaletteColors.forEach(color => {
    if (!html.includes(color)) {
      errors.push(`index.html must include flight telemetry color: ${color}`);
    }
  });

  // Check 16: Apple Fluid Interface & Vanguard UI standards in css/style.css
  if (!css.includes(':active') || !css.includes('scale(0.97)')) {
    errors.push('css/style.css must implement Apple-style :active scale(0.97) direct tactile response');
  }
  if (!css.includes('cubic-bezier(0.16, 1, 0.3, 1)') && !css.includes('cubic-bezier(.16,1,.3,1)')) {
    errors.push('css/style.css must implement Apple critically damped spring curve');
  }
  if (!css.includes('backdrop-filter: blur(20px) saturate(180%)')) {
    errors.push('css/style.css must implement Apple translucent materials hierarchy');
  }

  // Check 17: Zero inline styles ship in production markup
  if (html.includes('style="')) {
    errors.push('index.html must not contain inline style="" attributes (externalize to css/style.css)');
  }

  // Check 18: Zero inline handlers ship in production markup
  if (html.includes('onclick=')) {
    errors.push('index.html must not contain inline onclick handlers (delegate in js/main.js)');
  }

  // Check 19: Exactly one H1, owned by the name
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  if (h1Count !== 1) {
    errors.push(`index.html must contain exactly one <h1> (found ${h1Count})`);
  }

  // Check 20: Portrait can never render blank
  if (!html.includes('portrait-fallback') || !css.includes('.portrait-fallback')) {
    errors.push('portrait must ship a branded fallback (html + css)');
  }

  // Check 21: Gradient display text has a supports-guarded fallback
  if (!css.includes('@supports not')) {
    errors.push('css/style.css must guard gradient text with an @supports fallback');
  }

  // Check 22: All 8 simulation dispatches wired via data-sim
  const sims = ['trustrag:valid', 'trustrag:fail', 'docuchat:tool', 'docuchat:local', 'resumecrew:match', 'resumecrew:gap', 'careeros:dedup', 'careeros:resilient'];
  sims.forEach(s => {
    if (!html.includes(`data-sim="${s}"`)) {
      errors.push(`index.html must wire simulation data-sim="${s}"`);
    }
  });

  // Check 23: Zero inline <style> except the single noscript fallback
  // (all SVG diagram typography lives in css/style.css: .pd-t/.pd-label/.pd-sub/.pd-tiny)
  const styleTags = (html.match(/<style/g) || []).length;
  if (styleTags > 1) {
    errors.push(`index.html must contain at most one <style> (noscript fallback only, found ${styleTags})`);
  }
  if (styleTags === 1 && !html.includes('<noscript><style>')) {
    errors.push('the single permitted <style> must be the noscript fallback');
  }
  ['.pd-t', '.pd-label', '.pd-sub', '.pd-tiny'].forEach(cls => {
    if (!css.includes(cls)) {
      errors.push(`css/style.css must define shared SVG diagram class ${cls} (no per-SVG <style> blocks)`);
    }
  });

  // Check 24: Canonical + OG URLs must resolve (maithresh.sh is NXDOMAIN —
  // point at the live github.io origin; brand text maithresh.sh is fine)
  if (html.includes('href="https://maithresh.sh/') || html.includes('content="https://maithresh.sh/')) {
    errors.push('index.html must not link canonical/OG URLs to non-resolving https://maithresh.sh/ (use the github.io origin)');
  }
  if (!html.includes('https://maithreshvaddi-27.github.io/maithresh.sh/')) {
    errors.push('index.html canonical/OG URLs must point at https://maithreshvaddi-27.github.io/maithresh.sh/');
  }

  // Check 25: Résumé asset wired (palette data-action="resume" → real PDF)
  if (!html.includes('data-action="resume"')) {
    errors.push('index.html command palette must expose a data-action="resume" item');
  }
  if (!fs.existsSync(path.join(__dirname, '../assets/maithresh_vaddi_resume.pdf'))) {
    errors.push('assets/maithresh_vaddi_resume.pdf must exist (palette resume target)');
  }

  // Check 26: Immutable edge-cache rules ship for versioned static assets
  const headersPath = path.join(__dirname, '../_headers');
  const netlifyPath = path.join(__dirname, '../netlify.toml');
  if (!fs.existsSync(headersPath) || !fs.readFileSync(headersPath, 'utf8').includes('immutable')) {
    errors.push('_headers must define immutable caching for /css/*, /js/*, /assets/*');
  }
  if (!fs.existsSync(netlifyPath) || !fs.readFileSync(netlifyPath, 'utf8').includes('immutable')) {
    errors.push('netlify.toml must mirror immutable caching for /css/*, /js/*, /assets/*');
  }

  // Check 27: Solo-system counts read eleven everywhere (reconciled total)
  ['ten solo-built systems', 'Ten of those are solo builds', '10 solo-built'].forEach(stale => {
    if (html.includes(stale)) {
      errors.push(`stale count "${stale}" contradicts the reconciled 11 solo systems`);
    }
  });
  if (!html.includes('11 SOLO SYSTEMS') || !html.includes('11 solo-built agent repositories')) {
    errors.push('telemetry bar + palette must both state the reconciled 11 solo systems');
  }

  // Check 28: Decorative HUD reticles hidden from assistive tech
  const reticles = (html.match(/class="hud-reticle/g) || []).length;
  const hiddenReticles = (html.match(/aria-hidden="true" class="hud-reticle/g) || []).length;
  if (reticles === 0 || hiddenReticles !== reticles) {
    errors.push(`all ${reticles} decorative HUD reticles must carry aria-hidden="true" (found ${hiddenReticles})`);
  }

  // Check 29: No dead :root tokens and no dead legacy selectors
  // (every defined --token must be consumed via var(); every legacy
  // selector family retired by the redesign must stay retired)
  const definedTokens = [...new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]))];
  const deadTokens = definedTokens.filter(t => !css.includes(`var(${t})`));
  if (deadTokens.length > 0) {
    errors.push(`css/style.css ships dead tokens never consumed via var(): ${deadTokens.join(', ')}`);
  }
  ['.term-bar', '.frame-corner', '.btn-primary', '.btn-ghost', '.tab-index', '.pipeline-link', '.hero-stat-icon', '.nav-cta{', '.nav-cta:'].forEach(sel => {
    if (css.includes(sel)) {
      errors.push(`css/style.css must not resurrect retired legacy selector ${sel}`);
    }
  });

  // Check 30: Deep-audit invariants (sim serialization, clone IDs,
  // canvas/inert a11y, no dead stylesheet, tight meta description)
  const simFns = ['runTrustRagSim', 'runDocuChatSim', 'runResumeCrewSim', 'runCareerOSSim'];
  simFns.forEach(fn => {
    if (!js.includes(`nextSimToken(window.${fn})`)) {
      errors.push(`js/main.js ${fn} must take a generation token (serializes rapid re-clicks)`);
    }
  });
  const timeouts = (js.match(/setTimeout\(\(\) => \{\n    if \(myToken !== window\.run\w+Sim\._token\) return;/g) || []).length;
  if (timeouts < 12) {
    errors.push(`all 12 sim timeouts must guard on their generation token (found ${timeouts})`);
  }
  if (!js.includes("querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'))")) {
    errors.push('fillStage stage clone must strip IDs (no runtime duplicate IDs)');
  }
  if (!html.includes('<canvas id="hero-canvas" aria-hidden="true">')) {
    errors.push('decorative #hero-canvas must carry aria-hidden="true"');
  }
  if (!js.includes('el.inert = true') || !js.includes('el.inert = false')) {
    errors.push('command palette must toggle inert on background landmarks');
  }
  if (html.includes('lenis.css')) {
    errors.push('dead lenis.css render-blocking request must stay removed (lenis.min.js stays)');
  }
  const desc = (html.match(/name="description" content="([^"]*)"/) || [])[1] || '';
  if (desc.length > 160) {
    errors.push(`meta description must fit the SERP budget (found ${desc.length} chars)`);
  }

  // Check 31: Nav/heading/anchor order + formatting invariants
  // (a) nav link order mirrors page section order (workbench precedes projects)
  const navBlock = (html.match(/<ul class="navlinks"[\s\S]*?<\/ul>/) || [])[0] || '';
  if (navBlock.indexOf('#workbench') === -1 || navBlock.indexOf('#workbench') > navBlock.indexOf('#projects')) {
    errors.push('nav link order must mirror page order: Workbench before Systems(#projects)');
  }
  // (b) heading hierarchy has no skips: h1×1, zero h4, zero div-based titles
  if ((html.match(/<h4[\s>]/g) || []).length > 0) {
    errors.push('heading hierarchy must not skip levels (no <h4> without <h3> context — use h3)');
  }
  if (html.includes('div class="proj-row-title"') || html.includes('div class="proj-title')) {
    errors.push('card titles must be real headings (h3), not divs');
  }
  // (c) exactly one scroll-margin-top anchor offset (no conflicting duplicates)
  const margins = (css.match(/scroll-margin-top/g) || []).length;
  if (margins !== 1) {
    errors.push(`exactly one scroll-margin-top anchor offset must ship (found ${margins})`);
  }

  // Check 32: Minified ship artifacts are fresh and carry the behavior
  // (sources stay readable; deploys serve .min — regenerate with:
  //  npx -y clean-css-cli -o css/style.min.css css/style.css &&
  //  npx -y terser js/main.js -o js/main.min.js -c -m &&
  //  npx -y terser js/scene.js -o js/scene.min.js -c -m)
  const pairs = [
    ['css/style.css', 'css/style.min.css', '.pd-t'],
    ['js/main.js', 'js/main.min.js', 'runTrustRagSim'],
    ['js/scene.js', 'js/scene.min.js', 'hero-canvas'],
  ];
  pairs.forEach(([src, min, marker]) => {
    const srcP = path.join(__dirname, '..', src);
    const minP = path.join(__dirname, '..', min);
    if (!fs.existsSync(minP)) {
      errors.push(`missing ship artifact ${min} (regenerate from ${src})`);
      return;
    }
    if (fs.statSync(minP).mtimeMs < fs.statSync(srcP).mtimeMs) {
      errors.push(`${min} is older than ${src} — regenerate before shipping`);
    }
    if (!fs.readFileSync(minP, 'utf8').includes(marker)) {
      errors.push(`${min} missing marker ${marker} — suspect minification`);
    }
  });
  ['css/style.min.css', 'js/main.min.js', 'js/scene.min.js'].forEach(ref => {
    if (!html.includes(ref)) {
      errors.push(`index.html must ship ${ref} (not the unminified source)`);
    }
  });

  if (errors.length > 0) {
    console.error('❌ Verification Failed with ' + errors.length + ' errors:');
    errors.forEach(e => console.error('  - ' + e));
    process.exit(1);
  } else {
    console.log('✅ All Redesign Verification Checks Passed Successfully!');
  }
}

runChecks();
