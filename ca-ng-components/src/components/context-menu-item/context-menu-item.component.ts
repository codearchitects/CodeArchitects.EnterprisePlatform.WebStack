import { IShBaseOptions } from './../base/base.component';
import { ShBaseAuthComponent } from './../base/base-auth.component';
import { Component, Input, Injector } from '@angular/core';
// import { IContextMenuCommand } from '../context-menu/context-menu.component';

/**
 * Base ContextMenu item component options contract
 */
@Component({
    selector: 'sh-context-menu-item',
    templateUrl: './context-menu-item.component.html',
    standalone: false
})
/**
 * Base ContextMenu item component
 */
export class ShContextMenuItemComponent extends ShBaseAuthComponent<IShBaseOptions> {
  /**
   * The command
   */
  @Input() command: any/**IContextMenuCommand*/;

  /**
   * Base ContextMenu item component
   */
  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * Handles command
   */
  /*protected*/ public handle() {
    if (this.command.handler && this.enable) {
      this.command.handler(this.command);
    }
  }
}
