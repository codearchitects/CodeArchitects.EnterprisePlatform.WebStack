import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShRadioComponent } from './radio.component';

/**
 * `sh-radio` is a single-select form control that renders a group of radio
 * buttons. It binds to a `[model]` object and a `[prop]` key; the selected
 * option's value is stored on that model property. The list of choices is
 * supplied through `options.values`, and each entry's label defaults to its
 * string value. Set `options.isInline` to lay the radios out horizontally.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The wrapper is exposed as `role="radiogroup"`; give the group an accessible
 *   name via `options.ariaLabel` (or `options.ariaLabelledBy`) so assistive tech
 *   announces what the radios belong to.
 * - Each choice is a `role="radio"` element following the APG roving-tabindex
 *   pattern: only the checked option (or the first, when none is selected) is in
 *   the tab order, and Arrow keys move focus *and* selection with wrap-around.
 *   Space selects the focused option. `aria-checked`, `aria-disabled` and
 *   `aria-readonly` reflect the current state.
 * - The native `<input type="radio">` is visually hidden (`aria-hidden`,
 *   `tabindex="-1"`); the visible box carries the semantics and focus ring.
 *
 * This is a **form-control** component; the model/prop wiring mirrors
 * `text.stories.ts`.
 */
const meta: Meta<ShRadioComponent<string, string>> = {
  title: 'ng-components/Radio',
  component: ShRadioComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    enable: { control: 'boolean', description: 'Enabled state (false → disabled)' },
    show: { control: 'boolean', description: 'Whether the control is rendered' },
  },
  args: { enable: true, show: true },
  render: (args) => ({
    props: {
      ...args,
      model: (args as any).model ?? { field: (args as any).value ?? undefined },
    },
    template: `
      <sh-radio [model]="model" prop="field" [options]="options" [enable]="enable" [show]="show"></sh-radio>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShRadioComponent<string, string> & { value?: string; model?: any }>;

/** Nothing selected. Choices are stacked vertically. */
export const Default: Story = {
  args: {
    options: {
      ariaLabel: 'Shipping method',
      values: ['Standard', 'Express', 'Overnight'],
    } as any,
  },
};

/** A choice pre-selected via the bound model value. */
export const WithSelection: Story = {
  args: {
    options: {
      ariaLabel: 'Shipping method',
      values: ['Standard', 'Express', 'Overnight'],
    } as any,
    value: 'Express',
  },
};

/** Horizontal layout (`options.isInline = true`). */
export const Inline: Story = {
  args: {
    options: {
      ariaLabel: 'Shipping method',
      values: ['Standard', 'Express', 'Overnight'],
      isInline: true,
    } as any,
    value: 'Standard',
  },
};

/** Read-only group: the selection is shown but cannot be changed. */
export const Readonly: Story = {
  args: {
    options: {
      ariaLabel: 'Shipping method',
      values: ['Standard', 'Express', 'Overnight'],
      isReadonly: true,
    } as any,
    value: 'Express',
  },
};

/** Disabled group (`enable = false`). */
export const Disabled: Story = {
  args: {
    options: {
      ariaLabel: 'Shipping method',
      values: ['Standard', 'Express', 'Overnight'],
    } as any,
    value: 'Standard',
    enable: false,
  },
};
