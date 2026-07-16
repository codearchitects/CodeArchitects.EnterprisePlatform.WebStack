import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShColumnComponent } from './column.component';

/**
 * `column` is a responsive layout-grid column (Bootstrap-style). It projects its
 * content via `<ng-content>` and computes a `col-*` class string from the
 * per-breakpoint inputs: width (`xs`/`sm`/`md`/`lg`/`xl`), `offset_*`, `order_*`,
 * `break`, and `hide`. With no width input it falls back to the fluid `col` class.
 *
 * A single column on its own is not visually meaningful, so every story below
 * renders a **row of sibling columns** with different spans — that is the only
 * way the width / offset / order / hide behaviour is actually observable.
 *
 * ### Rendering note (why the stories ship their own grid CSS)
 * The `column` component only *computes and applies* the grid class names; the
 * actual `.row` / `.col-*` / `.offset-*` / `.order-*` rules live in the
 * design-system `grid-system()` Sass mixin, which is scoped under a
 * `.grid-system` host and is not emitted in the isolated Storybook host. Each
 * story therefore injects a minimal, unscoped copy of those rules via `styles`
 * so the classes the component emits take visible effect. (`hide-*` / `break-*`
 * come from the component's own stylesheet and work without this.)
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - Purely presentational: it emits a styled container and does not introduce any
 *   interactive semantics, roles, or focusable elements of its own.
 * - It adds no ARIA and does not alter the accessibility tree — the projected
 *   content keeps its own semantics. `hide` toggles visual layout only, so make
 *   sure hidden columns don't strand content that assistive tech still needs.
 * - No text tokens are rendered by the component, so there is no color-contrast
 *   concern to exempt here.
 */
const meta: Meta<ShColumnComponent> = {
  title: 'ng-components/Column',
  component: ShColumnComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    xs: { control: 'text', description: 'Column width (1–12) at the extra-small breakpoint' },
    sm: { control: 'text', description: 'Column width at the small breakpoint' },
    md: { control: 'text', description: 'Column width at the medium breakpoint' },
    lg: { control: 'text', description: 'Column width at the large breakpoint' },
    xl: { control: 'text', description: 'Column width at the extra-large breakpoint' },
    offset_xs: { control: 'text', description: 'Left offset at the extra-small breakpoint' },
    offset_md: { control: 'text', description: 'Left offset at the medium breakpoint' },
    order_xs: { control: 'text', description: 'Visual order at the extra-small breakpoint' },
    order_md: { control: 'text', description: 'Visual order at the medium breakpoint' },
    break: {
      control: 'select',
      options: [undefined, 'xs', 'sm', 'md', 'lg', 'xl', 'all'],
      description: 'Breakpoint at which the column detaches from the bottom',
    },
    hide: {
      control: 'select',
      options: [undefined, 'xs', 'sm', 'md', 'lg', 'xl', 'all'],
      description: 'Breakpoint(s) at which the column is hidden',
    },
  },
  args: {},
};
export default meta;

type Story = StoryObj<ShColumnComponent>;

// --- Story helpers -------------------------------------------------------

// Minimal, unscoped Bootstrap-grid CSS keyed on the exact class names the
// `column` component computes, so the layout is actually visible in Storybook
// (see the file-level "Rendering note"). Generated instead of hand-written to
// keep the full 1–12 range, offsets, orders and the `md` breakpoint in sync.
const pct = (n: number) => `${((n / 12) * 100).toFixed(6)}%`;
const gridStyles = ((): string => {
  const rules: string[] = [
    '.row{display:flex;flex-wrap:wrap;margin-right:-15px;margin-left:-15px;}',
    '.row > column{position:relative;padding-right:15px;padding-left:15px;box-sizing:border-box;min-height:1px;}',
    '.col{flex-basis:0;flex-grow:1;max-width:100%;}',
  ];
  for (let i = 1; i <= 12; i++) {
    rules.push(`.col-${i}{flex:0 0 ${pct(i)};max-width:${pct(i)};}`);
  }
  for (let i = 1; i <= 11; i++) {
    rules.push(`.offset-${i}{margin-left:${pct(i)};}`);
  }
  for (let i = 0; i <= 12; i++) {
    rules.push(`.order-${i}{order:${i};}`);
  }
  // `md` and up (768px) — used by the Responsive / WithOffset stories.
  const md: string[] = [];
  md.push('.col-md{flex-basis:0;flex-grow:1;max-width:100%;}');
  for (let i = 1; i <= 12; i++) {
    md.push(`.col-md-${i}{flex:0 0 ${pct(i)};max-width:${pct(i)};}`);
  }
  for (let i = 0; i <= 11; i++) {
    md.push(`.offset-md-${i}{margin-left:${i === 0 ? '0' : pct(i)};}`);
  }
  for (let i = 0; i <= 12; i++) {
    md.push(`.order-md-${i}{order:${i};}`);
  }
  rules.push(`@media (min-width:768px){${md.join('')}}`);
  return rules.join('\n');
})();

// A coloured cell makes each column's extent obvious. The label states the span
// the column was given, so the mapping input → rendered width is self-evident.
const cell = (bg: string, label: string) =>
  `<div style="background:${bg};min-height:44px;display:flex;align-items:center;` +
  `justify-content:center;border-radius:4px;color:#fff;` +
  `font:600 13px/1.3 sans-serif;text-align:center;padding:8px;">${label}</div>`;

// Renders arbitrary <column> markup inside a bordered flex row, shipping the
// grid CSS so the computed classes take effect.
const demo = (columns: string) => () => ({
  props: {},
  styles: [gridStyles],
  template: `<div class="row" style="border:1px dashed #b0b0b0;padding:8px;">${columns}</div>`,
});

const BLUE = '#1e40af';
const GREEN = '#166534';
const ORANGE = '#9a3412';
const PURPLE = '#5b21b6';

// --- Stories -------------------------------------------------------------

/**
 * Fluid columns: no width input, so each renders the auto-sizing `col` class and
 * the three share the row equally (≈ one third each).
 */
export const Fluid: Story = {
  render: demo(`
    <column>${cell(BLUE, 'col (auto)')}</column>
    <column>${cell(GREEN, 'col (auto)')}</column>
    <column>${cell(ORANGE, 'col (auto)')}</column>
  `),
};

/** Two fixed half-width columns (`xs = 6` each) filling the 12-column grid. */
export const Halves: Story = {
  render: demo(`
    <column [xs]="6">${cell(BLUE, 'xs = 6')}</column>
    <column [xs]="6">${cell(GREEN, 'xs = 6')}</column>
  `),
};

/** Three equal thirds (`xs = 4` each). */
export const Thirds: Story = {
  render: demo(`
    <column [xs]="4">${cell(BLUE, 'xs = 4')}</column>
    <column [xs]="4">${cell(GREEN, 'xs = 4')}</column>
    <column [xs]="4">${cell(ORANGE, 'xs = 4')}</column>
  `),
};

/** Four equal quarters (`xs = 3` each). */
export const Quarters: Story = {
  render: demo(`
    <column [xs]="3">${cell(BLUE, 'xs = 3')}</column>
    <column [xs]="3">${cell(GREEN, 'xs = 3')}</column>
    <column [xs]="3">${cell(ORANGE, 'xs = 3')}</column>
    <column [xs]="3">${cell(PURPLE, 'xs = 3')}</column>
  `),
};

/**
 * Mixed widths: a narrow sidebar, a wide main area and a narrow rail
 * (`2 / 8 / 2`) — the spans still sum to 12.
 */
export const MixedWidths: Story = {
  render: demo(`
    <column [xs]="2">${cell(BLUE, 'xs = 2')}</column>
    <column [xs]="8">${cell(GREEN, 'xs = 8')}</column>
    <column [xs]="2">${cell(ORANGE, 'xs = 2')}</column>
  `),
};

/**
 * Offset: the second column is pushed to the right by three grid units
 * (`offset_xs = 3`), leaving a visible gap between the two `col-3` cells.
 */
export const WithOffset: Story = {
  render: demo(`
    <column [xs]="3">${cell(BLUE, 'xs = 3')}</column>
    <column [xs]="3" [offset_xs]="3">${cell(GREEN, 'xs = 3, offset_xs = 3')}</column>
  `),
};

/**
 * Visual reordering: the blue column is first in source order but rendered
 * **last** (`order_xs = 2`), while the green one is pulled ahead
 * (`order_xs = 1`). DOM/reading order is unchanged — only the visual order.
 */
export const WithOrder: Story = {
  render: demo(`
    <column [xs]="6" [order_xs]="2">${cell(BLUE, 'source #1 · order_xs = 2 → shown last')}</column>
    <column [xs]="6" [order_xs]="1">${cell(GREEN, 'source #2 · order_xs = 1 → shown first')}</column>
  `),
};

/**
 * Responsive widths: each column is full width on extra-small screens and one
 * third from the medium breakpoint up (`xs = 12`, `md = 4`). Resize the preview
 * (or use the viewport toolbar) to see the columns stack, then line up.
 */
export const Responsive: Story = {
  render: demo(`
    <column [xs]="12" [md]="4">${cell(BLUE, 'xs = 12 · md = 4')}</column>
    <column [xs]="12" [md]="4">${cell(GREEN, 'xs = 12 · md = 4')}</column>
    <column [xs]="12" [md]="4">${cell(ORANGE, 'xs = 12 · md = 4')}</column>
  `),
};

/**
 * Hidden column: the middle column sets `hide = "all"`, so it is removed from
 * the layout entirely and the two remaining `col-4` cells sit side by side with
 * a gap where it would have been.
 */
export const Hidden: Story = {
  render: demo(`
    <column [xs]="4">${cell(BLUE, 'xs = 4 (visible)')}</column>
    <column [xs]="4" [hide]="'all'">${cell(GREEN, 'xs = 4, hide = all (removed)')}</column>
    <column [xs]="4">${cell(ORANGE, 'xs = 4 (visible)')}</column>
  `),
};
