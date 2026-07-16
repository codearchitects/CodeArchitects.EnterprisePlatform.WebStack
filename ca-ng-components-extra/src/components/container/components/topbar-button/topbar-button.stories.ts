import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CaepContainerModule } from '../../container.module';
import { ICaepTopbarItem } from '../../models';
import { CaepTopbarButtonComponent } from './topbar-button.component';

/**
 * `caep-topbar-button` is the default icon action rendered inside the container
 * top-bar. It is driven by a single `[model]` (`ICaepTopbarItem`): the icon glyph
 * comes from `model.icon`, the accessible name from `model.ariaLabel` (translated)
 * or `model.ariaLabelledby`, and clicking it invokes `model.handler`. The `[enable]`
 * input toggles the native `disabled` state.
 *
 * The button consumes the `--caep-topbar-*` theming variables normally provided by
 * the parent top-bar (near-white foreground on a dark bar), so these stories render
 * it inside a dark wrapper that supplies those variables and its height.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - Renders a native `<button>`, so it is focusable and operable with Enter/Space.
 * - Icon-only: it **must** carry an accessible name — set `model.ariaLabel`
 *   (translated) or `model.ariaLabelledby`; the icon itself is decorative
 *   (`aria-hidden="true"`).
 * - Disabled state uses the native `disabled` attribute.
 * - A visible `:focus-visible` outline (`currentColor`) is provided by the styles.
 */
const meta: Meta<CaepTopbarButtonComponent & { icon?: string; ariaLabel?: string; handler?: (e: MouseEvent) => void }> = {
  title: 'ng-components-extra/TopbarButton',
  component: CaepTopbarButtonComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CaepContainerModule.forRoot({ stackFrameFactory: null, taskSlotFactory: null })],
    }),
  ],
  argTypes: {
    enable: { control: 'boolean', description: 'Enabled state (false → native disabled)' },
    icon: { control: 'text', description: 'Icon glyph name (mapped to `model.icon`)' },
    ariaLabel: { control: 'text', description: 'Accessible name (mapped to `model.ariaLabel`)' },
    handler: { action: 'handler', description: 'Invoked when the button is clicked' },
  },
  args: {
    enable: true,
    icon: 'bell',
    ariaLabel: 'Notifications',
  },
  render: (args) => {
    const { icon, ariaLabel, handler } = args as any;
    const model: ICaepTopbarItem = { icon, ariaLabel, handler };
    return {
      props: { ...args, model },
      template: `
        <div style="display:inline-flex; background:#2f3e4b; --caep-topbar-foreground:#fefefe; --caep-topbar-height:44px; padding:0 8px;">
          <caep-topbar-button [model]="model" [enable]="enable"></caep-topbar-button>
        </div>
      `,
    };
  },
};
export default meta;

type Story = StoryObj<CaepTopbarButtonComponent & { icon?: string; ariaLabel?: string; handler?: (e: MouseEvent) => void }>;

/** Default icon action with an accessible label. */
export const Default: Story = {};

/** A different action (e.g. opening settings). */
export const Settings: Story = {
  args: { icon: 'settings', ariaLabel: 'Settings' },
};

/** User/account action. */
export const Account: Story = {
  args: { icon: 'user', ariaLabel: 'Account' },
};

/** Disabled action (`enable = false`) — rendered with the native `disabled` attribute. */
export const Disabled: Story = {
  args: { icon: 'bell', ariaLabel: 'Notifications', enable: false },
};
