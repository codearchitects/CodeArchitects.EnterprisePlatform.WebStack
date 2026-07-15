import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShDateComponent } from './date.component';

/**
 * `sh-date` is a date/time input form control. Like every form control it binds
 * to a `[model]` object and a `[prop]` key (the form handler owns the underlying
 * form control), and the visible label comes from `options.placeholder`.
 *
 * Each date segment (day / month / year / hour / minutes / seconds) is an
 * individually editable, keyboard-driven field, and a pop-up calendar picker is
 * opened from the trailing calendar icon. The visible segments and their order
 * are driven by `options.format`; when omitted the format follows the active
 * locale (`it` → dd/mm/yyyy, `en` → mm/dd/yyyy).
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The segmented input is a `role="group"` associated with its `<label>` via
 *   `aria-labelledby`; each segment is a `role="spinbutton"` exposing
 *   `aria-valuemin` / `aria-valuemax` / `aria-valuenow` / `aria-valuetext`.
 * - Segments are keyboard operable: arrows increment/decrement, digits type the
 *   value, and Alt+Arrow opens the calendar.
 * - The calendar toggle is a `role="button"` with `aria-haspopup="grid"` and a
 *   synced `aria-expanded` / `aria-controls`.
 */
const meta: Meta<ShDateComponent> = {
  title: 'ng-components/Date',
  component: ShDateComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    enable: { control: 'boolean', description: 'Enabled state (false → disabled)' },
    show: { control: 'boolean', description: 'Whether the control is rendered' },
    icon: { control: 'text', description: 'Calendar toggle icon name' },
    valueChanges: { action: 'valueChanges' },
  },
  args: { enable: true, show: true },
  render: (args) => ({
    props: {
      ...args,
      model: (args as any).model ?? { field: (args as any).value ?? undefined },
    },
    template: `
      <sh-date
        [model]="model"
        prop="field"
        [options]="options"
        [enable]="enable"
        [show]="show"
        [icon]="icon"
        (valueChanges)="valueChanges($event)"
      ></sh-date>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShDateComponent & { value?: Date; model?: any }>;

/**
 * Pre-filled date field; the segmented input shows the value and the format
 * follows the active locale (`en` → mm/dd/yyyy). This is the canonical render:
 * the field is visible without needing the (portalled) calendar to open.
 */
export const Default: Story = {
  args: { options: { placeholder: 'Birth date' } as any, value: new Date(1990, 5, 15) },
};

/** Empty field showing the floating placeholder label; format follows the locale. */
export const Empty: Story = {
  args: { options: { placeholder: 'Birth date' } as any },
};

/** Explicit day/month/year order via `options.format`. */
export const CustomFormat: Story = {
  args: {
    options: { placeholder: 'Start date', format: ['day', 'month', 'year'] } as any,
    value: new Date(2026, 0, 31),
  },
};

/** Date + time (24h): shows hour and minute segments alongside the date. */
export const DateTime: Story = {
  args: {
    options: {
      placeholder: 'Appointment',
      format: ['day', 'month', 'year', 'HH', 'minutes'],
    } as any,
    value: new Date(2026, 6, 15, 14, 30),
  },
};

/** Time only, 12-hour notation with an AM/PM toggle. */
export const TimeTwelveHour: Story = {
  args: {
    options: { placeholder: 'Time', format: ['hh', 'minutes'] } as any,
    value: new Date(2026, 6, 15, 9, 5),
  },
};

/** Read-only field (no calendar toggle, segments not editable). */
export const Readonly: Story = {
  args: {
    options: { placeholder: 'Birth date', isReadonly: true } as any,
    value: new Date(1990, 5, 15),
  },
};

/** Disabled field (`enable = false`). */
export const Disabled: Story = {
  args: {
    options: { placeholder: 'Birth date' } as any,
    value: new Date(1990, 5, 15),
    enable: false,
  },
};

/** Picker restricted to a year range via `options.minYear` / `options.maxYear`. */
export const BoundedYears: Story = {
  args: {
    options: { placeholder: 'Year of enrolment', minYear: 2020, maxYear: 2030 } as any,
    value: new Date(2026, 0, 1),
  },
};
