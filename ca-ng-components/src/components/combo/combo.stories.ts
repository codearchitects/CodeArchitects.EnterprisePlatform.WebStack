import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShComboComponent } from './combo.component';

/**
 * `sh-combo` is an editable **combobox / autocomplete** form control. Like the
 * other form controls it binds to a `[model]` object plus a `[prop]` key, and
 * the visible label / placeholder comes from `options.placeholder`.
 *
 * As the user types, the control filters its `options.values` (a static array
 * or an `Observable`) — or, if provided, calls `options.onGetData(text)` — and
 * shows the matches in a popup listbox. Search starts after `options.minChars`
 * characters (default 3) and is debounced by `options.debounceTime` (default
 * 500ms). With `options.showTextAsResult` the free-typed text is itself offered
 * as a selectable result via `options.onSelectText`.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - Implements the APG editable-combobox pattern: the `<input>` has
 *   `role="combobox"`, `aria-autocomplete="list"`, `aria-haspopup="listbox"`
 *   and toggles `aria-expanded` / `aria-controls` as the popup opens.
 * - DOM focus stays on the input; the active option is tracked with
 *   `aria-activedescendant` (options are not individually focusable).
 * - The input is associated with its `<label>` via `for`/`id`, and invalid
 *   state is exposed through `aria-invalid`.
 */
const meta: Meta<ShComboComponent<string>> = {
  title: 'ng-components/Combo',
  component: ShComboComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  parameters: {
    a11y: {
      // ACCEPTED, not a bug (ACCESSIBILITY.md §6): the Open story shows the listbox;
      // scrollable-region-focusable is the correct APG activedescendant model (the
      // combobox stays focused and scrolls options via arrow keys) — same as select.
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
      model: (args as any).model ?? { field: (args as any).value ?? undefined },
    },
    template: `
      <sh-combo [model]="model" prop="field" [options]="options" [enable]="enable" [show]="show"></sh-combo>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShComboComponent<string> & { value?: string; model?: any }>;

const FRUITS = ['Apple', 'Apricot', 'Banana', 'Blackberry', 'Blueberry', 'Cherry', 'Grape', 'Mango', 'Orange', 'Peach'];

/** Empty autocomplete. Type at least 3 characters to filter the list. */
export const Default: Story = {
  args: { options: { placeholder: 'Fruit', values: FRUITS } as any },
};

/** Pre-selected value shown as the input text. */
export const WithValue: Story = {
  args: { options: { placeholder: 'Fruit', values: FRUITS } as any, value: 'Banana' },
};

/**
 * Results dropdown shown open so the listbox and its options are visible in the
 * story. The `values` are pre-loaded from `options.values` on init; the play
 * function clicks the caret icon (inside the combo, so it does not trip
 * `clickOutside`), which flips `isOpened` and reveals the popup with the
 * current value highlighted.
 */
export const Open: Story = {
  args: { options: { placeholder: 'Fruit', values: FRUITS } as any, value: 'Cherry' },
  play: async ({ canvasElement }) => {
    const caret = canvasElement.querySelector('sh-combo sh-icon') as HTMLElement | null;
    caret?.click();
  },
};

/**
 * Filters after a single character (`minChars: 1`) with no debounce, so the
 * listbox opens immediately while typing.
 */
export const InstantSearch: Story = {
  args: {
    options: { placeholder: 'Fruit', values: FRUITS, minChars: 1, debounceTime: 0 } as any,
  },
};

/**
 * `showTextAsResult` offers the free-typed text as its own selectable result,
 * turning the combo into a create-as-you-type field.
 */
export const FreeText: Story = {
  args: {
    options: {
      placeholder: 'Tag',
      values: FRUITS,
      minChars: 1,
      debounceTime: 0,
      showTextAsResult: true,
      onSelectText: (text: string) => text,
    } as any,
  },
};

/** Read-only field: value is displayed but the popup cannot be opened. */
export const Readonly: Story = {
  args: { options: { placeholder: 'Fruit', values: FRUITS, isReadonly: true } as any, value: 'Cherry' },
};

/** Disabled field (`enable = false`). */
export const Disabled: Story = {
  args: { options: { placeholder: 'Fruit', values: FRUITS } as any, value: 'Cherry', enable: false },
};
