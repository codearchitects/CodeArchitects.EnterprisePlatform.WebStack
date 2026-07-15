import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShFlexibleContentComponent } from './flexible-content.component';

/**
 * `sh-flexible-content` is a presentational layout component that lays out three
 * configurable zones on a single horizontal row: a **left** zone (grow 1), a
 * **center** zone (grow 2) and a **right** zone (grow 1). Each zone is filled
 * via content projection using the matching attribute:
 * `[left-zone]`, `[center-zone]` and `[right-zone]`.
 *
 * An optional `[text]` input renders a fixed-width text block that precedes the
 * left-zone content (typically a title/label for the row).
 *
 * The host stretches to `height: inherit`, so give it a container with a height
 * (as these stories do) for the zones to be vertically centered.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - This is a pure layout wrapper with no interactive behaviour of its own; it
 *   adds no roles or ARIA. Accessibility depends on the projected content, so
 *   ensure any controls/links you place in a zone are themselves accessible and
 *   in a sensible DOM reading order (left → center → right).
 * - `[text]` is presentational text; if it labels a specific control, associate
 *   them explicitly in the projected markup.
 */
const meta: Meta<ShFlexibleContentComponent> = {
  title: 'ng-components/FlexibleContent',
  component: ShFlexibleContentComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    text: { control: 'text', description: 'Optional fixed-width text block shown before the left zone' },
  },
  args: {
    text: undefined,
  },
  render: (args) => ({
    props: { ...args },
    template: `
      <div style="height: 64px; border: 1px solid #ddd;">
        <sh-flexible-content [text]="text">
          <div left-zone>Left content</div>
          <div center-zone>Center content</div>
          <div right-zone>Right content</div>
        </sh-flexible-content>
      </div>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShFlexibleContentComponent>;

/** All three zones populated, no leading text. */
export const Default: Story = {};

/** With the optional leading `[text]` block acting as a row title. */
export const WithText: Story = {
  args: { text: 'Title' },
};

/**
 * Only the center zone is used — the left and right zones stay empty but still
 * reserve their share of the row (grow 1 / 2 / 1).
 */
export const CenterOnly: Story = {
  render: (args) => ({
    props: { ...args },
    template: `
      <div style="height: 64px; border: 1px solid #ddd;">
        <sh-flexible-content [text]="text">
          <div center-zone>Centered content</div>
        </sh-flexible-content>
      </div>
    `,
  }),
};

/**
 * A realistic toolbar-style row: a title on the left (via `[text]`), an action
 * area in the center and metadata on the right.
 */
export const ToolbarRow: Story = {
  args: { text: 'Orders' },
  render: (args) => ({
    props: { ...args },
    template: `
      <div style="height: 56px; border: 1px solid #ddd;">
        <sh-flexible-content [text]="text">
          <div left-zone>Filters</div>
          <div center-zone>
            <sh-button [primary]="true">New order</sh-button>
          </div>
          <div right-zone>12 items</div>
        </sh-flexible-content>
      </div>
    `,
  }),
};
