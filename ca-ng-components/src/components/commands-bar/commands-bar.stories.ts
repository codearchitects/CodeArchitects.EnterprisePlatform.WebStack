import { EventEmitter } from '@angular/core';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CommandDispatcherService, type ICommand } from '@ca-webstack/ng-command-dispatcher';
import { ShComponentsModule } from '../components.module';
import { ShCommandsBarComponent } from './commands-bar.component';

/**
 * `sh-commands-bar` is a toolbar container that renders the commands published
 * on the {@link CommandDispatcherService} (optionally filtered by `family`).
 * Each command is projected through a `#commandsTemplate` `<ng-template>`, so
 * the consumer decides how a command is rendered (here: `sh-button`s). The bar
 * is service-driven — it shows nothing until commands are dispatched.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The host exposes `role="toolbar"` (APG Toolbar pattern) and an accessible
 *   name via `aria-label` — `options.ariaLabel`, else a localized default,
 *   else `aria-labelledby` when provided. (WCAG 4.1.2)
 * - The projected command controls are native, individually focusable buttons,
 *   so they stay tabbable with no roving-tabindex bookkeeping required.
 *
 * ### Storybook note
 * In a real app the commands come from components that register with the
 * dispatcher. To render standalone, these stories provide a stub
 * `CommandDispatcherService` that emits a fixed demo command set on `apply()`.
 */

/** Demo commands the stub dispatcher publishes (families let us show filtering). */
const DEMO_COMMANDS: ICommand[] = [
  { name: 'save', label: 'Save', iconClassName: 'save', family: 'file', enabled: true, visible: true },
  { name: 'print', label: 'Print', iconClassName: 'print', family: 'file', enabled: true, visible: true },
  { name: 'share', label: 'Share', iconClassName: 'share', family: 'file', enabled: true, visible: true },
  { name: 'delete', label: 'Delete', iconClassName: 'delete', family: 'edit', enabled: false, visible: true },
];

/**
 * Minimal stand-in for {@link CommandDispatcherService} that publishes a fixed
 * command set instead of collecting them from registered components — enough to
 * make the toolbar render in isolation.
 */
class StoryCommandDispatcher {
  public changes = new EventEmitter<ICommand[]>();
  public apply(): void {
    this.changes.emit(DEMO_COMMANDS);
  }
  public add(): void {
    /* no-op in stories */
  }
  public remove(): void {
    /* no-op in stories */
  }
  public run(): void {
    /* no-op in stories */
  }
}

const meta: Meta<ShCommandsBarComponent & { commandRun?: (c: ICommand) => void }> = {
  title: 'ng-components/CommandsBar',
  component: ShCommandsBarComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ShComponentsModule],
      // The dispatcher is not a global provider; supply a stub so the bar has
      // commands to render (see the "Storybook note" above).
      providers: [{ provide: CommandDispatcherService, useClass: StoryCommandDispatcher }],
    }),
  ],
  argTypes: {
    family: {
      control: 'text',
      description: 'Only commands whose `family` matches are shown; empty shows all',
    },
    options: { control: 'object', description: 'Base options (e.g. `ariaLabel` for the toolbar)' },
    commandRun: { action: 'commandRun' },
  },
  args: {
    family: undefined,
    options: { ariaLabel: 'Document actions' } as any,
  },
  render: (args) => ({
    props: { ...args },
    template: `
      <sh-commands-bar [family]="family" [options]="options">
        <ng-template #commandsTemplate let-command="$implicit">
          @if (command.visible !== false) {
            <sh-button
              [transparent]="true"
              [icon]="command.iconClassName"
              [enable]="command.enabled !== false"
              (clicked)="commandRun(command)"
            >{{ command.label }}</sh-button>
          }
        </ng-template>
      </sh-commands-bar>
    `,
  }),
};
export default meta;

type Story = StoryObj<ShCommandsBarComponent & { commandRun?: (c: ICommand) => void }>;

/** All published commands (no `family` filter), named "Document actions". */
export const Default: Story = {};

/** Filtered to the `file` family — Save / Print / Share only. */
export const FilteredByFamily: Story = {
  args: { family: 'file' },
};

/**
 * The `edit` family contains a disabled command, showing how `enabled: false`
 * flows through to the projected control's `enable` binding.
 */
export const WithDisabledCommand: Story = {
  args: { family: 'edit' },
};

/**
 * A `family` that matches nothing renders an empty toolbar. The `role="toolbar"`
 * host and its accessible name are still present for assistive technology.
 */
export const Empty: Story = {
  args: { family: 'no-such-family' },
  parameters: { allowEmptyRender: true },
};

/**
 * Named via `aria-labelledby` instead of `aria-label`: when
 * `options.ariaLabelledBy` is set the component drops its own `aria-label` so
 * the toolbar is named by the referenced element. (WCAG 1.3.1 / 4.1.2)
 */
export const NamedByLabelledBy: Story = {
  args: { options: { ariaLabelledBy: 'toolbar-heading' } as any },
  render: (args) => ({
    props: { ...args },
    template: `
      <h3 id="toolbar-heading">File</h3>
      <sh-commands-bar [family]="family" [options]="options">
        <ng-template #commandsTemplate let-command="$implicit">
          @if (command.visible !== false) {
            <sh-button
              [transparent]="true"
              [icon]="command.iconClassName"
              [enable]="command.enabled !== false"
              (clicked)="commandRun(command)"
            >{{ command.label }}</sh-button>
          }
        </ng-template>
      </sh-commands-bar>
    `,
  }),
};
