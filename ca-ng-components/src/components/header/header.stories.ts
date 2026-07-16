import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShHeaderComponent } from './header.component';

/**
 * `sh-header` is the application top bar. It renders (optionally) a logo image,
 * an (optional) sidebar-based search bar (`sh-sidebar-search`), and projects any
 * extra content (actions, user menu, …) into its right-hand content area via
 * `<ng-content>`. The host element carries `role="banner"`.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The host exposes the `banner` landmark (`role="banner"`), so assistive
 *   technology announces it as the page header.
 * - The landmark can be named via `options.ariaLabel` / `options.ariaLabelledBy`
 *   / `options.ariaDescribedBy` — useful when a page has more than one banner.
 * - The logo `<img>` gets its `alt` from `applicationName` (falling back to
 *   `"logo"`), so it is never an unlabelled image.
 */
const meta: Meta<ShHeaderComponent> = {
  title: 'ng-components/Header',
  component: ShHeaderComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    logo: { control: 'text', description: 'Logo asset file name under assets/ (30px tall)' },
    applicationName: { control: 'text', description: 'Application name (also used as the logo alt text)' },
    showSearchbar: { control: 'boolean', description: 'Whether the sidebar search bar is shown' },
    searchBarIcon: { control: 'text', description: 'Search bar icon name' },
    enable: { control: 'boolean', description: 'Enabled state' },
    show: { control: 'boolean', description: 'Whether the header is rendered' },
  },
  args: {
    applicationName: 'Enterprise Platform',
    showSearchbar: true,
    searchBarIcon: 'search',
    enable: true,
    show: true,
  },
  render: (args) => ({
    props: { ...args, content: (args as any).content ?? '' },
    template: `
      <sh-header
        [logo]="logo"
        [applicationName]="applicationName"
        [showSearchbar]="showSearchbar"
        [searchBarIcon]="searchBarIcon"
        [options]="options"
        [enable]="enable"
        [show]="show"
      >{{ content }}</sh-header>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShHeaderComponent & { content?: string }>;

/** Default header with the application name and the sidebar search bar. */
export const Default: Story = {};

/** Header without the search bar (e.g. minimal / focused screens). */
export const WithoutSearchbar: Story = {
  args: { showSearchbar: false },
};

/** Header with a custom search-bar icon. */
export const CustomSearchIcon: Story = {
  args: { searchBarIcon: 'filter' },
};

/**
 * Header with projected content on the right-hand side (actions, user menu…).
 * Content is provided through `<ng-content>`.
 */
export const WithProjectedContent: Story = {
  args: { content: 'User menu' },
};

/**
 * Named `banner` landmark. When a page has more than one banner, set
 * `options.ariaLabel` so each is distinguishable to assistive technology.
 */
export const NamedLandmark: Story = {
  args: { options: { ariaLabel: 'Main application header' } as any },
};
