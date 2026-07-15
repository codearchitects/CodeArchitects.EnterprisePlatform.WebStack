import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShNumberComponent } from './number.component';

/**
 * `sh-number` is a numeric input form control. Like every form control in the
 * library it binds to a `[model]` object and a `[prop]` key, while the visible
 * label / placeholder comes from `options.placeholder`. It extends
 * `ShBaseFormattedComponent`, so `options.format` drives the display formatting
 * (numeral.js pattern, default `'0,0'`) and `min` / `max` / `step` constrain the
 * value. Arrow Up / Arrow Down increment / decrement by `step`.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The `<input>` is associated with its `<label>` via `for`/`id`.
 * - Validation state is exposed with `aria-invalid` and linked to the error via
 *   `aria-describedby` when the control is invalid and touched.
 * - Value can be adjusted from the keyboard (Arrow Up / Arrow Down).
 */
const meta: Meta<ShNumberComponent<any>> = {
  title: 'ng-components/Number',
  component: ShNumberComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    enable: { control: 'boolean', description: 'Enabled state (false → disabled)' },
    icon: { control: 'text', description: 'Optional leading icon name' },
  },
  args: { enable: true },
  render: (args) => ({
    props: {
      ...args,
      model: (args as any).model ?? { field: (args as any).value ?? undefined },
    },
    template: `
      <sh-number [model]="model" prop="field" [options]="options" [enable]="enable" [icon]="icon"></sh-number>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShNumberComponent<any> & { value?: number; model?: any }>;

/** Empty field with a floating placeholder label. */
export const Default: Story = {
  args: { options: { placeholder: 'Quantity' } as any },
};

/** Pre-filled value, formatted with thousands separators (default `'0,0'`). */
export const WithValue: Story = {
  args: { options: { placeholder: 'Quantity' } as any, value: 12500 },
};

/** Two decimal places via a custom numeral format. */
export const Decimal: Story = {
  args: { options: { placeholder: 'Amount', format: '0,0.00' } as any, value: 1234.5 },
};

/**
 * Bounded control with `min`, `max` and a larger `step` — Arrow Up / Arrow Down
 * move by `step` and the value is clamped to the range.
 */
export const MinMaxStep: Story = {
  args: { options: { placeholder: 'Rating (0–10)', min: 0, max: 10, step: 2 } as any, value: 4 },
};

/** Read-only field. */
export const Readonly: Story = {
  args: { options: { placeholder: 'Quantity', isReadonly: true } as any, value: 12500 },
};

/** Disabled field (`enable = false`). */
export const Disabled: Story = {
  args: { options: { placeholder: 'Quantity' } as any, value: 12500, enable: false },
};

/** Field with a leading icon. */
export const WithIcon: Story = {
  args: { options: { placeholder: 'Price' } as any, icon: 'money', value: 99 },
};
