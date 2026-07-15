import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShSpinnerComponent } from './spinner.component';

/**
 * `sh-spinner` is a purely presentational loading indicator: an animated SVG
 * ring. It can be rendered as a normal block element, inline with other
 * controls (`[isInline]`), or as a full-screen overlay (`[isOverlay]`, which
 * moves the element onto `<body>` and dims the page).
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The container carries `role="status"`, so assistive technology announces
 *   the busy state politely.
 * - A visually-hidden "Loading" text gives the status a default accessible
 *   name; the animated SVG is decorative (`aria-hidden`, `focusable="false"`).
 * - You can override/augment the name via `options.ariaLabel` /
 *   `options.ariaLabelledBy` / `options.ariaDescribedBy` (see the
 *   *With aria-label* story).
 */
const meta: Meta<ShSpinnerComponent> = {
  title: 'ng-components/Spinner',
  component: ShSpinnerComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    isInline: { control: 'boolean', description: 'Render inline with other controls' },
    isOverlay: {
      control: 'boolean',
      description: 'Render as a full-screen overlay (moved onto <body>)',
    },
    show: { control: 'boolean', description: 'Whether the spinner is rendered' },
  },
  args: {
    isInline: false,
    isOverlay: false,
    show: true,
  },
  render: (args) => ({
    props: { ...args },
    template: `
      <sh-spinner
        [isInline]="isInline"
        [isOverlay]="isOverlay"
        [show]="show"
        [options]="options"
      ></sh-spinner>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShSpinnerComponent>;

/** Default block spinner. */
export const Default: Story = {};

/** Inline spinner, sized to sit alongside adjacent controls/text. */
export const Inline: Story = {
  args: { isInline: true },
};

/**
 * Full-screen overlay spinner. On init the element is appended to `<body>` and
 * given the `spinner-overlay` class, dimming the *entire* page — use it for
 * blocking, page-level loading states.
 *
 * Because the overlay is `position: fixed` and covers everything (including the
 * autodocs page, which renders every story inline), it is **gated behind a
 * trigger** and starts closed: click *Show overlay spinner* to append it to
 * `<body>`, and *Hide overlay spinner* (kept on top via a higher `z-index`) to
 * destroy it, which removes it from `<body>` again.
 */
export const Overlay: Story = {
  render: (args) => ({
    props: { ...args, showOverlay: false },
    template: `
      <div style="padding: 1rem;">
        @if (!showOverlay) {
          <button type="button" (click)="showOverlay = true">Show overlay spinner</button>
        }
        @if (showOverlay) {
          <button
            type="button"
            (click)="showOverlay = false"
            style="position: fixed; top: 1rem; right: 1rem; z-index: 10000000000;"
          >Hide overlay spinner</button>
          <sh-spinner [isOverlay]="true" [options]="options"></sh-spinner>
        }
      </div>
    `,
  }),
};

/**
 * Provides an explicit accessible name via `options.ariaLabel`, overriding the
 * default visually-hidden "Loading" text (WCAG 4.1.2).
 */
export const WithAriaLabel: Story = {
  args: { options: { ariaLabel: 'Loading results' } as any },
};
