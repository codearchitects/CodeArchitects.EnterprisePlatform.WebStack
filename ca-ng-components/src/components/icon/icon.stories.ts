import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShIconComponent } from './icon.component';

/**
 * `sh-icon` renders a font-based icon `<i>` element. The icon glyph is selected
 * via the `[name]` input (the component maps a bare name to the
 * `icon icon-<name>` class, or applies the registered `CAEP_ICON_PREFIX_TOKEN`
 * prefix when one is provided).
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - By default the icon is **decorative**: it is rendered with `aria-hidden="true"`
 *   and exposed to no accessible name, so screen readers skip it. Use this when
 *   the icon sits next to text that already conveys the meaning.
 * - When the icon carries meaning on its own, set `[ariaLabel]`. The icon is then
 *   exposed as `role="img"` with that label (see the *WithAriaLabel* story),
 *   satisfying WCAG 1.1.1 (Non-text Content).
 */
const meta: Meta<ShIconComponent> = {
  title: 'ng-components/Icon',
  component: ShIconComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    name: { control: 'text', description: 'Icon name (mapped to the icon font class)' },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label; when set the icon becomes role="img", otherwise it is decorative (aria-hidden)',
    },
  },
  args: {
    name: 'save',
  },
  render: (args) => ({
    props: { ...args },
    // The icon is a font glyph that inherits font-size; render it at a visible
    // size so the glyph (not a tiny/zero-height inline element) is shown.
    template: `<sh-icon [name]="name" [ariaLabel]="ariaLabel" style="font-size: 2rem; color:#333; display:inline-block; line-height:1;"></sh-icon>`,
  }),
};
export default meta;

type Story = StoryObj<ShIconComponent>;

/** Decorative icon (default). Rendered with `aria-hidden="true"`. */
export const Default: Story = {
  args: { name: 'save' },
};

/** A different glyph, still decorative. */
export const Search: Story = {
  args: { name: 'search' },
};

/**
 * Meaningful icon with an accessible name. It is exposed as `role="img"` with the
 * given label so assistive technology announces it (WCAG 1.1.1).
 */
export const WithAriaLabel: Story = {
  args: { name: 'trash', ariaLabel: 'Delete item' },
};
