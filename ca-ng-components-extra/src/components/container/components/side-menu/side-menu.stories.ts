import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { of } from 'rxjs';
import { CaepIdSequenceService } from '../../../../services';
import type { ICaepSideMenuEntry } from '../../models';
import { CaepContainerModule } from '../../container.module';
import { CaepSideMenuService } from '../../services';
import { CaepSideMenuComponent } from './side-menu.component';

/**
 * `caep-side-menu` is the collapsible left-hand navigation of the application
 * shell. It renders a header with the app logo and a collapse/expand toggle,
 * plus a `navigation` landmark that lists the menu entries streamed by
 * `CaepSideMenuService` (each rendered as a `caep-side-menu-entry`). Clicking the
 * header toggles between the expanded (logo + labelled entries) and collapsed
 * (icon rail) layouts.
 *
 * Because the entry list is service-driven, these stories replace
 * `CaepSideMenuService` with a lightweight stub that streams a fixed set of
 * entries and a neutral location, so the menu renders standalone without the
 * router / task-slot wiring a real host provides. Use the header toggle in the
 * canvas to see the collapsed state.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The collapse/expand control is a native `<button>` (focusable, operable with
 *   Enter/Space). It has no visible text, so `[toggleAriaLabel]` provides its
 *   accessible name, and it exposes `aria-expanded` + `aria-controls` pointing at
 *   the navigation region it discloses (WCAG 4.1.2 / 1.3.1).
 * - The entries live in a `<nav>` landmark whose accessible name comes from
 *   `[navAriaLabel]`, so assistive tech can distinguish it from other landmarks
 *   (WCAG 2.4.1).
 * - Logo / icon `<img>`s are purely decorative and marked `alt=""` +
 *   `aria-hidden`, so they are skipped by screen readers.
 * - The active entry auto-scroll honours `prefers-reduced-motion` (WCAG 2.3.3).
 *
 * The dark menu palette (`#fefefe` on `#2f3e4b`) clears the 4.5:1 contrast
 * threshold, so no color-contrast exception is needed here.
 */

/** Flat set of entries (no links) used to populate the navigation list. */
const SAMPLE_ENTRIES: ICaepSideMenuEntry[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'projects', label: 'Projects' },
  { id: 'reports', label: 'Reports' },
  { id: 'settings', label: 'Settings' },
];

/**
 * Builds the module metadata for a story, wiring the container module and a stub
 * `CaepSideMenuService` that just streams the given entries (and an empty
 * location, so nothing resolves as "active"). `CaepIdSequenceService` is provided
 * because the entry components request it and the container module does not.
 */
function withMenu(entries: ICaepSideMenuEntry[]) {
  const stub: Partial<CaepSideMenuService> = {
    entries$: of(entries),
    location$: of(''),
    getActiveEntry: () => null,
    isActive: () => false,
  };
  return moduleMetadata({
    imports: [CaepContainerModule.forRoot({ stackFrameFactory: null, taskSlotFactory: null })],
    providers: [
      CaepIdSequenceService,
      { provide: CaepSideMenuService, useValue: stub as CaepSideMenuService },
    ],
  });
}

const meta: Meta<CaepSideMenuComponent> = {
  title: 'ng-components-extra/SideMenu',
  component: CaepSideMenuComponent,
  tags: ['autodocs'],
  decorators: [withMenu(SAMPLE_ENTRIES)],
  argTypes: {
    toggleAriaLabel: {
      control: 'text',
      description: 'Accessible name for the collapse/expand toggle button (translation key or literal).',
    },
    navAriaLabel: {
      control: 'text',
      description: 'Accessible name for the navigation landmark (translation key or literal).',
    },
    logo: { control: 'text', description: 'Logo image path (expanded state).' },
    logoCollapsed: { control: 'text', description: 'Logo image path (collapsed state).' },
    expandIcon: { control: 'text', description: 'Icon shown on the toggle when the menu is collapsed.' },
    collapseIcon: { control: 'text', description: 'Icon shown on the toggle when the menu is expanded.' },
    placeholderIcon: { control: 'text', description: 'Default entry icon path.' },
  },
  args: {
    toggleAriaLabel: 'Toggle navigation menu',
    navAriaLabel: 'Main navigation',
  },
  render: (args) => ({
    props: { ...args },
    template: `
      <div style="height: 520px; display: flex;">
        <caep-side-menu
          [logo]="logo"
          [logoCollapsed]="logoCollapsed"
          [expandIcon]="expandIcon"
          [collapseIcon]="collapseIcon"
          [placeholderIcon]="placeholderIcon"
          [backIcon]="backIcon"
          [chevronRightIcon]="chevronRightIcon"
          [toggleAriaLabel]="toggleAriaLabel"
          [navAriaLabel]="navAriaLabel"
        ></caep-side-menu>
      </div>
    `,
  }),
};
export default meta;

type Story = StoryObj<CaepSideMenuComponent>;

/**
 * Expanded menu with a labelled navigation landmark and a few entries. Use the
 * header button to toggle the collapsed (icon-rail) layout.
 */
export const Default: Story = {};

/**
 * Custom accessible names for the toggle button and the navigation landmark —
 * useful when the page hosts more than one `navigation` landmark and each needs
 * a distinct name (WCAG 2.4.1).
 */
export const CustomAriaLabels: Story = {
  args: {
    toggleAriaLabel: 'Collapse or expand the primary menu',
    navAriaLabel: 'Primary',
  },
};

/**
 * Custom branding: distinct expanded/collapsed logos and toggle icons. The image
 * paths are illustrative; when they do not resolve the surrounding chrome (button,
 * landmark, entries) still renders.
 */
export const CustomBranding: Story = {
  args: {
    logo: 'assets/menu/logo.svg',
    logoCollapsed: 'assets/menu/logo-mark.svg',
    expandIcon: 'assets/menu/expand.svg',
    collapseIcon: 'assets/menu/collapse.svg',
  },
};

/**
 * Empty menu — the service streams no entries (e.g. before they have loaded). The
 * header, toggle button and empty `navigation` landmark still render, so the
 * accessible structure is present regardless of content.
 */
export const Empty: Story = {
  decorators: [withMenu([])],
};
