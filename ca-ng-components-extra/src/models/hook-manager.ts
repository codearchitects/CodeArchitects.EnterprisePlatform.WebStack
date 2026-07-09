import { SimpleChanges } from '@angular/core';
import { CaepHookType } from '../decorators';
import { isNoU } from '../utilities/common.utility';
import { ICaepHookHandler } from './hook-handler.interface';
import { CaepSimpleOptionsChange } from './options-changes.interface';

/**
 * Manager to automate running of hook handlers decorated with @CaepHook decorator for a component/directive
 */
export class CaepHookManager {
  /**
   * Saved handlers for OnChanges lifecycle hook
   */
  private _onChangeHandlersGroups: Array<ICaepHookHandler[]>;

  /**
   * Saved handlers for DoCheck lifecycle hook
   */
  private _doCheckHandlersGroups: Array<ICaepHookHandler[]>;

  /**
   * Saved handlers for AfterViewChecked lifecycle hook
   */
  private _afterViewChekHandlersGroups: Array<ICaepHookHandler[]>;

  /**
   * Saved handlers for AfterContentChecked lifecycle hook
   */
  private _afterContentCheckHandlersGroups: Array<ICaepHookHandler[]>;

  /**
   * Saved handlers for OnOptionsChanges lifecycle hook
   */
  private _onOptionsChangesHandlersGroups: Array<ICaepHookHandler[]>;

  constructor(private _component: { [key: string]: any }) {}

  /**
   * Runs hook handlers for OnInit lifecycle hook
   */
  public initialize() {
    this.runHookHandlers(CaepHookType.Init, undefined);
  }

  /**
   * Runs hook handlers for OnChanges lifecycle hook
   * @param changes SimpleChanges object containing input changes
   */
  public change(changes: SimpleChanges) {
    this._onChangeHandlersGroups = this.runHookHandlers(CaepHookType.Change, this._onChangeHandlersGroups, changes);
  }

  /**
   * Runs hook handlers for AfterViewInit lifecycle hook
   */
  public initializeAfterViewInit() {
    this.runHookHandlers(CaepHookType.AfterViewInit, undefined);
  }

  /**
   * Runs hook handlers for AfterViewCheck lifecycle hook
   */
  public initializeAfterViewCheck() {
    this._afterViewChekHandlersGroups = this.runHookHandlers(
      CaepHookType.AfterViewChecked,
      this._afterViewChekHandlersGroups
    );
  }

  /**
   * Runs hook handlers for AfterContentInit lifecycle hook
   */
  public initializeAfterContentInit() {
    this.runHookHandlers(CaepHookType.AfterContentInit, undefined);
  }

  /**
   * Runs hook handlers for AfterContentChecked lifecycle hook
   */
  public initializeAfterContentCheck() {
    this._afterContentCheckHandlersGroups = this.runHookHandlers(
      CaepHookType.AfterContentChecked,
      this._afterContentCheckHandlersGroups
    );
  }

  /**
   * Runs hook handlers for DoCheck lifecycle hook
   */
  public doCheck() {
    this._doCheckHandlersGroups = this.runHookHandlers(CaepHookType.DoCheck, this._doCheckHandlersGroups);
  }

  /**
   * Runs hook handlers for OnDestroy lifecycle hook
   */
  public destroy() {
    this.runHookHandlers(CaepHookType.Destroy, undefined);
  }

  /**
   * Runs hook handlers for OnOptionsChanges lifecycle hook
   * @param change CaepSimpleOptionsChange object containing option changes
   */
  public optionsChange(change: CaepSimpleOptionsChange) {
    this._onOptionsChangesHandlersGroups = this.runHookHandlers(
      CaepHookType.OptionsChanges,
      this._onOptionsChangesHandlersGroups,
      change
    );
  }

  /**
   * Gets ICaepHookHandler metadata for specific lifecycle hook type
   * @param type lifecycle hook type
   */
  private getHookHandlers(type: CaepHookType): ICaepHookHandler[] {
    let handlers = [] as ICaepHookHandler[];
    let prototype = Object.getPrototypeOf(this._component);
    for (; prototype != Object.prototype; prototype = Object.getPrototypeOf(prototype)) {
      let props = Object.keys(prototype);
      for (const prop of props) {
        const handler = Reflect.getOwnMetadata(CaepHookType[type], prototype, prop); //MetadataHelpers.getMetadata<ICaepHookHandler>(CaepHookType[type], this._component, prop);
        if (handler) {
          const hookHandler: ICaepHookHandler = Object.assign({}, handler, {
            handler: this._component[prop].bind(this._component)
          });
          handlers.push(hookHandler);
        }
      }
    }
    return handlers;
  }

  /**
   * Runs hook handlers for specific lifecycle hook type
   * @param type lifecycle hook type
   * @param savedHandlerGroups saved handlers for lifecycle hook
   * @param params handler params
   */
  private runHookHandlers(
    type: CaepHookType,
    savedHandlerGroups: Array<ICaepHookHandler[]>,
    ...params: any[]
  ): Array<ICaepHookHandler[]> {
    if (!savedHandlerGroups) {
      let handlerGroups: Array<ICaepHookHandler[]>,
        hookHandlers: ICaepHookHandler[] = this.getHookHandlers(type);

      if (hookHandlers.length > 0) {
        //group hook handlers by class name to respect priority in an eventual class hierarchy
        handlerGroups = this.getHandlerGroupsByClassName(hookHandlers);

        //first sorts each handler group by priority parameter and executes handlers which have runBeforeSuper parameter set to true
        for (const handlerGroup of handlerGroups) {
          if (handlerGroup.length > 1) handlerGroup.sort(this.sortByHanlderPriorityAsc);
          for (const hookHandler of handlerGroup) {
            if (hookHandler.runBeforeSuper) hookHandler.handler(...params);
          }
        }

        //reverse groups order to respect inheritance concept and to execute first handlers from superclasses
        handlerGroups.reverse();

        //executes handlers which have not runBeforeSuper parameter set to true by the new order
        for (const handlerGroup of handlerGroups) {
          for (const hookHandler of handlerGroup) {
            if (!hookHandler.runBeforeSuper) hookHandler.handler(...params);
          }
        }
      } else handlerGroups = [];

      return handlerGroups;
    } else {
      if (savedHandlerGroups.length > 0) {
        //reverse groups' order to execute first runBeforeSuper handlers
        savedHandlerGroups.reverse();
        for (const handlerGroup of savedHandlerGroups) {
          for (const hookHandler of handlerGroup) {
            if (hookHandler.runBeforeSuper) hookHandler.handler(...params);
          }
        }
        //reverse groups order to respect inheritance concept and to execute first handlers from superclasses
        savedHandlerGroups.reverse();
        for (const handlerGroup of savedHandlerGroups) {
          for (const hookHandler of handlerGroup) {
            if (!hookHandler.runBeforeSuper) hookHandler.handler(...params);
          }
        }
      }
      return savedHandlerGroups;
    }
  }

  /**
   * Gets hook handlers organized by class name
   * @param hookHandlers list of hook handlers
   */
  private getHandlerGroupsByClassName(hookHandlers: ICaepHookHandler[]): Array<ICaepHookHandler[]> {
    let handlerGroups: Array<ICaepHookHandler[]> = [],
      currentClassname = '';
    for (const hookHandler of hookHandlers) {
      if (hookHandler.className !== currentClassname) {
        handlerGroups.push([hookHandler]);
        currentClassname = hookHandler.className;
      } else {
        handlerGroups[handlerGroups.length - 1].push(hookHandler);
      }
    }
    return handlerGroups;
  }

  /**
   * Compare function to sort handler by ascending priority
   * @param h1 first handler
   * @param h2 second handler
   */
  private sortByHanlderPriorityAsc(h1: ICaepHookHandler, h2: ICaepHookHandler): number {
    if (isNoU(h1.priority) && isNoU(h2.priority)) return 0;
    else if (isNoU(h1.priority)) return 1;
    else if (isNoU(h2.priority)) return -1;
    else if (h1.priority > h2.priority) return 1;
    else if (h1.priority === h2.priority) return 0;
    else return -1;
  }
}
