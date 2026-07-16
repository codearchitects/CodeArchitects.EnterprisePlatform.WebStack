/**
 * One-off contrast audit: runs axe color-contrast over every story (no per-story
 * suppressions) and prints the unique failing foreground/background pairs with
 * their ratio and the element, so the exact tokens to darken are known.
 * Usage: node .storybook/contrast-audit.mjs   (Storybook must be built)
 */
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

const PORT = 6023;
const BASE = `http://127.0.0.1:${PORT}`;
const server = spawn('npx', ['http-server', 'storybook-static', '-p', String(PORT), '-s', '-c-1'], { stdio: 'ignore' });

async function waitUp(t = 20000) {
  const end = Date.now() + t;
  while (Date.now() < end) { try { if ((await fetch(`${BASE}/index.json`)).ok) return; } catch {} await new Promise(r => setTimeout(r, 300)); }
  throw new Error('server not up');
}

try {
  await waitUp();
  const index = JSON.parse(readFileSync('storybook-static/index.json', 'utf8'));
  const stories = Object.values(index.entries).filter(e => e.type === 'story');
  const browser = await chromium.launch();
  const page = await (await browser.newContext()).newPage();
  const pairs = new Map(); // key: fg|bg -> {fg,bg,ratio,need,stories:Set,sample}

  for (const s of stories) {
    try {
      await page.goto(`${BASE}/iframe.html?id=${s.id}&viewMode=story`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(400);
      const res = await new AxeBuilder({ page }).withTags(['wcag2aa', 'wcag21aa', 'wcag22aa']).options({ runOnly: ['color-contrast'] }).analyze();
      for (const v of res.violations) {
        for (const n of v.nodes) {
          const d = n.any?.[0]?.data || {};
          const key = `${d.fgColor}|${d.bgColor}`;
          if (!pairs.has(key)) pairs.set(key, { fg: d.fgColor, bg: d.bgColor, ratio: d.contrastRatio, need: d.expectedContrastRatio, stories: new Set(), sample: (n.target || []).join(' ') });
          pairs.get(key).stories.add(s.id.split('--')[0]);
        }
      }
    } catch { /* skip */ }
  }
  await browser.close();

  const rows = [...pairs.values()].sort((a, b) => (a.ratio || 0) - (b.ratio || 0));
  console.log(`\n${rows.length} unique failing colour pairs:\n`);
  for (const r of rows) {
    console.log(`fg ${r.fg}  on bg ${r.bg}  = ${r.ratio}:1 (need ${r.need})`);
    console.log(`   components: ${[...r.stories].join(', ')}`);
    console.log(`   e.g. ${r.sample.slice(0, 80)}`);
  }
} catch (e) {
  console.error('audit failed:', e.message);
} finally {
  server.kill();
}
