import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { SH_CHANGE_DETECTOR } from 'src/environments/change-detection-strategy';
import { SidebarCommand } from '../../models/sidebar';
import { AssetsService } from '../../services/index';
import { IShBaseOptions, ShBaseAuthComponent } from '../base/index';

@Component({
  selector: 'sh-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: SH_CHANGE_DETECTOR.STRATEGY
})
export class ShSidebarComponent extends ShBaseAuthComponent<IShBaseOptions> implements OnInit {
  /**
   * Logo assets path (e.g.: "logo.png")
   * The image must be 130x45px to fit content correctly
   * @default undefined
   */
  @Input() public logo: string;
  /**
   * Specifies if sidebar is expanded
   * @default false
   */
  @Input() public isExpanded = false;
  /**
   * Promise which must return sidebar commands.
   * If not specified, sidebar commands are retrieved from sidebar.json (assets)
   * @default undefined
   */
  @Input() public onGetData: () => Promise<SidebarCommand[]>;
  /**
   * Emits an event when sidebar collapses/expands itself
   */
  @Output() public isExpandedChange = new EventEmitter<boolean>();
  /**
   * Identifier of command with expanded children
   */
  protected expandedCommandId: string;
  /**
   * List of navigation commands to be shown in the sidebar
   */
  public commands: SidebarCommand[];
  /**
   * Change detector references
   */
  protected changeDetection: ChangeDetectorRef;
  /**
   * Assets service
   */
  private _assetsService: AssetsService;

  /**
   * Sidebar component
   */
  constructor(injector: Injector) {
    super(injector);
    this._assetsService = injector.get(AssetsService);
    this.changeDetection = injector.get(ChangeDetectorRef);
  }

  public async ngOnInit() {
    super.ngOnInit();
    this.commands = this.onGetData
      ? await this.onGetData()
      : await this._assetsService.get<SidebarCommand[]>('sidebar.json');
    if (SH_CHANGE_DETECTOR.STRATEGY === ChangeDetectionStrategy.OnPush) {
      this.changeDetection.markForCheck();
    }
  }

  /**
   * Toggles command children
   * @param id Identifier of the command to be toggled
   */
  protected toggle(id: string) {
    if (this.expandedCommandId === id) {
      delete this.expandedCommandId;
    } else {
      this.expandedCommandId = id;
    }
  }
}
