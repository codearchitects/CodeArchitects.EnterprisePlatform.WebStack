import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShTextComponent } from './text.component';

/**
 * `sh-text` is a text input form control. It binds to a `[model]` object and a
 * `[prop]` key (the form handler creates the underlying form control), and the
 * visible label / placeholder comes from `options.placeholder`.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The `<input>` is associated with its `<label>` via `for`/`id`.
 * - Validation errors are announced (`role="alert"`) and linked via
 *   `aria-invalid` + `aria-describedby` (see the *Invalid* story).
 *
 * This is the reference story for **form-control** components; copy this wiring
 * (model/prop + providers) for select, number, checkbox, etc.
 */
const meta: Meta<ShTextComponent> = {
  title: 'ng-components/Text',
  component: ShTextComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    enable: { control: 'boolean' },
    icon: { control: 'text' },
  },
  args: { enable: true },
  render: (args) => ({
    props: {
      ...args,
      model: (args as any).model ?? { field: (args as any).value ?? '' },
    },
    template: `
      <sh-text [model]="model" prop="field" [options]="options" [enable]="enable" [icon]="icon"></sh-text>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShTextComponent & { value?: string; model?: any }>;

/** Empty field with a floating placeholder label. */
export const Default: Story = {
  args: { options: { placeholder: 'Full name' } as any },
};

/** Pre-filled value. */
export const WithValue: Story = {
  args: { options: { placeholder: 'Full name' } as any, value: 'Ada Lovelace' },
};

/** Read-only field. */
export const Readonly: Story = {
  args: { options: { placeholder: 'Full name', isReadonly: true } as any, value: 'Ada Lovelace' },
};

/** Disabled field. */
export const Disabled: Story = {
  args: { options: { placeholder: 'Full name' } as any, value: 'Ada Lovelace', enable: false },
};

/** Field with a leading icon. */
export const WithIcon: Story = {
  args: { options: { placeholder: 'Search' } as any, icon: 'search' },
};

/** Password input. */
export const Password: Story = {
  args: { options: { placeholder: 'Password', type: 'password' } as any },
};
