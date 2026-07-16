import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShProgressBarComponent } from './progress-bar.component';

/**
 * `sh-progress-bar` is a presentational progress indicator. It fills a track to
 * represent `value` scaled between `min` and `max`, optionally showing the
 * percentage label (`showLabel`) or animating an indeterminate state
 * (`isIndeterminate`).
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The track exposes `role="progressbar"` with `aria-valuemin`, `aria-valuemax`
 *   and (when determinate) `aria-valuenow`, so assistive technology can announce
 *   progress. In indeterminate mode `aria-valuenow` is omitted, as required.
 * - The bar has no intrinsic text, so **provide an accessible name** via
 *   `options.ariaLabel` (or `options.ariaLabelledBy`) describing what is
 *   progressing — every story below sets one.
 * - The fill is a non-text graphical element, so the 4.5:1 text-contrast rule
 *   does not apply; no color-contrast exception is needed here.
 */
const meta: Meta<ShProgressBarComponent> = {
  title: 'ng-components/ProgressBar',
  component: ShProgressBarComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 }, description: 'Current progress value' },
    min: { control: 'number', description: 'Minimum value of the scale' },
    max: { control: 'number', description: 'Maximum value of the scale' },
    showLabel: { control: 'boolean', description: 'Show the percentage label next to the bar' },
    isIndeterminate: { control: 'boolean', description: 'Animate an indeterminate (unknown-duration) state' },
    enable: { control: 'boolean', description: 'Enabled state (false → grayscale/disabled)' },
    show: { control: 'boolean', description: 'Whether the bar is rendered' },
  },
  args: {
    value: 40,
    min: 0,
    max: 100,
    showLabel: false,
    isIndeterminate: false,
    enable: true,
    show: true,
  },
  render: (args) => ({
    props: { ...args, options: (args as any).options ?? { ariaLabel: 'Loading progress' } },
    template: `
      <div style="width: 320px;">
        <sh-progress-bar
          [value]="value"
          [min]="min"
          [max]="max"
          [showLabel]="showLabel"
          [isIndeterminate]="isIndeterminate"
          [enable]="enable"
          [show]="show"
          [options]="options"
        ></sh-progress-bar>
      </div>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShProgressBarComponent>;

/** Default determinate bar at 40%. */
export const Default: Story = {
  args: { value: 40 },
};

/** With the percentage label shown next to the track. */
export const WithLabel: Story = {
  args: { value: 65, showLabel: true },
};

/** Nearly complete. */
export const AlmostComplete: Story = {
  args: { value: 90, showLabel: true },
};

/** Empty (0%) — the track is visible but the fill is collapsed. */
export const Empty: Story = {
  args: { value: 0, showLabel: true },
};

/** Complete (100%). */
export const Complete: Story = {
  args: { value: 100, showLabel: true },
};

/**
 * Custom scale: value 5 on a 0–20 range renders at 25%. The label reflects the
 * scaled percentage, not the raw value.
 */
export const CustomRange: Story = {
  args: { value: 5, min: 0, max: 20, showLabel: true },
};

/**
 * Indeterminate mode: an unknown-duration operation. `aria-valuenow` is omitted
 * and the label is hidden while the fill animates.
 */
export const Indeterminate: Story = {
  args: { isIndeterminate: true, options: { ariaLabel: 'Working' } as any },
};

/** Disabled state (grayscaled, fill hidden). */
export const Disabled: Story = {
  args: { value: 40, showLabel: true, enable: false },
};
