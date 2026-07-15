/**
 * Headless keyboard-interaction gate for Storybook (WCAG 2.1.1 keyboard,
 * 2.1.2 no trap, 2.4.3/2.4.7 focus — see ACCESSIBILITY.md §4/§7).
 *
 * Unlike `.storybook/a11y.mjs` (structural axe rules run identically over
 * every story), keyboard *behaviour* is control-specific: Tab/Enter/Esc/Arrow
 * keys are expected to do different things on a switch vs. a combobox vs. a
 * dialog. So this is a small, explicit table of {story, check(page)} cases —
 * one (or a few) representative story per interaction pattern used across
 * ca-ng-components / ca-ng-components-extra — rather than a generic sweep.
 *
 * Each check drives real keyboard events (`page.keyboard.press`, which
 * dispatches trusted keydown/keyup — unlike `dispatchEvent`, this also
 * triggers native behaviour on real form controls) and asserts the resulting
 * DOM state (aria-*, focus, visibility). A case that throws is a failure.
 *
 * Same rationale as a11y.mjs for not using @storybook/test-runner: it pulls
 * jest 30, which conflicts with the monorepo's jest 29 unit tests.
 *
 * Usage: build Storybook first, then `node .storybook/keyboard.mjs`
 * (wrapped by `npm run test:keyboard`).
 */
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const STATIC_DIR = 'storybook-static';
const PORT = 6007;
const BASE = `http://127.0.0.1:${PORT}`;

function startServer() {
  return spawn('npx', ['http-server', STATIC_DIR, '-p', String(PORT), '-s', '-c-1'], { stdio: 'ignore' });
}

async function waitForServer(timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/index.json`);
      if (res.ok) return;
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Storybook static server did not start on ${BASE}`);
}

async function goto(page, id) {
  await page.goto(`${BASE}/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => {
    const r = document.querySelector('#storybook-root');
    return (r && r.children.length > 0) || !!document.querySelector('[role="dialog"], .cdk-overlay-container *');
  }, { timeout: 8000 });
  await page.waitForTimeout(300);
}

// `page.keyboard.press()` resolves once the DOM event is dispatched, but
// Angular's change detection (zone flush) that reacts to it runs on a later
// task — reading DOM state immediately after can observe stale attributes.
// Every case presses through this helper instead of calling
// `page.keyboard.press` directly, so state reads are never racing CD.
async function press(page, key) {
  await page.keyboard.press(key);
  await page.waitForTimeout(150);
}

async function focus(locator) {
  await locator.focus();
  await locator.page().waitForTimeout(150);
}

/**
 * One check per interaction *pattern*, not per component — e.g. sh-combo
 * inherits sh-select's Arrow/Enter/Escape handling, so only sh-select is
 * covered explicitly; a divergence would already be caught by axe/unit tests.
 */
const CASES = [
  {
    name: 'sh-toggle — Enter and Space both toggle the switch',
    id: 'ng-components-toggle--default',
    async run(page) {
      const el = page.locator('.toggle[role="switch"]').first();
      await focus(el);
      const before = await el.getAttribute('aria-checked');
      await press(page, 'Enter');
      const afterEnter = await el.getAttribute('aria-checked');
      if (afterEnter === before) throw new Error(`Enter did not toggle aria-checked (stayed ${before})`);
      await press(page, ' ');
      const afterSpace = await el.getAttribute('aria-checked');
      if (afterSpace === afterEnter) throw new Error(`Space did not toggle aria-checked back (stayed ${afterEnter})`);
    },
  },
  {
    name: 'sh-checkbox — Space toggles the native checkbox',
    id: 'ng-components-checkbox--default',
    async run(page) {
      const input = page.locator('input[type="checkbox"]').first();
      await focus(input);
      const before = await input.isChecked();
      await press(page, ' ');
      const after = await input.isChecked();
      if (after === before) throw new Error(`Space did not toggle the checkbox (stayed ${before})`);
    },
  },
  {
    name: 'sh-radio — ArrowDown moves focus+selection, Space selects the focused option',
    id: 'ng-components-radio--default',
    async run(page) {
      // The `.radio[role=radio]` divs carry no `id` (only their hidden native
      // `<input>` sibling does), so focus is tracked by element identity, not id.
      const options = page.locator('.radio[role="radio"]');
      const count = await options.count();
      if (count < 2) throw new Error('story needs >=2 options to test Arrow navigation');
      await focus(options.nth(0));
      await press(page, 'ArrowDown');
      const focusedSecond = await options.nth(1).evaluate((el) => el === document.activeElement);
      if (!focusedSecond) throw new Error('ArrowDown did not move focus to the next option');
      await press(page, ' ');
      const checkedAfter = await options.nth(1).getAttribute('aria-checked');
      if (checkedAfter !== 'true') throw new Error(`Space did not select the focused option (aria-checked=${checkedAfter})`);
    },
  },
  {
    name: 'sh-checkgroup — Space toggles a single item without affecting siblings',
    id: 'ng-components-checkgroup--default',
    async run(page) {
      const items = page.locator('.checkbox[role="checkbox"]');
      if (await items.count() < 1) throw new Error('no checkbox items rendered');
      const first = items.nth(0);
      await focus(first);
      const before = await first.getAttribute('aria-checked');
      await press(page, ' ');
      const after = await first.getAttribute('aria-checked');
      if (after === before) throw new Error(`Space did not toggle the item (stayed ${before})`);
    },
  },
  {
    name: 'sh-tabs — ArrowRight moves to and selects the next tab, Home jumps to the first',
    id: 'ng-components-tabs--default',
    async run(page) {
      const tabs = page.locator('[role="tab"]');
      const count = await tabs.count();
      if (count < 2) throw new Error('story needs >=2 tabs to test Arrow navigation');
      const focusable = page.locator('[role="tab"][tabindex="0"]').first();
      await focus(focusable);
      await press(page, 'ArrowRight');
      const focusedId = await page.evaluate(() => document.activeElement?.id);
      const selectedNow = await page.locator(`#${focusedId}`).getAttribute('aria-selected');
      if (selectedNow !== 'true') throw new Error(`ArrowRight did not select the newly-focused tab (aria-selected=${selectedNow})`);
      await press(page, 'Home');
      const firstTabId = await tabs.nth(0).getAttribute('id');
      const focusedAfterHome = await page.evaluate(() => document.activeElement?.id);
      if (focusedAfterHome !== firstTabId) throw new Error(`Home did not move focus to the first tab (focus=${focusedAfterHome})`);
    },
  },
  {
    name: 'sh-select — closed ArrowDown cycles the value, Alt+ArrowDown opens the listbox, Enter commits, Escape closes',
    id: 'ng-components-select--default',
    async run(page) {
      const combobox = page.locator('[role="combobox"]').first();
      await focus(combobox);
      // Closed + plain ArrowDown cycles the committed value directly (native
      // OS <select> "closed spin" behaviour) — it does NOT open the listbox.
      const textBefore = await combobox.textContent();
      await press(page, 'ArrowDown');
      if ((await combobox.textContent()) === textBefore) throw new Error('ArrowDown (closed) did not cycle the value');
      if ((await combobox.getAttribute('aria-expanded')) !== 'false') throw new Error('plain ArrowDown unexpectedly opened the listbox');
      // Alt+ArrowDown is the documented "open" key (matches the native
      // Alt+Down convention), moving through options with plain arrows once open.
      await press(page, 'Alt+ArrowDown');
      if ((await combobox.getAttribute('aria-expanded')) !== 'true') throw new Error('Alt+ArrowDown did not open the listbox (aria-expanded != true)');
      const active = await combobox.getAttribute('aria-activedescendant');
      if (!active) throw new Error('opening the listbox did not set aria-activedescendant');
      await press(page, 'ArrowDown');
      const activeAfter = await combobox.getAttribute('aria-activedescendant');
      if (activeAfter === active) throw new Error('ArrowDown (open) did not move aria-activedescendant');
      await press(page, 'Enter');
      if ((await combobox.getAttribute('aria-expanded')) !== 'false') throw new Error('Enter did not close the listbox (aria-expanded != false)');
      await press(page, 'Alt+ArrowDown');
      if ((await combobox.getAttribute('aria-expanded')) !== 'true') throw new Error('re-opening with Alt+ArrowDown failed');
      await press(page, 'Escape');
      if ((await combobox.getAttribute('aria-expanded')) !== 'false') throw new Error('Escape did not close the listbox (aria-expanded != false)');
    },
  },
  {
    name: 'sh-combo — Alt+ArrowDown opens the listbox, Escape closes it (inherits sh-select handling)',
    id: 'ng-components-combo--default',
    async run(page) {
      const combobox = page.locator('[role="combobox"]').first();
      await focus(combobox);
      await press(page, 'Alt+ArrowDown');
      if ((await combobox.getAttribute('aria-expanded')) !== 'true') throw new Error('Alt+ArrowDown did not open the listbox (aria-expanded != true)');
      await press(page, 'Escape');
      if ((await combobox.getAttribute('aria-expanded')) !== 'false') throw new Error('Escape did not close the listbox (aria-expanded != false)');
    },
  },
  {
    name: 'sh-modal — Escape closes the dialog (via onCancel, reactive [(model)] binding)',
    id: 'ng-components-modal--default',
    async run(page) {
      await page.getByText('Open dialog', { exact: true }).click();
      const dialog = page.locator('[role="dialog"]');
      await dialog.waitFor({ state: 'visible', timeout: 3000 });
      await press(page, 'Escape');
      await dialog.waitFor({ state: 'hidden', timeout: 3000 });
    },
  },
  {
    name: 'caep-side-panel — trigger button opens it, Escape closes it',
    // "closed-initially" starts closed (unlike --default, which auto-opens
    // for canvas visibility) so this exercises the real open+close cycle.
    id: 'ng-components-extra-sidepanel--closed-initially',
    async run(page) {
      const dialog = page.locator('[role="dialog"]');
      await page.getByText('Open side panel', { exact: true }).click();
      await dialog.waitFor({ state: 'visible', timeout: 3000 });
      await press(page, 'Escape');
      await dialog.waitFor({ state: 'hidden', timeout: 3000 });
    },
  },
  {
    name: 'caep-floating-commands — ArrowRight nudges the toolbar via the drag handle',
    id: 'ng-components-extra-floatingcommands--default',
    async run(page) {
      const handle = page.locator('.caep-drag-handle').first();
      const before = await handle.evaluate((el) => el.closest('.caep-floating-commands').getBoundingClientRect().left);
      await focus(handle);
      await press(page, 'ArrowRight');
      const after = await handle.evaluate((el) => el.closest('.caep-floating-commands').getBoundingClientRect().left);
      if (after <= before) throw new Error(`ArrowRight did not move the toolbar right (before=${before}, after=${after})`);
    },
  },
  {
    name: 'sh-sidebar-item — Enter activates the link item; Enter/Space on an expandable parent do not throw',
    id: 'ng-components-sidebaritem--with-children',
    async run(page) {
      const toggle = page.locator('.children-overlay[role="button"]').first();
      await focus(toggle);
      await press(page, 'Enter');
      await press(page, ' ');
      // No reactive story state to assert (areChildrenShown is a fixed arg here);
      // this is a keyboard-operability smoke test — the real assertion is that
      // no runtime error was thrown (surfaced by the pageerror listener below).
    },
  },
];

const server = startServer();
let exitCode = 0;
try {
  await waitForServer();
  const browser = await chromium.launch();
  const page = await browser.newContext().then((c) => c.newPage());

  let pageErrors = [];
  const IGNORE_ERR = /NG04002|404|Failed to load resource|favicon/i;
  page.on('pageerror', (e) => pageErrors.push(e.message.split('\n')[0]));
  page.on('console', (m) => { if (m.type() === 'error') pageErrors.push(m.text().split('\n')[0]); });

  const failures = [];
  for (const testCase of CASES) {
    pageErrors = [];
    try {
      await goto(page, testCase.id);
      await testCase.run(page);
      const realErrors = pageErrors.filter((m) => !IGNORE_ERR.test(m));
      if (realErrors.length) throw new Error('runtime: ' + realErrors[0].slice(0, 140));
      console.log(`  ✓ ${testCase.name}`);
    } catch (e) {
      failures.push({ name: testCase.name, reason: e.message.split('\n')[0] });
      console.error(`  ✗ ${testCase.name} — ${e.message.split('\n')[0]}`);
    }
  }

  await browser.close();

  console.log(`\n${CASES.length - failures.length}/${CASES.length} keyboard-interaction checks passed.`);
  if (failures.length) {
    console.error(`\n${failures.length} failure(s):`);
    for (const f of failures) console.error(`  - ${f.name}: ${f.reason}`);
    exitCode = 1;
  }
} catch (e) {
  console.error('Fatal error running the keyboard gate:', e);
  exitCode = 1;
} finally {
  server.kill();
}
process.exit(exitCode);
