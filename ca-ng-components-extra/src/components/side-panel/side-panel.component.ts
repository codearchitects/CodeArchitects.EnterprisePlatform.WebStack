import { ChangeDetectionStrategy, Component, HostBinding, ViewEncapsulation } from '@angular/core';
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
