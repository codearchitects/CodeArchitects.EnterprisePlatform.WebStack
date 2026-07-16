import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CaepComponentsModule } from '../components.module';
import { MockTextComponent } from './mock-text.component';

/**
 * `caep-mock-text` is a text input form control. It binds to a `[model]` object
 * and a `[prop]` key (the form handler creates the underlying `FormControl`), and
 * the visible placeholder/label comes from `options.placeholder`. It supports the
 * `text`, `password` and `email` input types via `options.type`.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - When no visible label is associated, pass `[ariaLabel]` to give the `<input>`
 *   an accessible name (`aria-label`, WCAG 4.1.2 / 3.3.2).
 * - A `required` validator on the control is reflected via `aria-required`
 *   (WCAG 3.3.2), and invalid+touched state via `aria-invalid`.
 */
const meta: Meta<MockTextComponent> = {
  title: 'ng-components-extra/MockText',
  component: MockTextComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [CaepComponentsModule] })],
  argTypes: {
    enable: { control: 'boolean', description: 'Enabled state (false → disabled)' },
    show: { control: 'boolean', description: 'Whether the control is rendered' },
    ariaLabel: { control: 'text', description: 'Accessible name (aria-label) for the input' },
  },
  args: { enable: true, show: true },
  render: (args) => ({
    props: {
      ...args,
      model: (args as any).model ?? { field: (args as any).value ?? '' },
    },
    template: `
      <caep-mock-text
        [model]="model"
        prop="field"
        [options]="options"
        [enable]="enable"
        [show]="show"
        [ariaLabel]="ariaLabel"
      ></caep-mock-text>
    `,
  }),
};
export default meta;

type Story = StoryObj<MockTextComponent & { value?: string; model?: any }>;

/** Empty field with a placeholder label. */
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

/** Disabled field (`enable = false`). */
export const Disabled: Story = {
  args: { options: { placeholder: 'Full name' } as any, value: 'Ada Lovelace', enable: false },
};

/** Password input (`options.type = 'password'`). */
export const Password: Story = {
  args: { options: { placeholder: 'Password', type: 'password' } as any, value: 'hunter2' },
};

/** Email input (`options.type = 'email'`). */
export const Email: Story = {
  args: { options: { placeholder: 'Email', type: 'email' } as any, value: 'ada@example.com' },
};

/**
 * No visible label — an explicit `ariaLabel` provides the accessible name so
 * assistive technology can announce the field (WCAG 4.1.2).
 */
export const WithAriaLabel: Story = {
  args: { options: { placeholder: '' } as any, ariaLabel: 'Search term', value: 'ada' },
};
