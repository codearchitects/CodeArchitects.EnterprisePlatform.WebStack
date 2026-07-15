import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { SidebarCommand } from '../../models/sidebar';
import { ShSidebarComponent } from './sidebar.component';

/**
 * `sh-sidebar` is the app navigation rail. It renders a collapse/expand toggler
 * and a list of navigation commands (`sh-sidebar-item`s). Commands are supplied
 * via the `[onGetData]` promise (or loaded from `assets/sidebar.json` when it is
 * not set); an optional `[logo]` is shown at the top. Each command may carry a
 * `routerLink` and nested `children`.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The toggler is an operable control (`role="button"`, `tabindex="0"`) with an
 *   accessible name and `aria-expanded`/`aria-controls`, and responds to
 *   Enter/Space.
 * - The command list is a `role="navigation"` landmark, labelled via
 *   `options.ariaLabel`/`options.ariaLabelledBy` (falling back to a translated
 *   "navigation" label).
 */
const meta: Meta<ShSidebarComponent> = {
  title: 'ng-components/Sidebar',
  component: ShSidebarComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    isExpanded: { control: 'boolean', description: 'Whether the rail is expanded (labels visible)' },
    logo: { control: 'text', description: 'Logo asset file name (assets/<logo>), ~130x45px' },
    togglerIcon: { control: 'text', description: 'Icon name for the collapse/expand toggler' },
    isExpandedChange: { action: 'isExpandedChange' },
  },
  args: {
    isExpanded: false,
    togglerIcon: 'hamburger',
  },
  render: (args) => ({
    props: {
      ...args,
      onGetData: (args as any).onGetData ?? (() => Promise.resolve(sampleCommands)),
    },
    template: `
      <sh-sidebar
        [logo]="logo"
        [isExpanded]="isExpanded"
        [togglerIcon]="togglerIcon"
        [onGetData]="onGetData"
        (isExpandedChange)="isExpandedChange($event)"
      ></sh-sidebar>
    `,
  }),
};
export default meta;

const sampleCommands: SidebarCommand[] = [
  { id: 'home', icon: 'home', title: 'Home', routerLink: '/home' },
  { id: 'orders', icon: 'cart', title: 'Orders', routerLink: '/orders' },
  {
    id: 'settings',
    icon: 'settings',
    title: 'Settings',
    routerLink: '/settings',
    children: [
      { id: 'profile', icon: 'user', title: 'Profile', routerLink: '/settings/profile' },
      { id: 'security', icon: 'lock', title: 'Security', routerLink: '/settings/security' },
    ],
  },
  { id: 'reports', icon: 'chart', title: 'Reports', routerLink: '/reports' },
];

type Story = StoryObj<ShSidebarComponent & { onGetData?: () => Promise<SidebarCommand[]> }>;

/** Collapsed rail (icons only) — the default resting state. */
export const Collapsed: Story = {
  args: { isExpanded: false },
};

/** Expanded rail — command titles are visible alongside their icons. */
export const Expanded: Story = {
  args: { isExpanded: true },
};

/** Expanded rail with a brand logo shown at the top. */
export const WithLogo: Story = {
  args: { isExpanded: true, logo: 'logo.png' },
};

/** Custom toggler icon instead of the default hamburger. */
export const CustomTogglerIcon: Story = {
  args: { isExpanded: true, togglerIcon: 'arrow-left' },
};

/** Empty navigation (the data promise resolves to no commands). */
export const NoCommands: Story = {
  args: { isExpanded: true, onGetData: () => Promise.resolve([] as SidebarCommand[]) },
};
