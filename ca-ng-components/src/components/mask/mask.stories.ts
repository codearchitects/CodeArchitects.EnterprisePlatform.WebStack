import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShMaskComponent } from './mask.component';

/**
 * `sh-mask` is a masked text input form control. It extends `sh-text`
 * (`ShTextComponent`) and layers an input mask on top via the ngx-mask
 * directive (provided by `ShComponentsModule`). Like every form control here it
 * binds to a `[model]` object and a `[prop]` key, and the visible label /
 * placeholder comes from `options.placeholder`. The mask pattern and its
 * behaviour (prefix/suffix, special characters, dropping them from the model,
 * showing the mask while typing, …) are all driven from `options`.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The `<input>` is associated with its `<label>` via `for`/`id`.
 * - Validation state is exposed with `aria-invalid` and linked to the error
 *   text via `aria-describedby` when the field is invalid and touched.
 * - The mask placeholder characters (e.g. `_`) are purely visual formatting
 *   hints inside the native input; the accessible name is still the `<label>`.
 */
const meta: Meta<ShMaskComponent> = {
  title: 'ng-components/Mask',
  component: ShMaskComponent,
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
      <sh-mask [model]="model" prop="field" [options]="options" [enable]="enable" [icon]="icon"></sh-mask>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShMaskComponent & { value?: string; model?: any }>;

/** Basic date mask (`dd/MM/yyyy`) with a floating placeholder label. */
export const Default: Story = {
  args: { options: { placeholder: 'Date of birth', mask: '00/00/0000' } as any },
};

/** Pre-filled masked value. */
export const WithValue: Story = {
  args: {
    options: { placeholder: 'Date of birth', mask: '00/00/0000' } as any,
    value: '31/12/1990',
  },
};

/** The mask pattern is shown while typing, using `_` as the placeholder character. */
export const ShowMaskTyped: Story = {
  args: {
    options: {
      placeholder: 'Date of birth',
      mask: '00/00/0000',
      showMaskTyped: true,
    } as any,
  },
};

/** Phone number with a country-code prefix. */
export const WithPrefix: Story = {
  args: {
    options: {
      placeholder: 'Phone number',
      mask: '000 000 0000',
      prefix: '+39 ',
    } as any,
  },
};

/** Currency-style mask with a suffix and a leading icon. */
export const WithSuffixAndIcon: Story = {
  args: {
    options: {
      placeholder: 'Amount',
      mask: 'separator.2',
      suffix: ' €',
    } as any,
    icon: 'euro',
  },
};

/** Read-only masked field. */
export const Readonly: Story = {
  args: {
    options: { placeholder: 'Date of birth', mask: '00/00/0000', isReadonly: true } as any,
    value: '31/12/1990',
  },
};

/** Disabled field (`enable = false`). */
export const Disabled: Story = {
  args: {
    options: { placeholder: 'Date of birth', mask: '00/00/0000' } as any,
    value: '31/12/1990',
    enable: false,
  },
};
