import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShTimerComponent } from './timer.component';

/**
 * `sh-timer` is a countdown timer built on top of `ngx-countdown`. It counts
 * down from an initial number of seconds provided via `[model]`, formats the
 * remaining time with `options.format`, and (when `options.showPlayer` is true)
 * renders start/pause/resume/stop/restart controls. Discrete lifecycle events
 * are emitted through `started`, `paused`, `resumed`, `stopped`, `restarted`
 * and `done`; the remaining time is pushed back via `modelChange`.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The visibly ticking countdown updates every second and is hidden from
 *   assistive technology (`aria-hidden`) so a polite live region is not flooded
 *   with never-catching-up speech.
 * - Discrete state transitions (start/pause/resume/stop/restart/done) are
 *   announced instead via a dedicated screen-reader-only `role="status"`
 *   live region with `aria-atomic`.
 * - When the consumer supplies no `ariaLabel`/`ariaLabelledBy`, a localized
 *   "timer" label provides context for that status region.
 * - Player controls are icon/glyph buttons that each set `options.ariaLabel`
 *   (localized start/pause/etc.) so they have accessible names.
 */
const meta: Meta<ShTimerComponent> = {
  title: 'ng-components/Timer',
  component: ShTimerComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    model: { control: 'number', description: 'Initial countdown time, in seconds' },
    enable: { control: 'boolean', description: 'Enabled state (false → player disabled)' },
    show: { control: 'boolean', description: 'Whether the timer is rendered' },
    modelChange: { action: 'modelChange' },
    started: { action: 'started' },
    paused: { action: 'paused' },
    resumed: { action: 'resumed' },
    stopped: { action: 'stopped' },
    restarted: { action: 'restarted' },
    done: { action: 'done' },
  },
  args: {
    model: 60,
    enable: true,
    show: true,
  },
  render: (args) => ({
    props: { ...args },
    template: `
      <sh-timer
        [model]="model"
        [options]="options"
        [enable]="enable"
        [show]="show"
        (modelChange)="modelChange($event)"
        (started)="started($event)"
        (paused)="paused($event)"
        (resumed)="resumed($event)"
        (stopped)="stopped($event)"
        (restarted)="restarted($event)"
        (done)="done($event)"
      ></sh-timer>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShTimerComponent>;

/** Default 60-second countdown with the full player, auto-starting. */
export const Default: Story = {
  args: { model: 60 },
};

/**
 * Timer that does NOT auto-start (`options.autoplay = false`); it stays in the
 * *NotRun* state until the user presses play.
 */
export const ManualStart: Story = {
  args: { model: 120, options: { autoplay: false } as any },
};

/**
 * Display-only timer with the player hidden (`options.showPlayer = false`) —
 * useful for a passive count-down readout.
 */
export const DisplayOnly: Story = {
  args: { model: 90, options: { showPlayer: false } as any },
};

/** Minutes/seconds only, via a custom `options.format`. */
export const MinutesSeconds: Story = {
  args: { model: 300, options: { format: 'mm:ss' } as any },
};

/**
 * Restricted player: only start/stop are allowed (pause, resume and restart
 * are disabled through the corresponding `options.can*` flags).
 */
export const StartStopOnly: Story = {
  args: {
    model: 60,
    options: { canPause: false, canResume: false, canRestart: false } as any,
  },
};

/** Disabled state — the player controls are rendered but not operable. */
export const Disabled: Story = {
  args: { model: 60, options: { autoplay: false } as any, enable: false },
};
