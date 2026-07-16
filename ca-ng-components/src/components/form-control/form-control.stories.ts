import { Validators } from '@angular/forms';
import { Aspect, Validation } from '@ca-webstack/ng-aspects';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShFormControlComponent } from './form-control.component';

/**
 * `sh-form-control` is a **dynamic** form control: it reads the `@Aspect`
 * metadata of the bound `[model]`/`[prop]` and renders the matching template
 * (text, number, textarea, toggle, …) together with its `sh-label` and
 * `sh-validation-message`.
 *
 * The idiomatic way to drive it — and what these stories use — is a plain model
 * **class** whose properties are decorated with `@Aspect` (which template + label
 * to render) and, optionally, `@Validation` (validators). Each story binds a
 * different property of the same `DemoModel`, so the different `template` values
 * produce genuinely different controls.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - Delegates to the concrete template component, so the underlying control is
 *   associated with its `<label>` and validation errors are announced
 *   (`role="alert"`, `aria-invalid`, `aria-describedby`).
 * - One visible name per field: the `@Aspect` label drives the control's
 *   floating placeholder, so the wrapper `sh-label` is hidden with
 *   `options.label: false` to avoid printing the name twice.
 */

/**
 * Example model: each property declares, via `@Aspect`, which template and label
 * the dynamic form-control should render. `email` also carries a `required`
 * `@Validation` to demonstrate error handling.
 */
class DemoModel {
  @Aspect({ default: { label: 'Full name', template: 'TEXT' } })
  fullName = 'Ada Lovelace';

  @Aspect({ default: { label: 'Quantity', template: 'NUMBER' } })
  quantity = 42;

  @Aspect({ default: { label: 'Notes', template: 'TEXTAREA' } })
  notes = 'Some longer notes about this record…';

  @Aspect({ default: { label: 'Active', template: 'TOGGLE' } })
  active = true;

  @Validation({ validator: Validators.required, message: 'Email is required' })
  @Aspect({ default: { label: 'Email (required)', template: 'TEXT' } })
  email = '';
}

// A fresh model per story — the form handler binds/mutates the instance.
const model = () => new DemoModel();

const meta: Meta<ShFormControlComponent<any>> = {
  title: 'ng-components/FormControl',
  component: ShFormControlComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    enable: { control: 'boolean', description: 'Enabled state (false → disabled)' },
    show: { control: 'boolean', description: 'Whether the control is rendered' },
    valueChanges: { action: 'valueChanges' },
  },
  args: { enable: true, show: true },
  render: (args) => ({
    props: { ...args },
    template: `
      <sh-form-control
        [model]="model"
        [prop]="prop"
        [options]="options"
        [enable]="enable"
        [show]="show"
        (valueChanges)="valueChanges($event)"
      ></sh-form-control>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShFormControlComponent<any> & { model?: any; prop?: string }>;

/** Text template, resolved from the model's `@Aspect`. */
export const Text: Story = {
  args: { model: model(), prop: 'fullName', options: { label: false } as any },
};

/** Numeric template. */
export const Number: Story = {
  args: { model: model(), prop: 'quantity', options: { label: false } as any },
};

/** Multi-line (textarea) template. */
export const Textarea: Story = {
  args: { model: model(), prop: 'notes', options: { label: false } as any },
};

/** Boolean toggle template. */
export const Toggle: Story = {
  args: { model: model(), prop: 'active' },
};

/** Text field with a `required` `@Validation` — shows the validation wiring. */
export const Required: Story = {
  args: { model: model(), prop: 'email', options: { label: false } as any },
};

/** Disabled control (`enable = false`). */
export const Disabled: Story = {
  args: { model: model(), prop: 'fullName', options: { label: false } as any, enable: false },
};

/** Read-only field via `options.isReadonly`. */
export const Readonly: Story = {
  args: { model: model(), prop: 'fullName', options: { label: false, isReadonly: true } as any },
};
