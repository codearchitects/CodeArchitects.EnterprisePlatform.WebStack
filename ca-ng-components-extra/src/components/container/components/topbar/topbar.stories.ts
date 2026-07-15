import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CaepContainerModule } from '../../container.module';
import { CaepTopbarComponent } from './topbar.component';

/**
 * `caep-topbar` is the application header bar. It renders as a `banner` landmark
 * and lays its content out into three regions — **left**, **center** and
 * **right**. It is a *service-driven* component: items are not passed as inputs
 * but registered with `CaepTopbarService`, most conveniently through the
 * `*caepTopbarItem` structural directive used for content projection in the
 * templates below. Each registered item declares its `position` (defaults to
 * `right`), an `order` within that region, and an optional `priority` used to
 * decide which items are dropped first when the bar runs out of horizontal
 * space (it measures the container with a `ResizeObserver` and only shows the
 * items that fit).
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The bar exposes a single `role="banner"` landmark. When a page contains more
 *   than one banner-type landmark, set `[ariaLabel]` so assistive technology can
 *   tell them apart (see the *With aria-label* story); leave it unset for the
 *   common single-header case.
 * - Interactive items should be real, focusable controls (native `<button>`) with
 *   a visible text label or, for icon-only actions, an `ariaLabel` on the item so
 *   the control has an accessible name (WCAG 4.1.2).
 */
const meta: Meta<CaepTopbarComponent & { itemClicked?: (e: MouseEvent) => void }> = {
  title: 'ng-components-extra/Topbar',
  component: CaepTopbarComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CaepContainerModule.forRoot({ stackFrameFactory: null, taskSlotFactory: null })],
    }),
  ],
  argTypes: {
    ariaLabel: {
      control: 'text',
      description: 'Optional accessible name for the banner landmark (set only when multiple banners exist).',
    },
    // Not a component @Output — a shared handler wired to the projected item
    // buttons so item activations show up in the Actions panel.
    itemClicked: { action: 'itemClicked' },
  },
  args: {
    ariaLabel: undefined,
  },
  render: (args) => ({
    props: { ...args },
    // A width-constrained wrapper gives the topbar's ResizeObserver a real width
    // to measure, so its fit/overflow logic can display the items.
    template: `
      <div style="width: 900px; max-width: 100%;">
        <caep-topbar [ariaLabel]="ariaLabel">
          <ng-template caepTopbarItem id="menu" position="left" [order]="0">
            <button style="background: transparent; border: 1px solid #fefefe; color: #fefefe; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin: 0 4px;" (click)="itemClicked($event)">Menu</button>
          </ng-template>
          <ng-template caepTopbarItem id="title" position="center" [order]="0">
            <span style="color: #fefefe; font-weight: 600;">Enterprise Platform</span>
          </ng-template>
          <ng-template caepTopbarItem id="search" position="right" [order]="0">
            <button style="background: transparent; border: 1px solid #fefefe; color: #fefefe; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin: 0 4px;" (click)="itemClicked($event)">Search</button>
          </ng-template>
          <ng-template caepTopbarItem id="profile" position="right" [order]="1">
            <button style="background: transparent; border: 1px solid #fefefe; color: #fefefe; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin: 0 4px;" (click)="itemClicked($event)">Profile</button>
          </ng-template>
        </caep-topbar>
      </div>
    `,
  }),
};
export default meta;

type Story = StoryObj<CaepTopbarComponent & { itemClicked?: (event: MouseEvent) => void }>;

/** A typical header: a left menu action, a centered title and right-aligned actions. */
export const Default: Story = {};

/**
 * One item in each region to make the three layout slots explicit: items are
 * distributed **left**, **center** and **right** according to their `position`.
 */
export const Positions: Story = {
  render: (args) => ({
    props: { ...args },
    template: `
      <div style="width: 900px; max-width: 100%;">
        <caep-topbar [ariaLabel]="ariaLabel">
          <ng-template caepTopbarItem id="left" position="left">
            <span style="color: #fefefe; font-weight: 600;">Left</span>
          </ng-template>
          <ng-template caepTopbarItem id="center" position="center">
            <span style="color: #fefefe; font-weight: 600;">Center</span>
          </ng-template>
          <ng-template caepTopbarItem id="right" position="right">
            <span style="color: #fefefe; font-weight: 600;">Right</span>
          </ng-template>
        </caep-topbar>
      </div>
    `,
  }),
};

/**
 * Items with no explicit `position` fall back to the **right** region (the
 * default). `order` controls their left-to-right sequence within it.
 */
export const RightAlignedActions: Story = {
  render: (args) => ({
    props: { ...args },
    template: `
      <div style="width: 900px; max-width: 100%;">
        <caep-topbar [ariaLabel]="ariaLabel">
          <ng-template caepTopbarItem id="notifications" [order]="0">
            <button style="background: transparent; border: 1px solid #fefefe; color: #fefefe; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin: 0 4px;" (click)="itemClicked($event)">Notifications</button>
          </ng-template>
          <ng-template caepTopbarItem id="settings" [order]="1">
            <button style="background: transparent; border: 1px solid #fefefe; color: #fefefe; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin: 0 4px;" (click)="itemClicked($event)">Settings</button>
          </ng-template>
          <ng-template caepTopbarItem id="account" [order]="2">
            <button style="background: transparent; border: 1px solid #fefefe; color: #fefefe; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin: 0 4px;" (click)="itemClicked($event)">Account</button>
          </ng-template>
        </caep-topbar>
      </div>
    `,
  }),
};

/**
 * The banner with an explicit accessible name via `[ariaLabel]` — use this only
 * when the page renders more than one banner-type landmark.
 */
export const WithAriaLabel: Story = {
  args: { ariaLabel: 'Primary header' },
  render: (args) => ({
    props: { ...args },
    template: `
      <div style="width: 900px; max-width: 100%;">
        <caep-topbar [ariaLabel]="ariaLabel">
          <ng-template caepTopbarItem id="title" position="left">
            <span style="color: #fefefe; font-weight: 600;">Enterprise Platform</span>
          </ng-template>
        </caep-topbar>
      </div>
    `,
  }),
};

/** Empty state: no registered items — the bar renders on its own. */
export const Empty: Story = {
  render: (args) => ({
    props: { ...args },
    template: `
      <div style="width: 900px; max-width: 100%;">
        <caep-topbar [ariaLabel]="ariaLabel"></caep-topbar>
      </div>
    `,
  }),
};
