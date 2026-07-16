import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CaepContainerModule } from '../../container.module';
import { CaepTopbarItemComponent } from './topbar-item.component';

/**
 * `caep-topbar-item` renders a single item of the application top bar. It takes a
 * `[model]` (`ICaepTopbarItem`) and, when no custom `templateRef` is provided,
 * delegates to `caep-topbar-button` to draw an icon-only button that runs
 * `model.handler` on click. The item's authorization/visibility is driven by
 * `model.enable` / `model.show` (and the component's own `enable`/`show` inputs,
 * inherited from the auth base component).
 *
 * The topbar button uses CSS custom properties (`--caep-topbar-height`,
 * `--caep-topbar-foreground`) that are normally supplied by the parent
 * `caep-topbar` / `caep-container`. The stories set those variables on a wrapper
 * so the item is visible standalone.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The rendered control is a native `<button>`, focusable and operable with
 *   Enter/Space, with a visible focus outline (`:focus-visible`).
 * - Because it is **icon-only** (the `<i>` glyph is `aria-hidden`), the model
 *   **must** provide `ariaLabel` (translated) or `ariaLabelledby` so assistive
 *   technology announces a meaningful name (WCAG 4.1.2). Every story below sets
 *   `ariaLabel`.
 * - The disabled state is conveyed via the native `disabled` attribute.
 */
const meta: Meta<CaepTopbarItemComponent & { icon?: string; ariaLabel?: string; handler?: (e: MouseEvent) => void }> = {
  title: 'ng-components-extra/TopbarItem',
  component: CaepTopbarItemComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CaepContainerModule.forRoot({ stackFrameFactory: null, taskSlotFactory: null })],
    }),
  ],
  argTypes: {
    show: { control: 'boolean', description: 'Whether the item is rendered (component input)' },
    icon: { control: 'text', description: 'Icon glyph name shown in the button (model.icon)' },
    ariaLabel: { control: 'text', description: 'Accessible name for the icon-only button (model.ariaLabel)' },
    enable: { control: 'boolean', description: 'Whether the button is enabled (model.enable)' },
    handler: { action: 'handler' },
  },
  args: {
    show: true,
    icon: 'settings',
    ariaLabel: 'Settings',
    enable: true,
  },
  render: (args) => {
    const a = args as any;
    return {
      props: {
        ...args,
        model: {
          id: 'demo',
          icon: a.icon,
          ariaLabel: a.ariaLabel,
          enable: a.enable,
          show: true,
          handler: (event: MouseEvent) => a.handler(event),
        },
      },
      template: `
        <div style="--caep-topbar-height: 48px; --caep-topbar-foreground: #1a1a1a; display: inline-flex;">
          <caep-topbar-item [model]="model" [show]="show"></caep-topbar-item>
        </div>
      `,
    };
  },
};
export default meta;

type Story = StoryObj<CaepTopbarItemComponent & { icon?: string; ariaLabel?: string }>;

/** Default enabled item rendered as an icon button. */
export const Default: Story = {};

/** A different icon, e.g. a notifications bell. */
export const NotificationsIcon: Story = {
  args: { icon: 'notification', ariaLabel: 'Notifications' },
};

/** Disabled item — the button is rendered but not interactive. */
export const Disabled: Story = {
  args: { icon: 'settings', ariaLabel: 'Settings', enable: false },
};

/** Hidden item — with `show = false` nothing is rendered. */
export const Hidden: Story = {
  args: { show: false },
};
