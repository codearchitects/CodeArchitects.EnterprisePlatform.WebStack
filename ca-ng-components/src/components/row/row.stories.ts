import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShRowComponent } from './row.component';

/**
 * `row` is a layout primitive of the design-system grid. It is a purely
 * presentational flex container: projected content (typically `column`
 * elements) is laid out horizontally, and the `verticalAlignment` /
 * `horizontalAlignment` / `noGutters` inputs map to the corresponding
 * `align-items-*` / `justify-content-*` / `no-gutters` flex utility classes.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - `row` is layout-only: it renders no interactive elements, no label and no
 *   text of its own, so it introduces no focus order, ARIA or naming concerns.
 * - It does **not** add a landmark/role — keep it inside a semantically correct
 *   region and let the projected content carry meaning.
 * - Because visual order follows source order, the DOM reading order stays in
 *   sync with the visual layout (no reflow/2.4.3 issues introduced here).
 */
const meta: Meta<ShRowComponent> = {
  title: 'ng-components/Row',
  component: ShRowComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    verticalAlignment: {
      control: 'inline-radio',
      options: [undefined, 'start', 'center', 'end'],
      description: 'Cross-axis (vertical) alignment of the columns',
    },
    horizontalAlignment: {
      control: 'select',
      options: [undefined, 'start', 'center', 'end', 'around', 'between'],
      description: 'Main-axis (horizontal) distribution of the columns',
    },
    noGutters: {
      control: 'boolean',
      description: 'Remove the negative horizontal margins / column padding',
    },
  },
  args: {
    noGutters: false,
  },
};
export default meta;

type Story = StoryObj<ShRowComponent>;

// --- Story helpers -------------------------------------------------------
// A coloured block makes each cell (and thus the layout) visible. `h` lets a
// story make cells different heights so vertical alignment is demonstrable.
const block = (bg: string, label: string, h = 40) =>
  `<div style="background:${bg}; height:${h}px; display:flex; align-items:center; justify-content:center;` +
  ` border-radius:4px; color:#fff; font:600 13px/1 sans-serif; text-align:center; padding:0 8px;">${label}</div>`;

// Wraps the projected cells in a bordered <row>, binding all three inputs so
// the args (and the docs controls) drive the layout.
const rowTemplate = (cells: string) => `
  <div style="border: 1px dashed #b0b0b0; padding: 8px; min-height: 120px;">
    <row
      [verticalAlignment]="verticalAlignment"
      [horizontalAlignment]="horizontalAlignment"
      [noGutters]="noGutters"
    >
      ${cells}
    </row>
  </div>
`;

const renderCells = (cells: string) => (args: any) => ({
  props: args,
  template: rowTemplate(cells),
});

// --- Stories -------------------------------------------------------------

/**
 * Default row: columns of mixed spans flow left-to-right with default gutters.
 * The `col-6` / `col-3` / `col-3` widths add up to the full 12-column grid.
 */
export const Default: Story = {
  render: renderCells(`
    <column [xs]="6">${block('#1e40af', 'xs = 6', 40)}</column>
    <column [xs]="3">${block('#166534', 'xs = 3', 40)}</column>
    <column [xs]="3">${block('#9a3412', 'xs = 3', 40)}</column>
  `),
};

/**
 * Columns pushed to the horizontal end of the row. Three narrow `col-2`
 * columns leave free space that `justify-content-end` collects on the left.
 */
export const HorizontalEnd: Story = {
  args: { horizontalAlignment: 'end' },
  render: renderCells(`
    <column [xs]="2">${block('#1e40af', 'A', 40)}</column>
    <column [xs]="2">${block('#166534', 'B', 40)}</column>
    <column [xs]="2">${block('#9a3412', 'C', 40)}</column>
  `),
};

/**
 * Columns centered along the main (horizontal) axis — the leftover width is
 * split evenly on both sides of the group.
 */
export const HorizontalCenter: Story = {
  args: { horizontalAlignment: 'center' },
  render: renderCells(`
    <column [xs]="2">${block('#1e40af', 'A', 40)}</column>
    <column [xs]="2">${block('#166534', 'B', 40)}</column>
    <column [xs]="2">${block('#9a3412', 'C', 40)}</column>
  `),
};

/**
 * Equal space *between* columns (`justify-content-between`): the first and last
 * cells hug the edges, remaining space is distributed between them.
 */
export const SpaceBetween: Story = {
  args: { horizontalAlignment: 'between' },
  render: renderCells(`
    <column [xs]="2">${block('#1e40af', 'A', 40)}</column>
    <column [xs]="2">${block('#166534', 'B', 40)}</column>
    <column [xs]="2">${block('#9a3412', 'C', 40)}</column>
  `),
};

/**
 * Equal space *around* each column (`justify-content-around`): every cell gets
 * matching space on both sides, so edge gaps are half the inner gaps.
 */
export const SpaceAround: Story = {
  args: { horizontalAlignment: 'around' },
  render: renderCells(`
    <column [xs]="2">${block('#1e40af', 'A', 40)}</column>
    <column [xs]="2">${block('#166534', 'B', 40)}</column>
    <column [xs]="2">${block('#9a3412', 'C', 40)}</column>
  `),
};

/**
 * Columns aligned to the vertical center. The cells have deliberately different
 * heights so `align-items-center` is visible — they line up on their midline.
 */
export const VerticalCenter: Story = {
  args: { verticalAlignment: 'center' },
  render: renderCells(`
    <column [xs]="4">${block('#1e40af', 'short', 32)}</column>
    <column [xs]="4">${block('#166534', 'tall', 88)}</column>
    <column [xs]="4">${block('#9a3412', 'medium', 56)}</column>
  `),
};

/**
 * Columns aligned to the vertical end (bottom). Same mixed-height cells as
 * *Vertical center*, but here they share a common baseline at the bottom.
 */
export const VerticalEnd: Story = {
  args: { verticalAlignment: 'end' },
  render: renderCells(`
    <column [xs]="4">${block('#1e40af', 'short', 32)}</column>
    <column [xs]="4">${block('#166534', 'tall', 88)}</column>
    <column [xs]="4">${block('#9a3412', 'medium', 56)}</column>
  `),
};

/**
 * Gutterless row: the negative margins / column padding are removed, so the two
 * half-width cells sit flush against each other with no gap between them.
 */
export const NoGutters: Story = {
  args: { noGutters: true },
  render: renderCells(`
    <column [xs]="6">${block('#1e40af', 'xs = 6 (flush)', 40)}</column>
    <column [xs]="6">${block('#166534', 'xs = 6 (flush)', 40)}</column>
  `),
};
