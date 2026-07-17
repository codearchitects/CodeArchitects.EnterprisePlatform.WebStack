import { Component, Injector, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { SH_CHANGE_DETECTOR } from 'src/environments/change-detection-strategy';
import { isNoU } from 'src/utilities/common.utility';
import { ShBaseAuthComponent } from './../base/base-auth.component';
import { IShBaseOptions } from './../base/base.component';

/**
 * Base ContextMenu Component options contract
 */
export interface IContextMenuCommand {
  /**
   * Command identifier
   */
  id?: string;
  /**
   * Command icon
   */
  icon?: string;
  /**
   * Command name
   */
  name: string;
  /**
   * If specified, the command acts like a router node
   */
  routerLink?: string | string[];
  /**
   * List of command children
   */
  children?: IContextMenuCommand[];
  /**
   * Resource linked to command
   */
  resource?: string;
  /**
   * Specifies if command is enabled
   */
  enable?: boolean;
  /**
   * Specifies if command is shown
   */
  show?: boolean;
  /**
   * Command handler
   */
  handler?(command: IContextMenuCommand): void;
}

@Component({
  selector: 'sh-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  changeDetection: SH_CHANGE_DETECTOR.STRATEGY
 })
/**
 * Base ContextMenu Component
 */
export class ShContextMenuComponent extends ShBaseAuthComponent<IShBaseOptions> implements OnChanges {
  /**
   * List of context menu commands
   */
  @Input() public commands: IContextMenuCommand[] = [];
  /**
   * References to ngx-context-menu component
   */
  @ViewChild('contextMenu', { static: false }) protected context: ShContextMenuComponent;

  /**
  * Base ContextMenu Component
  */
  constructor(injector: Injector) {
    super(injector);
  }

  public ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['commands']) {
      this.commands.forEach(cmd => {
        cmd.enable = isNoU(cmd.enable) ? true : cmd.enable;
        cmd.show = isNoU(cmd.show) ? true : cmd.show;
      });
    }
  }
}
