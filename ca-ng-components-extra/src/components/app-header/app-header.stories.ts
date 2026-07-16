import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CaepComponentsModule } from '../components.module';
import { CaepAppHeaderComponent } from './app-header.component';

/**
 * `caep-app-header` is the application top bar. It is a presentational layout
 * component: it renders a `<header role="banner">` with three named
 * content-projection slots — `[header-start]`, `[header-center]` and
 * `[header-end]` — that the host application fills with logo, search, actions,
 * user menu, etc. The only input is an optional `ariaLabel`.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - Renders a single `role="banner"` landmark region.
 * - `[ariaLabel]` sets `aria-label` on that landmark so it can be told apart
 *   from other banner regions on the same page (see the *With Aria Label*
 *   story); when unset no attribute is emitted, which is correct for a single
 *   banner.
 * - The projected content is the host's responsibility; the header itself adds
 *   no interactive elements.
 */
const meta: Meta<CaepAppHeaderComponent> = {
  title: 'ng-components-extra/AppHeader',
  component: CaepAppHeaderComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [CaepComponentsModule] })],
  argTypes: {
    ariaLabel: {
      control: 'text',
      description: 'Optional accessible name for the banner landmark',
    },
  },
  args: { ariaLabel: undefined },
  render: (args) => ({
    props: { ...args },
    template: `
      <caep-app-header [ariaLabel]="ariaLabel">
        <div header-start>
          <strong>My Application</strong>
        </div>
        <div header-center>
          <span>Dashboard</span>
        </div>
        <div header-end>
          <span>Jane Doe</span>
        </div>
      </caep-app-header>
    `,
  }),
};
export default meta;

type Story = StoryObj<CaepAppHeaderComponent>;

/** Header with all three slots filled (start / center / end). */
export const Default: Story = {};

/**
 * Header with an explicit `ariaLabel`. Use this when a page has more than one
 * banner region so assistive technology can distinguish them.
 */
export const WithAriaLabel: Story = {
  args: { ariaLabel: 'Primary navigation header' },
};

/** Only the start slot is projected (e.g. a minimal branding-only header). */
export const StartOnly: Story = {
  render: (args) => ({
    props: { ...args },
    template: `
      <caep-app-header [ariaLabel]="ariaLabel">
        <div header-start>
          <strong>My Application</strong>
        </div>
      </caep-app-header>
    `,
  }),
};

/** Actions grouped on the end slot, leaving the center empty. */
export const StartAndEnd: Story = {
  render: (args) => ({
    props: { ...args },
    template: `
      <caep-app-header [ariaLabel]="ariaLabel">
        <div header-start>
          <strong>My Application</strong>
        </div>
        <div header-end>
          <span>Settings</span>
          &nbsp;
          <span>Jane Doe</span>
        </div>
      </caep-app-header>
    `,
  }),
};
