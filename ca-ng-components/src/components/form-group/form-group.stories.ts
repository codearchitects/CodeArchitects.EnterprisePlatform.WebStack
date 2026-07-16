import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShFormGroupComponent } from './form-group.component';

/**
 * `sh-form-group` is a **structural container** that groups a set of
 * form-control components together and applies group-level validation. It
 * binds to a `[model]` object (or a `[prop]` on a `[parent]`), creates a form
 * group via the form handler, projects the grouped controls through
 * `<ng-content>`, and renders a shared `sh-validation-message` for the group.
 *
 * It has no visual chrome of its own — you wrap the controls that belong to
 * the group inside it.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The wrapper renders `role="group"`; give it an accessible name via
 *   `options.ariaLabel` (or `options.ariaLabelledBy`) so assistive technology
 *   announces the purpose of the grouped fields (WCAG 1.3.1 / 4.1.2).
 * - `options.ariaDescribedBy` links the group to descriptive text when needed.
 * - Group-level validation messages are surfaced by the nested
 *   `sh-validation-message`.
 */
const meta: Meta<ShFormGroupComponent<any, any>> = {
  title: 'ng-components/FormGroup',
  component: ShFormGroupComponent,
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
      model: (args as any).model ?? { firstName: '', lastName: '' },
    },
    template: `
      <sh-form-group [model]="model" [options]="options" [enable]="enable" [show]="show">
        <sh-text [model]="model" prop="firstName" [options]="{ placeholder: 'First name' }" [enable]="enable"></sh-text>
        <sh-text [model]="model" prop="lastName" [options]="{ placeholder: 'Last name' }" [enable]="enable"></sh-text>
      </sh-form-group>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShFormGroupComponent<any, any> & { model?: any }>;

/**
 * A group wrapping two text controls. The group is given an accessible name
 * through `options.ariaLabel`.
 */
export const Default: Story = {
  args: { options: { ariaLabel: 'Full name' } as any },
};

/** Group with pre-filled values in the grouped controls. */
export const WithValues: Story = {
  args: {
    options: { ariaLabel: 'Full name' } as any,
    model: { firstName: 'Ada', lastName: 'Lovelace' },
  },
};

/** Disabled group — the grouped controls are rendered but not editable. */
export const Disabled: Story = {
  args: {
    options: { ariaLabel: 'Full name' } as any,
    model: { firstName: 'Ada', lastName: 'Lovelace' },
    enable: false,
  },
};
