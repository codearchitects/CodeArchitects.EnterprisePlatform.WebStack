import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CaepComponentsModule } from '../components.module';
import { CaepFormControlComponent } from './form-control.component';

/**
 * `caep-form-control` is the dynamic form-control host. It binds to a `[model]`
 * object and a `[prop]` key and, reading the aspect metadata declared on that
 * model property, renders the matching control template at runtime (via the
 * inner `caep-template`). When a property carries no aspect metadata it falls
 * back to the `TEXT` template (`caep-text`), so a plain `{ field: value }`
 * model renders as a text input — which is what these stories show.
 *
 * The visible label/placeholder comes from `options.placeholder`; an explicit
 * `[label]` renders an associated `<label>` and wraps the control in a
 * `role="group"` with an `aria-label`.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The generated `<input>` is associated with its `<label>` via `for`/`id`.
 * - Validity is exposed via `aria-invalid` once the control is touched, and
 *   `aria-required` reflects a `required` validator.
 * - When no visible label is used, `options.placeholder`/`ariaLabel` provide
 *   the accessible name.
 */
const meta: Meta<CaepFormControlComponent<string>> = {
  title: 'ng-components-extra/FormControl',
  component: CaepFormControlComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [CaepComponentsModule] })],
  argTypes: {
    enable: { control: 'boolean', description: 'Enabled state (false → disabled)' },
    label: { control: 'text', description: 'Visible, associated label for the control' },
    valueChanges: { action: 'valueChanges' },
    focused: { action: 'focused' },
    blurred: { action: 'blurred' },
  },
  args: { enable: true, label: undefined },
  render: (args) => ({
    props: {
      ...args,
      model: (args as any).model ?? { field: (args as any).value ?? '' },
    },
    template: `
      <caep-form-control
        [model]="model"
        prop="field"
        [options]="options"
        [enable]="enable"
        [label]="label"
        (valueChanges)="valueChanges($event)"
        (focused)="focused($event)"
        (blurred)="blurred($event)"
      ></caep-form-control>
    `,
  }),
};
export default meta;

type Story = StoryObj<CaepFormControlComponent<string> & { value?: string; model?: any }>;

/** Empty field with a floating placeholder label (falls back to the TEXT template). */
export const Default: Story = {
  args: { options: { placeholder: 'Full name' } as any },
};

/** Pre-filled value. */
export const WithValue: Story = {
  args: { options: { placeholder: 'Full name' } as any, value: 'Ada Lovelace' },
};

/** Explicit associated `<label>`, wrapping the control in a labelled `role="group"`. */
export const WithLabel: Story = {
  args: { label: 'Full name', value: 'Ada Lovelace', options: {} as any },
};

/** Read-only field. */
export const Readonly: Story = {
  args: { options: { placeholder: 'Full name', isReadonly: true } as any, value: 'Ada Lovelace' },
};

/** Disabled field (`enable = false`). */
export const Disabled: Story = {
  args: { options: { placeholder: 'Full name' } as any, value: 'Ada Lovelace', enable: false },
};

/** Password input, driven via `options.type`. */
export const Password: Story = {
  args: { options: { placeholder: 'Password', type: 'password' } as any },
};
