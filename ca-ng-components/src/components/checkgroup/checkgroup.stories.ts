import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShCheckgroupComponent } from './checkgroup.component';

/**
 * `sh-checkgroup` is a multi-select form control that renders a group of
 * checkboxes. It binds to a `[model]` object and a `[prop]` key; the selected
 * items are stored as an array on that model property. The list of choices is
 * supplied through `options.values`, and each entry's label defaults to its
 * string value (or is formatted via `options.valuesPipe`). Set
 * `options.isInline` to lay the checkboxes out horizontally.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The wrapper is exposed as `role="group"`; give the group an accessible name
 *   via `options.ariaLabel` (or `options.ariaLabelledBy`) so assistive tech
 *   announces what the checkboxes belong to.
 * - Each choice is a `role="checkbox"` element that is keyboard-focusable and
 *   toggled with Enter/Space; `aria-checked`, `aria-disabled` and
 *   `aria-readonly` reflect the current state. The native `<input>` is visually
 *   hidden but kept in the accessibility tree.
 * - A focus ring is drawn explicitly on the visual box (the native input is
 *   `tabindex="-1"`), satisfying WCAG 2.4.7 / 2.4.11.
 *
 * This is a **form-control** component; the model/prop wiring mirrors
 * `text.stories.ts`.
 */
const meta: Meta<ShCheckgroupComponent<string, string>> = {
  title: 'ng-components/Checkgroup',
  component: ShCheckgroupComponent,
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
      model: (args as any).model ?? { field: (args as any).value ?? [] },
    },
    template: `
      <sh-checkgroup [model]="model" prop="field" [options]="options" [enable]="enable" [show]="show"></sh-checkgroup>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShCheckgroupComponent<string, string> & { value?: string[]; model?: any }>;

/** Nothing selected. Choices are stacked vertically. */
export const Default: Story = {
  args: {
    options: {
      ariaLabel: 'Notification channels',
      values: ['Email', 'SMS', 'Push notification'],
    } as any,
  },
};

/** Some choices pre-selected via the bound model value. */
export const WithSelection: Story = {
  args: {
    options: {
      ariaLabel: 'Notification channels',
      values: ['Email', 'SMS', 'Push notification'],
    } as any,
    value: ['Email', 'Push notification'],
  },
};

/** Horizontal layout (`options.isInline = true`). */
export const Inline: Story = {
  args: {
    options: {
      ariaLabel: 'Notification channels',
      values: ['Email', 'SMS', 'Push notification'],
      isInline: true,
    } as any,
    value: ['SMS'],
  },
};

/** Read-only group: values are shown but cannot be toggled. */
export const Readonly: Story = {
  args: {
    options: {
      ariaLabel: 'Notification channels',
      values: ['Email', 'SMS', 'Push notification'],
      isReadonly: true,
    } as any,
    value: ['Email'],
  },
};

/** Disabled group (`enable = false`). */
export const Disabled: Story = {
  args: {
    options: {
      ariaLabel: 'Notification channels',
      values: ['Email', 'SMS', 'Push notification'],
    } as any,
    value: ['Email'],
    enable: false,
  },
};
