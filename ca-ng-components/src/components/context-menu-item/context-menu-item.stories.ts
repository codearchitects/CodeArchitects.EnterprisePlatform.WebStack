import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShComponentsModule } from '../components.module';
import { ShContextMenuItemComponent } from './context-menu-item.component';

/**
 * `sh-context-menu-item` renders a single entry of a context menu. It is
 * normally instantiated by `sh-context-menu`, but it renders standalone from a
 * `[command]` object describing the entry: `name` (label text, run through the
 * `translate` pipe), optional `icon`, optional `routerLink`, and an optional
 * `handler` invoked on activation. Visibility/enablement come from the
 * `[show]`/`[enable]` inputs (merged with policy-engine authorizations).
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - Activation goes through a single `activate()` path shared by pointer and
 *   keyboard (Enter/Space), so mouse and keyboard users behave identically
 *   (WCAG 2.1.1). Keyboard focus/roles are owned by the parent `sh-context-menu`.
 * - The leading icon is decorative and marked `aria-hidden="true"`; the visible
 *   name is the accessible label.
 * - The disabled state is exposed via `aria-disabled="true"` and blocks the
 *   handler even on keyboard activation.
 */
const meta: Meta<ShContextMenuItemComponent> = {
  title: 'ng-components/ContextMenuItem',
  component: ShContextMenuItemComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ShComponentsModule] })],
  argTypes: {
    command: { control: 'object', description: 'Command descriptor (name, icon, routerLink, handler)' },
    enable: { control: 'boolean', description: 'Enabled state (false → dimmed, handler blocked)' },
    show: { control: 'boolean', description: 'Whether the item is rendered' },
  },
  args: {
    enable: true,
    show: true,
  },
  render: (args) => ({
    props: { ...args },
    template: `
      <sh-context-menu-item
        [command]="command"
        [enable]="enable"
        [show]="show"
      ></sh-context-menu-item>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShContextMenuItemComponent>;

/** A plain text command. */
export const Default: Story = {
  args: { command: { name: 'Rename' } },
};

/** Command with a leading (decorative) icon. */
export const WithIcon: Story = {
  args: { command: { name: 'Delete', icon: 'delete' } },
};

/** Command that acts as a router node (rendered inside a `routed-command` wrapper). */
export const RoutedCommand: Story = {
  args: { command: { name: 'Open details', icon: 'open', routerLink: ['details'] } },
};

/** Disabled item — dimmed, `aria-disabled="true"`, and its handler will not run. */
export const Disabled: Story = {
  args: { command: { name: 'Delete', icon: 'delete' }, enable: false },
};
