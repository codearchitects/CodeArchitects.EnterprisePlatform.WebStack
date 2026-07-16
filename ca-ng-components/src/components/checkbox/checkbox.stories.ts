import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShCheckboxComponent } from './checkbox.component';

/**
 * `sh-checkbox` is a boolean form control. It binds to a `[model]` object and a
 * `[prop]` key (the form handler creates the underlying form control), and the
 * text shown next to the box comes from `options.label`. Clicking the control or
 * pressing Enter/Space toggles the value.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The native `<input type="checkbox">` is labelled: when `options.label` is set
 *   the input is `aria-labelledby` the label span; otherwise it falls back to
 *   `aria-label`. Always provide one so the control has an accessible name.
 * - Operable with Enter/Space (see `onKey`) in addition to click.
 * - `aria-readonly` / `readonly` and the native `disabled` attribute convey state.
 */
const meta: Meta<ShCheckboxComponent> = {
  title: 'ng-components/Checkbox',
  component: ShCheckboxComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    enable: { control: 'boolean' },
  },
  args: { enable: true },
  render: (args) => ({
    props: {
      ...args,
      model: (args as any).model ?? { field: (args as any).value ?? false },
    },
    template: `
      <sh-checkbox [model]="model" prop="field" [options]="options" [enable]="enable"></sh-checkbox>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShCheckboxComponent & { value?: boolean; model?: any }>;

/** Unchecked checkbox with a label. */
export const Default: Story = {
  args: { options: { label: 'Accept terms and conditions' } as any },
};

/** Checked checkbox. */
export const Checked: Story = {
  args: { options: { label: 'Subscribe to newsletter' } as any, value: true },
};

/** Read-only checkbox (value cannot be toggled). */
export const Readonly: Story = {
  args: { options: { label: 'Read-only option', isReadonly: true } as any, value: true },
};

/** Disabled checkbox (`enable = false`). */
export const Disabled: Story = {
  args: { options: { label: 'Disabled option' } as any, value: true, enable: false },
};

/**
 * Checkbox without a visible label. `options.ariaLabel` **must** be set so
 * assistive technology announces a meaningful name (WCAG 4.1.2).
 */
export const NoLabel: Story = {
  args: { options: { ariaLabel: 'Select row' } as any },
};
