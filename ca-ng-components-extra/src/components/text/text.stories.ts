import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CaepComponentsModule } from '../components.module';
import { CaepTextComponent } from './text.component';

/**
 * `caep-text` is a text input form control. It binds to a `[model]` object and a
 * `[prop]` key (the form handler creates the underlying reactive form control),
 * a visible `[label]` (rendered as an associated `<label>`) and/or a
 * `options.placeholder`. Supports `text`, `password` and `email` input types.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The `<input>` is associated with its `<label>` via `for`/`id`.
 * - When no visible label is set, pass `[ariaLabel]` so assistive technology
 *   still announces a meaningful name (WCAG 4.1.2) — see the *No visible label* story.
 * - `aria-required` is rendered when the control has a `required` validator, and
 *   `aria-invalid` is set once the field is invalid and touched.
 */
const meta: Meta<CaepTextComponent> = {
  title: 'ng-components-extra/Text',
  component: CaepTextComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [CaepComponentsModule] })],
  argTypes: {
    label: { control: 'text', description: 'Visible label text' },
    ariaLabel: { control: 'text', description: 'Accessible name used when no visible label is set' },
    enable: { control: 'boolean', description: 'Enabled state (false → disabled)' },
    show: { control: 'boolean', description: 'Whether the control is rendered' },
    valueChanges: { action: 'valueChanges' },
    focused: { action: 'focused' },
    blurred: { action: 'blurred' },
  },
  args: { enable: true, show: true },
  render: (args) => ({
    props: {
      ...args,
      model: (args as any).model ?? { field: (args as any).value ?? '' },
      // Always pass a defined options object: binding `[options]="undefined"`
      // makes the base component's areOptionsEqual() call Object.keys(undefined),
      // which throws "Cannot convert undefined or null to object".
      options: (args as any).options ?? {},
    },
    template: `
      <caep-text
        [model]="model"
        prop="field"
        [label]="label"
        [ariaLabel]="ariaLabel"
        [options]="options"
        [enable]="enable"
        [show]="show"
        (valueChanges)="valueChanges($event)"
        (focused)="focused($event)"
        (blurred)="blurred($event)"
      ></caep-text>
    `,
  }),
};
export default meta;

type Story = StoryObj<CaepTextComponent & { value?: string; model?: any }>;

/** Empty field with a visible label. */
export const Default: Story = {
  args: { label: 'Full name' },
};

/** Pre-filled value. */
export const WithValue: Story = {
  args: { label: 'Full name', value: 'Ada Lovelace' },
};

/** Field with a placeholder shown while empty. */
export const WithPlaceholder: Story = {
  args: { label: 'Full name', options: { placeholder: 'e.g. Ada Lovelace' } as any },
};

/** Read-only field. */
export const Readonly: Story = {
  args: { label: 'Full name', value: 'Ada Lovelace', options: { isReadonly: true } as any },
};

/** Disabled field (`enable = false`). */
export const Disabled: Story = {
  args: { label: 'Full name', value: 'Ada Lovelace', enable: false },
};

/** Field with a leading icon. */
export const WithIcon: Story = {
  args: { label: 'Search', options: { icon: 'search' } as any },
};

/** Password input (`options.type = 'password'`). */
export const Password: Story = {
  args: { label: 'Password', options: { type: 'password' } as any },
};

/** Email input (`options.type = 'email'`). */
export const Email: Story = {
  args: { label: 'Email', options: { type: 'email' } as any, value: 'ada@example.com' },
};

/**
 * No visible label — an `[ariaLabel]` is provided so the field still has an
 * accessible name (WCAG 4.1.2).
 */
export const NoVisibleLabel: Story = {
  args: { ariaLabel: 'Full name', options: { placeholder: 'Full name' } as any },
};
