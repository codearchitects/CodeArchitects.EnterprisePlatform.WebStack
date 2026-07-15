import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CaepContainerModule } from '../../container.module';
import { CaepContainerComponent } from './container.component';

/**
 * `caep-container` is the top-level application layout shell. It arranges an
 * optional side menu, an optional topbar and the routed page content into a
 * responsive frame, and exposes a "skip to main content" link as the first
 * focusable element on the page.
 *
 * Content is provided via projection:
 * - `caep-side-menu` / `[side-menu]` → the left navigation slot,
 * - `caep-topbar` / `[topbar]` → the top bar slot,
 * - default projected content → the routed page, rendered inside `<main>`.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The first focusable element is a **skip link** that moves focus straight to
 *   the `<main>` landmark (bypassing repeated navigation, WCAG 2.4.1). The
 *   label is a translation key resolved via `translate`.
 * - The page content lives in a single `<main>` landmark with `tabindex="-1"`
 *   so it can receive programmatic focus from the skip link without mutating
 *   the URL fragment.
 * - Set `mainAriaLabel` only when there is more than one `<main>` on the page;
 *   a lone `<main>` needs no accessible name.
 */
const meta: Meta<CaepContainerComponent> = {
  title: 'ng-components-extra/Container',
  component: CaepContainerComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CaepContainerModule.forRoot({ stackFrameFactory: null, taskSlotFactory: null })],
    }),
  ],
  argTypes: {
    skipToMainLabel: {
      control: 'text',
      description: 'Translation key for the "skip to main content" link.',
    },
    mainAriaLabel: {
      control: 'text',
      description: 'Optional accessible name for the main content landmark.',
    },
  },
  args: {
    skipToMainLabel: 'skipToMain',
    mainAriaLabel: undefined,
  },
  render: (args) => ({
    props: { ...args },
    template: `
      <caep-container [skipToMainLabel]="skipToMainLabel" [mainAriaLabel]="mainAriaLabel">
        <nav side-menu style="padding: 12px; min-width: 160px; background: #2d2f38; color: #fff;">
          <div>Dashboard</div>
          <div>Reports</div>
          <div>Settings</div>
        </nav>
        <header topbar style="padding: 12px; background: #f4f5f7; border-bottom: 1px solid #dcdfe4;">
          <strong>Enterprise Platform</strong>
        </header>
        <section style="padding: 24px;">
          <h1>Main content</h1>
          <p>This is the routed page content projected into the container's main region.</p>
        </section>
      </caep-container>
    `,
  }),
};
export default meta;

type Story = StoryObj<CaepContainerComponent>;

/** Full layout with a side menu, a topbar and page content. */
export const Default: Story = {};

/**
 * Just the main content region — no side menu or topbar slots filled. The skip
 * link is still the first focusable element.
 */
export const ContentOnly: Story = {
  render: (args) => ({
    props: { ...args },
    template: `
      <caep-container [skipToMainLabel]="skipToMainLabel" [mainAriaLabel]="mainAriaLabel">
        <section style="padding: 24px;">
          <h1>Main content</h1>
          <p>A container without a side menu or topbar still renders a main landmark and a skip link.</p>
        </section>
      </caep-container>
    `,
  }),
};

/**
 * Container whose main landmark has an explicit accessible name via
 * `mainAriaLabel` — useful when a page exposes more than one `<main>`.
 */
export const WithMainAriaLabel: Story = {
  args: { mainAriaLabel: 'Primary content' },
};
