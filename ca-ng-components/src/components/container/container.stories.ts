import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShContainerComponent } from './container.component';
import { SidebarCommand } from '../../models/sidebar';

/**
 * `sh-container` is the application **master page / shell**. It composes the
 * `sh-sidebar`, `sh-header` and `sh-toolbar` around a scrollable content area,
 * and exposes three content-projection slots: `[header]`, `[toolbar]` and the
 * default (page body) slot.
 *
 * Sidebar commands are supplied via the `[onGetSidebarCommands]` promise (in a
 * real app they default to being fetched from `sidebar.json` under assets); the
 * stories provide a static list so the shell renders without any HTTP wiring.
 * The shell is absolutely positioned, so it is wrapped in a sized host element
 * in every story to be visible.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The back button emits `(return)` and is a native control; the breadcrumb
 *   and language controls are keyboard operable.
 * - Icon-only chrome controls (sidebar toggler, search) rely on the underlying
 *   `sh-sidebar` / `sh-header` accessible names.
 */
const meta: Meta<ShContainerComponent> = {
  title: 'ng-components/Container',
  component: ShContainerComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    applicationName: { control: 'text', description: 'Application name shown in the header' },
    showBackButton: { control: 'boolean', description: 'Whether the toolbar shows the back button' },
    showBreadcrumb: { control: 'boolean', description: 'Whether the toolbar shows the breadcrumb' },
    showSearchbar: { control: 'boolean', description: 'Whether the header shows the search bar' },
    showLangControl: { control: 'boolean', description: 'Whether the toolbar shows the language control' },
    searchBarIcon: { control: 'text', description: 'Search bar icon name' },
    togglerIcon: { control: 'text', description: 'Sidebar toggler icon name' },
    companyLogo: { control: 'text', description: 'Sidebar logo assets path (130x45px)' },
    appLogo: { control: 'text', description: 'Toolbar logo assets path (height 30px)' },
    return: { action: 'return' },
  },
  args: {
    applicationName: 'Enterprise Platform',
    showBackButton: true,
    showBreadcrumb: true,
    showSearchbar: true,
    showLangControl: true,
    // The template binds [searchBarIcon] and [togglerIcon]; the component
    // supplies defaults, but binding them to undefined args would override
    // those defaults and pass an undefined name down to the child `sh-icon`
    // (in the sidebar toggler and header search), which is what made the
    // composed shell throw. Provide explicit names so a valid icon is always
    // passed. Names match the sibling sidebar / sidebar-search stories.
    searchBarIcon: 'search',
    togglerIcon: 'hamburger',
  },
  render: (args) => {
    const commands: SidebarCommand[] = (args as any).commands ?? [
      { id: 'home', icon: 'home', title: 'Dashboard', routerLink: '/dashboard' },
      { id: 'orders', icon: 'list', title: 'Orders', routerLink: '/orders' },
      { id: 'settings', icon: 'settings', title: 'Settings', routerLink: '/settings' },
    ];
    return {
      props: {
        ...args,
        onGetSidebarCommands: () => Promise.resolve(commands),
      },
      template: `
        <div style="position: relative; width: 100%; height: 640px; overflow: hidden;">
          <sh-container
            [applicationName]="applicationName"
            [companyLogo]="companyLogo"
            [appLogo]="appLogo"
            [showBackButton]="showBackButton"
            [showBreadcrumb]="showBreadcrumb"
            [showSearchbar]="showSearchbar"
            [showLangControl]="showLangControl"
            [searchBarIcon]="searchBarIcon"
            [togglerIcon]="togglerIcon"
            [activity]="activity"
            [onGetSidebarCommands]="onGetSidebarCommands"
            (return)="return($event)"
          >
            <span header>Header slot content</span>
            <span toolbar>Toolbar slot content</span>
            <div style="padding: 24px;">
              <h2>Page content</h2>
              <p>Projected into the default (body) slot of the shell.</p>
            </div>
          </sh-container>
        </div>
      `,
    };
  },
};
export default meta;

type Story = StoryObj<ShContainerComponent & { commands?: SidebarCommand[] }>;

/** Full shell: sidebar, header, toolbar and a scrollable content area. */
export const Default: Story = {};

/** Minimal chrome: no search bar, breadcrumb or language control. */
export const MinimalChrome: Story = {
  args: {
    showSearchbar: false,
    showBreadcrumb: false,
    showLangControl: false,
  },
};

/** Shell without the header search bar. */
export const NoSearchbar: Story = {
  args: { showSearchbar: false },
};

/** Shell without the back button in the toolbar. */
export const NoBackButton: Story = {
  args: { showBackButton: false },
};
