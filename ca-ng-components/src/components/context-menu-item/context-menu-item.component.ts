import { IShBaseOptions } from './../base/base.component';
import { ShBaseAuthComponent } from './../base/base-auth.component';
import { Component, Input, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  private _router: Router;
  private _route: ActivatedRoute;

  /**
   * Base ContextMenu item component
   */
  constructor(injector: Injector) {
    super(injector);
    this._router = injector.get(Router);
    this._route = injector.get(ActivatedRoute);
  }

  /**
   * Handles command
   */
  /*protected*/ public handle() {
    if (this.command.handler && this.enable) {
      this.command.handler(this.command);
    }
  }

  /**
   * Single activation path shared by pointer AND keyboard (WCAG 2.1.1). Invoked
   * from the parent context-menu on the library's `(execute)` output, which
   * fires for both mouse click and Enter/Space on the menuitem. Gated on the
   * policy-merged `enable` so keyboard activation cannot bypass authorization.
   */
  public activate() {
    if (!this.enable) {
      return;
    }
    if (this.command.handler) {
      this.command.handler(this.command);
    }
    if (this.command.routerLink != null) {
      this._router.navigate([].concat(this.command.routerLink), { relativeTo: this._route });
    }
  }
}
