import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShLabelComponent } from './label.component';

/**
 * `sh-label` renders a design-system `<label>` for a form field. Like the other
 * form controls it binds to a `[model]` object and a `[prop]` key; the label
 * text is resolved from the field metadata via the aspect helper, or overridden
 * explicitly with `options.label`. Extra CSS classes can be applied through
 * `options.labelClass`. When `label` resolves to `false` the element is not
 * rendered at all.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - Renders a native `<label>` whose `for` attribute is wired to the associated
 *   control's `id` (`options.id`), so clicking the label focuses its control and
 *   assistive technology announces the accessible name.
 * - Read-only fields are marked with an `untouchable` attribute (via
 *   `options.isReadonly`) rather than removing the label.
 */
const meta: Meta<ShLabelComponent<any, any>> = {
  title: 'ng-components/Label',
  component: ShLabelComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  render: (args) => ({
    props: {
      ...args,
      model: (args as any).model ?? { field: (args as any).value ?? '' },
    },
    template: `
      <sh-label [model]="model" prop="field" [options]="options"></sh-label>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShLabelComponent<any, any> & { value?: string; model?: any }>;

/** Label text provided explicitly through `options.label`. */
export const Default: Story = {
  args: { options: { label: 'Full name', id: 'full-name' } as any },
};

/**
 * Read-only field: the label gets the `untouchable` attribute
 * (`options.isReadonly = true`) instead of being hidden.
 */
export const Readonly: Story = {
  args: { options: { label: 'Full name', id: 'full-name', isReadonly: true } as any },
};

/** Extra styling applied via `options.labelClass`. */
export const WithCustomClass: Story = {
  args: { options: { label: 'Amount', id: 'amount', labelClass: ['text-bold'] } as any },
};

/**
 * When `options.label` is `false` the `<label>` element is not rendered
 * (the `@if` in the template evaluates to false).
 */
export const Hidden: Story = {
  args: { options: { label: false, id: 'hidden-field' } as any },
  parameters: { allowEmptyRender: true },
};
