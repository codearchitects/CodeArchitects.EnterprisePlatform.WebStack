import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShButtonComponent } from './button.component';

/**
 * `sh-button` renders a native `<button>` with the design-system styling and
 * variants. The label is provided via content projection; an optional leading
 * icon is shown with `[icon]`.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - Uses a native `<button>`, so it is focusable and operable with
 *   Enter/Space out of the box.
 * - **Icon-only buttons must set `options.ariaLabel`** to provide an accessible
 *   name (see the *Icon only* story); the icon itself is decorative
 *   (`aria-hidden`).
 * - Disabled state is conveyed via the native `disabled` attribute.
 */
const meta: Meta<ShButtonComponent> = {
  title: 'ng-components/Button',
  component: ShButtonComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    primary: { control: 'boolean', description: 'Primary (filled) style' },
    outline: { control: 'boolean', description: 'Outline style' },
    transparent: { control: 'boolean', description: 'Transparent style' },
    negative: { control: 'boolean', description: 'White-on-dark (negative) style' },
    icon: { control: 'text', description: 'Optional leading icon name' },
    enable: { control: 'boolean', description: 'Enabled state (false → disabled)' },
    show: { control: 'boolean', description: 'Whether the button is rendered' },
    clicked: { action: 'clicked' },
    click: { action: 'click' },
  },
  args: {
    primary: false,
    outline: false,
    transparent: false,
    negative: false,
    enable: true,
    show: true,
    icon: undefined,
  },
  render: (args) => ({
    props: { ...args, label: (args as any).label ?? 'Button' },
    template: `
      <sh-button
        [primary]="primary"
        [outline]="outline"
        [transparent]="transparent"
        [negative]="negative"
        [icon]="icon"
        [enable]="enable"
        [show]="show"
        [options]="options"
        (clicked)="clicked($event)"
        (click)="click($event)"
      >{{ label }}</sh-button>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShButtonComponent & { label: string }>;

/** Default (secondary) button. */
export const Default: Story = {
  args: { label: 'Button' },
};

/** Primary call-to-action style. */
export const Primary: Story = {
  args: { label: 'Save', primary: true },
};

/** Outline style. */
export const Outline: Story = {
  args: { label: 'Cancel', outline: true },
};

/** Transparent style (e.g. toolbars). */
export const Transparent: Story = {
  args: { label: 'More', transparent: true },
};

/** Button with a leading icon and a text label. */
export const WithIcon: Story = {
  args: { label: 'Save', icon: 'save', primary: true },
};

/**
 * Icon-only button. **Must** set `options.ariaLabel` so assistive technology
 * announces a meaningful name (WCAG 4.1.2) — the icon alone is not a name.
 */
export const IconOnly: Story = {
  args: { label: '', icon: 'save', primary: true, options: { ariaLabel: 'Save' } as any },
};

/** Disabled button (`enable = false`). */
export const Disabled: Story = {
  args: { label: 'Save', primary: true, enable: false },
};
