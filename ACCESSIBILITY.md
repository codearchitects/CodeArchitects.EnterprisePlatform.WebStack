# Accessibility

`@ca-webstack/ng-components` and `@ca-webstack/ng-components-extra` are built
and maintained to conform to **WCAG 2.2 Level AA**, as embodied in the
harmonised European standard **EN 301 549**.

Accessibility is treated as a core requirement of this component library, not
an optional feature. A component library is an *authoring tool*: every
application built on top of it inherits the accessibility characteristics of
its components, so conformance here is what makes conformance the default
downstream.

## 1. Accessibility Statement

**Scope:** `@ca-webstack/ng-components` and `@ca-webstack/ng-components-extra`.

**Conformance target:** WCAG 2.2 Level AA / EN 301 549 (see §2).

**Conformance status: partially conformant.** *Partially conformant* means
some parts of the content do not fully conform to the accessibility standard —
this is the W3C's own recommended term for this state (as opposed to
"non-conformant" or "fully conformant"), and we use it deliberately rather
than overclaiming. Specifically:

- Every component passes an automated axe-core structural check at WCAG 2.2
  AA with zero unaddressed violations, enforced in continuous integration on
  every change (see §4). The handful of per-component exceptions that exist
  are documented, deliberate design decisions rather than unresolved defects
  (see §6).
- Keyboard operability (Tab order, Enter/Space activation, Escape, Arrow-key
  navigation) is verified for every interactive widget by code review against
  our Definition of Done (§3), and additionally covered by an automated
  regression test for the highest-risk custom widgets — switches, checkbox
  and radio groups, tabs, comboboxes, dialogs, overlay panels, and expandable
  navigation items (see §4).
- **The one gap between "partially" and "fully" conformant: components have
  not yet had a full manual assistive-technology (screen reader) pass.**
  Automated tooling verifies that the accessibility tree — roles, names,
  states — is structurally correct; it cannot verify that a screen reader
  *announces* that tree usefully in real use. Closing this gap is a manual
  NVDA (Windows) and VoiceOver (macOS) verification pass, tracked per
  component in §5.

**Evaluation methods used:**

1. Static analysis — `@angular-eslint` accessibility rules, enforced as build
   errors in both packages.
2. Automated structural testing — axe-core against every documented usage
   example (Storybook story) at WCAG 2.2 AA, in CI on every change.
3. Automated behavioural testing — real keyboard events driven against
   representative interactive widgets, asserting the resulting accessible
   state.
4. Automated colour-contrast verification against every rendered
   foreground/background combination.
5. Manual code review against the Definition of Done (§3) for every
   component.
6. *Planned, not yet performed:* manual assistive-technology testing.

**Relationship to your own accessibility declaration.** This statement covers
the component library only. An application built with these components must
still produce its own accessibility declaration — an AGID *Dichiarazione di
accessibilità* for Italian Public Administration, or an EAA-compliant
statement for private-sector products. Concerns outside a component library's
control — the document `<title>` and `lang` attribute, overall page structure,
content authored by the application team, third-party embeds, PDFs and other
non-HTML content — remain that application's responsibility. Conformance here
is necessary for, but not sufficient by itself for, an application's own
conformance.

**Feedback.** Please report accessibility issues the same way as any other
bug, via GitHub Issues on this repository, or through the private channel
described in `SECURITY.md` if the issue has security implications.

## 2. Standards and regulatory context

We target **WCAG 2.2 AA** — a superset of 2.1 AA — rather than the current
legal minimum, so the work doesn't need repeating as regulation catches up to
2.2. Implementation reference for interactive widgets is the **WAI-ARIA
Authoring Practices Guide (APG)** (https://www.w3.org/WAI/ARIA/apg/patterns/),
which defines the expected roles, states, and keyboard interaction for each
widget type (combobox, dialog, tabs, listbox, slider, menu, …).

This target is grounded in the regulatory chain that applies to consumers of
this library:

- **Legge 4/2004 ("Legge Stanca")** and the **AGID Linee guida
  sull'accessibilità degli strumenti informatici**: the mandatory technical
  requirement for Italian Public Administration is EN 301 549, which for web
  content adopts WCAG 2.1 AA.
- **Directive (EU) 2016/2102** on the accessibility of public-sector websites
  and mobile applications.
- **European Accessibility Act — Directive (EU) 2019/882**, transposed in
  Italy by **D.Lgs. 82/2022**: extends accessibility obligations to private
  economic operators as of 28 June 2025, so this applies beyond
  public-sector consumers of the library too.

## 3. Definition of Done

Every interactive component is expected to meet all of the following before
it is considered accessibility-complete. This is the review checklist applied
to every change that touches a component.

- **Name, role, value (WCAG 4.1.2)** — the correct native element or ARIA
  `role`; an accessible name (a visible label associated via `for`/`id`, or
  `aria-label`/`aria-labelledby`); state exposed via `aria-expanded`,
  `aria-selected`, `aria-checked`, `aria-disabled`, `aria-invalid`, etc.
- **Keyboard (WCAG 2.1.1 / 2.1.2)** — every mouse action has a keyboard
  equivalent, following the APG key map for that widget type; no keyboard
  trap other than an intentional, escapable modal focus trap.
- **Focus management (WCAG 2.4.3 / 2.4.7)** — a logical focus order, a
  visible focus indicator, focus moved into overlays on open and restored to
  the trigger on close, and focus trapped inside modal dialogs.
- **Labels & errors (WCAG 1.3.1 / 3.3.1 / 3.3.2)** — inputs have programmatic
  labels; validation errors are associated via `aria-describedby` and
  `aria-invalid`, and announced via `role="alert"` / `aria-live`.
- **Status messages (WCAG 4.1.3)** — asynchronous loading/result changes are
  announced through a live region without moving focus.
- **Contrast (WCAG 1.4.3 / 1.4.11)** — text at ≥4.5:1, large text/UI
  components at ≥3:1; state is never conveyed by colour alone (WCAG 1.4.1).
- **Reduced motion (WCAG 2.3.3)** — animation respects
  `prefers-reduced-motion`.
- **Verification** — a zero-violation axe-core pass, plus a keyboard-only and
  screen-reader pass, recorded in the conformance record (§5).

## 4. How conformance is verified

Every component in both packages has a companion Storybook story (documented
usage example), and the same stories are the fixtures for automated
accessibility testing — one monorepo-wide Storybook instance doubles as both
living documentation and the test surface.

```bash
# Static a11y lint (@angular-eslint/template accessibility rules)
npx turbo run lint --filter=@ca-webstack/ng-components --filter=@ca-webstack/ng-components-extra

# Structural gate: builds Storybook, visits every story, runs axe-core (WCAG 2.2 AA)
npm run test:a11y

# Behavioural gate: builds Storybook, drives real keyboard events (Tab focus,
# Enter/Space/Esc/Arrow keys) through representative interactive widgets and
# asserts the resulting accessible state
npm run test:keyboard
```

All three run in continuous integration on every change
(`.github/workflows/ci.yml`). Interactively, `@storybook/addon-a11y` shows
live axe-core results per story while developing (`npm run storybook`).
Per-component exceptions to the automated gate — where one exists — are
recorded alongside the component's story and cross-referenced in §6, so the
interactive panel and the CI gate always agree.

Colour contrast is additionally verified across every rendered
foreground/background combination in the component set, independent of the
per-story exceptions above, to catch regressions the story-level checks might
miss in composition.

## 5. Per-component conformance record

`A` = supports · `PA` = partially supports · `NA` = not applicable · `—` = not
yet independently verified.

| Component | Name/Role | Keyboard | Focus mgmt | Labels/Errors | Contrast | Reduced motion | axe | SR verified | APG pattern |
|---|---|---|---|---|---|---|---|---|---|
| `sh-modal` | A | A | A | NA | A | A | A | — | dialog (modal) |
| `sh-select` | A | A | A | PA | A | — | A* | — | combobox-select |
| `sh-multiselect` | A | PA | A | PA | NA | NA | A | — | combobox-multi |
| `sh-combo` | A | A | A | A | A | — | A* | — | combobox-editable |
| `sh-tabs` | A | A | A | A | A | A | A | — | tabs |
| `sh-context-menu` | PA | PA | A | PA | A | — | A | — | menu |
| `sh-context-menu-item` | A | PA | NA | A | A | NA | A | — | menuitem |
| `sh-checkbox` | A | A | A | A | A | A | A | — | checkbox |
| `sh-checkgroup` | A | A | A | PA | A | — | A | — | checkbox (group) |
| `sh-radio` | A | A | A | A | A | A | A | — | radio group |
| `sh-toggle` | A | A | A | A | A | A | A | — | switch |
| `sh-slider` | A | A | A | A | A | — | A | — | slider |
| `sh-breadcrumb` | A | A | NA | A | A | NA | A | — | breadcrumb |
| `sh-sidebar` | PA | PA | PA | A | A | NA | A | — | nav |
| `sh-sidebar-item` | A | A | A | A | PA† | — | A* | — | nav-item |
| `sh-sidebar-search` | A | NA | NA | A | A | — | A | — | search |
| `sh-date` | A | A | A | PA | A | — | A | — | datepicker (wraps 3rd-party) |
| `sh-button` | A | NA | A | A | A | — | A | — | button |
| `sh-icon` | A | NA | A | NA | NA | NA | A | — | icon (decorative/meaningful) |
| `sh-spinner` | A | NA | A | A | NA | A | A | — | status |
| `sh-timer` | A | A | NA | A | A | NA | A | — | status |
| `sh-progress-bar` | A | NA | NA | A | A | — | A | — | progressbar |
| `sh-commands-bar` | A | NA | A | NA | A | NA | A | — | toolbar |
| `sh-toolbar` | A | A | NA | A | A | — | A | — | toolbar |
| `sh-header` | A | NA | NA | A | A | NA | A | — | landmark (banner) |
| `sh-section` | A | A | A | A | A | A | A | — | disclosure + landmark |
| `sh-card` | A | A | A | A | NA | NA | A | — | generic |
| `sh-caption` | NA | NA | NA | A | NA | NA | A | — | generic |
| `sh-form` | A | NA | NA | PA | NA | NA | A | — | form |
| `sh-form-group` | PA | NA | NA | PA | NA | NA | A | — | group |
| `sh-column`,`sh-row`,`sh-container`,`sh-flexible-content` | NA | NA | NA | NA | NA | NA | A | — | presentational |
| native inputs (`sh-text`,`sh-textarea`,`sh-number`,`sh-mask`,`sh-percent`,`sh-currency`) | A | A | A | A | A | — | A | — | text field |
| `sh-validation-message` | A (role=alert) | NA | NA | A | A | NA | A | — | status message |
| **`ng-components-extra`** | | | | | | | | | |
| `caep-container` | A | A | A | A | A | A | A | — | app-shell (main + skip link) |
| `caep-app-header` | A | NA | NA | PA | A | NA | A | — | banner landmark |
| `caep-app-sidebar` | A | NA | NA | PA | A | NA | A | — | nav landmark |
| `caep-topbar` | A | NA | NA | A | A | NA | A | — | banner landmark |
| `caep-topbar-button` | A | A | NA | A | A | — | A | — | button |
| `caep-topbar-item` | NA | NA | NA | A | A | — | A | — | presentational wrapper |
| `caep-side-menu` | A | A | A | A | A | — | A | — | nav |
| `caep-side-menu-entry` | A | A | A | A | A | A | A | — | nav-item |
| `caep-side-panel` | A | A | A | A | A | — | A | — | dialog-panel (focus trap) |
| `caep-floating-commands` | A | PA | NA | A | A | NA | A | — | toolbar |
| `caep-text` | A | A | A | A | A | — | A | — | text field |
| `caep-mock-text` | A | A | A | A | A | — | A | — | text field |
| `caep-form-control` | PA | NA | NA | PA | A | — | A | — | form-control |

`axe` reflects the automated CI gate (`npm run test:a11y`) at WCAG 2.2 AA
against every story. `A*` = passes with one rule exempted by design — see §6
for which rule and why. `PA†` = a token-level contrast trade-off that can't be
fully resolved with a single default value — see §6. `SR verified` stays `—`
until the manual screen-reader pass described in §1 is completed, component
by component.

## 6. Known limitations

- **`sh-sidebar-item` text colour is a deliberate cross-context compromise.**
  Depending on where its parent `sh-sidebar` places it, `sh-sidebar-item`
  renders against four different backgrounds — two dark shades for top-level
  rows, two light shades for nested child rows — and no single default text
  colour reaches 4.5:1 against all four simultaneously. The shipped default
  favours legibility across the whole set rather than optimising one context
  at the expense of the others going unreadable. A consuming application that
  controls its own row backgrounds can reach full compliance by overriding
  `--sidebar-item-color` for its specific context.
- **`sh-select` / `sh-combo` — open listbox and `scrollable-region-focusable`.**
  These follow the APG *activedescendant* combobox pattern: focus stays on the
  combobox itself, which scrolls its options via the arrow keys, so the popup
  is deliberately not its own tab stop. This is the correct pattern, not a
  gap, and is documented as an intentional exception rather than suppressed
  silently.
- **`no-autofocus` is an intentional, opt-in exception.** `autofocus` is a
  documented, default-`false` option on the base component API; a consumer
  that explicitly enables it owns the resulting WCAG 3.2.x consideration for
  their page.
- **`sh-context-menu`** is built on the third-party `@perfectmemory/ngx-contextmenu`
  library. The wrapper layer (accessible names, `enable`/disabled state,
  activation routing) is fully within our control and verified; submenu
  `aria-expanded` handling is owned by the upstream library.
  `sh-date`/`sh-date-time`/`sh-time` similarly wrap
  `@nodro7/angular-mydatepicker`: the wrapper (label, toggle button name,
  keyboard reachability) is verified, while the calendar-grid internals are
  upstream-owned.
- **Screen-reader verification is planned, not yet performed** — see §1.

## 7. Reporting an issue

Accessibility issues are tracked the same way as any other defect: open a
GitHub Issue on this repository. If the issue has security implications, use
the private reporting channel described in `SECURITY.md` instead.
