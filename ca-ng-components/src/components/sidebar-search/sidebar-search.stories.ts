import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShSidebarSearchComponent } from './sidebar-search.component';

/**
 * `sh-sidebar-search` is the global "search a command / navigate" control shown
 * in the application sidebar. It renders a `sh-combo` autocomplete plus a
 * trailing search icon. On selection it emits `modelChange` and (when an
 * `applicationName` is provided) routes to the selected command's `routerLink`.
 *
 * The list of searchable commands is loaded asynchronously in `ngOnInit` from
 * `assets/sidebar.json` via `AssetsService`; the inner combo is only rendered
 * once that fetch resolves. In an isolated Storybook (no `sidebar.json` served)
 * that request typically 404s, so only the search icon and the `role="search"`
 * landmark render — see the story note below.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The wrapper is a `role="search"` landmark; it exposes an accessible name via
 *   `options.ariaLabel` (or `options.ariaLabelledBy`), falling back to the
 *   translated "search" string.
 * - The trailing icon is decorative (`aria-hidden="true"`); the accessible name
 *   comes from the landmark / combo, not the icon.
 */
const meta: Meta<ShSidebarSearchComponent> = {
  title: 'ng-components/SidebarSearch',
  component: ShSidebarSearchComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    icon: { control: 'text', description: 'Trailing search icon name (default: "search")' },
    applicationName: {
      control: 'text',
      description: 'App route segment prepended to the selected command routerLink on navigation',
    },
    modelChange: { action: 'modelChange' },
  },
  args: {
    icon: 'search',
    applicationName: 'my-app',
  },
  render: (args) => ({
    props: { ...args },
    // This control's real habitat is the dark sidebar/header bar
    // ($sh-lush-black) — wrap it here so the story matches that context
    // instead of Storybook's default white canvas.
    template: `
      <div style="background: #3a3939; padding: 12px; width: 280px;">
        <sh-sidebar-search
          [icon]="icon"
          [applicationName]="applicationName"
          [options]="options"
          (modelChange)="modelChange($event)"
        ></sh-sidebar-search>
      </div>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShSidebarSearchComponent>;

/**
 * Default sidebar search.
 *
 * NOTE: the searchable-command list is fetched from `assets/sidebar.json`; with
 * no such asset served in isolation the combo may not appear, leaving the
 * `role="search"` landmark and the search icon visible.
 */
export const Default: Story = {};

/** A named search landmark, useful when several search fields share a page. */
export const WithAccessibleName: Story = {
  args: { options: { ariaLabel: 'Search commands' } as any },
};

/** Custom trailing icon instead of the default magnifier. */
export const CustomIcon: Story = {
  args: { icon: 'filter' },
};
