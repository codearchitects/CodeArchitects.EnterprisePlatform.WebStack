import {
  AfterViewInit,
  Component,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CaepComponentsModule } from '../components.module';
import { CaepSidePanelComponent } from './side-panel.component';
import { CaepSidePanelService } from './service/caep-side-panel.service';

/**
 * Story-only host that drives `caep-side-panel` through its service: it supplies
 * the body `<ng-template>` to project, opens the panel (immediately when
 * `autoOpen`, or via the trigger button), and renders the panel itself. This is
 * the minimal wiring a real host page needs — the component never renders alone.
 */
@Component({
  standalone: true,
  selector: 'caep-side-panel-demo',
  imports: [CaepComponentsModule],
  template: `
    <button type="button" class="side-panel-demo-trigger" (click)="open($event)">Open side panel</button>

    <ng-template #textTpl>
      <div class="side-panel-demo-body" style="width: 320px; padding: 24px;">
        <h2 style="margin-top: 0;">Details</h2>
        <p>This content is projected into the side panel via the service template.</p>
      </div>
    </ng-template>

    <ng-template #formTpl>
      <div class="side-panel-demo-body" style="width: 320px; padding: 24px;">
        <h2 style="margin-top: 0;">Edit item</h2>
        <label style="display: block; margin-bottom: 12px;">
          Name
          <input type="text" style="display: block; width: 100%;" />
        </label>
        <label style="display: block; margin-bottom: 12px;">
          Description
          <textarea rows="3" style="display: block; width: 100%;"></textarea>
        </label>
        <button type="button">Save</button>
      </div>
    </ng-template>

    <ng-template #longTpl>
      <!--
        Demo-only scrollable region (not part of the shipped component — a
        consuming app's own body content). tabindex="0" makes it reachable so
        keyboard users can scroll it without a pointer (WCAG 2.1.1).
      -->
      <div class="side-panel-demo-body" tabindex="0" style="width: 320px; max-height: 100vh; overflow: auto; padding: 24px;">
        <h2 style="margin-top: 0;">Terms</h2>
        @for (n of paragraphs; track n) {
          <p>
            Section {{ n }} — long body copy so the panel area scrolls
            independently of the page while the dialog stays open.
          </p>
        }
      </div>
    </ng-template>

    <caep-side-panel [ariaLabel]="ariaLabel" [closeAriaLabel]="closeAriaLabel"></caep-side-panel>
  `,
})
class SidePanelDemoComponent implements AfterViewInit {
  @Input() public ariaLabel = 'Side panel';
  @Input() public closeAriaLabel = 'Close';
  @Input() public autoOpen = true;
  @Input() public body: 'text' | 'form' | 'long' = 'text';

  @ViewChild('textTpl', { static: true }) private textTpl!: TemplateRef<unknown>;
  @ViewChild('formTpl', { static: true }) private formTpl!: TemplateRef<unknown>;
  @ViewChild('longTpl', { static: true }) private longTpl!: TemplateRef<unknown>;

  public readonly paragraphs = Array.from({ length: 12 }, (_, i) => i + 1);

  constructor(private _sidePanel: CaepSidePanelService) {}

  public ngAfterViewInit(): void {
    if (this.autoOpen) {
      // Defer to avoid ExpressionChangedAfterItHasBeenChecked while the async
      // pipe in the panel picks up the new open state.
      setTimeout(() => this._sidePanel.open(new Event('click'), this._template()));
    }
  }

  public open(event: Event): void {
    this._sidePanel.open(event, this._template());
  }

  private _template(): TemplateRef<unknown> {
    return this.body === 'form' ? this.formTpl : this.body === 'long' ? this.longTpl : this.textTpl;
  }
}

/**
 * `caep-side-panel` is a **service-driven overlay dialog** that slides in from the
 * right. It renders nothing until `CaepSidePanelService.open(event, template)` is
 * called: the service holds the open/closed state (`isOpen$`), the `TemplateRef`
 * to project as the panel body, and the trigger element used to compute the
 * panel's top offset. Closing (the built-in close button or `Esc`) calls
 * `service.close()`. The two `@Input`s (`ariaLabel`, `closeAriaLabel`) only set
 * the accessible names of the dialog and its close button.
 *
 * Because the panel cannot render on its own, these stories wrap it in a small
 * host that injects the service, supplies a body `<ng-template>`, and opens the
 * panel automatically so its content is visible in the canvas. A trigger button
 * is also shown so you can close and re-open it.
 *
 * ### Accessibility (WCAG 2.2 AA)
 * - The overlay is a `role="dialog"` with `aria-modal="true"` and a programmatic
 *   name from `ariaLabel` (WCAG 4.1.2); pass an already-localized string.
 * - Focus is trapped inside the panel (`cdkTrapFocus` with auto-capture) and
 *   `Esc` closes it.
 * - The close button has its own accessible name (`closeAriaLabel`) and keeps a
 *   visible `:focus-visible` outline (WCAG 2.4.7).
 */
const meta: Meta<CaepSidePanelComponent> = {
  title: 'ng-components-extra/SidePanel',
  component: CaepSidePanelComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [CaepComponentsModule, SidePanelDemoComponent] })],
  argTypes: {
    ariaLabel: {
      control: 'text',
      description: 'Accessible name of the role="dialog" overlay (localized).',
    },
    closeAriaLabel: {
      control: 'text',
      description: 'Accessible name of the close button (localized).',
    },
  },
  args: {
    ariaLabel: 'Side panel',
    closeAriaLabel: 'Close',
  },
  render: (args) => ({
    props: { ...args },
    template: `
      <caep-side-panel-demo
        [ariaLabel]="ariaLabel"
        [closeAriaLabel]="closeAriaLabel"
        [autoOpen]="autoOpen"
        [body]="body"
      ></caep-side-panel-demo>
    `,
  }),
};
export default meta;

type Story = StoryObj<CaepSidePanelComponent & { autoOpen?: boolean; body?: 'text' | 'form' | 'long' }>;

/** Panel opened on load with simple projected content. */
export const Default: Story = {
  args: { autoOpen: true, body: 'text' },
};

/** Panel projecting a small form-like body, showing focus trapping across fields. */
export const WithFormContent: Story = {
  args: { autoOpen: true, body: 'form' },
};

/** Long body content, so the panel area scrolls independently. */
export const LongContent: Story = {
  args: { autoOpen: true, body: 'long' },
};

/** Custom, localized accessible names for the dialog and its close button. */
export const CustomAriaLabels: Story = {
  args: {
    autoOpen: true,
    body: 'text',
    ariaLabel: 'Pannello dettagli',
    closeAriaLabel: 'Chiudi',
  },
};

/**
 * Closed initial state: nothing is rendered until you click the trigger, which
 * calls `CaepSidePanelService.open()` (the real runtime entry point).
 */
export const ClosedInitially: Story = {
  args: { autoOpen: false, body: 'text' },
};
