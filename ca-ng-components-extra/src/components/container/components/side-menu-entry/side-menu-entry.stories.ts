import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CaepContainerModule } from '../../container.module';
import { ICaepSideMenuEntry } from '../../models';
import { CaepSideMenuEntryComponent } from './side-menu-entry.component';

/**
 * `caep-side-menu-entry` renders a single entry of the container side menu. It is
 * driven by a `[model]` (`ICaepSideMenuEntry`) that provides the label, optional
 * icon, link and (optionally) nested `children`. A navigable entry behaves like a
 * link; an entry that has `children` (or is `lazy`) is *expandable* and toggles the
 * disclosure of its child entries when activated. Active/active-route highlighting
 * is derived from the router location via `CaepSideMenuService`.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The entry is a native `<a>`; expandable entries carry `role="button"`,
 *   `tabindex="0"` and are operable with Enter/Space (`aria-expanded` reflects the
 *   open state, `aria-controls` points at the disclosed children container).
 * - The active route is announced via `aria-current="page"`.
 * - Chevron / active indicators are decorative (`aria-hidden`), so the label alone
 *   carries the accessible name.
 * - Scroll-into-view of the active entry honors `prefers-reduced-motion` (WCAG 2.3.3).
 */
const meta: Meta<CaepSideMenuEntryComponent> = {
  title: 'ng-components-extra/SideMenuEntry',
  component: CaepSideMenuEntryComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CaepContainerModule.forRoot({ stackFrameFactory: null, taskSlotFactory: null })],
    }),
  ],
  argTypes: {
    model: { control: 'object', description: 'Menu entry model (label, icon, link, children).' },
    visible: { control: 'boolean', description: 'Whether the current layer shows this entry.' },
    enable: { control: 'boolean', description: 'Enabled state (false → disabled).' },
    show: { control: 'boolean', description: 'Whether the entry is rendered at all.' },
    inward: { action: 'inward' },
  },
  args: {
    visible: true,
    enable: true,
    show: true,
  },
  render: (args) => ({
    props: { ...args },
    // A colored wrapper mirrors the side-menu surface so the theme-driven entry
    // colors are readable in isolation.
    template: `
      <div style="width: 320px; padding: 8px; background: var(--caep-menu-background, #1f2937); border-radius: 8px;">
        <caep-side-menu-entry
          [model]="model"
          [visible]="visible"
          [enable]="enable"
          [show]="show"
          (inward)="inward()"
        ></caep-side-menu-entry>
      </div>
    `,
  }),
};
export default meta;

type Story = StoryObj<CaepSideMenuEntryComponent>;

/** A single navigable entry pointing at a route. */
export const Default: Story = {
  args: {
    model: {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'home',
      link: { url: '/dashboard' },
    } as ICaepSideMenuEntry,
  },
};

/** Entry with a leading icon. */
export const WithIcon: Story = {
  args: {
    model: {
      id: 'reports',
      label: 'Reports',
      icon: 'chart',
      link: { url: '/reports' },
    } as ICaepSideMenuEntry,
  },
};

/**
 * Expandable entry with nested children. It renders the disclosure chevron and is
 * operable with pointer or Enter/Space; activating it toggles the child list
 * (`aria-expanded` / `aria-controls` update accordingly).
 */
export const Expandable: Story = {
  args: {
    model: {
      id: 'settings',
      label: 'Settings',
      icon: 'cog',
      children: [
        { id: 'settings-profile', label: 'Profile', link: { url: '/settings/profile' } },
        { id: 'settings-security', label: 'Security', link: { url: '/settings/security' } },
        { id: 'settings-billing', label: 'Billing', link: { url: '/settings/billing' } },
      ],
    } as ICaepSideMenuEntry,
  },
};

/** Disabled entry (`enable = false`). */
export const Disabled: Story = {
  args: {
    model: {
      id: 'admin',
      label: 'Administration',
      icon: 'lock',
      link: { url: '/admin' },
    } as ICaepSideMenuEntry,
    enable: false,
  },
};
