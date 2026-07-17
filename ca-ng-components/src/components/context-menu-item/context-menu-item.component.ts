import { IShBaseOptions } from './../base/base.component';
import { ShBaseAuthComponent } from './../base/base-auth.component';
import { Component, OnInit, Input, Injector } from '@angular/core';
// import { IContextMenuCommand } from '../context-menu/context-menu.component';

/**
 * Base ContextMenu item component options contract
 */
@Component({
  selector: 'sh-context-menu-item',
  templateUrl: './context-menu-item.component.html'
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
  protected handle() {
    if (this.command.handler) {
      this.command.handler(this.command);
    }
  }
}
