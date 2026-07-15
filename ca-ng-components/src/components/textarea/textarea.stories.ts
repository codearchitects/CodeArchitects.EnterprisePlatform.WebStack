import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShTextareaComponent } from './textarea.component';

/**
 * `sh-textarea` is a multi-line text input form control. Like the other inputs
 * it binds to a `[model]` object and a `[prop]` key (the form handler creates
 * the underlying form control), and the visible label / placeholder comes from
 * `options.placeholder`. It adds textarea-specific options: `rows`, `cols`,
 * `maxRows` and `autoresize` (grows to fit the content).
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The `<textarea>` is associated with its `<label>` via `for`/`id`.
 * - Validation errors are linked via `aria-invalid` + `aria-describedby` when
 *   the control is invalid and touched.
 */
const meta: Meta<ShTextareaComponent> = {
  title: 'ng-components/Textarea',
  component: ShTextareaComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    enable: { control: 'boolean', description: 'Enabled state (false → disabled)' },
    icon: { control: 'text', description: 'Optional leading icon name' },
  },
  args: { enable: true },
  render: (args) => ({
    props: {
      ...args,
      model: (args as any).model ?? { field: (args as any).value ?? '' },
    },
    template: `
      <sh-textarea [model]="model" prop="field" [options]="options" [enable]="enable" [icon]="icon"></sh-textarea>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShTextareaComponent & { value?: string; model?: any }>;

/** Empty field with a floating placeholder label. */
export const Default: Story = {
  args: { options: { placeholder: 'Description' } as any },
};

/** Pre-filled value. */
export const WithValue: Story = {
  args: {
    options: { placeholder: 'Description' } as any,
    value: 'Ada Lovelace is regarded as the first computer programmer.',
  },
};

/** Fixed number of visible rows. */
export const WithRows: Story = {
  args: { options: { placeholder: 'Notes', rows: 6 } as any },
};

/** Auto-resizing textarea that grows to fit its content. */
export const Autoresize: Story = {
  args: {
    options: { placeholder: 'Comment', autoresize: true } as any,
    value: 'Line one\nLine two\nLine three\nType more and the field grows.',
  },
};

/** Limited-height field: grows up to `maxRows`, then scrolls. */
export const MaxRows: Story = {
  args: {
    options: { placeholder: 'Comment', autoresize: true, maxRows: 3 } as any,
    value: 'Line one\nLine two\nLine three\nLine four\nLine five',
  },
};

/** Field with a leading icon. */
export const WithIcon: Story = {
  args: { options: { placeholder: 'Message' } as any, icon: 'edit' },
};

/** Read-only field. */
export const Readonly: Story = {
  args: {
    options: { placeholder: 'Description', isReadonly: true } as any,
    value: 'This content cannot be edited.',
  },
};

/** Disabled field (`enable = false`). */
export const Disabled: Story = {
  args: {
    options: { placeholder: 'Description' } as any,
    value: 'Disabled content',
    enable: false,
  },
};
