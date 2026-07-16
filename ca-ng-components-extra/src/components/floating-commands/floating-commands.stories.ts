import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CaepComponentsModule } from '../components.module';
import { CaepFloatingCommandsComponent } from './floating-commands.component';

/**
 * `caep-floating-commands` is a draggable, floating toolbar that groups a set of
 * command controls (projected via `<ng-content>`) and can be repositioned over
 * the page. It renders a drag handle plus a `role="toolbar"` content region and
 * is positioned `absolute` relative to its nearest positioned ancestor, so the
 * stories wrap it in a tall, `position: relative` host so it is actually visible.
 *
 * Content is projected: place your command buttons/icons directly inside the
 * element and they appear inside the toolbar region.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The command region is exposed as `role="toolbar"`; set `ariaLabel` when a
 *   page shows more than one floating toolbar so assistive technology can tell
 *   them apart.
 * - The drag handle is a `role="button"` with `tabindex="0"` and a default
 *   accessible name (`dragHandleAriaLabel`), giving keyboard-only users a
 *   pointer-free way to move the bar: Arrow keys nudge it, Home/End jump it to
 *   the top-left / bottom-right corners (WCAG 2.5.7 dragging-movements, 2.1.1
 *   keyboard). The handle shows a visible `:focus-visible` outline.
 */
const meta: Meta<CaepFloatingCommandsComponent> = {
  title: 'ng-components-extra/FloatingCommands',
  component: CaepFloatingCommandsComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [CaepComponentsModule] })],
  argTypes: {
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the role="toolbar" command region.',
    },
    dragHandleAriaLabel: {
      control: 'text',
      description: 'Accessible name for the keyboard-operable drag handle.',
    },
  },
  args: {
    ariaLabel: 'Page commands',
    dragHandleAriaLabel: 'Move commands toolbar',
  },
  render: (args) => ({
    props: { ...args },
    // The component is positioned `absolute`; wrap it in a tall, positioned host
    // so it renders somewhere visible inside the story canvas.
    template: `
      <div style="position: relative; height: 220px; border: 1px dashed #ccc;">
        <caep-floating-commands [ariaLabel]="ariaLabel" [dragHandleAriaLabel]="dragHandleAriaLabel">
          <button type="button" style="padding: 8px 14px; border: 1px solid #ccc;">Edit</button>
          <button type="button" style="padding: 8px 14px; border: 1px solid #ccc;">Save</button>
          <button type="button" style="padding: 8px 14px; border: 1px solid #ccc;">Delete</button>
        </caep-floating-commands>
      </div>
    `,
  }),
};
export default meta;

type Story = StoryObj<CaepFloatingCommandsComponent>;

/** Default floating toolbar with a labelled drag handle and three commands. */
export const Default: Story = {};

/**
 * Two projected commands. Useful when a page exposes several floating toolbars —
 * a distinct `ariaLabel` keeps them individually identifiable to screen readers.
 */
export const FewCommands: Story = {
  args: { ariaLabel: 'Selection actions' },
  render: (args) => ({
    props: { ...args },
    template: `
      <div style="position: relative; height: 220px; border: 1px dashed #ccc;">
        <caep-floating-commands [ariaLabel]="ariaLabel" [dragHandleAriaLabel]="dragHandleAriaLabel">
          <button type="button" style="padding: 8px 14px; border: 1px solid #ccc;">Confirm</button>
          <button type="button" style="padding: 8px 14px; border: 1px solid #ccc;">Cancel</button>
        </caep-floating-commands>
      </div>
    `,
  }),
};

/**
 * Many projected commands, showing the toolbar growing horizontally. Focus the
 * drag handle and use the Arrow keys (or Home/End) to reposition the bar.
 */
export const ManyCommands: Story = {
  args: { ariaLabel: 'Document toolbar' },
  render: (args) => ({
    props: { ...args },
    template: `
      <div style="position: relative; height: 220px; border: 1px dashed #ccc;">
        <caep-floating-commands [ariaLabel]="ariaLabel" [dragHandleAriaLabel]="dragHandleAriaLabel">
          <button type="button" style="padding: 8px 14px; border: 1px solid #ccc;">Cut</button>
          <button type="button" style="padding: 8px 14px; border: 1px solid #ccc;">Copy</button>
          <button type="button" style="padding: 8px 14px; border: 1px solid #ccc;">Paste</button>
          <button type="button" style="padding: 8px 14px; border: 1px solid #ccc;">Undo</button>
          <button type="button" style="padding: 8px 14px; border: 1px solid #ccc;">Redo</button>
        </caep-floating-commands>
      </div>
    `,
  }),
};

/**
 * Custom, localized accessible names for both the toolbar region and the drag
 * handle.
 */
export const CustomAriaLabels: Story = {
  args: {
    ariaLabel: 'Comandi pagina',
    dragHandleAriaLabel: 'Sposta la barra dei comandi',
  },
};
