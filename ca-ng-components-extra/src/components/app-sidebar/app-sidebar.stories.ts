import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CaepComponentsModule } from '../components.module';
import { CaepAppSidebarComponent } from './app-sidebar.component';

/**
 * `caep-app-sidebar` is a presentational layout container for an application's
 * side navigation. It renders as a fixed-width, full-height vertical panel and
 * projects arbitrary content (nav links, buttons, logos, …) via `<ng-content>`.
 *
 * The host element is a `navigation` landmark (`role="navigation"`), and the
 * optional `[ariaLabel]` input sets its `aria-label`.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The host exposes a `navigation` landmark so assistive technology can jump
 *   to it directly.
 * - **Set `[ariaLabel]`** whenever more than one `navigation` landmark exists on
 *   a page so each can be told apart (WCAG 2.4.1 / EN 301 549). It is bound to
 *   the host `aria-label`, and is omitted from the DOM when null so no empty
 *   attribute is rendered.
 * - It is a pure container: the projected content is responsible for its own
 *   focus order, links and interactive semantics.
 */
const meta: Meta<CaepAppSidebarComponent> = {
  title: 'ng-components-extra/AppSidebar',
  component: CaepAppSidebarComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [CaepComponentsModule] })],
  argTypes: {
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the navigation landmark (host aria-label).',
    },
  },
  args: {
    ariaLabel: 'Main navigation',
  },
  render: (args) => ({
    props: { ...args, content: (args as any).content },
    template: `
      <caep-app-sidebar [ariaLabel]="ariaLabel">
        <div style="padding: 12px 16px; display: flex; flex-direction: column; gap: 8px;">
          <div style="font-weight: 600; margin-bottom: 8px;">My App</div>
          <a href="#" style="text-decoration: none; color: inherit;">Dashboard</a>
          <a href="#" style="text-decoration: none; color: inherit;">Projects</a>
          <a href="#" style="text-decoration: none; color: inherit;">Reports</a>
          <a href="#" style="text-decoration: none; color: inherit;">Settings</a>
        </div>
      </caep-app-sidebar>
    `,
  }),
};
export default meta;

type Story = StoryObj<CaepAppSidebarComponent>;

/** Default sidebar with a labelled navigation landmark and projected links. */
export const Default: Story = {
  args: { ariaLabel: 'Main navigation' },
};

/**
 * A second sidebar with a distinct `ariaLabel`. When a page has more than one
 * `navigation` landmark, each must carry a unique accessible name so screen
 * readers can distinguish them (WCAG 2.4.1).
 */
export const SecondaryNavigation: Story = {
  args: { ariaLabel: 'Secondary navigation' },
};

/**
 * Sidebar without an `ariaLabel`. The `aria-label` attribute is omitted from the
 * DOM entirely (the input defaults to `null`). Acceptable only when a single
 * `navigation` landmark exists on the page; otherwise provide a label.
 */
export const WithoutLabel: Story = {
  args: { ariaLabel: null },
};

/** Minimal sidebar showing an empty container (content projected by the host). */
export const Empty: Story = {
  args: { ariaLabel: 'Main navigation' },
  render: (args) => ({
    props: { ...args },
    template: `<caep-app-sidebar [ariaLabel]="ariaLabel"></caep-app-sidebar>`,
  }),
};
