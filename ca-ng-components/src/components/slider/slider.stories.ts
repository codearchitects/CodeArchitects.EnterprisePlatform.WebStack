import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShSliderComponent } from './slider.component';

/**
 * `sh-slider` is a range (slider) form control. Like the other form controls it
 * binds to a `[model]` object and a `[prop]` key, and renders a native
 * `<input type="range">`. Range/step behaviour and the optional value read-out
 * come from `[options]` (`min` / `max` / `step` / `showValue`); the visible
 * label comes from `options.placeholder`.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - Uses a native `<input type="range">`, so it is focusable and operable with
 *   the arrow keys / Home / End out of the box.
 * - The control is associated with its `<label>` via `for`/`id` when a
 *   `placeholder` is set; otherwise provide `options.ariaLabel` /
 *   `options.ariaLabelledBy` for an accessible name (WCAG 4.1.2).
 * - `min` / `max` / `step` are exposed as native attributes so assistive tech
 *   announces the current position and range.
 */
const meta: Meta<ShSliderComponent> = {
  title: 'ng-components/Slider',
  component: ShSliderComponent,
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
      model: (args as any).model ?? { field: (args as any).value ?? 0 },
    },
    template: `
      <sh-slider [model]="model" prop="field" [options]="options" [enable]="enable" [icon]="icon"></sh-slider>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShSliderComponent & { value?: number; model?: any }>;

/** Default slider (0–100), starting at 0. */
export const Default: Story = {
  args: { options: { placeholder: 'Volume', min: 0, max: 100 } as any },
};

/** Pre-set value. */
export const WithValue: Story = {
  args: { options: { placeholder: 'Volume', min: 0, max: 100 } as any, value: 60 },
};

/** Shows the current numeric value next to the track via `options.showValue`. */
export const WithValueDisplay: Story = {
  args: { options: { placeholder: 'Volume', min: 0, max: 100, showValue: true } as any, value: 40 },
};

/** Custom range and step (e.g. 0–10 in steps of 2). */
export const CustomRangeAndStep: Story = {
  args: { options: { placeholder: 'Rating', min: 0, max: 10, step: 2, showValue: true } as any, value: 6 },
};

/** Read-only slider. */
export const Readonly: Story = {
  args: { options: { placeholder: 'Volume', min: 0, max: 100, isReadonly: true } as any, value: 50 },
};

/** Disabled slider (`enable = false`). */
export const Disabled: Story = {
  args: { options: { placeholder: 'Volume', min: 0, max: 100 } as any, value: 50, enable: false },
};

/** Slider with a leading icon. */
export const WithIcon: Story = {
  args: { options: { placeholder: 'Volume', min: 0, max: 100, showValue: true } as any, value: 30, icon: 'volume' },
};
