import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShFormComponent } from './form.component';

/**
 * `sh-form` is a **container** that groups form-control components (`sh-text`,
 * `sh-select`, `sh-number`, …) into a single validation unit. It binds to a
 * `[model]` object (or a `[parent]`/`[prop]` pair), asks the form-handler to
 * build a `ShFormGroup` from it, and projects the actual controls via
 * `<ng-content>`. It also renders an `<sh-validation-message>` for the group.
 *
 * The child controls bind the *same* `[model]` and their own `prop` keys, so
 * the form aggregates their validity. Nothing renders until a form group has
 * been created (`show && formGroup`).
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - Renders a `<div role="group">` so assistive tech treats the fields as one
 *   named group; the name comes from `options.ariaLabel` /
 *   `options.ariaLabelledBy` (and `options.ariaDescribedBy` for help text).
 *   The *Default* story sets `ariaLabel` so the group is announced.
 * - Validation errors are surfaced through the projected
 *   `<sh-validation-message>` and the controls' own `aria-invalid` wiring.
 */
const meta: Meta<ShFormComponent<any, any>> = {
  title: 'ng-components/Form',
  component: ShFormComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    enable: { control: 'boolean', description: 'Enabled state of the group' },
    show: { control: 'boolean', description: 'Whether the group is rendered' },
  },
  args: { enable: true, show: true },
  render: (args) => ({
    props: {
      ...args,
      model: (args as any).model ?? { firstName: '', lastName: '', email: '' },
      options: (args as any).options ?? { ariaLabel: 'Contact details' },
    },
    template: `
      <sh-form [model]="model" [options]="options" [enable]="enable" [show]="show">
        <sh-text [model]="model" prop="firstName" [options]="{ placeholder: 'First name' }" [enable]="enable"></sh-text>
        <sh-text [model]="model" prop="lastName" [options]="{ placeholder: 'Last name' }" [enable]="enable"></sh-text>
        <sh-text [model]="model" prop="email" [options]="{ placeholder: 'Email' }" [enable]="enable"></sh-text>
      </sh-form>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShFormComponent<any, any> & { model?: any }>;

/** Empty form with three projected text controls, grouped under one aria label. */
export const Default: Story = {};

/** Form pre-filled with a model, showing how child controls read from `[model]`. */
export const WithValues: Story = {
  args: {
    model: { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' },
  },
};

/** Disabled form — the `enable = false` flag cascades to the projected fields. */
export const Disabled: Story = {
  args: {
    enable: false,
    model: { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' },
  },
};
