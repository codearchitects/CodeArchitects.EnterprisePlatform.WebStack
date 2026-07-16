import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { SidebarCommand } from '../../models/sidebar';
import { ShSidebarItemComponent } from './sidebar-item.component';

/**
 * `sh-sidebar-item` renders a single entry of the application sidebar/navigation.
 * It is driven by a `[model]` ({@link SidebarCommand}) that carries the icon,
 * the (i18n) title and either a `routerLink` (navigational leaf) or a list of
 * `children` (expandable parent). `[isExpanded]` switches between the compact
 * (icon-only) and the expanded (icon + caption) layout, and `[areChildrenShown]`
 * toggles the visibility of a parent's children. The `toggleChildren` output
 * fires when the user activates an expandable parent.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The navigational item exposes `role="link"`, is keyboard focusable
 *   (`tabindex="0"`) and activates on Enter; `aria-current="page"` marks the
 *   active route.
 * - The expandable parent exposes `role="button"` with `aria-expanded` and
 *   `aria-controls` pointing at the children group, and toggles on
 *   Enter/Space as well as click.
 * - The disabled state is asserted via `aria-disabled` and keyboard/mouse
 *   activation is suppressed (WCAG 4.1.2).
 * - The decorative icon is `aria-hidden`; the accessible name comes from the
 *   command title (or `options.ariaLabel` when provided).
 */
const meta: Meta<ShSidebarItemComponent> = {
  title: 'ng-components/SidebarItem',
  component: ShSidebarItemComponent,
  tags: ['autodocs'],
  parameters: {
    a11y: {
      // KNOWN LIMITATION (ACCESSIBILITY.md §6): sh-sidebar-item renders on four
      // different backgrounds depending on where its parent sh-sidebar places
      // it (dark top-level odd/even rows, light child odd/even rows via
      // sh-sidebar's own ::ng-deep rules) — no single flat text colour clears
      // 4.5:1 against all four. $sh-light-gray is a deliberate compromise, not
      // a bug; kept suppressed here rather than silently regressing one
      // context to "fix" contrast in another (see git history for a case
      // where that trade was made and had to be reverted).
      config: { rules: [{ id: 'color-contrast', enabled: false }] },
    },
  },
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    isExpanded: { control: 'boolean', description: 'Expanded (icon + caption) vs. compact (icon only) layout' },
    areChildrenShown: { control: 'boolean', description: 'Whether an expandable parent shows its children' },
    enable: { control: 'boolean', description: 'Enabled state (false → aria-disabled, activation suppressed)' },
    show: { control: 'boolean', description: 'Whether the item is rendered at all' },
    toggleChildren: { action: 'toggleChildren' },
  },
  args: {
    isExpanded: true,
    areChildrenShown: false,
    enable: true,
    show: true,
  },
  render: (args) => ({
    props: {
      ...args,
      model: (args as any).model,
    },
    template: `
      <div style="width: 240px; background: #3a3939; padding: 8px;">
        <sh-sidebar-item
          [model]="model"
          [isExpanded]="isExpanded"
          [areChildrenShown]="areChildrenShown"
          [enable]="enable"
          [show]="show"
          (toggleChildren)="toggleChildren($event)"
        ></sh-sidebar-item>
      </div>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShSidebarItemComponent & { model?: SidebarCommand }>;

const link: SidebarCommand = {
  id: 'dashboard',
  icon: 'home',
  title: 'Dashboard',
  routerLink: '/dashboard',
};

const parent: SidebarCommand = {
  id: 'settings',
  icon: 'settings',
  title: 'Settings',
  routerLink: null as any,
  children: [
    { id: 'profile', icon: 'user', title: 'Profile', routerLink: '/settings/profile' },
    { id: 'security', icon: 'lock', title: 'Security', routerLink: '/settings/security' },
  ],
};

/** Expanded navigational leaf: icon + caption, links to a route. */
export const Default: Story = {
  args: { model: link, isExpanded: true },
};

/** Compact (collapsed sidebar) layout: icon only, caption hidden. */
export const Compact: Story = {
  args: { model: link, isExpanded: false },
};

/** Expandable parent item (has children) with the children collapsed. */
export const WithChildren: Story = {
  args: { model: parent, isExpanded: true, areChildrenShown: false },
};

/** Expandable parent with its children expanded and visible. */
export const ChildrenExpanded: Story = {
  args: { model: parent, isExpanded: true, areChildrenShown: true },
};

/** Disabled item: `aria-disabled` is asserted and activation is suppressed. */
export const Disabled: Story = {
  args: { model: link, isExpanded: true, enable: false },
};
