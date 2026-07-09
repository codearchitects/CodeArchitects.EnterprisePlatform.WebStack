import { Injectable } from '@angular/core';
import { ICommand } from '@ca-webstack/ng-command-dispatcher';
import { UUID } from 'angular2-uuid';
import { BehaviorSubject, of } from 'rxjs';
import { CaepTopbarItemPosition, ICaepTopbarItem } from '../models/topbar-item';

const noop = () => undefined;

/**
 * Service which handles topbar
 */
@Injectable()
export class CaepTopbarService {
  //#region Internals
  private _items$ = new BehaviorSubject<ICaepTopbarItem[]>([]);
  //#endregion
  //#region Public
  /**
   * Observable that emits whenever items have been registered/unregistered/updated.
   */
  public items$ = this._items$.asObservable();
  /**
   * Current registered items.
   */
  public get snapshot(): ICaepTopbarItem[] {
    return this._items$.value;
  }
  //#endregion
  //#region Hooks
  /**
   * Registers given item.
   * @param item Item to be registered.
   * @returns Registered item identifier.
   */
  public register(item: ICaepTopbarItem): string | null;
  /**
   * Registers given items.
   * @param item Items to be registered.
   * @returns Registered items identifiers.
   */
  public register(...items: ICaepTopbarItem[]): string[] | null;
  public register(...items: ICaepTopbarItem[]): string | string[] | null {
    const toRegister = items.filter(item => !!item).map(item => this._setDefaults(item));
    if (toRegister.length) {
      this._items$.next([...this._items$.value, ...toRegister]);
    }
    return this._firstOrArray(toRegister) ?? null;
  }
  /**
   * Updates given item if found. Items will be compared by id.
   * @param item Item to be updated.
   * @returns Updated item.
   */
  public update(item: ICaepTopbarItem): ICaepTopbarItem;
  /**
   * Updates given items when existing found. Items will be compared by id.
   * @param item Items to be updated.
   * @returns Updated items.
   */
  public update(...items: ICaepTopbarItem[]): ICaepTopbarItem[];
  public update(...items: ICaepTopbarItem[]): ICaepTopbarItem | ICaepTopbarItem[] | null {
    const copy = [...this._items$.value];
    const updated: ICaepTopbarItem[] = [];
    for (const item of items.filter(item => !!item)) {
      const idx = copy.findIndex(itm => itm.id === item.id);
      if (idx > -1) {
        const toUpdate = this._setDefaults(item);
        copy[idx] = toUpdate;
        updated.push(toUpdate);
      }
    }
    if (updated.length > 0) {
      this._items$.next(copy);
    }
    return this._firstOrArray(updated) ?? null;
  }
  /**
   * Registers given item or update existing one. Items will be compared by id.
   * @param item Item to be registered or updated.
   * @returns Item if it has been updated or registered.
   */
  public registerOrUpdate(item: ICaepTopbarItem): ICaepTopbarItem | null;
  /**
   * Registers given items or update existing ones. Items will be compared by id.
   * @param item Items to be registered or updated.
   * @returns Registered or updated items.
   */
  public registerOrUpdate(...items: ICaepTopbarItem[]): ICaepTopbarItem[] | null;
  public registerOrUpdate(...items: ICaepTopbarItem[]): ICaepTopbarItem | ICaepTopbarItem[] | null {
    const copy = [...this._items$.value];
    const updated: ICaepTopbarItem[] = [];
    for (const item of items.filter(item => !!item)) {
      const idx = copy.findIndex(itm => itm.id === item.id);
      const element = this._setDefaults(item);
      if (idx > -1) {
        copy[idx] = element;
        updated.push(element);
      } else {
        copy.push(element);
        updated.push(element);
      }
    }
    if (updated.length > 0) {
      this._items$.next(copy);
    }
    return this._firstOrArray(updated) ?? null;
  }
  /**
   * Unregisters item by id.
   * @param id Item to be unregistered identifiers.
   * @returns Unregistered item.
   */
  public unregister(id: string): ICaepTopbarItem | null;
  /**
   * Unregisters items by id.
   * @param ids Items to be unregistered identifiers.
   * @returns Unregistered items.
   */
  public unregister(...ids: string[]): ICaepTopbarItem[] | null;
  public unregister(...ids: string[]): ICaepTopbarItem | ICaepTopbarItem[] | null {
    const toDelete = [...(ids ?? [])];
    const deleted: ICaepTopbarItem[] = [];
    const entries = this._items$.value.filter(item => {
      const idx = toDelete.findIndex(id => item.id === id);
      if (idx > -1) {
        deleted.push(item);
        toDelete.splice(idx, 1);
        return false;
      }
      return true;
    });

    if (entries.length !== this._items$.value.length) {
      this._items$.next(entries);
    }
    return this._firstOrArray(deleted) ?? null;
  }
  /**
   * Clear all items from service.
   */
  public clear() {
    this._items$.next([]);
  }
  /**
   * Looks for an item having provided identifier.
   * @param id Identifier to look for.
   * @returns Item if found, undefined otherwise.
   */
  public getItemById(id: string): ICaepTopbarItem | undefined {
    return this._items$.value.find(item => item.id === id);
  }
  /**
   * Maps command to a topbar item.
   * @param command Command to be mapped.
   * @returns Mapped command.
   */
  public commandToTopbarItem(command: ICommand): ICaepTopbarItem {
    return {
      id: command.name,
      icon: command.iconClassName,
      handler: command.handler,
      ariaLabel: command.label ?? command.caption ?? command.name,
      resource: command.resource,
      order: command.properties?.order,
      priority: command.properties?.priority,
      position: command.properties?.position,
      containerClass: command.htmlClassName ?? command.properties?.containerClass,
      templateRef: command.properties?.templateRef,
      templateContext: command.properties?.templateContext,
      enable: typeof command.enabled === 'string' ? true : command.enabled,
      show: typeof command.visible === 'string' ? true : command.visible
    };
  }
  //#endregion
  //#region Internal hooks
  /**
   * If item is not an array, it returns it.
   * If item is an array and has more than one item it returns given array.
   * If item is an array and has one item only, or no item, it returns respectively first item or undefined
   */
  private _firstOrArray(itemOrItems: any | any[]): any {
    if (!Array.isArray(itemOrItems) || itemOrItems.length > 1) return itemOrItems;
    return itemOrItems[0];
  }
  /**
   * Retrieves a new item which extends given one applying default values.
   */
  private _setDefaults(item: ICaepTopbarItem): ICaepTopbarItem {
    return {
      ...item,
      id: item.id ?? UUID.UUID(),
      show: item.show ?? true,
      enable: item.enable ?? true,
      position: item.position ?? CaepTopbarItemPosition.Right,
      handler: item.handler ?? noop,
      containerClass:
        Array.isArray(item.containerClass) || typeof item.containerClass === 'string'
          ? of(item.containerClass)
          : item.containerClass
    };
  }
  //#endregion
}
