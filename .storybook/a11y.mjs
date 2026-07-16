/**
 * Headless accessibility gate for Storybook (WCAG 2.2 AA / EN 301 549 — see
 * ACCESSIBILITY.md). For every story in the static build it (1) confirms the
 * story renders without error and (2) runs axe-core, failing on any violation.
 *
 * Deliberately does NOT use @storybook/test-runner: that pulls jest 30, which
 * conflicts with the monorepo's jest 29 unit tests. This uses Playwright +
 * @axe-core/playwright directly (no jest), so the two test stacks never clash.
 *
 * Per-story exceptions are read from the story's own `parameters.a11y`
 * (disable, or config.rules: [{ id, enabled:false }]) — the same annotations
 * the interactive addon-a11y panel honours — so there is a single source of
 * truth in the story file.
 *
 * Usage: build Storybook first, then `node .storybook/a11y.mjs`
 * (wrapped by `npm run test:a11y`).
 */
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

const STATIC_DIR = 'storybook-static';
const PORT = 6006;
const BASE = `http://127.0.0.1:${PORT}`;
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

function startServer() {
  const proc = spawn(
    'npx',
    ['http-server', STATIC_DIR, '-p', String(PORT), '-s', '-c-1'],
    { stdio: 'ignore' }
  );
  return proc;
}

async function waitForServer(timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/index.json`);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Storybook static server did not start on ${BASE}`);
}

const server = startServer();
let exitCode = 0;
try {
  await waitForServer();
  const index = JSON.parse(readFileSync(`${STATIC_DIR}/index.json`, 'utf8'));
  const stories = Object.values(index.entries).filter((e) => e.type === 'story');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const failures = [];

  // Capture runtime errors per story — a story that throws still leaves an empty
  // #storybook-root that would otherwise "pass" axe, so treat throws as failures.
  // Ignore known, harmless noise (the router matching iframe.html; missing assets).
  let pageErrors = [];
  const IGNORE_ERR = /NG04002|404|Failed to load resource|favicon/i;
  page.on('pageerror', (e) => pageErrors.push(e.message.split('\n')[0]));
  page.on('console', (m) => {
    if (m.type() === 'error') pageErrors.push(m.text().split('\n')[0]);
  });

  const renderErrors = [];
  for (const story of stories) {
    pageErrors = [];
    // A single broken story must NOT abort the whole survey — capture and move on.
    try {
      // 'networkidle' is unreliable here — icon-font 404s and the router keep
      // the network busy — so wait for DOM + actual rendered content instead.
      await page.goto(`${BASE}/iframe.html?id=${story.id}&viewMode=story`, {
        waitUntil: 'domcontentloaded',
      });
      // Rendered content can be inside #storybook-root OR an overlay portalled
      // into <body> (modal, context menu, side panel).
      await page.waitForFunction(
        () => {
          const r = document.querySelector('#storybook-root');
          return (r && r.children.length > 0) ||
            !!document.querySelector('.modal-overlay, [role="dialog"], .ngx-contextmenu, cdk-dialog-container, .cdk-overlay-container *');
        },
        { timeout: 8000 }
      );
      // Let change detection settle so any thrown runtime error surfaces.
      await page.waitForTimeout(300);
      const realErrors = pageErrors.filter((m) => !IGNORE_ERR.test(m));
      if (realErrors.length) {
        throw new Error('runtime: ' + realErrors[0].slice(0, 140));
      }
      // Detect EMPTY renders: the wrapper element can exist while the component
      // rendered nothing (an internal @if is false → only a comment node), which
      // still "passes" axe. Require actual laid-out content (or a body overlay).
      // A story may legitimately render nothing (documenting a hidden/empty
      // state); it opts out of the empty-render check with
      // parameters.allowEmptyRender = true.
      const allowEmpty = await page.evaluate(async (id) => {
        try {
          const s = await window.__STORYBOOK_PREVIEW__.storyStore.loadStory({ storyId: id });
          return s?.parameters?.allowEmptyRender === true;
        } catch {
          return false;
        }
      }, story.id);
      const empty = allowEmpty ? false : await page.evaluate(() => {
        const root = document.querySelector('#storybook-root');
        if (!root) return true;
        const overlay = document.querySelector(
          '.modal-overlay, [role="dialog"], .ngx-contextmenu, .cdk-overlay-container *'
        );
        if (overlay) return false;
        // The mount root is always full-width; a component that rendered nothing
        // (internal @if false → only a comment) leaves ALL descendants with a
        // zero box. Consider it rendered only if some descendant is laid out.
        for (const el of root.querySelectorAll('*')) {
          if (el.offsetHeight > 0 || el.offsetWidth > 0) return false;
        }
        return true;
      });
      if (empty) {
        throw new Error('rendered empty (component produced no visible content)');
      }
    } catch (e) {
      renderErrors.push({ id: story.id, reason: e.message.split('\n')[0] });
      console.error(`  ✗ ${story.id} — DID NOT RENDER (${e.message.split('\n')[0]})`);
      continue;
    }

    // Read the story's own a11y parameters (single source of truth with the
    // interactive addon), so documented exceptions are honoured here too.
    const a11y = await page.evaluate(async (id) => {
      try {
        const preview = window.__STORYBOOK_PREVIEW__;
        const story = await preview.storyStore.loadStory({ storyId: id });
        return story?.parameters?.a11y ?? null;
      } catch {
        return null;
      }
    }, story.id);

    if (a11y?.disable) {
      console.log(`  ⊘ ${story.id} (a11y disabled)`);
      continue;
    }
    const disabledRules = process.env.A11Y_NO_SUPPRESS
      ? []
      : (a11y?.config?.rules ?? [])
          .filter((r) => r && r.enabled === false && r.id)
          .map((r) => r.id);

    try {
      let builder = new AxeBuilder({ page }).withTags(WCAG_TAGS);
      if (disabledRules.length) builder = builder.disableRules(disabledRules);
      const results = await builder.analyze();
      if (results.violations.length) {
        failures.push({ id: story.id, violations: results.violations });
        console.error(
          `  ✗ ${story.id} — ${results.violations
            .map((v) => `${v.id} (${v.impact}, ${v.nodes.length})`)
            .join(', ')}`
        );
      } else {
        const note = disabledRules.length ? ` [skipped: ${disabledRules.join(', ')}]` : '';
        console.log(`  ✓ ${story.id}${note}`);
      }
    } catch (e) {
      renderErrors.push({ id: story.id, reason: 'axe: ' + e.message.split('\n')[0] });
      console.error(`  ✗ ${story.id} — axe error (${e.message.split('\n')[0]})`);
    }
  }
  if (renderErrors.length) {
    console.error(`\n${renderErrors.length} story/ies failed to render / axe-error:`);
    for (const r of renderErrors) console.error(`   - ${r.id}: ${r.reason}`);
    failures.push(...renderErrors);
  }

  await browser.close();

  if (failures.length) {
    console.error(`\n${failures.length} story/ies with WCAG 2.2 AA violations.`);
    exitCode = 1;
  } else {
    console.log(`\nAll ${stories.length} stories pass WCAG 2.2 AA (axe-core).`);
  }
} catch (err) {
  console.error('a11y run failed:', err);
  exitCode = 1;
} finally {
  server.kill();
}

process.exit(exitCode);
