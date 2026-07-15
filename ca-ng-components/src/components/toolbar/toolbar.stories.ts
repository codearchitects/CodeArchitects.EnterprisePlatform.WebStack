import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { IShBreadcrumbActivity } from '../breadcrumb/breadcrumb.component';
import type { IShBreadcrumbStackFrame } from '../breadcrumb/interface';
import { ShToolbarComponent } from './toolbar.component';

/**
 * Builds a fully-formed navigable breadcrumb frame. The route-segment arrays
 * (`application/domain/scenario/action`) are required because the `breadcrumb`
 * pipe spreads them to compute the `routerLink`; omitting them makes the pipe
 * throw on `...undefined`.
 */
function frame(
  label: string,
  action: string[],
  extra: Partial<IShBreadcrumbStackFrame> = {},
): IShBreadcrumbStackFrame {
  return { label, application: [], domain: [], scenario: [], action, ...extra };
}

/** A realistic multi-frame navigation activity for the breadcrumb + back button. */
const activity: IShBreadcrumbActivity = {
  CurrentPayload: {
    stack: [
      frame('Home', ['home'], { isReturnPoint: true }),
      frame('Orders', ['orders']),
      frame('Order #1024', ['orders', 'detail']),
    ],
  },
};

/** Single-frame activity: the back button renders but stays disabled (stack length ≤ 1). */
const rootActivity: IShBreadcrumbActivity = {
  CurrentPayload: { stack: [frame('Home', ['home'])] },
};

/**
 * `sh-toolbar` is a presentational container that lays out the application
 * navigation chrome: an optional back button, a breadcrumb trail, an optional
 * language selector, and any consumer content projected via `<ng-content>` into
 * the right-hand `.content` area.
 *
 * Each region is toggled independently with `[showBackButton]`,
 * `[showBreadcrumb]` and `[showLangControl]`; the breadcrumb and back button are
 * driven by the `[activity]` navigation stack, and `(return)` fires when the
 * back button is clicked.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The host exposes `role="toolbar"` and carries an accessible name via
 *   `aria-label` (a localized *"toolbar"* default, overridable through
 *   `options.ariaLabel`, or `options.ariaLabelledBy` to point at an external
 *   label). (WCAG 4.1.2)
 * - The projected controls (back button, breadcrumb links, language select) are
 *   native focusable elements, so they remain individually tabbable. (WCAG 2.1.1)
 * - The back button is disabled (native `disabled`) when there is nowhere to
 *   navigate back to.
 */
const meta: Meta<ShToolbarComponent> = {
  title: 'ng-components/Toolbar',
  component: ShToolbarComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    showBackButton: { control: 'boolean', description: 'Show the back-navigation button' },
    showBreadcrumb: { control: 'boolean', description: 'Show the breadcrumb trail' },
    showLangControl: { control: 'boolean', description: 'Show the language selector' },
    return: { action: 'return' },
  },
  args: {
    showBackButton: true,
    showBreadcrumb: true,
    showLangControl: true,
  },
  render: (args) => ({
    props: { ...args, activity: (args as any).activity ?? activity },
    template: `
      <sh-toolbar
        [showBackButton]="showBackButton"
        [showBreadcrumb]="showBreadcrumb"
        [showLangControl]="showLangControl"
        [activity]="activity"
        [options]="options"
        (return)="return($event)"
      >
        <sh-button icon="save" [primary]="true">Save</sh-button>
      </sh-toolbar>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShToolbarComponent & { activity?: IShBreadcrumbActivity }>;

/**
 * Full toolbar: back button (enabled — the stack has more than one frame),
 * breadcrumb trail, a projected *Save* action and the language selector.
 */
export const Default: Story = {};

/**
 * At the navigation root: the back button is rendered but disabled because
 * there is only one frame on the stack, and the breadcrumb shows a single crumb.
 */
export const AtRoot: Story = {
  args: { activity: rootActivity },
};

/** Breadcrumb only — no back button and no language selector. */
export const BreadcrumbOnly: Story = {
  args: { showBackButton: false, showLangControl: false },
};

/** Language selector hidden (e.g. single-language apps). */
export const WithoutLanguageControl: Story = {
  args: { showLangControl: false },
};

/**
 * Minimal chrome: every built-in region hidden, leaving just the projected
 * content. Useful when a screen only needs a custom action area.
 */
export const ContentOnly: Story = {
  args: { showBackButton: false, showBreadcrumb: false, showLangControl: false },
};

/**
 * Custom accessible name for the toolbar landmark via `options.ariaLabel`,
 * overriding the localized default. (WCAG 4.1.2)
 */
export const CustomAriaLabel: Story = {
  args: { options: { ariaLabel: 'Primary navigation' } as any },
};
