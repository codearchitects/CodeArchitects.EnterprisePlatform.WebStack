import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShBreadcrumbComponent, type IShBreadcrumbActivity } from './breadcrumb.component';
import type { IShBreadcrumbStackFrame } from './interface';

/**
 * `sh-breadcrumb` renders the current navigation trail from an application
 * `activity`. It reads `activity.CurrentPayload.stack` (an array of
 * `IShBreadcrumbStackFrame`), always prefixes a **HOME** entry (linked to `/`),
 * then one entry per non-return-point frame separated by `/` dividers. Each
 * frame's visible text is `frame.label`, falling back to `frame.action[0]` when
 * `[hasFallback]` is `true` and no label is set. Clicking a frame truncates the
 * navigation stack back to that point (`actualize`) and routes via the
 * `breadcrumb` pipe (`frame.application/domain/scenario/action`).
 *
 * The design-system styling paints the trail with white/near-white tokens meant
 * for a **dark header background**, so these stories wrap the component in a
 * dark container to reproduce its intended appearance (and keep text contrast
 * within AA).
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - Uses the WAI-ARIA APG breadcrumb pattern: `<nav aria-label="breadcrumb">`
 *   wrapping an `<ol>`; the current page carries `aria-current="page"` (the
 *   HOME entry when the stack is empty, otherwise the last visible frame).
 * - Trail items are `role="link"` spans; Enter/Space activate them via
 *   `onActivateKey` (WCAG 2.1.1 keyboard operability), and they are focusable
 *   through `options.tabindex`.
 * - The `/` dividers are decorative (`aria-hidden="true"`).
 */
const meta: Meta<ShBreadcrumbComponent> = {
  title: 'ng-components/Breadcrumb',
  component: ShBreadcrumbComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    hasFallback: {
      control: 'boolean',
      description: "Show the frame's action name when it has no label",
    },
    enable: { control: 'boolean', description: 'Enabled state' },
    show: { control: 'boolean', description: 'Whether the control is rendered' },
    activity: { control: 'object', description: 'Application activity holding the navigation stack' },
  },
  args: {
    hasFallback: true,
    enable: true,
    show: true,
  },
  render: (args) => ({
    props: { ...args },
    // Rendered on a dark surface: the breadcrumb tokens are white-on-dark,
    // matching the shell header where the component lives.
    template: `
      <div style="background:#2b2f36; padding:12px 16px; border-radius:4px; display:inline-block;">
        <sh-breadcrumb
          [activity]="activity"
          [hasFallback]="hasFallback"
          [enable]="enable"
          [show]="show"
        ></sh-breadcrumb>
      </div>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShBreadcrumbComponent>;

/** Helper: a fully-formed navigable frame (all route segments are arrays, as
 * the `breadcrumb` pipe spreads them). */
function frame(label: string, action: string[], extra: Partial<IShBreadcrumbStackFrame> = {}): IShBreadcrumbStackFrame {
  return { label, application: [], domain: [], scenario: [], action, ...extra };
}

function activity(stack: IShBreadcrumbStackFrame[]): IShBreadcrumbActivity {
  return { CurrentPayload: { stack } };
}

/** A typical two-level trail: HOME / Orders / Order 1042 (the last item is the
 * current page and is marked `aria-current="page"`). */
export const Default: Story = {
  args: {
    activity: activity([
      frame('Orders', ['orders']),
      frame('Order 1042', ['orders', 'detail']),
    ]),
  },
};

/** No frames on the stack, so **HOME** is itself the current page and carries
 * `aria-current="page"` (nothing is navigable). */
export const HomeOnly: Story = {
  args: {
    activity: activity([]),
  },
};

/** A deep trail exercising several intermediate links plus the current page. */
export const DeepTrail: Story = {
  args: {
    activity: activity([
      frame('Sales', ['sales']),
      frame('Customers', ['sales', 'customers']),
      frame('Acme Corp', ['sales', 'customers', 'acme']),
      frame('Invoices', ['sales', 'customers', 'acme', 'invoices']),
      frame('INV-2026-07', ['sales', 'customers', 'acme', 'invoices', 'detail']),
    ]),
  },
};

/** Frame without a `label`: with `[hasFallback]="true"` the trail shows the
 * first `action` segment instead of an empty entry. */
export const ActionFallback: Story = {
  args: {
    hasFallback: true,
    activity: activity([
      frame('Reports', ['reports']),
      { application: [], domain: [], scenario: [], action: ['analytics'] }, // no label
    ]),
  },
};

/** Return-point frames are skipped: the middle frame (`isReturnPoint`) is not
 * rendered, so the visible trail is HOME / Orders / Order 1042. */
export const ReturnPointSkipped: Story = {
  args: {
    activity: activity([
      frame('Orders', ['orders']),
      frame('(internal step)', ['orders', 'step'], { isReturnPoint: true }),
      frame('Order 1042', ['orders', 'detail']),
    ]),
  },
};
