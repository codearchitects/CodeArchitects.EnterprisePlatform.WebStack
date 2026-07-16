import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { Subject } from 'rxjs';
import { ShComponentsModule } from '../components.module';
import { ShMultiSelectComponent } from './multiselect.component';

/**
 * `sh-multiselect` is a multiple-selection dropdown form control. Like the other
 * form controls it binds to a `[model]` object plus a `[prop]` key, and the
 * visible label / placeholder comes from `options.placeholder`. The selectable
 * items come from `options.values` (a static array or an `Observable`), and the
 * bound model property holds the **array** of currently selected values.
 *
 * Clicking the field (or pressing Enter/Space/Arrow keys) opens a listbox of
 * checkable options; picking several keeps the popup open and the field shows
 * the selected labels joined together.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - Implements the APG combobox + `role="listbox"` (`aria-multiselectable`)
 *   pattern: the trigger has `role="combobox"`, `aria-haspopup="listbox"` and
 *   toggles `aria-expanded` / `aria-controls` as the popup opens.
 * - DOM focus stays on the trigger; the active option is tracked with
 *   `aria-activedescendant` and each option exposes `aria-selected` (options are
 *   not individually focusable).
 * - Keyboard: Enter/Space open the popup and toggle the active option, Arrow
 *   Up/Down move the active option, Home/End jump to the ends, first-character
 *   type-ahead jumps to a matching option, and Esc/Tab close the popup.
 * - The trigger is named via `aria-labelledby` (the floating `<label>`), or an
 *   explicit `aria-label` / `aria-labelledby`; invalid state is exposed through
 *   `aria-invalid`.
 */
const meta: Meta<ShMultiSelectComponent<string, string, any>> = {
  title: 'ng-components/MultiSelect',
  component: ShMultiSelectComponent,
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
      <sh-multiselect [model]="model" prop="field" [options]="options" [enable]="enable" [show]="show"></sh-multiselect>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShMultiSelectComponent<string, string, any> & { value?: string[]; model?: any }>;

const COLORS = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet'];

/** Empty control with a floating placeholder label. Click to open the listbox. */
export const Default: Story = {
  args: { options: { placeholder: 'Colors', values: COLORS } as any },
};

/** Pre-selected values shown as the joined field text. */
export const WithValue: Story = {
  args: { options: { placeholder: 'Colors', values: COLORS } as any, value: ['Green', 'Blue'] },
};

/**
 * The dropdown listbox rendered open so the checkable options are visible.
 *
 * The popup is `position: fixed`, so it is kept **closed by default** and gated
 * behind an explicit trigger: click the **Open dropdown** button to toggle the
 * listbox via `options.toggleDropdown$` (which the component subscribes to).
 * This keeps the autodocs page — which renders every story inline — from being
 * covered by a stacked overlay.
 */
export const Open: Story = {
  render: (args) => ({
    props: {
      ...args,
      model: { field: ['Green'] },
      toggle: () => (args as any).options.toggleDropdown$.next(true),
    },
    template: `
      <button type="button" (click)="toggle()">Open dropdown</button>
      <sh-multiselect [model]="model" prop="field" [options]="options" [enable]="enable" [show]="show"></sh-multiselect>
    `,
  }),
  args: {
    options: { placeholder: 'Colors', values: COLORS, toggleDropdown$: new Subject<boolean>() } as any,
  },
};

/** Read-only field: selected values are displayed but the popup cannot be opened. */
export const Readonly: Story = {
  args: { options: { placeholder: 'Colors', values: COLORS, isReadonly: true } as any, value: ['Red'] },
};

/** Disabled field (`enable = false`). */
export const Disabled: Story = {
  args: { options: { placeholder: 'Colors', values: COLORS } as any, value: ['Red', 'Yellow'], enable: false },
};
