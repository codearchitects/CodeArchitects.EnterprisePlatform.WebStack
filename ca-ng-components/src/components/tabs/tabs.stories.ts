import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShTabsComponent, type IShTab } from './tabs.component';

/**
 * `sh-tabs` renders a horizontal tab strip driven by a `[model]` array of
 * `IShTab` objects (`title`, plus optional `id`/`isCurrent`/`isHidden`/
 * `isDisabled`). The body of the active tab is projected through a
 * `<ng-template #content>`, which receives the current tab as its implicit
 * context. `tabChange` emits whenever the active tab changes.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - Implements the WAI-ARIA APG **Tabs** pattern: the strip is a `role="tablist"`,
 *   each header is a `role="tab"` (with `aria-selected`/`aria-controls`), and the
 *   body is a `role="tabpanel"` labelled by its tab (`aria-labelledby`).
 * - Keyboard support follows the APG roving-tabindex rule: exactly one tab is in
 *   the tab order; Arrow keys move (and activate) between tabs, Home/End jump to
 *   first/last, and Enter/Space activate the focused tab. Hidden and disabled
 *   tabs are skipped.
 * - **The tablist should be given an accessible name** via `options.ariaLabel`
 *   (or `options.ariaLabelledBy`) so assistive tech can announce the group; every
 *   story below sets one.
 */
const meta: Meta<ShTabsComponent> = {
  title: 'ng-components/Tabs',
  component: ShTabsComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    model: { control: 'object', description: 'List of tabs (IShTab[])' },
    autosetCurrentTab: {
      control: 'boolean',
      description: 'Auto-select the first tab when none is marked current',
    },
    isLeftAligned: { control: 'boolean', description: 'Align the strip to the left of its container' },
    hasAbsoluteContent: { control: 'boolean', description: 'Position the tab body absolutely instead of relatively' },
    tabChange: { action: 'tabChange' },
  },
  args: {
    autosetCurrentTab: true,
    isLeftAligned: false,
    hasAbsoluteContent: false,
  },
  render: (args) => ({
    props: { ...args, options: (args as any).options ?? { ariaLabel: 'Sections' } },
    template: `
      <sh-tabs
        [model]="model"
        [autosetCurrentTab]="autosetCurrentTab"
        [isLeftAligned]="isLeftAligned"
        [hasAbsoluteContent]="hasAbsoluteContent"
        [options]="options"
        (tabChange)="tabChange($event)"
      >
        <ng-template #content let-tab>
          <div style="padding: 16px;">Content for <strong>{{ tab?.title }}</strong></div>
        </ng-template>
      </sh-tabs>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShTabsComponent>;

const basicTabs: IShTab[] = [
  { title: 'Overview' },
  { title: 'Details' },
  { title: 'History' },
];

/** Three tabs; the first is auto-selected and its content is shown. */
export const Default: Story = {
  args: { model: basicTabs },
};

/** A specific tab pre-selected via `isCurrent`. */
export const PreselectedTab: Story = {
  args: {
    model: [
      { title: 'Overview' },
      { title: 'Details', isCurrent: true },
      { title: 'History' },
    ],
  },
};

/** A disabled tab is skipped by keyboard navigation and cannot be activated. */
export const WithDisabledTab: Story = {
  args: {
    model: [
      { title: 'Overview' },
      { title: 'Details', isDisabled: true },
      { title: 'History' },
    ],
  },
};

/** A hidden tab is not rendered in the strip at all. */
export const WithHiddenTab: Story = {
  args: {
    model: [
      { title: 'Overview' },
      { title: 'Secret', isHidden: true },
      { title: 'History' },
    ],
  },
};

/** Tabs aligned to the left of their container. */
export const LeftAligned: Story = {
  args: { model: basicTabs, isLeftAligned: true },
};

/** Single tab. */
export const SingleTab: Story = {
  args: { model: [{ title: 'Overview' }] },
};
