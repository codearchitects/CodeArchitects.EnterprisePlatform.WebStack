import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShFormArrayComponent } from './form-array.component';

/**
 * `sh-form-array` renders a **list of templated form controls**: it binds to an
 * array `[model]` and repeats the projected `<ng-template>` once per item,
 * wiring each rendered control set into the shared form group so validation is
 * tracked for the whole collection. It extends `sh-form-group` (a form
 * container) and is not a stand-alone input — you supply the per-item UI as
 * content via a single `<ng-template let-item>`.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The component itself renders no interactive element; accessibility is driven
 *   by the child controls projected into the template (labels, `for`/`id`
 *   associations, error announcements are handled by those controls).
 * - Each projected control should still carry its own visible/associated label
 *   (via `options.placeholder`) so every row is individually identifiable.
 */
const meta: Meta<ShFormArrayComponent<any, any>> = {
  title: 'ng-components/FormArray',
  component: ShFormArrayComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    enable: { control: 'boolean', description: 'Enabled state of the group' },
    show: { control: 'boolean', description: 'Whether the array is rendered' },
  },
  args: { enable: true, show: true },
  render: (args) => ({
    props: {
      ...args,
      model: (args as any).model ?? [{ name: '' }],
    },
    template: `
      <sh-form-array [model]="model" [options]="options" [enable]="enable" [show]="show">
        <ng-template let-item>
          <sh-text [model]="item" prop="name" [options]="{ placeholder: 'Item name' }"></sh-text>
        </ng-template>
      </sh-form-array>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShFormArrayComponent<any, any> & { model?: any[] }>;

/** A list of pre-filled templated rows, each an `sh-text` control. */
export const Default: Story = {
  args: {
    model: [{ name: 'Ada Lovelace' }, { name: 'Grace Hopper' }, { name: 'Alan Turing' }],
  },
};

/** A single empty row (the default when no model is supplied). */
export const SingleRow: Story = {
  args: { model: [{ name: '' }] },
};

/** An empty collection renders the container with no rows. */
export const Empty: Story = {
  args: { model: [] },
};

/** Disabled group: every projected control is rendered read-only/disabled. */
export const Disabled: Story = {
  args: {
    model: [{ name: 'Ada Lovelace' }, { name: 'Grace Hopper' }],
    enable: false,
  },
};
