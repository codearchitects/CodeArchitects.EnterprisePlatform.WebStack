import { Component, Injector, Input, OnChanges, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';
import { isNoU } from '../../utilities';
import { ShBaseAuthComponent } from './../base/base-auth.component';
import { IShBaseOptions } from './../base/base.component';
import { ShContextMenuItemComponent } from '../context-menu-item/context-menu-item.component';

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
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
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
  @ViewChild('contextMenu') /*protected*/ public context: ShContextMenuComponent;
  /**
   * Rendered menu item components, used to route keyboard/pointer activation to
   * the matching item (which owns the policy-merged `enable`).
   */
  @ViewChildren(ShContextMenuItemComponent) /*protected*/ public menuItems: QueryList<ShContextMenuItemComponent>;

  /**
  * Base ContextMenu Component
  */
  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * Runs a command when the library reports activation (`execute`), for both
   * mouse click and keyboard (Enter/Space) on the menuitem — a single path so
   * activation is keyboard-operable (WCAG 2.1.1) without double-firing.
   */
  public onExecute(command: IContextMenuCommand) {
    const item = this.menuItems?.find(i => i.command === command);
    if (item) {
      item.activate();
    }
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
