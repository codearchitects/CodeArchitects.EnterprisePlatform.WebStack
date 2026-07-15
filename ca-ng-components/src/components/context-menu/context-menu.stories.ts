import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShContextMenuComponent, type IContextMenuCommand } from './context-menu.component';

/**
 * `sh-context-menu` wraps `@perfectmemory/ngx-contextmenu` to render a
 * design-system context menu from a list of `[commands]`. Each command becomes
 * a `sh-context-menu-item` (icon + translated label); commands with `children`
 * open a nested sub-menu, and a divider is inserted between top-level items.
 * The menu itself is an overlay: it is registered by this component but only
 * shown when triggered (right-click via the library's `[contextMenu]` directive
 * on a host element, or programmatically). Command activation runs through a
 * single `onExecute` path shared by mouse and keyboard.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The rendered menu uses the library's `role="menu"` / `role="menuitem"`
 *   semantics; activation is keyboard-operable (Enter/Space) via one shared
 *   `activate()` path, so pointer and keyboard cannot double-fire (WCAG 2.1.1).
 * - Disabled commands expose `aria-disabled="true"` and their `activate()` is
 *   gated on the policy-merged `enable`, so keyboard activation cannot bypass
 *   authorization.
 * - Command icons are decorative (`aria-hidden="true"`); the accessible name
 *   comes from the (translated) command `name`.
 *
 * Each story renders a trigger button; click it to open the menu via the
 * component's public API (`context.show(...)`). The menu starts closed so the
 * autodocs page (which renders every story inline) is not covered by stacked
 * overlays. The overlay is attached to the document body by CDK, so it renders
 * outside the story canvas root.
 */
const meta: Meta<ShContextMenuComponent> = {
  title: 'ng-components/ContextMenu',
  component: ShContextMenuComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    commands: {
      control: 'object',
      description: 'List of context-menu commands (label, icon, children, enable/show, handler).',
    },
  },
  render: (args) => ({
    props: {
      ...args,
      // The trigger opens the wrapped ngx context menu at the click position.
      // `context` is the public ViewChild referencing the underlying
      // `<context-menu>` (ngx ContextMenuComponent); `show` accepts a viewport
      // anchor. The `[contextMenu]` directive is not re-exported by
      // ShComponentsModule, so we drive the menu via this public API instead.
    },
    template: `
      <div style="padding: 2rem;">
        <button
          type="button"
          data-testid="context-menu-trigger"
          (click)="menu.context.show({ anchoredTo: 'position', x: $event.clientX || 40, y: $event.clientY || 80, value: null })"
        >Open context menu</button>
        <sh-context-menu #menu [commands]="commands"></sh-context-menu>
      </div>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShContextMenuComponent>;

const basicCommands: IContextMenuCommand[] = [
  { id: 'edit', name: 'Edit', icon: 'edit' },
  { id: 'copy', name: 'Copy', icon: 'copy' },
  { id: 'delete', name: 'Delete', icon: 'delete' },
];

/** A basic menu with three commands (label + icon). */
export const Default: Story = {
  args: { commands: basicCommands },
};

/** Text-only commands (no icons). */
export const TextOnly: Story = {
  args: {
    commands: [
      { id: 'open', name: 'Open' },
      { id: 'rename', name: 'Rename' },
      { id: 'archive', name: 'Archive' },
    ],
  },
};

/**
 * A command with `children` renders as a nested sub-menu; hover/focus the
 * *Share* item to expand it.
 */
export const WithSubmenu: Story = {
  args: {
    commands: [
      { id: 'edit', name: 'Edit', icon: 'edit' },
      {
        id: 'share',
        name: 'Share',
        icon: 'share',
        children: [
          { id: 'share-link', name: 'Copy link' },
          { id: 'share-email', name: 'Send by email' },
        ],
      },
      { id: 'delete', name: 'Delete', icon: 'delete' },
    ],
  },
};

/**
 * A disabled command exposes `aria-disabled="true"` and cannot be activated by
 * pointer or keyboard.
 */
export const WithDisabledCommand: Story = {
  args: {
    commands: [
      { id: 'edit', name: 'Edit', icon: 'edit' },
      { id: 'delete', name: 'Delete', icon: 'delete', enable: false },
    ],
  },
};

/**
 * A hidden command (`show: false`) is not rendered as a menu item; only the two
 * visible commands appear.
 */
export const WithHiddenCommand: Story = {
  args: {
    commands: [
      { id: 'edit', name: 'Edit', icon: 'edit' },
      { id: 'secret', name: 'Hidden action', show: false },
      { id: 'delete', name: 'Delete', icon: 'delete' },
    ],
  },
};
