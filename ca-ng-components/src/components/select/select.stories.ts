import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShSelectComponent } from './select.component';

/**
 * `sh-select` is a single-value lookup (dropdown) form control. Like the other
 * form controls it binds to a `[model]` object and a `[prop]` key, while the
 * list of choices and the visible label come from `[options]`:
 * `options.values` is the array of selectable values and `options.placeholder`
 * provides the floating label.
 *
 * It renders as an ARIA combobox (`role="combobox"` + a `role="listbox"`
 * popup); the dropdown opens on click, Space, Arrow keys or Home/End.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The control exposes `role="combobox"` with `aria-haspopup="listbox"`,
 *   `aria-expanded`, and `aria-controls` pointing at the listbox.
 * - The active option is tracked with `aria-activedescendant` (the combobox
 *   keeps focus; options are not individually focusable — APG combobox model).
 * - Keyboard: Arrow Up/Down move through options, Enter commits, Home/End jump
 *   to first/last, Space toggles the popup, Escape/Tab close it, and
 *   Delete/Backspace clear the value.
 * - The floating placeholder is associated with the combobox via
 *   `aria-labelledby`; the selected value / caret icon are decorative.
 */
const meta: Meta<ShSelectComponent<string, string, any>> = {
  title: 'ng-components/Select',
  component: ShSelectComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  parameters: {
    a11y: {
      // ACCEPTED, not a bug (ACCESSIBILITY.md §6): axe flags scrollable-region-focusable
      // on the open listbox, but this is the correct APG activedescendant combobox
      // pattern — focus stays on the combobox itself, which scrolls the options via
      // arrow keys, so the popup is deliberately not its own tab stop.
      config: {
        rules: [{ id: 'scrollable-region-focusable', enabled: false }],
      },
    },
  },
  argTypes: {
    enable: { control: 'boolean', description: 'Enabled state (false → disabled)' },
    show: { control: 'boolean', description: 'Whether the control is rendered' },
  },
  args: { enable: true, show: true },
  render: (args) => ({
    props: {
      ...args,
      model: (args as any).model ?? { field: (args as any).value },
    },
    template: `
      <sh-select [model]="model" prop="field" [options]="options" [enable]="enable" [show]="show"></sh-select>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShSelectComponent<string, string, any> & { value?: string; model?: any }>;

const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

/** Empty select with a floating placeholder label and a list of options. */
export const Default: Story = {
  args: {
    options: { placeholder: 'Fruit', values: fruits } as any,
  },
};

/** Pre-selected value. */
export const WithValue: Story = {
  args: {
    options: { placeholder: 'Fruit', values: fruits } as any,
    value: 'Banana',
  },
};

/**
 * Dropdown shown open so the listbox and its options are visible in the story.
 *
 * The `play` function clicks the `role="combobox"` box, which flips the
 * component's `isOpened` flag and renders the (non-portalled, in-subtree)
 * `role="listbox"` popup. Storybook does NOT auto-run `play` on the Docs page
 * by default, so `docs.story.autoplay` is enabled here — otherwise the dropdown
 * would stay closed inline in the autodocs and the options would never show.
 */
export const Open: Story = {
  args: {
    options: { placeholder: 'Fruit', values: fruits } as any,
    value: 'Cherry',
  },
  parameters: {
    docs: { story: { autoplay: true } },
  },
  play: async ({ canvasElement }) => {
    const combobox = canvasElement.querySelector('[role="combobox"]') as HTMLElement | null;
    combobox?.click();
  },
};

/** Read-only select (value shown, popup cannot be opened). */
export const Readonly: Story = {
  args: {
    options: { placeholder: 'Fruit', values: fruits, isReadonly: true } as any,
    value: 'Date',
  },
};

/** Disabled select (`enable = false`). */
export const Disabled: Story = {
  args: {
    options: { placeholder: 'Fruit', values: fruits } as any,
    value: 'Apple',
    enable: false,
  },
};
