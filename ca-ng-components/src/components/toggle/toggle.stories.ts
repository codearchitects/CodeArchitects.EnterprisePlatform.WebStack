import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShToggleComponent } from './toggle.component';

/**
 * `sh-toggle` is a boolean form control rendered as an on/off switch. Like every
 * form control it binds to a `[model]` object and a `[prop]` key (the form
 * handler creates the underlying boolean form control); the optional visible
 * text beside the switch comes from `options.label`.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The interactive element exposes `role="switch"` with `aria-checked`
 *   reflecting the current value, and is keyboard-operable (Enter/Space toggle).
 * - When `options.label` is set, the switch is linked to the visible label via
 *   `aria-labelledby`; otherwise provide `options.ariaLabel` for an accessible
 *   name.
 * - `readonly`/disabled states are exposed via `aria-readonly` / `aria-disabled`.
 */
const meta: Meta<ShToggleComponent> = {
  title: 'ng-components/Toggle',
  component: ShToggleComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    enable: { control: 'boolean', description: 'Enabled state (false → disabled)' },
    show: { control: 'boolean', description: 'Whether the control is rendered' },
  },
  args: { enable: true, show: true },
  render: (args) => ({
    props: {
      ...args,
      model: (args as any).model ?? { field: (args as any).value ?? false },
    },
    template: `
      <sh-toggle [model]="model" prop="field" [options]="options" [enable]="enable" [show]="show"></sh-toggle>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShToggleComponent & { value?: boolean; model?: any }>;

/** Off by default, with a visible label. */
export const Default: Story = {
  args: { options: { label: 'Enable notifications' } as any, value: false },
};

/** Switched on. */
export const Checked: Story = {
  args: { options: { label: 'Enable notifications' } as any, value: true },
};

/** No visible label — an `ariaLabel` supplies the accessible name (WCAG 4.1.2). */
export const NoLabel: Story = {
  args: { options: { ariaLabel: 'Enable notifications' } as any, value: true },
};

/** Read-only switch: reflects a value but cannot be toggled. */
export const Readonly: Story = {
  args: { options: { label: 'Feature flag', isReadonly: true } as any, value: true },
};

/** Disabled switch (`enable = false`). */
export const Disabled: Story = {
  args: { options: { label: 'Enable notifications' } as any, value: true, enable: false },
};
