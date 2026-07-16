import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShCaptionComponent } from './caption.component';

/**
 * `sh-caption` renders a read-only text `<label>` whose text comes from a bound
 * `[model]` object and a `[prop]` key. It is a model-bound control (extends
 * `ShBaseModelComponent`), but unlike an editable field it only displays the
 * value — typically used as a caption/label for a value or a group of controls.
 * Additional inline content can be projected via `<ng-content>`.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - Renders a native `<label>` with `for` pointing at `internalOptions.id`, so
 *   it can be associated with the control it captions (WCAG 1.3.1 / 4.1.2).
 * - The full text is also exposed as the element `title` (tooltip) so truncated
 *   captions remain discoverable.
 * - Text is translated through the i18n pipe; the caption itself is not
 *   interactive (`cursor: default`).
 */
const meta: Meta<ShCaptionComponent<any>> = {
  title: 'ng-components/Caption',
  component: ShCaptionComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    show: { control: 'boolean', description: 'Whether the caption is rendered' },
    enable: { control: 'boolean', description: 'Enabled state' },
  },
  args: { show: true, enable: true },
  render: (args) => ({
    props: {
      ...args,
      model: (args as any).model ?? { field: (args as any).value ?? '' },
    },
    template: `
      <sh-caption [model]="model" prop="field" [options]="options" [show]="show" [enable]="enable"></sh-caption>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShCaptionComponent<any> & { value?: string; model?: any }>;

/** Basic caption showing a text value bound from the model. */
export const Default: Story = {
  args: { value: 'Full name' },
};

/** Longer caption text — the full value is exposed via the element `title`. */
export const LongText: Story = {
  args: { value: 'Billing address used for invoicing and tax documents' },
};

/** Caption tied to a specific control via `options.id` (`<label for>`). */
export const AssociatedWithControl: Story = {
  args: { value: 'Email', options: { id: 'email-field' } as any },
};

/** Empty value — nothing meaningful to show, only the (empty) label element. */
export const Empty: Story = {
  args: { value: '' },
  parameters: { allowEmptyRender: true },
};

/** Hidden caption (`show = false`) — nothing is rendered. */
export const Hidden: Story = {
  args: { value: 'Full name', show: false },
  parameters: { allowEmptyRender: true },
};
