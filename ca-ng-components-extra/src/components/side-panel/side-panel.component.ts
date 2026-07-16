import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { CaepSidePanelService } from './service/caep-side-panel.service';

@Component({
    selector: 'caep-side-panel',
    templateUrl: './side-panel.component.html',
    styleUrls: ['./side-panel.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CaepSidePanelComponent {
  /**
   * Accessible name for the side panel dialog. Exposed as the `aria-label` of the
   * `role="dialog"` overlay so the panel has a programmatic name (WCAG 4.1.2).
   * Pass an already-localized string.
   */
  @Input() public ariaLabel = 'Side panel';
  /**
   * Accessible name for the close button. Pass an already-localized string.
   */
  @Input() public closeAriaLabel = 'Close';
  /** Template in side panel content */
  public get template() {
    return this._caepSidePanel.template;
  }
  /** Observable of isOpen flag */
  public get isOpen$() {
    return this._caepSidePanel.isOpen$;
  }
  /** The top position of side panel  */
  @HostBinding('style.top.px')
  public get top() {
    const rect = (this._caepSidePanel.target as HTMLElement)?.getBoundingClientRect();
    return (rect && rect.top + rect.height) || 0;
  }
  constructor(private _caepSidePanel: CaepSidePanelService) {}

  /** Close side panel */
  public close() {
    this._caepSidePanel.close();
  }
}
